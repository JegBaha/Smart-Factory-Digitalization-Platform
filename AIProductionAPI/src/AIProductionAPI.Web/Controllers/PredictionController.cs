using Microsoft.AspNetCore.Mvc;
using AIProductionAPI.Application.DTOs;
using AIProductionAPI.Application.Services;

namespace AIProductionAPI.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PredictionController : ControllerBase
{
    private readonly IPredictionService _predictionService;

    public PredictionController(IPredictionService predictionService)
    {
        _predictionService = predictionService;
    }

    [HttpPost("predict")]
    public async Task<ActionResult<PredictionResponseDto>> Predict([FromBody] PredictionRequestDto request)
    {
        var result = await _predictionService.PredictAsync(request);
        return Ok(result);
    }

    [HttpPost("batch-predict")]
    public async Task<ActionResult<List<PredictionResponseDto>>> BatchPredict([FromBody] List<PredictionRequestDto> requests)
    {
        var results = await _predictionService.BatchPredictAsync(requests);
        return Ok(results);
    }

    [HttpGet("feature-importance")]
    public async Task<ActionResult<List<FeatureImportanceDto>>> GetFeatureImportance()
    {
        var importance = await _predictionService.GetFeatureImportanceAsync();
        return Ok(importance);
    }

    [HttpGet("temperature-curve")]
    public async Task<ActionResult<List<TemperatureCurvePointDto>>> GetTemperatureCurve()
    {
        var curve = await _predictionService.GetTemperatureCurveAsync();
        return Ok(curve);
    }

    [HttpGet("history")]
    public async Task<ActionResult<PagedResultDto<PredictionHistoryDto>>> GetHistory(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var history = await _predictionService.GetHistoryAsync(page, pageSize);
        return Ok(history);
    }
}
