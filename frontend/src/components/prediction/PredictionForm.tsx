import { useState } from 'react';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import type { PredictionRequest, PredictionResponse } from '../../types';
import { predictionApi } from '../../api/prediction';
import { useLanguage } from '../../context/LanguageContext';

export function PredictionForm() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<PredictionRequest>({
    temperature: 80,
    lineSpeed: 85,
    shift: 'Day',
    operatorExperience: 5,
    machineAge: 24,
  });
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'shift' ? value : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await predictionApi.predict(formData);
      setResult(response);
    } catch (err) {
      setError(language === 'tr'
        ? 'Tahmin yapılamadı. Lütfen tekrar deneyin.'
        : 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{t('predictions.title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="temperature" className="label">
              {t('predictions.temperature')}
            </label>
            <input
              type="number"
              id="temperature"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              min="50"
              max="120"
              step="0.1"
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="lineSpeed" className="label">
              {t('predictions.lineSpeed')}
            </label>
            <input
              type="number"
              id="lineSpeed"
              name="lineSpeed"
              value={formData.lineSpeed}
              onChange={handleChange}
              min="50"
              max="150"
              step="0.1"
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="shift" className="label">
              {t('predictions.shift')}
            </label>
            <select
              id="shift"
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="Day">{t('predictions.shiftDay')}</option>
              <option value="Night">{t('predictions.shiftNight')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="operatorExperience" className="label">
              {t('predictions.operatorExp')}
            </label>
            <input
              type="number"
              id="operatorExperience"
              name="operatorExperience"
              value={formData.operatorExperience}
              onChange={handleChange}
              min="0"
              max="30"
              step="0.1"
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="machineAge" className="label">
              {t('predictions.machineAge')}
            </label>
            <input
              type="number"
              id="machineAge"
              name="machineAge"
              value={formData.machineAge}
              onChange={handleChange}
              min="0"
              max="120"
              step="0.1"
              className="input"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                {t('predictions.predicting')}
              </>
            ) : (
              t('predictions.predict')
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t('predictions.result')}</h2>
          <div
            className={`p-6 rounded-lg ${
              result.predictedDefect
                ? 'bg-red-50 border border-red-200'
                : 'bg-green-50 border border-green-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {result.predictedDefect ? (
                <AlertTriangle className="w-8 h-8 text-red-600" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-600" />
              )}
              <div>
                <p className="font-bold text-lg">
                  {result.predictedDefect
                    ? (language === 'tr' ? 'Yüksek Defect Riski' : 'High Defect Risk')
                    : (language === 'tr' ? 'Düşük Defect Riski' : 'Low Defect Risk')}
                </p>
                <p className="text-sm opacity-75">
                  Model: {result.modelUsed}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('predictions.defectProbability')}:</span>
                <span className="font-bold">
                  {(result.defectProbability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    result.defectProbability > 0.5 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${result.defectProbability * 100}%` }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('predictions.confidence')}:</span>
                <span className="font-bold">
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              {language === 'tr' ? 'Giriş Parametreleri' : 'Input Parameters'}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">{t('predictions.temperature')}:</div>
              <div className="font-medium">{result.input.temperature}°C</div>
              <div className="text-gray-600">{t('predictions.lineSpeed')}:</div>
              <div className="font-medium">{result.input.lineSpeed} u/min</div>
              <div className="text-gray-600">{t('predictions.shift')}:</div>
              <div className="font-medium">
                {result.input.shift === 'Day' ? t('predictions.shiftDay') : t('predictions.shiftNight')}
              </div>
              <div className="text-gray-600">{t('predictions.operatorExp')}:</div>
              <div className="font-medium">{result.input.operatorExperience} {t('production.year')}</div>
              <div className="text-gray-600">{t('predictions.machineAge')}:</div>
              <div className="font-medium">{result.input.machineAge} {t('production.month')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
