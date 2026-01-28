namespace AIProductionAPI.Application.DTOs;

public record PredictionRequestDto(
    decimal Temperature,
    decimal LineSpeed,
    string Shift,
    decimal OperatorExperience,
    decimal MachineAge
);

public record PredictionResponseDto(
    decimal DefectProbability,
    bool PredictedDefect,
    decimal Confidence,
    string ModelUsed,
    DateTime PredictedAt,
    PredictionRequestDto Input
);

public record FeatureImportanceDto(
    string FeatureName,
    decimal Importance,
    int Rank
);

public record TemperatureCurvePointDto(
    decimal Temperature,
    decimal DefectProbability
);

public record PredictionHistoryDto(
    long Id,
    decimal Temperature,
    decimal LineSpeed,
    string Shift,
    decimal DefectProbability,
    bool PredictedDefect,
    DateTime CreatedAt
);
