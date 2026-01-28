using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using AIProductionAPI.Application.DTOs;
using AIProductionAPI.Application.Services;
using AIProductionAPI.Domain.Entities;
using AIProductionAPI.Infrastructure.Data;

namespace AIProductionAPI.Infrastructure.Services;

public class PredictionService : IPredictionService
{
    private readonly HttpClient _httpClient;
    private readonly ApplicationDbContext _context;

    public PredictionService(HttpClient httpClient, ApplicationDbContext context, IConfiguration config)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri(config["PythonML:BaseUrl"] ?? "http://localhost:5001");
        _context = context;
    }

    public async Task<PredictionResponseDto> PredictAsync(PredictionRequestDto request)
    {
        var pythonRequest = new
        {
            temperature = request.Temperature,
            line_speed = request.LineSpeed,
            shift = request.Shift,
            operator_experience = request.OperatorExperience,
            machine_age = request.MachineAge
        };

        var response = await _httpClient.PostAsJsonAsync("/predict", pythonRequest);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<PythonPredictionResult>();

        // Save to database
        var prediction = new DefectPrediction
        {
            MLModelId = 1, // Default model
            Temperature = request.Temperature,
            LineSpeed = request.LineSpeed,
            Shift = request.Shift,
            OperatorExperience = request.OperatorExperience,
            MachineAge = request.MachineAge,
            DefectProbability = result!.DefectProbability,
            PredictedDefect = result.PredictedDefect,
            Confidence = result.Confidence
        };

        _context.DefectPredictions.Add(prediction);
        await _context.SaveChangesAsync();

        return new PredictionResponseDto(
            result.DefectProbability,
            result.PredictedDefect,
            result.Confidence,
            "Random Forest",
            DateTime.UtcNow,
            request
        );
    }

    public async Task<List<PredictionResponseDto>> BatchPredictAsync(List<PredictionRequestDto> requests)
    {
        var results = new List<PredictionResponseDto>();
        foreach (var request in requests)
        {
            results.Add(await PredictAsync(request));
        }
        return results;
    }

    public async Task<List<FeatureImportanceDto>> GetFeatureImportanceAsync()
    {
        var response = await _httpClient.GetAsync("/feature-importance");
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<List<PythonFeatureImportance>>();

        return result!
            .OrderByDescending(x => x.Importance)
            .Select((x, i) => new FeatureImportanceDto(x.Feature, x.Importance, i + 1))
            .ToList();
    }

    public async Task<List<TemperatureCurvePointDto>> GetTemperatureCurveAsync()
    {
        var response = await _httpClient.GetAsync("/temperature-curve");
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<List<PythonTempCurve>>();

        return result!.Select(x => new TemperatureCurvePointDto(x.Temperature, x.DefectProbability)).ToList();
    }

    public async Task<PagedResultDto<PredictionHistoryDto>> GetHistoryAsync(int page, int pageSize)
    {
        var query = _context.DefectPredictions.OrderByDescending(p => p.CreatedAt);
        var total = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new PredictionHistoryDto(
                p.Id, p.Temperature, p.LineSpeed, p.Shift,
                p.DefectProbability, p.PredictedDefect, p.CreatedAt
            ))
            .ToListAsync();

        return new PagedResultDto<PredictionHistoryDto>(
            items, total, page, pageSize, (int)Math.Ceiling(total / (double)pageSize)
        );
    }

    private record PythonPredictionResult(decimal DefectProbability, bool PredictedDefect, decimal Confidence);
    private record PythonFeatureImportance(string Feature, decimal Importance);
    private record PythonTempCurve(decimal Temperature, decimal DefectProbability);
}
