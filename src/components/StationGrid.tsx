/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StationModelForecast } from "../types";
import { ChevronRight, Percent, Wind, Thermometer, Gauge, Droplet, Layers } from "lucide-react";

interface StationGridProps {
  stations: StationModelForecast[];
}

export default function StationGrid({ stations }: StationGridProps) {
  if (!stations || stations.length === 0) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 text-center text-slate-450 font-mono text-xs">
        No weather stations model telemetry loaded from regional grids.
      </div>
    );
  }

  // Calculate Station Deviation metrics
  const temperatures = stations.map(s => s.temperature);
  const avgTemp = temperatures.reduce((a, b) => a + b, 0) / stations.length;
  const tempVariance = temperatures.reduce((a, b) => a + Math.pow(b - avgTemp, 2), 0) / stations.length;
  const tempStdDev = Math.sqrt(tempVariance);

  // Determine Consensus Tier
  let consensusTier = { text: "Optimal Consistency", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" };
  if (tempStdDev > 2.0) {
    consensusTier = { text: "High Model Divergence", color: "text-rose-450 border-red-500/20 bg-red-500/10" };
  } else if (tempStdDev > 1.0) {
    consensusTier = { text: "Moderate Divergence", color: "text-amber-400 border-amber-500/20 bg-amber-500/10" };
  }

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden" id="station-telemetry-array">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Station Sensor Aggregation Array</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing current outputs across 5 sovereign weather models and integrated consensus.
          </p>
        </div>
        
        {/* Consensus Metric Panel */}
        <div className={`border rounded-xl px-3 py-1 flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase ${consensusTier.color}`}>
          <span className="h-1.5 w-1.5 bg-current rounded-full" />
          <span>{consensusTier.text} (±{tempStdDev.toFixed(2)}°C)</span>
        </div>
      </div>

      {/* Grid of Station cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {stations.map((station, idx) => {
          // Calculate individual variance from statistical mean
          const individualDelta = station.temperature - avgTemp;
          const deltaColor = individualDelta > 0.5 
            ? "text-rose-400" 
            : individualDelta < -0.5 
              ? "text-blue-400" 
              : "text-slate-500";

          const isComposite = station.modelName.includes("Composite");

          return (
            <div 
              key={idx} 
              className={`rounded-xl p-4 transition-all duration-300 relative border ${
                isComposite 
                  ? "bg-white/5 border-white/10 ring-1 ring-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] text-center" 
                  : "bg-white/5 border-white/5 text-center hover:border-white/10"
              }`}
            >
              <div className="mb-2">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                  {isComposite ? "Consensus Model" : "API Station"}
                </span>
                <span className="font-semibold text-white text-xs truncate block" title={station.modelName}>
                  {station.modelName.split(" (")[0]}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1 block text-ellipsis break-words" title={station.source}>
                  {station.source}
                </span>
              </div>

              {/* Temperature Reading */}
              <div className="flex items-baseline justify-center gap-1.5 my-3">
                <span className="text-xl md:text-2xl font-light font-mono text-white tracking-tight">
                  {station.temperature.toFixed(1)}°C
                </span>
                <span className={`text-[10px] font-mono ${deltaColor}`} title="Variance from consensus average">
                  {individualDelta >= 0 ? "+" : ""}{individualDelta.toFixed(1)}
                </span>
              </div>

              {/* Secondary Multi-Station Telemetries */}
              <div className="space-y-1.5 border-t border-white/5 pt-2.5 font-mono text-[10px] text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Droplet className="w-3 h-3 text-blue-400" />
                    <span>HUM</span>
                  </span>
                  <span className="text-slate-200 font-semibold">{station.relativeHumidity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-blue-300" />
                    <span>WND</span>
                  </span>
                  <span className="text-slate-200 font-semibold">{station.windSpeed.toFixed(0)} km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3 h-3 text-indigo-400" />
                    <span>PREC</span>
                  </span>
                  <span className="text-slate-200 font-semibold">{station.precipitationProbability.toFixed(1)} mm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-slate-500" />
                    <span>BAR</span>
                  </span>
                  <span className="text-slate-200 font-semibold">{station.pressure.toFixed(0)} hPa</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
