/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { HistoricalTrendPoint } from "../types";
import { TrendingUp, LineChart, Table, AlertCircle, RefreshCw } from "lucide-react";

interface HistoricalChartProps {
  history: HistoricalTrendPoint[];
  forecast: HistoricalTrendPoint[];
}

export default function HistoricalChart({ history, forecast }: HistoricalChartProps) {
  const [activeTab, setActiveTab ] = useState<"chart" | "data">("chart");
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);

  // Combine historical and forecast elements into a single contiguous 14-day timeline
  const combinedPoints = [
    ...history.map((h) => ({ ...h, isHistorical: true })),
    ...forecast.map((f) => ({ ...f, isHistorical: false }))
  ];

  if (combinedPoints.length === 0) {
    return (
      <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        No chronological trend lines loaded.
      </div>
    );
  }

  // Calculate coordinates dimensions for fluid SVG scaling
  const width = 1000;
  const height = 300;
  const paddingLeft = 50;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 40;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Determine scaling boundaries dynamically for high contrast charts
  const temps = combinedPoints.flatMap((p) => [p.temperatureMax, p.temperatureMin]);
  const minTemp = Math.floor(Math.min(...temps) - 2);
  const maxTemp = Math.ceil(Math.max(...temps) + 2);
  const tempRange = maxTemp - minTemp;

  // Compute exact coordinates based on index and temperature values
  const getX = (index: number) => {
    return paddingLeft + (index / (combinedPoints.length - 1)) * chartWidth;
  };

  const getY = (temp: number) => {
    return paddingTop + chartHeight - ((temp - minTemp) / tempRange) * chartHeight;
  };

  // Build SVG Path strings dynamically matching cubic curves
  let maxTempPath = "";
  let minTempPath = "";
  
  combinedPoints.forEach((pt, idx) => {
    const x = getX(idx);
    const yMax = getY(pt.temperatureMax);
    const yMin = getY(pt.temperatureMin);

    if (idx === 0) {
      maxTempPath = `M ${x} ${yMax}`;
      minTempPath = `M ${x} ${yMin}`;
    } else {
      maxTempPath += ` L ${x} ${yMax}`;
      minTempPath += ` L ${x} ${yMin}`;
    }
  });

  // Poly-fill area bounds to create smooth gradients
  const maxAreaPath = `${maxTempPath} L ${getX(combinedPoints.length - 1)} ${getY(minTemp)} L ${getX(0)} ${getY(minTemp)} Z`;

  // X Coordinate where history switches to forecast
  const middleX = getX(history.length - 1);

  // Helper to format short date string for layout clean axis labels
  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl relative" id="historical-meteorological-trends">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>Thermal Evolution Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Analyzing 14 continuous days of meteorological history compared concurrently with forecast trajectories.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="bg-[#080b12]/60 border border-white/5 rounded-xl p-1 flex">
          <button
            onClick={() => setActiveTab("chart")}
            className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "chart" 
                ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Interactive Curve</span>
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "data" 
                ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Tabular Matrix</span>
          </button>
        </div>
      </div>

      {activeTab === "chart" ? (
        <div className="relative">
          
          {/* Legend Strip */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 text-[10px] font-mono text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-gradient-to-r from-red-400 to-rose-450 rounded-full inline-block" />
              <span>Day Max Temp (°C)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full inline-block" />
              <span>Day Min Temp (°C)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-slate-700 rounded-sm inline-block" />
              <span>Rainfall precip (mm)</span>
            </div>
            <div className="h-4 w-[1px] bg-white/5 hidden sm:block" />
            <div className="flex items-center gap-1.5 uppercase tracking-wide">
              <span className="border-l-2 border-dashed border-blue-500/60 pl-2 text-slate-500">
                Left Segment: <strong className="text-slate-300">Actual History</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 uppercase tracking-wide">
              <span className="border-l-2 border-blue-500/60 pl-2 text-slate-500">
                Right Segment: <strong className="text-blue-400">Forecast</strong>
              </span>
            </div>
          </div>

          {/* Fluid SVG Container */}
          <div className="overflow-x-auto">
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full min-w-[700px] h-auto select-none"
              style={{ overflow: "visible" }}
            >
              <defs>
                {/* Temperature High Gradient */}
                <linearGradient id="highTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#080b12" stopOpacity="0.0" />
                </linearGradient>
                {/* History Overlay Gradient */}
                <linearGradient id="historyGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.01" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Reference Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const tempVal = minTemp + ratio * tempRange;
                const y = getY(tempVal);
                return (
                  <g key={i}>
                    <line 
                      x1={paddingLeft} 
                      y1={y} 
                      x2={width - paddingRight} 
                      y2={y} 
                      stroke="#1e293b" 
                      strokeWidth="1" 
                      strokeDasharray="4 4"
                    />
                    <text 
                      x={paddingLeft - 12} 
                      y={y + 4} 
                      fill="#64748b" 
                      fontSize="10" 
                      fontFamily="monospace" 
                      textAnchor="end"
                    >
                      {tempVal.toFixed(0)}°
                    </text>
                  </g>
                );
              })}

              {/* Actual Past History Ambient Shading block */}
              <rect 
                x={paddingLeft} 
                y={paddingTop} 
                width={middleX - paddingLeft} 
                height={chartHeight} 
                fill="url(#historyGrad)" 
              />

              {/* Division line between Sensor Record and Projections */}
              <line 
                x1={middleX} 
                y1={paddingTop - 10} 
                x2={middleX} 
                y2={height - paddingBottom} 
                stroke="#06b6d4" 
                strokeWidth="1.5" 
                strokeDasharray="5 5" 
              />
              <text 
                x={middleX - 10} 
                y={paddingTop} 
                fill="#06b6d4" 
                fontSize="9" 
                fontFamily="monospace" 
                textAnchor="end"
                className="font-bold uppercase tracking-wider"
              >
                Actual Sensor History
              </text>
              <text 
                x={middleX + 10} 
                y={paddingTop} 
                fill="#38bdf8" 
                fontSize="9" 
                fontFamily="monospace" 
                textAnchor="start"
                className="font-bold uppercase tracking-wider"
              >
                Model Forecast →
              </text>

              {/* Day Rainfall Precipitation Bar Graphics */}
              {combinedPoints.map((pt, idx) => {
                const x = getX(idx);
                const barWidth = 14;
                const barHeight = Math.min(chartHeight, (pt.precipitation / 30) * chartHeight);
                const barY = paddingTop + chartHeight - barHeight;
                return (
                  <g key={idx}>
                    <rect 
                      x={x - barWidth / 2} 
                      y={barY} 
                      width={barWidth} 
                      height={barHeight} 
                      fill="#1e2e4f" 
                      stroke="#3b82f6" 
                      strokeWidth="0.5"
                      opacity="0.55"
                      rx="2"
                    />
                  </g>
                );
              })}

              {/* Path Area under curves */}
              <path 
                d={maxAreaPath} 
                fill="url(#highTempGrad)" 
                className="transition-all duration-500"
              />

              {/* Daytime Low Curve Line */}
              <path 
                d={minTempPath} 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                className="transition-all duration-500"
              />

              {/* Daytime High Curve Line */}
              <path 
                d={maxTempPath} 
                fill="none" 
                stroke="#fb7185" 
                strokeWidth="3" 
                strokeLinecap="round"
                className="transition-all duration-500"
              />

              {/* Interactive Hover Vertical Guard & Points overlay */}
              {combinedPoints.map((pt, idx) => {
                const x = getX(idx);
                const yMax = getY(pt.temperatureMax);
                const yMin = getY(pt.temperatureMin);

                return (
                  <g key={idx}>
                    <line 
                      x1={x} 
                      y1={paddingTop} 
                      x2={x} 
                      y2={height - paddingBottom} 
                      stroke={hoveredPointIdx === idx ? "#06b6d4" : "transparent"} 
                      strokeWidth={hoveredPointIdx === idx ? "1.5" : "15"}
                      onMouseEnter={() => setHoveredPointIdx(idx)}
                      onMouseLeave={() => setHoveredPointIdx(null)}
                      className="cursor-pointer"
                    />

                    {/* Dot markers */}
                    <circle 
                      cx={x} 
                      cy={yMax} 
                      r={hoveredPointIdx === idx ? 6 : 4} 
                      fill="#fb7185" 
                      stroke="#111625" 
                      strokeWidth="2" 
                    />
                    <circle 
                      cx={x} 
                      cy={yMin} 
                      r={hoveredPointIdx === idx ? 5 : 3.5} 
                      fill="#38bdf8" 
                      stroke="#111625" 
                      strokeWidth="1.5" 
                    />

                    {/* X Axis Date labels */}
                    {idx % 2 === 0 && (
                      <text 
                        x={x} 
                        y={height - paddingBottom + 18} 
                        fill="#64748b" 
                        fontSize="9.5" 
                        fontFamily="monospace" 
                        textAnchor="middle"
                        className="font-medium"
                      >
                        {formatShortDate(pt.date)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Dynamic Hover Tooltip Overlay */}
          {hoveredPointIdx !== null && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-md border border-white/10 p-3.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-100 transition-all z-20 flex gap-4 pointer-events-none w-max max-w-sm">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-slate-500 block uppercase">
                  {combinedPoints[hoveredPointIdx].isHistorical ? "Actual Record" : "Forecasting"}
                </span>
                <span className="text-white text-xs font-semibold block">
                  {new Date(combinedPoints[hoveredPointIdx].date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="h-8 w-[1px] bg-white/5 align-self-center" />
              <div className="flex gap-4">
                <div>
                  <span className="text-[9px] font-mono text-rose-400 block">MAX</span>
                  <span className="text-sm font-semibold font-mono text-rose-300">
                    {combinedPoints[hoveredPointIdx].temperatureMax.toFixed(1)}°C
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-blue-450 block">MIN</span>
                  <span className="text-sm font-semibold font-mono text-blue-300">
                    {combinedPoints[hoveredPointIdx].temperatureMin.toFixed(1)}°C
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-blue-400 block">PRECIP</span>
                  <span className="text-sm font-semibold font-mono text-indigo-400">
                    {combinedPoints[hoveredPointIdx].precipitation.toFixed(1)} mm
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-550 block">WIND MAX</span>
                  <span className="text-sm font-semibold font-mono text-slate-350">
                    {combinedPoints[hoveredPointIdx].windSpeedMax.toFixed(0)} km/h
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Tabular Data View */
        <div className="overflow-x-auto rounded-xl border border-white/5 shadow-inner">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-white/5 text-slate-400 border-b border-white/5">
                <th className="p-3">Timeline Sector</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Max Temp</th>
                <th className="p-3 text-right">Min Temp</th>
                <th className="p-3 text-right">Precipitation</th>
                <th className="p-3 text-right">Max Wind</th>
              </tr>
            </thead>
            <tbody>
              {combinedPoints.map((pt, idx) => (
                <tr 
                  key={idx} 
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                    pt.isHistorical ? "text-slate-350" : "text-blue-300"
                  }`}
                >
                  <td className="p-3 font-semibold uppercase text-[10px]">
                    {pt.isHistorical ? (
                      <span className="text-slate-505">Actual History</span>
                    ) : (
                      <span className="text-blue-450 animate-pulse">Forecast Model</span>
                    )}
                  </td>
                  <td className="p-3 text-white font-medium">
                    {new Date(pt.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="p-3 text-right font-medium text-rose-300">{pt.temperatureMax.toFixed(1)}°C</td>
                  <td className="p-3 text-right font-medium text-blue-300">{pt.temperatureMin.toFixed(1)}°C</td>
                  <td className="p-3 text-right text-indigo-400">{pt.precipitation.toFixed(1)} mm</td>
                  <td className="p-3 text-right text-slate-400">{pt.windSpeedMax.toFixed(0)} km/h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
