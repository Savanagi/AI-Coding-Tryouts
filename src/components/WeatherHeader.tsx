/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, MapPin, Compass, ShieldAlert, Sparkles } from "lucide-react";
import { GeoLocation } from "../types";

interface WeatherHeaderProps {
  currentLocation: GeoLocation;
  isLoading: boolean;
  onSearch: (lat: number, lon: number, cityName?: string, regionName?: string) => void;
  onReset: () => void;
}

// Pre-configured extreme weather anchors
const CLIMATE_ANCHORS = [
  { name: "Houston", lat: 29.7604, lon: -95.3698, region: "Texas", label: "Humid Coast" },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503, region: "Kanto", label: "East Maritime" },
  { name: "London", lat: 51.5074, lon: -0.1278, region: "Greater London", label: "Atlantic Westerly" },
  { name: "Anchorage", lat: 61.2181, lon: -149.9003, region: "Alaska", label: "Arctic Freeze" },
  { name: "Sahara Desert", lat: 23.8739, lon: 11.2868, region: "Illizi", label: "Extreme Heat" },
  { name: "Miami", lat: 25.7617, lon: -80.1918, region: "Florida", label: "Saffir-UV" },
];

export default function WeatherHeader({
  currentLocation,
  isLoading,
  onSearch,
  onReset
}: WeatherHeaderProps) {
  const [latInput, setLatInput] = useState("");
  const [lonInput, setLonInput] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latInput);
    const lon = parseFloat(lonInput);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setErrorText("Latitude must be a valid number between -90 and 90.");
      return;
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      setErrorText("Longitude must be a valid number between -180 and 180.");
      return;
    }

    setErrorText("");
    onSearch(lat, lon, `Coord-Grid (${lat.toFixed(2)}, ${lon.toFixed(2)})`, "Global Coordinate");
  };

  const handleDeviceGeolocation = () => {
    if (!navigator.geolocation) {
      setErrorText("Geolocation is not supported by your browser.");
      return;
    }

    setErrorText("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onSearch(latitude, longitude, "Your Precise Location", "Live Geo-Fix");
      },
      (err) => {
        console.error("Hardware Geolocation access denied or failed:", err);
        setErrorText("Could not fetch GPS lock. Falling back to IP-based location.");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden" id="weather-sensor-header">
      {/* Background ambient radar glow effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-blue-400 text-xs md:text-sm font-medium tracking-wider uppercase">
            <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></div>
            <span>Live Satellite Feed • IP: {currentLocation.ip}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-slate-100">
            {currentLocation.city}, <span className="font-semibold text-white">{currentLocation.region}</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm">
            Station Status: <span className="font-mono text-cyan-400">{currentLocation.provider}</span> | Lat: {currentLocation.latitude.toFixed(4)}°, Lon: {currentLocation.longitude.toFixed(4)}°
          </p>
        </div>

        {/* Dynamic GPS & Sensor Trigger Controls */}
        <div className="flex flex-col gap-3 min-w-[280px] sm:min-w-[400px]">
          <form onSubmit={handleSubmit} className="flex flex-wrap sm:flex-nowrap gap-2 items-end">
            <div className="flex-1 min-w-[90px]">
              <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-1.5">LATITUDE</label>
              <input
                type="text"
                placeholder="e.g. 37.77"
                value={latInput}
                onChange={(e) => setLatInput(e.target.value)}
                className="w-full bg-[#080b12]/60 border border-white/5 rounded-xl py-2 px-3 font-mono text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              />
            </div>
            <div className="flex-1 min-w-[90px]">
              <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-1.5">LONGITUDE</label>
              <input
                type="text"
                placeholder="e.g. -122.41"
                value={lonInput}
                onChange={(e) => setLonInput(e.target.value)}
                className="w-full bg-[#080b12]/60 border border-white/5 rounded-xl py-2 px-3 font-mono text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              />
            </div>
            <div className="flex gap-1.5 w-full sm:w-auto">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(59,130,246,0.3)]"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Track</span>
              </button>
              <button
                type="button"
                onClick={handleDeviceGeolocation}
                disabled={isLoading}
                title="Use browser device high-accuracy sensor geolocation"
                className="bg-slate-800/40 hover:bg-slate-700/60 border border-white/5 hover:border-white/10 text-slate-300 p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </form>
          {errorText && (
            <p className="text-rose-400 text-[11px] font-mono">{errorText}</p>
          )}
        </div>
      </div>

      {/* Climate Anchors Shortcut Strip */}
      <div className="border-t border-white/5 mt-6 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>Microclimate Stations / Stress Anchors:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CLIMATE_ANCHORS.map((anchor) => (
            <button
              key={anchor.name}
              onClick={() => onSearch(anchor.lat, anchor.lon, anchor.name, anchor.region)}
              disabled={isLoading}
              className="bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 px-3 py-1 font-mono text-[10px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-2.5 h-2.5 text-blue-400" />
              <span className="font-semibold text-white">{anchor.name}</span>
              <span className="text-[9px] text-slate-500">({anchor.label})</span>
            </button>
          ))}
          <button
            onClick={onReset}
            disabled={isLoading}
            className="border border-dashed border-red-500/30 hover:bg-red-500/10 text-rose-300 px-3 py-1 font-mono text-[10px] rounded-lg transition-all cursor-pointer"
          >
            Reset to IP
          </button>
        </div>
      </div>
    </div>
  );
}
