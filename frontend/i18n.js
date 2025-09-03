const LOCALES = {
  en: {
    title: 'AI-Powered Crop Yield Prediction & Optimization',
    language: 'Language',
    inputSection: 'Input Details',
    crop: 'Crop',
    region: 'Region',
    sowingDate: 'Sowing Date',
    area: 'Area (hectares)',
    soilMetrics: 'Soil Metrics',
    organicMatter: 'Organic Matter (%)',
    location: 'Location',
    predict: 'Predict',
    results: 'Results',
    footer: 'This tool provides heuristic guidance. Consult local experts for decisions.'
  },
  hi: {
    title: 'एआई आधारित फसल उपज पूर्वानुमान और अनुकूलन',
    language: 'भाषा',
    inputSection: 'इनपुट विवरण',
    crop: 'फसल',
    region: 'क्षेत्र',
    sowingDate: 'बोआई तिथि',
    area: 'क्षेत्र (हेक्टेयर)',
    soilMetrics: 'मृदा मापदंड',
    organicMatter: 'जैविक पदार्थ (%)',
    location: 'स्थान',
    predict: 'पूर्वानुमान',
    results: 'परिणाम',
    footer: 'यह उपकरण परामर्श हेतु है। निर्णय के लिए स्थानीय विशेषज्ञ से सलाह लें।'
  }
};

function applyI18n(lang) {
  const dict = LOCALES[lang] || LOCALES.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
}

window.I18N = { applyI18n, LOCALES };


