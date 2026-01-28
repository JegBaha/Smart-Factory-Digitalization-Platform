namespace AIProductionAPI.Domain.Entities;

public class MESExecution
{
    public long Id { get; set; }
    public string OrderId { get; set; } = string.Empty;
    public int ProducedQty { get; set; }
    public int DefectQty { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ERPOrder? ERPOrder { get; set; }
}
