namespace AIProductionAPI.Domain.Entities;

public class ProductionData
{
    public long Id { get; set; }
    public decimal Temperature { get; set; }
    public decimal LineSpeed { get; set; }
    public string Shift { get; set; } = "Day";
    public decimal OperatorExperience { get; set; }
    public decimal MachineAge { get; set; }
    public bool Defect { get; set; }
    public DateTime RecordedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
