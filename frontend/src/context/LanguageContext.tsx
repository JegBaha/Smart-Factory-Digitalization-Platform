import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  tr: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.predictions': 'Tahminler',
    'nav.production': 'Üretim Verileri',
    'nav.orders': 'Siparişler',
    'nav.analytics': 'Analitik',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Üretim performansınızı izleyin',
    'dashboard.planFulfillment': 'Plan Gerçekleşme',
    'dashboard.avgDelay': 'Ortalama Gecikme',
    'dashboard.scrapRate': 'Hurda Oranı',
    'dashboard.totalOrders': 'Toplam Sipariş',
    'dashboard.hours': 'saat',

    // Predictions
    'predictions.title': 'Defect Tahmini',
    'predictions.subtitle': 'Üretim parametrelerini girin ve defect olasılığını tahmin edin',
    'predictions.temperature': 'Sıcaklık (°C)',
    'predictions.lineSpeed': 'Hat Hızı (birim/dk)',
    'predictions.shift': 'Vardiya',
    'predictions.shiftDay': 'Gündüz',
    'predictions.shiftNight': 'Gece',
    'predictions.operatorExp': 'Operatör Deneyimi (yıl)',
    'predictions.machineAge': 'Makine Yaşı (ay)',
    'predictions.predict': 'Tahmin Et',
    'predictions.predicting': 'Tahmin ediliyor...',
    'predictions.result': 'Tahmin Sonucu',
    'predictions.defectProbability': 'Defect Olasılığı',
    'predictions.prediction': 'Tahmin',
    'predictions.confidence': 'Güven',
    'predictions.defectExpected': 'Defect Bekleniyor',
    'predictions.noDefect': 'Defect Beklenmez',
    'predictions.featureImportance': 'Feature Önem Sıralaması',
    'predictions.tempCurve': 'Sıcaklık - Defect Olasılığı Eğrisi',
    'predictions.riskThreshold': 'Risk Eşiği',
    'predictions.probability': 'Olasılık',
    'predictions.importance': 'Önem',

    // Production Data
    'production.title': 'Üretim Verileri',
    'production.subtitle': 'Tüm üretim kayıtlarını görüntüleyin',
    'production.totalRecords': 'Toplam Kayıt',
    'production.defectCount': 'Defect Sayısı',
    'production.avgTemp': 'Ort. Sıcaklık',
    'production.avgSpeed': 'Ort. Hız',
    'production.allShifts': 'Tüm Vardiyalar',
    'production.day': 'Gündüz',
    'production.night': 'Gece',
    'production.allStatus': 'Tüm Durumlar',
    'production.hasDefect': 'Defect Var',
    'production.noDefect': 'Defect Yok',
    'production.id': 'ID',
    'production.temperature': 'Sıcaklık',
    'production.speed': 'Hız',
    'production.shift': 'Vardiya',
    'production.experience': 'Deneyim',
    'production.machineAge': 'Makine Yaşı',
    'production.status': 'Durum',
    'production.date': 'Tarih',
    'production.defect': 'Defect',
    'production.ok': 'OK',
    'production.year': 'yıl',
    'production.month': 'ay',

    // Orders
    'orders.title': 'Sipariş Yönetimi',
    'orders.subtitle': 'ERP ve MES verilerinin entegre görünümü',
    'orders.search': 'Sipariş ara...',
    'orders.all': 'Tümü',
    'orders.completed': 'Tamamlanan',
    'orders.inProgress': 'Devam Eden',
    'orders.delayed': 'Gecikmeli',
    'orders.orderNo': 'Sipariş No',
    'orders.product': 'Ürün',
    'orders.planned': 'Planlanan',
    'orders.actual': 'Gerçekleşen',
    'orders.fulfillment': 'Gerçekleşme',
    'orders.delay': 'Gecikme',
    'orders.scrap': 'Hurda',

    // Analytics
    'analytics.title': 'Analitik',
    'analytics.subtitle': 'Detaylı üretim analizleri ve trendler',
    'analytics.kpiTrends': 'KPI Trendleri',
    'analytics.last30Days': 'Son 30 Gün',
    'analytics.fulfillmentTrend': 'Gerçekleşme Trendi',
    'analytics.scrapTrend': 'Hurda Trendi',
    'analytics.planVsActual': 'Plan vs Gerçekleşen',
    'analytics.byProduct': 'Ürün Bazında',

    // Common
    'common.loading': 'Yükleniyor...',
    'common.error': 'Hata',
    'common.save': 'Kaydet',
    'common.cancel': 'İptal',
    'common.delete': 'Sil',
    'common.edit': 'Düzenle',
    'common.search': 'Ara',
    'common.filter': 'Filtrele',
    'common.export': 'Dışa Aktar',
    'common.import': 'İçe Aktar',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.predictions': 'Predictions',
    'nav.production': 'Production Data',
    'nav.orders': 'Orders',
    'nav.analytics': 'Analytics',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Monitor your production performance',
    'dashboard.planFulfillment': 'Plan Fulfillment',
    'dashboard.avgDelay': 'Average Delay',
    'dashboard.scrapRate': 'Scrap Rate',
    'dashboard.totalOrders': 'Total Orders',
    'dashboard.hours': 'hours',

    // Predictions
    'predictions.title': 'Defect Prediction',
    'predictions.subtitle': 'Enter production parameters and predict defect probability',
    'predictions.temperature': 'Temperature (°C)',
    'predictions.lineSpeed': 'Line Speed (unit/min)',
    'predictions.shift': 'Shift',
    'predictions.shiftDay': 'Day',
    'predictions.shiftNight': 'Night',
    'predictions.operatorExp': 'Operator Experience (years)',
    'predictions.machineAge': 'Machine Age (months)',
    'predictions.predict': 'Predict',
    'predictions.predicting': 'Predicting...',
    'predictions.result': 'Prediction Result',
    'predictions.defectProbability': 'Defect Probability',
    'predictions.prediction': 'Prediction',
    'predictions.confidence': 'Confidence',
    'predictions.defectExpected': 'Defect Expected',
    'predictions.noDefect': 'No Defect Expected',
    'predictions.featureImportance': 'Feature Importance Ranking',
    'predictions.tempCurve': 'Temperature - Defect Probability Curve',
    'predictions.riskThreshold': 'Risk Threshold',
    'predictions.probability': 'Probability',
    'predictions.importance': 'Importance',

    // Production Data
    'production.title': 'Production Data',
    'production.subtitle': 'View all production records',
    'production.totalRecords': 'Total Records',
    'production.defectCount': 'Defect Count',
    'production.avgTemp': 'Avg. Temperature',
    'production.avgSpeed': 'Avg. Speed',
    'production.allShifts': 'All Shifts',
    'production.day': 'Day',
    'production.night': 'Night',
    'production.allStatus': 'All Status',
    'production.hasDefect': 'Has Defect',
    'production.noDefect': 'No Defect',
    'production.id': 'ID',
    'production.temperature': 'Temperature',
    'production.speed': 'Speed',
    'production.shift': 'Shift',
    'production.experience': 'Experience',
    'production.machineAge': 'Machine Age',
    'production.status': 'Status',
    'production.date': 'Date',
    'production.defect': 'Defect',
    'production.ok': 'OK',
    'production.year': 'years',
    'production.month': 'months',

    // Orders
    'orders.title': 'Order Management',
    'orders.subtitle': 'Integrated view of ERP and MES data',
    'orders.search': 'Search orders...',
    'orders.all': 'All',
    'orders.completed': 'Completed',
    'orders.inProgress': 'In Progress',
    'orders.delayed': 'Delayed',
    'orders.orderNo': 'Order No',
    'orders.product': 'Product',
    'orders.planned': 'Planned',
    'orders.actual': 'Actual',
    'orders.fulfillment': 'Fulfillment',
    'orders.delay': 'Delay',
    'orders.scrap': 'Scrap',

    // Analytics
    'analytics.title': 'Analytics',
    'analytics.subtitle': 'Detailed production analysis and trends',
    'analytics.kpiTrends': 'KPI Trends',
    'analytics.last30Days': 'Last 30 Days',
    'analytics.fulfillmentTrend': 'Fulfillment Trend',
    'analytics.scrapTrend': 'Scrap Trend',
    'analytics.planVsActual': 'Plan vs Actual',
    'analytics.byProduct': 'By Product',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'tr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
