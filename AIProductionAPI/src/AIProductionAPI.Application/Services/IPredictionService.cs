using AIProductionAPI.Application.DTOs;

namespace AIProductionAPI.Application.Services;

public interface IPredictionService
{
    Task<PredictionResponseDto> PredictAsync(PredictionRequestDto request);
    Task<List<PredictionResponseDto>> BatchPredictAsync(List<PredictionRequestDto> requests);
    Task<List<FeatureImportanceDto>> GetFeatureImportanceAsync();
    Task<List<TemperatureCurvePointDto>> GetTemperatureCurveAsync();
    Task<PagedResultDto<PredictionHistoryDto>> GetHistoryAsync(int page, int pageSize);
}
