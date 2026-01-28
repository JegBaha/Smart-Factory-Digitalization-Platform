import { useState } from 'react';
import { Card } from '../components/common/Card';
import { useLanguage } from '../context/LanguageContext';

// Mock unified orders data
const mockOrders = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  orderId: `ORD-${1000 + i}`,
  plannedQty: 800 + Math.floor(Math.random() * 500),
  producedQty: 750 + Math.floor(Math.random() * 500),
  defectQty: Math.floor(Math.random() * 50),
  plannedStart: new Date(Date.now() - (15 - i) * 24 * 60 * 60 * 1000).toISOString(),
  plannedEnd: new Date(Date.now() - (15 - i) * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
  actualStart: new Date(Date.now() - (15 - i) * 24 * 60 * 60 * 1000 - 1 * 60 * 60 * 1000).toISOString(),
  actualEnd: new Date(Date.now() - (15 - i) * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString(),
  planFulfillment: 0.85 + Math.random() * 0.2,
  delayHours: -2 + Math.random() * 6,
  scrapRate: Math.random() * 0.04,
}));

export function Orders() {
  const { t, language } = useLanguage();
  const [orders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);

  const getDelayLabel = (hours: number) => {
    if (language === 'tr') {
      return hours <= 0 ? 'Erken' : 'Geç';
    }
    return hours <= 0 ? 'Early' : 'Late';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('orders.title')}</h1>
        <p className="mt-1 text-gray-600">{t('orders.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Table */}
        <div className="lg:col-span-2">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">{t('orders.orderNo')}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">{t('orders.planned')}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">{t('orders.actual')}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">{t('orders.fulfillment')}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">{t('orders.delay')}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">{t('orders.scrap')}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className={`border-b border-gray-100 cursor-pointer transition-colors ${
                        selectedOrder?.id === order.id ? 'bg-primary-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="py-3 px-4 text-sm font-medium text-primary-600">{order.orderId}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{order.plannedQty.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{order.producedQty.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.planFulfillment >= 0.95
                              ? 'bg-green-100 text-green-800'
                              : order.planFulfillment >= 0.9
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {(order.planFulfillment * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-sm ${
                            order.delayHours <= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {order.delayHours <= 0 ? '' : '+'}
                          {order.delayHours.toFixed(1)}h
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {(order.scrapRate * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Order Detail */}
        <div>
          <Card title={selectedOrder ? selectedOrder.orderId : (language === 'tr' ? 'Sipariş Detayı' : 'Order Detail')}>
            {selectedOrder ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('orders.planned')}</p>
                    <p className="text-lg font-semibold">{selectedOrder.plannedQty.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('orders.actual')}</p>
                    <p className="text-lg font-semibold">{selectedOrder.producedQty.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{language === 'tr' ? 'Defect Miktarı' : 'Defect Count'}</p>
                    <p className="text-lg font-semibold text-red-600">{selectedOrder.defectQty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('orders.scrap')}</p>
                    <p className="text-lg font-semibold">{(selectedOrder.scrapRate * 100).toFixed(2)}%</p>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {language === 'tr' ? 'Zaman Çizelgesi' : 'Timeline'}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'tr' ? 'Planlanan Başlangıç:' : 'Planned Start:'}</span>
                      <span>{new Date(selectedOrder.plannedStart).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'tr' ? 'Planlanan Bitiş:' : 'Planned End:'}</span>
                      <span>{new Date(selectedOrder.plannedEnd).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'tr' ? 'Gerçek Başlangıç:' : 'Actual Start:'}</span>
                      <span>{new Date(selectedOrder.actualStart).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'tr' ? 'Gerçek Bitiş:' : 'Actual End:'}</span>
                      <span>{new Date(selectedOrder.actualEnd).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}</span>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">KPIs</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('dashboard.planFulfillment')}</span>
                      <div className="w-32">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              selectedOrder.planFulfillment >= 0.95 ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${Math.min(selectedOrder.planFulfillment * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{t('orders.delay')}</span>
                      <span
                        className={`text-sm font-medium ${
                          selectedOrder.delayHours <= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {getDelayLabel(selectedOrder.delayHours)}: {Math.abs(selectedOrder.delayHours).toFixed(1)} {t('dashboard.hours')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                {language === 'tr' ? 'Detay görüntülemek için bir sipariş seçin' : 'Select an order to view details'}
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
