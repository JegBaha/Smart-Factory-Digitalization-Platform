# MES–ERP Integration PoC

This proof of concept bridges shopfloor execution data (MES) with enterprise planning (ERP), improving transparency between production and business layers.

**Amaç:** MES (üretim) ve ERP (planlama) CSV’lerini tek veri modelinde birleştirip planlanan vs gerçekleşen üretimi analiz etmek. order_id entegrasyon anahtarıdır.

## Veri
- MES: `data/mes.csv` → `order_id, produced_qty, defect_qty, start_time, end_time`
- ERP: `data/erp.csv` → `order_id, planned_qty, planned_start, planned_end`

## Mimari
MES CSV → Python ETL → Unified Table  
ERP CSV → Python ETL → Unified Table  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓  
KPI Calculation (plan adherence, delay, scrap rate)

## Repo yapısı
```
mes-erp-integration/
├── data/
│   ├── mes.csv
│   └── erp.csv
├── src/
│   ├── load.py
│   ├── validate.py
│   ├── integrate.py
│   └── kpi.py
├── results/
│   ├── plan_vs_actual.png
│   └── validation.log
└── requirements.txt
```

## Çalıştırma
```
python -m venv .venv
.venv\Scripts\activate   # veya source .venv/bin/activate
pip install -r requirements.txt
python src/kpi.py
```
- `src/kpi.py` şunları yapar: MES/ERP yükleme, validasyon (eksik order_id / negatif miktar / zaman sırası), merge, KPI hesaplama (plan fulfillment, delay saat, scrap rate), unified CSV yazma, plan vs actual grafiği (`results/plan_vs_actual.png`).
- Validasyon hataları `results/validation.log` içine yazılır.

## Köprü notu (opsiyonel)
Bu unified tablo, `ai-process-optimization/` içindeki ML modeline ekstra özellik (planlanana göre sapmalar) olarak beslenebilir; ancak entegrasyon burada bağımsız çalışır.
