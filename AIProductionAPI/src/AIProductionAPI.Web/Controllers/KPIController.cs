using Microsoft.AspNetCore.Mvc;
using AIProductionAPI.Application.DTOs;
using AIProductionAPI.Application.Services;

namespace AIProductionAPI.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KPIController : ControllerBase
{
    private readonly IKPIService _kpiService;

    public KPIController(IKPIService kpiService)
    {
        _kpiService = kpiService;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<KPISummaryDto>> GetSummary()
    {
        var summary = await _kpiService.GetCurrentSummaryAsync();
        return Ok(summary);
    }

    [HttpGet("trends")]
    public async Task<ActionResult<KPITrendsDto>> GetTrends(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var trends = await _kpiService.GetTrendsAsync(startDate, endDate);
        return Ok(trends);
    }

    [HttpGet("snapshots")]
    public async Task<ActionResult<List<KPISnapshotDto>>> GetSnapshots([FromQuery] int days = 30)
    {
        var snapshots = await _kpiService.GetSnapshotsAsync(days);
        return Ok(snapshots);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult> RefreshKPIs()
    {
        await _kpiService.RefreshKPIsAsync();
        return Ok(new { Message = "KPIs refreshed successfully" });
    }
}
