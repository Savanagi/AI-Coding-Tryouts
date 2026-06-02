/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sun, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Thermometer, 
  Wind, 
  Droplet, 
  Gauge, 
  AlertOctagon, 
  RefreshCw,
  SunDim,
  Compass,
  ArrowUpRight
} from "lucide-react";
import { WeatherCommandResponse } from "./types";
import WeatherHeader from "./components/WeatherHeader";
import ActiveAlerts from "./components/ActiveAlerts";
import StationGrid from "./components/StationGrid";
import HistoricalChart from "./components/HistoricalChart";
import GeminiBrief from "./components/GeminiBrief";

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherCommandResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Custom manual tracking coords (starts as null to fall back to current IP address on load)
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lon: number; city?: string; region?: string } | null>(null);

  // Core atmospheric fetch routing dispatcher
  const fetchAtmosphericReport = async (
    lat: number | null = null, 
    lon: number | null = null,
    cityStr: string | null = null,
    regionStr: string | null = null
  ) => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      let fetchUrl = "/api/weather";
      if (lat !== null && lon !== null) {
        fetchUrl += `?lat=${lat}&lon=${lon}`;
        if (cityStr) fetchUrl += `&city=${encodeURIComponent(cityStr)}`;
        if (regionStr) fetchUrl += `&region=${encodeURIComponent(regionStr)}`;
      }

      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`Meteorological API reported bad response status ${response.status}`);
      }

      const payload: WeatherCommandResponse = await response.json();
      setWeatherData(payload);
    } catch (err: any) {
      console.error("Meteorological ingestion failed:", err);
      setErrorMsg(err.message || "Could not retrieve atmospheric data. Check API keys or regional coordinate access.");
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial lookup (based on client IP geolocation automatically)
  useEffect(() => {
    fetchAtmosphericReport();
  }, []);

  const handleCustomSearch = (lat: number, lon: number, cityName?: string, regionName?: string) => {
    setSelectedCoords({ lat, lon, city: cityName, region: regionName });
    fetchAtmosphericReport(lat, lon, cityName || null, regionName || null);
  };

  const handleResetToIp = () => {
    setSelectedCoords(null);
    fetchAtmosphericReport();
  };

  const handleManualRefresh = () => {
    if (selectedCoords) {
      fetchAtmosphericReport(selectedCoords.lat, selectedCoords.lon, selectedCoords.city || null, selectedCoords.region || null);
    } else {
      fetchAtmosphericReport();
    }
  };

  // Weather Code to Visual Widget Mapping
  const getWeatherVisual = (code: number) => {
    const iconSizeClass = "w-14 h-14 md:w-16 md:h-16";
    if (code === 0) {
      return {
        label: "Clear Sky",
        icon: <Sun className={`${iconSizeClass} text-amber-400`} />,
        bgGlow: "from-amber-500/10 to-transparent",
        badge: "text-amber-400 bg-amber-500/10 border-amber-500/20"
      };
    }
    if (code >= 1 && code <= 3) {
      return {
        label: "Partly Cloudy",
        icon: <Cloud className={`${iconSizeClass} text-slate-350`} />,
        bgGlow: "from-slate-500/10 to-transparent",
        badge: "text-slate-300 bg-slate-500/10 border-slate-500/20"
      };
    }
    if (code === 45 || code === 48) {
      return {
        label: "Dense Fog Conditions",
        icon: <CloudFog className={`${iconSizeClass} text-slate-450`} />,
        bgGlow: "from-zinc-500/10 to-transparent",
        badge: "text-slate-400 bg-zinc-500/10 border-zinc-500/20"
      };
    }
    if (code >= 51 && code <= 57) {
      return {
        label: "Continuous Drizzle",
        icon: <CloudDrizzle className={`${iconSizeClass} text-sky-400`} />,
        bgGlow: "from-sky-500/10 to-transparent",
        badge: "text-sky-305 bg-sky-500/15 border-sky-500/20"
      };
    }
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
      return {
        label: "Heavy Rainfall Precip",
        icon: <CloudRain className={`${iconSizeClass} text-blue-400`} />,
        bgGlow: "from-blue-500/10 to-transparent",
        badge: "text-blue-300 bg-blue-500/15 border-blue-500/25"
      };
    }
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
      return {
        label: "Active Winter Snowfall",
        icon: <CloudSnow className={`${iconSizeClass} text-sky-300`} />,
        bgGlow: "from-sky-300/10 to-transparent",
        badge: "text-sky-200 bg-sky-300/15 border-sky-300/25"
      };
    }
    if (code >= 95) {
      return {
        label: "Thunderstorm Electrical Cell",
        icon: <CloudLightning className={`${iconSizeClass} text-violet-400 animate-pulse`} />,
        bgGlow: "from-violet-500/15 to-transparent",
        badge: "text-violet-300 bg-violet-500/15 border-violet-500/25"
      };
    }
    return {
      label: "Varying Precipitation",
      icon: <CloudRain className={`${iconSizeClass} text-cyan-400`} />,
      bgGlow: "from-cyan-500/10 to-transparent",
      badge: "text-slate-350 bg-slate-800 border-slate-700"
    };
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      
      {/* Outer Layout Wrapper */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-6 md:py-8 space-y-6">
        
        {/* Header Unit */}
        {weatherData && (
          <WeatherHeader 
            currentLocation={weatherData.location}
            isLoading={isLoading}
            onSearch={handleCustomSearch}
            onReset={handleResetToIp}
          />
        )}

        {/* Global Operational Error Fallback banner */}
        {errorMsg && (
          <div className="bg-red-950/80 border border-red-800 rounded-xl p-4 text-center max-w-2xl mx-auto flex items-center justify-center gap-3">
            <AlertOctagon className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="text-left">
              <h4 className="text-white font-bold text-sm">Station Offline / Query Malfunction</h4>
              <p className="text-rose-200 text-xs mt-0.5">{errorMsg}</p>
            </div>
            <button 
              onClick={handleManualRefresh}
              className="bg-red-900/60 hover:bg-red-800/80 text-white text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-nowrap"
            >
              Retry Sync
            </button>
          </div>
        )}

        {/* Glassmorphic Loader Panel */}
        {isLoading && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center">
            <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm text-center">
              <RefreshCw className="w-10 h-10 text-blue-400 animate-spin mb-4" />
              <h3 className="text-white font-semibold text-base mb-1">
                Synchronizing Climate Data...
              </h3>
              <p className="text-slate-400 text-xs px-2 leading-relaxed">
                Aggregating satellite maps and executing multi-station AI synthesis with Gemini.
              </p>
            </div>
          </div>
        )}

        {/* Real-time Content Grid */}
        {weatherData && !isLoading && (
          <div className="space-y-6">
            
            {/* Upper Content Layout: Current Metrics + Active Warnings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Primary Localized Realtime Weather Condition Panel (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between" id="atmosphere-current-gauge">
                {/* Background soft ambient gradient */}
                <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl ${getWeatherVisual(weatherData.current.weatherCode).bgGlow} rounded-full blur-3xl pointer-events-none`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-blue-400" />
                      <span>Met-Sensor Reading</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Timestamp: {new Date(weatherData.current.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-add sm:items-center justify-between gap-6 mb-8">
                    {/* Temperature Numeric display */}
                    <div>
                      <div className="flex items-start">
                        <span className="text-5xl md:text-6xl font-light font-mono text-white tracking-tighter">
                          {weatherData.current.temperature.toFixed(1)}
                        </span>
                        <span className="text-xl md:text-2xl font-semibold text-blue-400 font-mono mt-1">°C</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md border font-mono tracking-tight font-semibold uppercase ${getWeatherVisual(weatherData.current.weatherCode).badge}`}>
                          {getWeatherVisual(weatherData.current.weatherCode).label}
                        </span>
                        <span className="text-slate-400 text-xs font-medium">
                          Feels like: <strong className="text-white font-semibold">{weatherData.current.apparentTemperature.toFixed(1)}°C</strong>
                        </span>
                      </div>
                    </div>

                    {/* Meteorological Visual Logo */}
                    <div className="flex flex-col items-center text-center p-3 bg-white/5 border border-white/5 rounded-2xl min-w-[124px]">
                      {getWeatherVisual(weatherData.current.weatherCode).icon}
                      <span className="text-[9px] text-slate-500 font-mono mt-1 uppercase tracking-wider">WMO CODE {weatherData.current.weatherCode}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-atmospheric sensor metrics footer block */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white/5 border border-white/5 rounded-xl relative z-10 font-mono text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-405">
                      <Droplet className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block leading-none mb-1">Humidity</span>
                      <strong className="text-slate-200 text-sm font-semibold">{weatherData.current.humidity}%</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block leading-none mb-1">Wind Force</span>
                      <strong className="text-slate-200 text-sm font-semibold">{weatherData.current.windSpeed.toFixed(1)} <span className="text-[9px] font-normal text-slate-405 uppercase">km/h</span></strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-500/10 rounded-lg text-slate-400">
                      <Gauge className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block leading-none mb-1">Barometer</span>
                      <strong className="text-slate-200 text-sm font-semibold">{weatherData.current.pressure.toFixed(0)} <span className="text-[9px] font-normal text-slate-400 uppercase">hPa</span></strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                      <SunDim className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block leading-none mb-1">UV Radiation</span>
                      <strong className="text-slate-200 text-sm font-semibold">{weatherData.current.uvIndex} <span className="text-[9px] font-normal text-slate-400 uppercase">INDEX</span></strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Severe alerts panel (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
                <ActiveAlerts alerts={weatherData.alerts} />
              </div>
            </div>

            {/* Station Sensor Side-by-side array comparing multi models */}
            <StationGrid stations={weatherData.stationModels} />

            {/* AI Synthesized Meteorological Analysis brief powered by Gemini (full width) */}
            <GeminiBrief synthesis={weatherData.synthesis} />

            {/* Historical trends chart comparing past records with forecast curves */}
            <HistoricalChart 
              history={weatherData.history}
              forecast={weatherData.forecast}
            />
          </div>
        )}
      </main>

      {/* Aesthetic humbler footer with no telemetry clutter */}
      <footer className="border-t border-slate-800/40 bg-[#050811] py-6 text-center text-slate-500 font-mono text-[10px]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Weather Signal Intelligence. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">Global Station Grid <ArrowUpRight className="w-3 h-3 text-cyan-400" /></span>
            <span className="flex items-center gap-1">Gemini AI Model Sync <ArrowUpRight className="w-3 h-3 text-violet-400" /></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
