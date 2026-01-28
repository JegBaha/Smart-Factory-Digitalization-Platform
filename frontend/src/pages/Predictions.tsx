import { PredictionForm } from '../components/prediction/PredictionForm';
import { FeatureImportanceChart } from '../components/charts/FeatureImportanceChart';
import { TemperatureCurveChart } from '../components/charts/TemperatureCurveChart';
import { useLanguage } from '../context/LanguageContext';

export function Predictions() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('predictions.title')}</h1>
        <p className="mt-1 text-gray-600">{t('predictions.subtitle')}</p>
      </div>

      <PredictionForm />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureImportanceChart />
        <TemperatureCurveChart />
      </div>
    </div>
  );
}
