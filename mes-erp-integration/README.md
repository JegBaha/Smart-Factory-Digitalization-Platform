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




