const API_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'http://localhost:4000/api'
  : '/api';

document.addEventListener('DOMContentLoaded', () => {
  const langSelect = document.getElementById('lang-select');
  const savedLang = localStorage.getItem('lang') || 'en';
  langSelect.value = savedLang;
  window.I18N.applyI18n(savedLang);
  langSelect.addEventListener('change', () => {
    localStorage.setItem('lang', langSelect.value);
    window.I18N.applyI18n(langSelect.value);
  });

  const form = document.getElementById('predict-form');
  const submitBtn = document.getElementById('submit-btn');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    try {
      const payload = collectPayload();
      const resp = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'Request failed');
      renderResults(data);
    } catch (err) {
      renderError(err.message);
    } finally {
      submitBtn.disabled = false;
    }
  });
});

function collectPayload() {
  return {
    crop: document.getElementById('crop').value,
    region: document.getElementById('region').value,
    sowingDate: document.getElementById('sowingDate').value,
    areaHectares: parseFloat(document.getElementById('area').value),
    soil: {
      nitrogen: parseFloat(document.getElementById('nitrogen').value),
      phosphorus: parseFloat(document.getElementById('phosphorus').value),
      potassium: parseFloat(document.getElementById('potassium').value),
      ph: parseFloat(document.getElementById('ph').value),
      organicMatter: parseFloat(document.getElementById('organicMatter').value)
    },
    location: {
      lat: parseFloat(document.getElementById('lat').value),
      lon: parseFloat(document.getElementById('lon').value)
    }
  };
}

function renderResults(data) {
  const results = document.getElementById('results');
  const pred = document.getElementById('prediction');
  const weather = document.getElementById('weather');
  const recs = document.getElementById('recs');

  pred.innerHTML = `
    <h3>Prediction</h3>
    <p><strong>Yield per hectare:</strong> ${data.prediction.yieldPerHectare} ${data.prediction.unit}</p>
    <p><strong>Total yield:</strong> ${data.prediction.totalYield} ${data.prediction.unit}</p>
  `;

  const ws = data.weather || {};
  weather.innerHTML = `
    <h3>Weather Summary</h3>
    <p><strong>Avg Max Temp:</strong> ${fmt(ws.tempMaxAvgC)} °C</p>
    <p><strong>Avg Min Temp:</strong> ${fmt(ws.tempMinAvgC)} °C</p>
    <p><strong>Avg Precipitation:</strong> ${fmt(ws.precipitationAvgMm)} mm</p>
  `;

  const recList = (data.recommendations?.list || []).map(r => `<li><strong>${capitalize(r.type)}:</strong> ${r.message}</li>`).join('');
  recs.innerHTML = `
    <h3>Recommendations</h3>
    <ul>${recList}</ul>
  `;

  results.hidden = false;
}

function renderError(msg) {
  const results = document.getElementById('results');
  const pred = document.getElementById('prediction');
  const weather = document.getElementById('weather');
  const recs = document.getElementById('recs');
  pred.innerHTML = `<p style="color:#fca5a5"><strong>Error:</strong> ${msg}</p>`;
  weather.innerHTML = '';
  recs.innerHTML = '';
  results.hidden = false;
}

function fmt(v) { return v == null ? '-' : Math.round(v * 10) / 10; }
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }


