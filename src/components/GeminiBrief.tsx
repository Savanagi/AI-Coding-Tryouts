/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { WeatherSynthesis } from "../types";
import { Sparkles, Brain, CheckSquare, Square, Info, ShieldAlert, HeartHandshake, Gauge, HelpCircle } from "lucide-react";

interface GeminiBriefProps {
  synthesis: WeatherSynthesis;
}

export default function GeminiBrief({ synthesis }: GeminiBriefProps) {
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (task: string) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [task]: !prev[task]
    }));
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return {
          bg: "bg-red-500/10 border-red-500/30 text-rose-200 shadow-[0_0_20px_rgba(239,68,68,0.1)]",
          badge: "bg-red-500/20 text-red-400 border border-red-500/40 font-bold",
          glow: "border-red-500/40"
        };
      case "high":
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.05)]",
          badge: "bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold",
          glow: "border-amber-500/40"
        };
      case "medium":
        return {
          bg: "bg-blue-500/10 border-blue-500/20 text-cyan-200",
          badge: "bg-blue-500/20 text-blue-400 border border-blue-500/45 font-semibold",
          glow: "border-blue-500/30"
        };
      case "low":
      default:
        return {
          bg: "bg-white/5 border-white/5 text-slate-200",
          badge: "bg-white/10 text-slate-300 border border-white/10 font-semibold",
          glow: "border-white/10"
        };
    }
  };

  const sLabel = getSeverityLabel(synthesis.severityRating);

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden" id="gemini-analytical-synthesis">
      {/* Decorative gradient corners */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-900/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Title block */}
      <div className="flex items-center justify-between gap-3 mb-6 border-b border-white/5 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400 animate-pulse" />
          <div>
            <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              Gemini AI Synoptic Briefing
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Deep Multi-Station Signal Analysis Engine
            </p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl px-2.5 py-1 text-slate-300 text-[10px] font-mono flex items-center gap-1.5 step-overlay">
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span>Real-Time Synthesis</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Column: Alerts & Science Narrative */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Active Synoptic Threat Block */}
          <div className={`border rounded-xl p-4 transition-all ${sLabel.bg}`}>
            <div className="flex items-start justify-between gap-4 mb-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                Threat Status
              </span>
              <span className={`text-[9px] uppercase tracking-wider font-mono rounded px-1.5 py-0.5 ${sLabel.badge}`}>
                {synthesis.severityRating} Severity
              </span>
            </div>
            <h4 className="text-white font-semibold text-base mb-1.5 flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-current flex-shrink-0" />
              <span>{synthesis.alertHeadline}</span>
            </h4>
            <p className="text-xs leading-relaxed text-slate-200">
              {synthesis.alertDetails}
            </p>
          </div>

          {/* Meteorological Narrative Brief */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-4">
            <h5 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-blue-405" />
              <span>Meteorological Dynamics Analysis</span>
            </h5>
            <p className="text-xs leading-relaxed text-slate-300">
              {synthesis.meteorologicalBrief}
            </p>
          </div>

          {/* Model Discrepancies and Gaps */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-4">
            <h5 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Global Weather Station Comparison</span>
            </h5>
            <p className="text-xs leading-relaxed text-slate-300">
              {synthesis.modelDiscrepancies}
            </p>
          </div>

          {/* Trend Analysis */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-4">
            <h5 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-indigo-400" />
              <span>Chronological Climate Shift Summary</span>
            </h5>
            <p className="text-xs leading-relaxed text-slate-300">
              {synthesis.trendAnalysis}
            </p>
          </div>
        </div>

        {/* Right Column: Confidence Score & Emergency Checklist */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Convergence Confidence Score */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center relative overflow-hidden">
            <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest block mb-2">
              Model Convergence Confidence
            </span>
            <div className="relative inline-flex items-center justify-center my-2">
              {/* Radial Score Gauge Render */}
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="#3b82f6"
                  strokeWidth="7"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - synthesis.confidenceScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl md:text-2xl font-light font-mono text-white">
                  {synthesis.confidenceScore}%
                </span>
                <span className="text-[8px] text-blue-400 font-mono block uppercase">
                  CONVERGENT
                </span>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 mt-2 p-2 bg-[#080b12]/60 rounded-lg border border-white/5 font-mono">
              Consensus agreement of NOAA (GFS), ECMWF, DWD (ICON), GEM & METNorway stations.
            </p>
          </div>

          {/* Actionable Preparedness Safety Checklist */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-4">
            <h5 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-blue-400" />
              <span>Preparedness Operations</span>
            </h5>
            
            {synthesis.safetyChecklist.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 text-center border border-dashed border-white/10 rounded-xl">
                Skies are calm. No immediate defensive checklists compiled. Keep enjoying the fine conditions!
              </p>
            ) : (
              <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                {synthesis.safetyChecklist.map((task, idx) => {
                  const isChecked = !!checkedTasks[task];
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleTask(task)}
                      className={`w-full text-left flex items-start gap-2 p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        isChecked 
                          ? "bg-blue-500/10 border-blue-500/20 text-slate-400 line-through" 
                          : "bg-white/5 hover:bg-white/10 border-white/5 text-slate-200"
                      }`}
                    >
                      <span className="mt-0.5 flex-shrink-0 text-blue-400">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </span>
                      <span>{task}</span>
                    </button>
                  );
                })}
              </div>
            )}
            
            {synthesis.safetyChecklist.length > 0 && (
              <div className="text-[9px] text-slate-500 font-mono mt-3 text-center uppercase tracking-wider">
                Defensive radar tracker. Tap to complete.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
