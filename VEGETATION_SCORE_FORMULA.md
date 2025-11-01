# Vegetation Change Score - Calculation Formula

## Enhanced Multi-Temporal Analysis Formula

### Core Formula (Same for All Time Periods)

```
Vegetation Change (%) = ((NDVI_after - NDVI_before) / NDVI_before) × 100
```

**Where:**
- `NDVI_after` = Median NDVI value from the **recent** time period
- `NDVI_before` = Median NDVI value from the **previous** time period
- Result is a **percentage change**

---

## Enhanced Method: Key Improvements

### 1. **Median Instead of Mean**
**Old Method:**
- Uses **mean** (average) NDVI values
- Sensitive to outliers (clouds, shadows, errors)

**New Method:**
- Uses **median** (middle value) NDVI values
- More robust against outliers
- Better represents typical vegetation condition

**Why Better:**
- Median ignores extreme values from bad satellite passes
- More accurate representation of actual vegetation health
- Reduces false alarms from data quality issues

---

### 2. **Multiple Time Periods (Multi-Temporal Analysis)**

Instead of **one comparison**, we now calculate **three scores**:

#### **A. Short-Term Change Score (30 days)**
```
Short_Term_Score = ((NDVI_last_30_days - NDVI_30_to_60_days_ago) / NDVI_30_to_60_days_ago) × 100
```
- **Period Before:** Days 30-60 ago
- **Period After:** Last 30 days
- **Use Case:** Detects immediate changes (recent cutting, fires, restoration)
- **Most sensitive** to recent activities

#### **B. Medium-Term Change Score (90 days)**
```
Medium_Term_Score = ((NDVI_last_90_days - NDVI_90_to_150_days_ago) / NDVI_90_to_150_days_ago) × 100
```
- **Period Before:** Days 90-150 ago
- **Period After:** Last 90 days
- **Use Case:** Quarterly trends, gradual changes
- **Filters out** short-term noise

#### **C. Long-Term Change Score (6 months)**
```
Long_Term_Score = ((NDVI_last_180_days - NDVI_180_to_270_days_ago) / NDVI_180_to_270_days_ago) × 100
```
- **Period Before:** Days 180-270 ago
- **Period After:** Last 180 days
- **Use Case:** Annual patterns, restoration success
- **Shows** long-term degradation or recovery

---

### 3. **Baseline Comparison Score**

**Additional Context:**
```
Baseline_Comparison = ((NDVI_current - NDVI_historical_baseline) / NDVI_historical_baseline) × 100
```

**Where:**
- `NDVI_current` = Current NDVI (from short-term analysis)
- `NDVI_historical_baseline` = Average NDVI from 6-12 months ago

**Purpose:**
- Compares current state to **historical average**
- Identifies if current change is **normal** or **anomalous**
- Helps distinguish **seasonal variations** from **real threats**

---

## Complete Score Structure

### Enhanced Result Format:

```python
{
    "short_term_change": 298.74,        # Primary score (30-day change)
    "medium_term_change": 45.23,        # Quarterly trend
    "long_term_change": 12.56,          # 6-month trend
    "ndvi_before": 0.1000,              # NDVI before period
    "ndvi_after": 0.3980,               # NDVI after period
    "trend_direction": "increasing",     # overall trend: increasing/decreasing/stable
    "alert_level": "normal",            # critical/warning/normal
    "baseline_comparison": {
        "baseline_ndvi": 0.2500,
        "current_ndvi": 0.3980,
        "vs_baseline_percent": 59.20    # vs historical average
    },
    "vegetation_change": 298.74         # Backward compatibility (same as short_term_change)
}
```

---

## Score Interpretation

### Positive Scores (+) = Vegetation Increase
- **+10% to +50%:** Moderate growth (good)
- **+50% to +200%:** Significant growth (excellent, but verify)
- **+200%+:** Exceptional growth (may indicate restoration or data anomaly)

### Negative Scores (-) = Vegetation Decrease
- **-5% to -15%:** Minor loss (monitor)
- **-15% to -30%:** Moderate loss (warning - action needed)
- **-30% or more:** Severe loss (critical - immediate action required)

### Zero or Near Zero (±2%) = Stable
- Minimal change detected
- Ecosystem is stable

---

## Alert Level Calculation

### Automatic Classification:

```python
if short_term_change < -30:
    alert_level = "critical"      # 🔴 Severe deforestation
elif short_term_change < -15:
    alert_level = "warning"       # 🟡 Moderate loss
elif short_term_change > 50:
    alert_level = "warning"       # 🟡 Unusually high growth (verify)
else:
    alert_level = "normal"        # 🟢 Typical variations
```

---

## Trend Direction Calculation

```python
if short_term_change > 10:
    trend_direction = "increasing"     # 📈 Growing
elif short_term_change < -10:
    trend_direction = "decreasing"     # 📉 Declining
else:
    trend_direction = "stable"         # ➡️ Stable
```

---

## Statistical Robustness

### Why Use Median?

**Example Scenario:**

**Satellite Passes for Period:**
- Pass 1: NDVI = 0.35 (clear image)
- Pass 2: NDVI = 0.38 (clear image)
- Pass 3: NDVI = 0.12 (cloudy, shadows) ← Outlier!
- Pass 4: NDVI = 0.36 (clear image)
- Pass 5: NDVI = 0.37 (clear image)

**Mean Calculation:**
```
Mean = (0.35 + 0.38 + 0.12 + 0.36 + 0.37) / 5 = 0.316
```
- **Problem:** Outlier (0.12) pulls average down significantly
- **Result:** Underestimates actual vegetation

**Median Calculation:**
```
Median = 0.36 (middle value: 0.12, 0.35, 0.36, 0.37, 0.38)
```
- **Benefit:** Ignores outlier
- **Result:** More accurate representation

---

## Comparison: Old vs New Method

### Old Simple Method:
```
Single Score = ((NDVI_mean_after - NDVI_mean_before) / NDVI_mean_before) × 100
```
- ✅ Fast and simple
- ❌ Only two data points
- ❌ Sensitive to outliers
- ❌ No context about trends
- ❌ No baseline comparison

### New Enhanced Method:
```
Multiple Scores (Short/Medium/Long-term)
+ Baseline Comparison
+ Trend Direction
+ Alert Level
```
- ✅ Robust (uses median)
- ✅ Multi-temporal analysis
- ✅ Trend detection
- ✅ Baseline context
- ✅ Alert prioritization
- ✅ Better informed decisions

---

## Example Calculations

### Example 1: Healthy Recovery
```
Before Period (30-60 days ago): NDVI median = 0.15
After Period (last 30 days): NDVI median = 0.35

Short-Term Score = ((0.35 - 0.15) / 0.15) × 100 = +133.33%
Trend: Increasing
Alert: Normal (growth is good)
```

### Example 2: Deforestation
```
Before Period (30-60 days ago): NDVI median = 0.60
After Period (last 30 days): NDVI median = 0.30

Short-Term Score = ((0.30 - 0.60) / 0.60) × 100 = -50%
Trend: Decreasing
Alert: Critical (severe loss detected)
```

### Example 3: Seasonal Variation
```
Short-Term Score: -20% (loss)
Medium-Term Score: +5% (growth)
Long-Term Score: +10% (growth)
Baseline Comparison: +15% above historical average

Interpretation: Short-term loss likely seasonal, long-term trend is positive
Alert: Normal (part of natural cycle)
```

---

## Summary

**The core formula remains the same:**
```
Change (%) = ((After - Before) / Before) × 100
```

**But the enhanced method:**
1. Uses **median** (not mean) for robustness
2. Calculates **three time horizons** (short/medium/long-term)
3. Compares against **historical baseline**
4. Automatically classifies **trend direction**
5. Provides **alert levels** for prioritization

**Result:** Much more informed and reliable vegetation change analysis!

