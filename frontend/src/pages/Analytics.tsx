import { FeatureImportanceChart } from '../components/charts/FeatureImportanceChart';
import { TemperatureCurveChart } from '../components/charts/TemperatureCurveChart';
import { Card } from '../components/common/Card';
import { useLanguage } from '../context/LanguageContext';

export function Analytics() {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('analytics.title')}</h1>
        <p className="mt-1 text-gray-600">{t('analytics.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureImportanceChart />
        <TemperatureCurveChart />
      </div>

      <Card title={language === 'tr' ? 'Model Bilgileri' : 'Model Information'}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Logistic Regression</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex justify-between">
                <span>{language === 'tr' ? 'Model Tipi:' : 'Model Type:'}</span>
                <span className="font-medium text-gray-900">Linear Classifier</span>
              </li>
              <li className="flex justify-between">
                <span>{language === 'tr' ? 'Özellik:' : 'Feature:'}</span>
                <span className="font-medium text-gray-900">{language === 'tr' ? 'Yorumlanabilir' : 'Interpretable'}</span>
              </li>
              <li className="flex justify-between">
                <span>Class Weights:</span>
                <span className="font-medium text-gray-900">Balanced</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Random Forest</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex justify-between">
                <span>{language === 'tr' ? 'Ağaç Sayısı:' : 'Number of Trees:'}</span>
                <span className="font-medium text-gray-900">300</span>
              </li>
              <li className="flex justify-between">
                <span>{language === 'tr' ? 'Max Derinlik:' : 'Max Depth:'}</span>
                <span className="font-medium text-gray-900">12</span>
              </li>
              <li className="flex justify-between">
                <span>{language === 'tr' ? 'Özellik:' : 'Feature:'}</span>
                <span className="font-medium text-gray-900">Non-linear Interaction</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <Card title={language === 'tr' ? 'Önemli Bulgular' : 'Key Findings'}>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900">
              {language === 'tr' ? 'Sıcaklık Etkisi' : 'Temperature Effect'}
            </h4>
            <p className="mt-1 text-sm text-blue-700">
              {language === 'tr'
                ? 'Yüksek sıcaklık (95°C+) defect olasılığını önemli ölçüde artırır. Optimal sıcaklık aralığı 75-85°C\'dir.'
                : 'High temperature (95°C+) significantly increases defect probability. Optimal temperature range is 75-85°C.'}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-900">
              {language === 'tr' ? 'Hat Hızı Etkisi' : 'Line Speed Effect'}
            </h4>
            <p className="mt-1 text-sm text-yellow-700">
              {language === 'tr'
                ? 'Yüksek hat hızı + yüksek sıcaklık kombinasyonu en riskli senaryodur. Hız artışı sıcaklıkla birlikte değerlendirilmelidir.'
                : 'High line speed + high temperature combination is the riskiest scenario. Speed increase should be evaluated together with temperature.'}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900">
              {language === 'tr' ? 'Vardiya Etkisi' : 'Shift Effect'}
            </h4>
            <p className="mt-1 text-sm text-purple-700">
              {language === 'tr'
                ? 'Gece vardiyasında defect oranı gündüze göre %15 daha yüksektir. Ek denetim önerilir.'
                : 'Defect rate is 15% higher in night shift compared to day shift. Additional supervision is recommended.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
