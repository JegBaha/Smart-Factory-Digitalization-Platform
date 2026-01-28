using AIProductionAPI.Application.DTOs;

namespace AIProductionAPI.Application.Services;

public interface IKPIService
{
    Task<KPISummaryDto> GetCurrentSummaryAsync();
    Task<KPITrendsDto> GetTrendsAsync(DateTime? startDate, DateTime? endDate);
    Task<List<KPISnapshotDto>> GetSnapshotsAsync(int days);
    Task RefreshKPIsAsync();
}
