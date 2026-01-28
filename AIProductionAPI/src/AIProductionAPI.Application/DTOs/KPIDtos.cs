namespace AIProductionAPI.Application.DTOs;

public record KPISummaryDto(
    decimal PlanFulfillmentMean,
    decimal DelayHoursMean,
    decimal ScrapRateMean,
    int TotalOrders,
    int TotalProduced,
    int TotalDefects,
    DateTime CalculatedAt
);

public record KPISnapshotDto(
    long Id,
    DateOnly SnapshotDate,
    decimal PlanFulfillmentMean,
    decimal DelayHoursMean,
    decimal ScrapRateMean,
    int TotalOrders
);

public record KPITrendsDto(
    List<KPISnapshotDto> Snapshots,
    decimal PlanFulfillmentTrend,
    decimal DelayHoursTrend,
    decimal ScrapRateTrend
);
