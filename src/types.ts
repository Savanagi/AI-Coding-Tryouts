/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GeoLocation {
  ip: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  provider: string;
}

export interface CurrentConditions {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  weatherCode: number;
  precipitation: number;
  uvIndex: number;
  time: string;
}

export interface AlertConditions {
  id: string;
  severity: "none" | "minor" | "moderate" | "severe" | "extreme";
  event: string;
  headline: string;
  description: string;
  instruction: string;
  sender: string;
  ends: string;
}

export interface StationModelForecast {
  modelName: string;
  source: string;
  temperature: number;
  relativeHumidity: number;
  windSpeed: number;
  precipitationProbability: number;
  pressure: number;
}

export interface HistoricalTrendPoint {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
  windSpeedMax: number;
}

export interface WeatherSynthesis {
  severityRating: "low" | "medium" | "high" | "critical";
  alertHeadline: string;
  alertDetails: string;
  modelDiscrepancies: string;
  confidenceScore: number; // 0-100%
  safetyChecklist: string[];
  meteorologicalBrief: string;
  trendAnalysis: string;
}

export interface WeatherCommandResponse {
  location: GeoLocation;
  current: CurrentConditions;
  alerts: AlertConditions[];
  stationModels: StationModelForecast[];
  history: HistoricalTrendPoint[];
  forecast: HistoricalTrendPoint[];
  synthesis: WeatherSynthesis;
}
