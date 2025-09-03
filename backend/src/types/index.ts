// API Request/Response Types

export interface PredictionRequest {
  crop: string;
  region: string;
  sowingDate: string;
  areaHectares: number;
  soil: SoilMetrics;
  location: Location;
}

export interface SoilMetrics {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  organicMatter: number;
}

export interface Location {
  lat: number;
  lon: number;
}

export interface PredictionResponse {
  prediction: YieldPrediction;
  recommendations: Recommendations;
  weather: WeatherSummary;
}

export interface YieldPrediction {
  unit: string;
  yieldPerHectare: number;
  totalYield: number;
  assumptions: PredictionAssumptions;
}

export interface PredictionAssumptions {
  baseByCrop: number;
  fertilityIndex: number;
  tempScore: number;
  rainScore: number;
  phPenalty: number;
}

export interface Recommendations {
  list: Recommendation[];
  targetImprovementPercent: number;
  notes: string;
}

export interface Recommendation {
  type: 'irrigation' | 'fertilization' | 'soil' | 'pest' | 'best_practice';
  message: string;
}

export interface WeatherSummary {
  precipitationAvgMm: number | null;
  tempMaxAvgC: number | null;
  tempMinAvgC: number | null;
  current: CurrentWeather | null;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
}

export interface WeatherData {
  raw: any;
  summary: WeatherSummary;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: string[];
}

// Model Types
export interface ModelInput {
  input: PredictionRequest;
  weather: WeatherData;
}

export interface RecommendationInput {
  input: PredictionRequest;
  weather: WeatherData;
  prediction: YieldPrediction;
}
