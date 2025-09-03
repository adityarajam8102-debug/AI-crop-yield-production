import fetch from 'node-fetch';

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeatherByLatLon(lat, lon) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily: 'precipitation_sum,temperature_2m_max,temperature_2m_min',
    current_weather: 'true',
    timezone: 'auto'
  });

  const url = `${OPEN_METEO_BASE}?${params.toString()}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Weather API error: ${resp.status}`);
  }
  const data = await resp.json();

  const daily = data.daily || {};
  const precipitation = Array.isArray(daily.precipitation_sum) ? avg(daily.precipitation_sum) : null;
  const tmax = Array.isArray(daily.temperature_2m_max) ? avg(daily.temperature_2m_max) : null;
  const tmin = Array.isArray(daily.temperature_2m_min) ? avg(daily.temperature_2m_min) : null;

  const summary = {
    precipitationAvgMm: precipitation,
    tempMaxAvgC: tmax,
    tempMinAvgC: tmin,
    current: data.current_weather || null
  };

  return { raw: data, summary };
}

function avg(arr) {
  if (!arr || arr.length === 0) return null;
  const sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
}


