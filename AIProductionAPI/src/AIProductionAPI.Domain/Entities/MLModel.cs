namespace AIProductionAPI.Domain.Entities;

public class MLModel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Version { get; set; } = "1.0";
    public string ModelType { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public decimal? AUCScore { get; set; }
    public string? ClassificationReport { get; set; }
    public string? FeatureImportanceJson { get; set; }
    public bool IsActive { get; set; }
    public DateTime TrainedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<DefectPrediction> Predictions { get; set; } = new List<DefectPrediction>();
}
