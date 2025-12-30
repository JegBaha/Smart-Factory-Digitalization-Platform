# AI-Assisted Production Process Optimization

This project demonstrates how AI can support process optimization by identifying production parameters that increase defect probability, enabling data-driven decisions at shopfloor level.

**Goal:** Üretim hattındaki proses parametrelerinin (sıcaklık, hız, vardiya) defect / downtime olasılığı üzerindeki etkisini ML ile analiz etmek ve hangi parametrenin riski artırdığını açıklamak.

## Scenario
- Features: `temperature (°C)`, `line_speed (unit/min)`, `shift (Day/Night)`, optional `operator_experience (year)`, `machine_age (month)`
- Target: `defect` (binary 0/1)
- Data: 8,000-row synthetic set in `data/production_data.csv` — This dataset simulates a real production line based on industrial assumptions.
- Expected effects: high speed + high temperature ↑ defect; night shift ↑ defect; low experience ↑ defect.

## Tech stack
- Data prep: Pandas, NumPy
- Viz: Matplotlib, Seaborn
- ML: Scikit-Learn (Logistic Regression baseline, RandomForest advanced)
- Explainability: Feature importance, temperature vs defect probability curves

## Repo structure
```
ai-process-optimization/
├── data/production_data.csv
├── notebooks/analysis.ipynb
├── src/
│   ├── preprocess.py
│   ├── train.py
│   └── evaluate.py
├── results/
│   ├── feature_importance.png
│   └── temperature_vs_defect.png
└── requirements.txt
```

## How to run
1) Install dependencies
```
python -m venv .venv
.venv\\Scripts\\activate  # or source .venv/bin/activate
pip install -r requirements.txt
```
2) Train baseline + advanced models and view metrics
```
python src/train.py
```
   - Scripts auto-resolve `data/production_data.csv` relative to the repo; run from repo root for simplicity.
3) Generate feature importance + temperature curve plots (saved to `results/`)
```
python src/evaluate.py
```
4) Explore interactively
```
jupyter notebook notebooks/analysis.ipynb
```

## Process highlights
- Data prep: IQR-based outlier removal, shift one-hot encoding, train/test split.
- Baseline: Logistic Regression (interpretable, class weights).
- Advanced: Random Forest (captures interaction of speed + temperature), feature importance comparison vs logistic coefficients.
- Analysis questions answered: Which parameter increases defect risk most? Is speed or temperature riskier? Does night shift drive defects?
