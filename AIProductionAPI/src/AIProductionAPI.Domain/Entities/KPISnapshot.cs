namespace AIProductionAPI.Domain.Entities;

public class KPISnapshot
{
    public long Id { get; set; }
    public DateOnly SnapshotDate { get; set; }
    public decimal PlanFulfillmentMean { get; set; }
    public decimal DelayHoursMean { get; set; }
    public decimal ScrapRateMean { get; set; }
    public int TotalOrders { get; set; }
    public int TotalProduced { get; set; }
    public int TotalDefects { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
