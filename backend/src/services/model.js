// Simple heuristic model as a placeholder for ML.
// Combines soil metrics and weather to estimate yield per hectare.

const BASE_YIELD_BY_CROP = {
  wheat: 3.2, // tons/ha
  rice: 4.0,
  maize: 5.0,
  cotton: 1.8,
  soybean: 2.8
};

export function estimateYield({ input, weather }) {
  const cropKey = String(input.crop || '').toLowerCase();
  const base = BASE_YIELD_BY_CROP[cropKey] ?? 3.0;

  const { nitrogen, phosphorus, potassium, ph, organicMatter } = input.soil;
  const fertilityIndex = normalize(nitrogen, 0, 100) * 0.4
    + normalize(phosphorus, 0, 100) * 0.2
    + normalize(potassium, 0, 100) * 0.2
    + normalize(organicMatter, 0, 10) * 0.2;

  const tempScore = weather?.summary?.tempMaxAvgC != null && weather?.summary?.tempMinAvgC != null
    ? gaussianComfort((weather.summary.tempMaxAvgC + weather.summary.tempMinAvgC) / 2, 22, 7)
    : 0.7;

  const rainScore = weather?.summary?.precipitationAvgMm != null
    ? saturation(weather.summary.precipitationAvgMm, 0, 5, 20)
    : 0.6;

  const phPenalty = ph >= 6 && ph <= 7.5 ? 1.0 : 0.85;

  const yieldPerHectare = base * (0.6 + 0.4 * fertilityIndex) * (0.5 + 0.5 * tempScore) * (0.5 + 0.5 * rainScore) * phPenalty;

  const totalYield = yieldPerHectare * input.areaHectares;

  return {
    unit: 'ton',
    yieldPerHectare: round2(yieldPerHectare),
    totalYield: round2(totalYield),
    assumptions: {
      baseByCrop: base,
      fertilityIndex: round2(fertilityIndex),
      tempScore: round2(tempScore),
      rainScore: round2(rainScore),
      phPenalty
    }
  };
}

function normalize(value, min, max) {
  const v = Math.max(min, Math.min(max, value));
  return (v - min) / (max - min);
}

function gaussianComfort(x, mean, std) {
  const z = (x - mean) / std;
  const g = Math.exp(-0.5 * z * z);
  return Math.max(0, Math.min(1, g));
}

function saturation(x, low, ideal, high) {
  if (x <= low) return 0;
  if (x >= high) return 1;
  if (x <= ideal) return (x - low) / (ideal - low);
  return 1 - (x - ideal) / (high - ideal);
}

function round2(n) {
  return Math.round(n * 100) / 100;
}


