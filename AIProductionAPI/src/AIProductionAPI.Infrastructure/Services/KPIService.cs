using Microsoft.EntityFrameworkCore;
using AIProductionAPI.Application.DTOs;
using AIProductionAPI.Application.Services;
using AIProductionAPI.Domain.Entities;
using AIProductionAPI.Infrastructure.Data;

namespace AIProductionAPI.Infrastructure.Services;

public class KPIService : IKPIService
{
    private readonly ApplicationDbContext _context;

    public KPIService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<KPISummaryDto> GetCurrentSummaryAsync()
    {
        var latestSnapshot = await _context.KPISnapshots
            .OrderByDescending(s => s.SnapshotDate)
            .FirstOrDefaultAsync();

        if (latestSnapshot != null)
        {
            return new KPISummaryDto(
                latestSnapshot.PlanFulfillmentMean,
                latestSnapshot.DelayHoursMean,
                latestSnapshot.ScrapRateMean,
                latestSnapshot.TotalOrders,
                latestSnapshot.TotalProduced,
                latestSnapshot.TotalDefects,
                latestSnapshot.CreatedAt
            );
        }

        // Calculate from unified orders if no snapshot
        var orders = await _context.UnifiedOrders
            .Include(o => o.ERPOrder)
            .Include(o => o.MESExecution)
            .ToListAsync();

        if (!orders.Any())
        {
            return new KPISummaryDto(0, 0, 0, 0, 0, 0, DateTime.UtcNow);
        }

        return new KPISummaryDto(
            orders.Average(o => o.PlanFulfillment),
            orders.Average(o => o.DelayHours),
            orders.Average(o => o.ScrapRate ?? 0),
            orders.Count,
            orders.Sum(o => o.MESExecution?.ProducedQty ?? 0),
            orders.Sum(o => o.MESExecution?.DefectQty ?? 0),
            DateTime.UtcNow
        );
    }

    public async Task<KPITrendsDto> GetTrendsAsync(DateTime? startDate, DateTime? endDate)
    {
        var start = startDate ?? DateTime.UtcNow.AddDays(-30);
        var end = endDate ?? DateTime.UtcNow;

        var snapshots = await _context.KPISnapshots
            .Where(s => s.SnapshotDate >= DateOnly.FromDateTime(start) && s.SnapshotDate <= DateOnly.FromDateTime(end))
            .OrderBy(s => s.SnapshotDate)
            .Select(s => new KPISnapshotDto(s.Id, s.SnapshotDate, s.PlanFulfillmentMean, s.DelayHoursMean, s.ScrapRateMean, s.TotalOrders))
            .ToListAsync();

        // Calculate trends (simple linear regression slope approximation)
        decimal pfTrend = 0, dhTrend = 0, srTrend = 0;
        if (snapshots.Count >= 2)
        {
            var first = snapshots.First();
            var last = snapshots.Last();
            pfTrend = last.PlanFulfillmentMean - first.PlanFulfillmentMean;
            dhTrend = last.DelayHoursMean - first.DelayHoursMean;
            srTrend = last.ScrapRateMean - first.ScrapRateMean;
        }

        return new KPITrendsDto(snapshots, pfTrend, dhTrend, srTrend);
    }

    public async Task<List<KPISnapshotDto>> GetSnapshotsAsync(int days)
    {
        var startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-days));

        return await _context.KPISnapshots
            .Where(s => s.SnapshotDate >= startDate)
            .OrderByDescending(s => s.SnapshotDate)
            .Select(s => new KPISnapshotDto(s.Id, s.SnapshotDate, s.PlanFulfillmentMean, s.DelayHoursMean, s.ScrapRateMean, s.TotalOrders))
            .ToListAsync();
    }

    public async Task RefreshKPIsAsync()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var orders = await _context.UnifiedOrders
            .Include(o => o.MESExecution)
            .ToListAsync();

        if (!orders.Any()) return;

        var snapshot = new KPISnapshot
        {
            SnapshotDate = today,
            PlanFulfillmentMean = orders.Average(o => o.PlanFulfillment),
            DelayHoursMean = orders.Average(o => o.DelayHours),
            ScrapRateMean = orders.Average(o => o.ScrapRate ?? 0),
            TotalOrders = orders.Count,
            TotalProduced = orders.Sum(o => o.MESExecution?.ProducedQty ?? 0),
            TotalDefects = orders.Sum(o => o.MESExecution?.DefectQty ?? 0)
        };

        var existing = await _context.KPISnapshots.FirstOrDefaultAsync(s => s.SnapshotDate == today);
        if (existing != null)
        {
            existing.PlanFulfillmentMean = snapshot.PlanFulfillmentMean;
            existing.DelayHoursMean = snapshot.DelayHoursMean;
            existing.ScrapRateMean = snapshot.ScrapRateMean;
            existing.TotalOrders = snapshot.TotalOrders;
            existing.TotalProduced = snapshot.TotalProduced;
            existing.TotalDefects = snapshot.TotalDefects;
        }
        else
        {
            _context.KPISnapshots.Add(snapshot);
        }

        await _context.SaveChangesAsync();
    }
}
