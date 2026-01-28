import { useEffect, useState } from 'react';
import { Factory, Clock, AlertTriangle, Package } from 'lucide-react';
import { KPICard } from '../components/dashboard/KPICard';
import { FeatureImportanceChart } from '../components/charts/FeatureImportanceChart';
import { TemperatureCurveChart } from '../components/charts/TemperatureCurveChart';
import { Loading } from '../components/common/Loading';
import { kpiApi } from '../api/kpi';
import { useLanguage } from '../context/LanguageContext';
import type { KPISummary } from '../types';

export function Dashboard() {
  const { t } = useLanguage();
  const [kpis, setKpis] = useState<KPISummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const data = await kpiApi.getSummary();
        setKpis(data);
      } catch (err) {
        setError('KPI data could not be loaded');
        // Mock data for demo
        setKpis({
          planFulfillmentMean: 0.947,
          delayHoursMean: 1.8,
          scrapRateMean: 0.022,
          totalOrders: 120,
          totalProduced: 125400,
          totalDefects: 2759,
          calculatedAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  if (loading) return <Loading size="lg" text={t('common.loading')} />;

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title={t('dashboard.planFulfillment')}
          value={`${((kpis?.planFulfillmentMean || 0) * 100).toFixed(1)}%`}
          subtitle={t('dashboard.subtitle')}
          trend={kpis?.planFulfillmentMean && kpis.planFulfillmentMean >= 0.95 ? 'up' : 'down'}
          trendValue="Target: ≥95%"
          icon={<Factory className="w-6 h-6" />}
          color={kpis?.planFulfillmentMean && kpis.planFulfillmentMean >= 0.95 ? 'green' : 'yellow'}
        />
        <KPICard
          title={t('dashboard.avgDelay')}
          value={`${(kpis?.delayHoursMean || 0).toFixed(1)} ${t('dashboard.hours')}`}
          subtitle={t('dashboard.subtitle')}
          trend={kpis?.delayHoursMean && kpis.delayHoursMean <= 2 ? 'up' : 'down'}
          trendValue={`Target: ≤2 ${t('dashboard.hours')}`}
          icon={<Clock className="w-6 h-6" />}
          color={kpis?.delayHoursMean && kpis.delayHoursMean <= 2 ? 'green' : 'red'}
        />
        <KPICard
          title={t('dashboard.scrapRate')}
          value={`${((kpis?.scrapRateMean || 0) * 100).toFixed(2)}%`}
          subtitle={t('dashboard.subtitle')}
          trend={kpis?.scrapRateMean && kpis.scrapRateMean <= 0.02 ? 'up' : 'down'}
          trendValue="Target: ≤2%"
          icon={<AlertTriangle className="w-6 h-6" />}
          color={kpis?.scrapRateMean && kpis.scrapRateMean <= 0.02 ? 'green' : 'red'}
        />
        <KPICard
          title={t('dashboard.totalOrders')}
          value={kpis?.totalOrders?.toLocaleString() || '0'}
          subtitle={`${kpis?.totalProduced?.toLocaleString() || 0} units`}
          icon={<Package className="w-6 h-6" />}
          color="blue"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureImportanceChart />
        <TemperatureCurveChart />
      </div>

      {/* Info */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
          <strong>Note:</strong> API connection failed, showing demo data.
        </div>
      )}
    </div>
  );
}
