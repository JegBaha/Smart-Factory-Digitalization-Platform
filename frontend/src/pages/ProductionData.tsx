import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Card } from '../components/common/Card';
import { useLanguage } from '../context/LanguageContext';

// Mock data for demonstration
const mockData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  temperature: 75 + Math.random() * 25,
  lineSpeed: 70 + Math.random() * 30,
  shift: Math.random() > 0.5 ? 'Day' : 'Night',
  operatorExperience: 1 + Math.random() * 9,
  machineAge: 12 + Math.random() * 28,
  defect: Math.random() > 0.8,
  recordedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
}));

export function ProductionData() {
  const { t, language } = useLanguage();
  const [data] = useState(mockData);
  const [filter, setFilter] = useState({
    shift: '',
    hasDefect: '',
  });

  const filteredData = data.filter((item) => {
    if (filter.shift && item.shift !== filter.shift) return false;
    if (filter.hasDefect === 'true' && !item.defect) return false;
    if (filter.hasDefect === 'false' && item.defect) return false;
    return true;
  });

  const stats = {
    total: data.length,
    defects: data.filter((d) => d.defect).length,
    avgTemp: data.reduce((sum, d) => sum + d.temperature, 0) / data.length,
    avgSpeed: data.reduce((sum, d) => sum + d.lineSpeed, 0) / data.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('production.title')}</h1>
          <p className="mt-1 text-gray-600">{t('production.subtitle')}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <p className="text-sm text-gray-600">{t('production.totalRecords')}</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-sm text-gray-600">{t('production.defectCount')}</p>
          <p className="text-2xl font-bold text-red-600">{stats.defects}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-sm text-gray-600">{t('production.avgTemp')}</p>
          <p className="text-2xl font-bold text-gray-900">{stats.avgTemp.toFixed(1)}°C</p>
        </Card>
        <Card className="!p-4">
          <p className="text-sm text-gray-600">{t('production.avgSpeed')}</p>
          <p className="text-2xl font-bold text-gray-900">{stats.avgSpeed.toFixed(1)} u/m</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="!p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            className="input w-auto"
            value={filter.shift}
            onChange={(e) => setFilter({ ...filter, shift: e.target.value })}
          >
            <option value="">{t('production.allShifts')}</option>
            <option value="Day">{t('production.day')}</option>
            <option value="Night">{t('production.night')}</option>
          </select>
          <select
            className="input w-auto"
            value={filter.hasDefect}
            onChange={(e) => setFilter({ ...filter, hasDefect: e.target.value })}
          >
            <option value="">{t('production.allStatus')}</option>
            <option value="true">{t('production.hasDefect')}</option>
            <option value="false">{t('production.noDefect')}</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">{t('production.id')}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">{t('production.temperature')}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">{t('production.speed')}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">{t('production.shift')}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">{t('production.experience')}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">{t('production.machineAge')}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">{t('production.status')}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">{t('production.date')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">#{item.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{item.temperature.toFixed(1)}°C</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{item.lineSpeed.toFixed(1)} u/m</td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.shift === 'Day'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {item.shift === 'Day' ? t('production.day') : t('production.night')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{item.operatorExperience.toFixed(1)} {t('production.year')}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{item.machineAge.toFixed(0)} {t('production.month')}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.defect
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {item.defect ? t('production.defect') : t('production.ok')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(item.recordedAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
