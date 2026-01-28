import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { predictionApi } from '../../api/prediction';
import type { FeatureImportance } from '../../types';
import { Loading } from '../common/Loading';

export function FeatureImportanceChart() {
  const [data, setData] = useState<FeatureImportance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const importance = await predictionApi.getFeatureImportance();
        setData(importance.sort((a, b) => b.importance - a.importance));
      } catch (err) {
        setError('Feature importance verileri yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading text="Grafik yükleniyor..." />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  const chartData = data.map((item) => ({
    name: item.featureName,
    importance: item.importance * 100,
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Feature Önem Sıralaması
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 'auto']} unit="%" />
          <YAxis type="category" dataKey="name" width={70} />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Önem']}
          />
          <Bar dataKey="importance" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
