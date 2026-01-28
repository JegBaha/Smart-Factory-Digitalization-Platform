namespace AIProductionAPI.Domain.Entities;

public class UnifiedOrder
{
    public long Id { get; set; }
    public long ERPOrderId { get; set; }
    public long MESExecutionId { get; set; }
    public decimal PlanFulfillment { get; set; }
    public decimal DelayHours { get; set; }
    public decimal? ScrapRate { get; set; }
    public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;

    public ERPOrder? ERPOrder { get; set; }
    public MESExecution? MESExecution { get; set; }
}
