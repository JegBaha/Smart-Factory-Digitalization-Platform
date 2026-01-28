// Prediction Types
export interface PredictionRequest {
  temperature: number;
  lineSpeed: number;
  shift: 'Day' | 'Night';
  operatorExperience: number;
  machineAge: number;
}

export interface PredictionResponse {
  defectProbability: number;
  predictedDefect: boolean;
  confidence: number;
  modelUsed: string;
  predictedAt: string;
  input: PredictionRequest;
}

export interface FeatureImportance {
  featureName: string;
  importance: number;
  rank: number;
}

export interface TemperatureCurvePoint {
  temperature: number;
  defectProbability: number;
}

// KPI Types
export interface KPISummary {
  planFulfillmentMean: number;
  delayHoursMean: number;
  scrapRateMean: number;
  totalOrders: number;
  totalProduced: number;
  totalDefects: number;
  calculatedAt: string;
}

export interface KPISnapshot {
  id: number;
  snapshotDate: string;
  planFulfillmentMean: number;
  delayHoursMean: number;
  scrapRateMean: number;
  totalOrders: number;
}

// Order Types
export interface UnifiedOrder {
  id: number;
  orderId: string;
  plannedQty: number;
  producedQty: number;
  defectQty: number;
  plannedStart: string;
  plannedEnd: string;
  actualStart: string;
  actualEnd: string;
  planFulfillment: number;
  delayHours: number;
  scrapRate: number;
}

// Production Data Types
export interface ProductionData {
  id: number;
  temperature: number;
  lineSpeed: number;
  shift: 'Day' | 'Night';
  operatorExperience: number;
  machineAge: number;
  defect: boolean;
  recordedAt: string;
}

export interface ProductionStatistics {
  totalRecords: number;
  defectRate: number;
  avgTemperature: number;
  avgLineSpeed: number;
  dayShiftCount: number;
  nightShiftCount: number;
}

// API Response Types
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
