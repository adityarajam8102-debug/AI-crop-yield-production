import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { fetchWeatherByLatLon } from '../services/weather.js';
import { estimateYield } from '../services/model.js';
import { generateRecommendations } from '../services/recommendations.js';
import { PredictionRequest, PredictionResponse, ApiError } from '../types/index.js';

const router = Router();

const schema = Joi.object({
  crop: Joi.string().required(),
  region: Joi.string().required(),
  sowingDate: Joi.string().isoDate().required(),
  areaHectares: Joi.number().positive().required(),
  soil: Joi.object({
    nitrogen: Joi.number().min(0).max(100).required(),
    phosphorus: Joi.number().min(0).max(100).required(),
    potassium: Joi.number().min(0).max(100).required(),
    ph: Joi.number().min(0).max(14).required(),
    organicMatter: Joi.number().min(0).max(20).required()
  }).required(),
  location: Joi.object({
    lat: Joi.number().required(),
    lon: Joi.number().required()
  }).required()
});

router.post('/', async (req: Request, res: Response) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorResponse: ApiError = { 
      error: 'ValidationError', 
      details: error.details.map(d => d.message) 
    };
    return res.status(400).json(errorResponse);
  }

  try {
    const validatedRequest = value as PredictionRequest;
    const weather = await fetchWeatherByLatLon(validatedRequest.location.lat, validatedRequest.location.lon);
    const prediction = estimateYield({ input: validatedRequest, weather });
    const recommendations = generateRecommendations({ input: validatedRequest, weather, prediction });

    const response: PredictionResponse = { 
      prediction, 
      recommendations, 
      weather: weather.summary 
    };
    res.json(response);
  } catch (e) {
    const error = e as Error;
    const errorResponse: ApiError = { 
      error: 'PredictionFailed', 
      message: error.message 
    };
    res.status(500).json(errorResponse);
  }
});

export default router;


