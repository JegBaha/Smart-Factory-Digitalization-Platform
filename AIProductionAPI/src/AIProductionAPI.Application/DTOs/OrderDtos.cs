namespace AIProductionAPI.Application.DTOs;

public record UnifiedOrderDto(
    long Id,
    string OrderId,
    int PlannedQty,
    int ProducedQty,
    int DefectQty,
    DateTime PlannedStart,
    DateTime PlannedEnd,
    DateTime ActualStart,
    DateTime ActualEnd,
    decimal PlanFulfillment,
    decimal DelayHours,
    decimal? ScrapRate
);

public record PagedResultDto<T>(
    List<T> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages
);
