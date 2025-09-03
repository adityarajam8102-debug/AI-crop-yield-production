export function generateRecommendations({ input, weather, prediction }) {
  const recs = [];

  // Irrigation
  const rain = weather?.summary?.precipitationAvgMm ?? 0;
  if (rain < 2) {
    recs.push({
      type: 'irrigation',
      message: 'Low expected rainfall. Increase irrigation frequency (1-2 extra cycles/week).'
    });
  } else if (rain > 10) {
    recs.push({
      type: 'irrigation',
      message: 'High rainfall forecast. Reduce irrigation to avoid waterlogging.'
    });
  } else {
    recs.push({ type: 'irrigation', message: 'Maintain regular irrigation schedule based on crop stage.' });
  }

  // Fertilization: NPK balance and pH
  const { nitrogen, phosphorus, potassium, ph } = input.soil;
  if (nitrogen < 40) {
    recs.push({ type: 'fertilization', message: 'Nitrogen low. Apply urea or ammonium nitrate as per guidelines.' });
  }
  if (phosphorus < 30) {
    recs.push({ type: 'fertilization', message: 'Phosphorus low. Use DAP/SSP during early growth.' });
  }
  if (potassium < 30) {
    recs.push({ type: 'fertilization', message: 'Potassium low. Apply MOP to improve stress tolerance.' });
  }
  if (ph < 6) {
    recs.push({ type: 'soil', message: 'Soil acidic. Consider liming to raise pH towards 6.5-7.' });
  } else if (ph > 7.5) {
    recs.push({ type: 'soil', message: 'Soil alkaline. Add organic matter and gypsum as needed.' });
  }

  // Pest risk indicator from temperature/humidity proxy
  const temp = weather?.summary?.tempMaxAvgC ?? 28;
  if (temp > 32) {
    recs.push({ type: 'pest', message: 'High temperature may increase pest pressure. Scout twice weekly.' });
  } else {
    recs.push({ type: 'pest', message: 'Monitor fields weekly; use pheromone traps for early detection.' });
  }

  // Yield improvement tips
  recs.push({ type: 'best_practice', message: 'Use mulching to conserve soil moisture and suppress weeds.' });
  recs.push({ type: 'best_practice', message: 'Adopt drip irrigation if feasible to save water and nutrients.' });

  return {
    list: recs,
    targetImprovementPercent: 10,
    notes: 'Recommendations are heuristic and should be localized with extension officer guidance.'
  };
}


