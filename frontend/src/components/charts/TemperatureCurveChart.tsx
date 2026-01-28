import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { predictionApi } from '../../api/prediction';
import type { TemperatureCurvePoint } from '../../types';
import { Loading } from '../common/Loading';

export function TemperatureCurveChart() {
  const [data, setData] = useState<TemperatureCurvePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const curve = await predictionApi.getTemperatureCurve();
        setData(curve);
      } catch (err) {
        setError('Sıcaklık eğrisi verileri yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading text="Grafik yükleniyor..." />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  const chartData = data.map((item) => ({
    temperature: item.temperature,
    probability: item.defectProbability * 100,
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Sıcaklık - Defect Olasılığı Eğrisi
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="temperature"
            unit="°C"
            label={{ value: 'Sıcaklık (°C)', position: 'bottom', offset: -5 }}
          />
          <YAxis
            unit="%"
            domain={[0, 100]}
            label={{ value: 'Defect Olasılığı (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Olasılık']}
            labelFormatter={(label) => `Sıcaklık: ${label}°C`}
          />
          <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="5 5" label="Risk Eşiği" />
          <Line
            type="monotone"
            dataKey="probability"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
