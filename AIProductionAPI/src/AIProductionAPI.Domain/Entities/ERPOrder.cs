namespace AIProductionAPI.Domain.Entities;

public class ERPOrder
{
    public long Id { get; set; }
    public string OrderId { get; set; } = string.Empty;
    public int PlannedQty { get; set; }
    public DateTime PlannedStart { get; set; }
    public DateTime PlannedEnd { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<MESExecution> MESExecutions { get; set; } = new List<MESExecution>();
}
