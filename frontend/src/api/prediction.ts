import apiClient from './client';
import type {
  PredictionRequest,
  PredictionResponse,
  FeatureImportance,
  TemperatureCurvePoint,
  PagedResult
} from '../types';

export const predictionApi = {
  predict: async (request: PredictionRequest): Promise<PredictionResponse> => {
    const { data } = await apiClient.post<PredictionResponse>('/prediction/predict', request);
    return data;
  },

  batchPredict: async (requests: PredictionRequest[]): Promise<PredictionResponse[]> => {
    const { data } = await apiClient.post<PredictionResponse[]>('/prediction/batch-predict', requests);
    return data;
  },

  getFeatureImportance: async (): Promise<FeatureImportance[]> => {
    const { data } = await apiClient.get<FeatureImportance[]>('/prediction/feature-importance');
    return data;
  },

  getTemperatureCurve: async (): Promise<TemperatureCurvePoint[]> => {
    const { data } = await apiClient.get<TemperatureCurvePoint[]>('/prediction/temperature-curve');
    return data;
  },

  getHistory: async (page = 1, pageSize = 20): Promise<PagedResult<PredictionResponse>> => {
    const { data } = await apiClient.get<PagedResult<PredictionResponse>>('/prediction/history', {
      params: { page, pageSize }
    });
    return data;
  },
};
