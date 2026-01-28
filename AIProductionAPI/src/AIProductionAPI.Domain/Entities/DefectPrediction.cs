namespace AIProductionAPI.Domain.Entities;

public class DefectPrediction
{
    public long Id { get; set; }
    public int MLModelId { get; set; }
    public decimal Temperature { get; set; }
    public decimal LineSpeed { get; set; }
    public string Shift { get; set; } = "Day";
    public decimal OperatorExperience { get; set; }
    public decimal MachineAge { get; set; }
    public decimal DefectProbability { get; set; }
    public bool PredictedDefect { get; set; }
    public decimal? Confidence { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public MLModel? MLModel { get; set; }
}
