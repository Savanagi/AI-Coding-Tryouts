/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlertConditions } from "../types";
import { AlertCircle, AlertOctagon, Info, Calendar, ShieldCheck, Flame, Wind, Snowflake } from "lucide-react";

interface ActiveAlertsProps {
  alerts: AlertConditions[];
}

export default function ActiveAlerts({ alerts }: ActiveAlertsProps) {
  // Utility for defining severity styles matching Immersive UI aesthetics
  const getSeverityStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "extreme":
        return {
          banner: "bg-red-500/10 border-red-500/30 text-rose-200 shadow-[0_0_20px_rgba(239,68,68,0.1)]",
          badge: "bg-red-500/20 text-red-400 border border-red-500/40 font-bold",
          icon: <AlertOctagon className="w-5 h-5 text-red-500 animate-bounce" />,
          glow: "shadow-[0_0_20px_rgba(239,68,68,0.1)]"
        };
      case "severe":
        return {
          banner: "bg-amber-500/10 border-amber-500/30 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.05)]",
          badge: "bg-amber-500/20 text-amber-400 border border-amber-500/40 font-semibold",
          icon: <AlertCircle className="w-5 h-5 text-amber-400 animate-pulse" />,
          glow: "shadow-[0_0_15px_rgba(245,158,11,0.05)]"
        };
      case "moderate":
        return {
          banner: "bg-blue-500/10 border-blue-500/20 text-cyan-200 shadow-[0_0_15px_rgba(59,130,246,0.05)]",
          badge: "bg-blue-500/20 text-blue-400 border border-blue-500/45 font-semibold",
          icon: <Info className="w-5 h-5 text-blue-400" />,
          glow: "shadow-[0_0_10px_rgba(59,130,246,0.05)]"
        };
      case "minor":
      default:
        return {
          banner: "bg-white/5 border-white/5 text-slate-200",
          badge: "bg-white/10 text-slate-300 border border-white/10 font-medium",
          icon: <Info className="w-5 h-5 text-slate-400" />,
          glow: "shadow-none"
        };
    }
  };

  const getAlertSymbol = (eventName: string) => {
    const ev = eventName.toLowerCase();
    if (ev.includes("fire") || ev.includes("heat") || ev.includes("thermal")) {
      return <Flame className="w-5 h-5 text-amber-500 inline mr-1.5" />;
    }
    if (ev.includes("wind") || ev.includes("cyclone") || ev.includes("tornado")) {
      return <Wind className="w-5 h-5 text-cyan-400 inline mr-1.5" />;
    }
    if (ev.includes("freeze") || ev.includes("blizzard") || ev.includes("snow") || ev.includes("ice")) {
      return <Snowflake className="w-5 h-5 text-sky-400 inline mr-1.5" />;
    }
    return null;
  };

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center text-center py-8 h-full min-h-[220px]" id="no-active-alerts">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-white text-base font-medium mb-1.5">Atmosphere Stable</h3>
        <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
          Weather telemetry shows tranquil readings. No severe alerts active within the immediate tracking grids.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-red-500" />
          <span>Active Alerts Advisory ({alerts.length})</span>
        </h3>
        <span className="text-[9px] bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 font-mono rounded-lg animate-pulse tracking-wider">
          LIVE SENSING
        </span>
      </div>

      <div className="flex flex-col gap-3.5 max-h-[380px] overflow-y-auto pr-1">
        {alerts.map((alert) => {
          const style = getSeverityStyle(alert.severity);
          return (
            <div
              key={alert.id}
              className={`border rounded-xl p-4 transition-all ${style.banner} ${style.glow}`}
            >
              <div className="flex items-start justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  {style.icon}
                  <span className="font-semibold text-sm md:text-base tracking-tight text-white flex items-center">
                    {getAlertSymbol(alert.event)}
                    {alert.event}
                  </span>
                </div>
                <span className={`text-[9px] uppercase tracking-wider font-mono rounded-md px-2 py-0.5 ${style.badge}`}>
                  {alert.severity}
                </span>
              </div>

              <h4 className="text-slate-100 text-xs font-semibold mb-2 italic">
                "{alert.headline}"
              </h4>
              
              <p className="text-slate-300 text-xs leading-relaxed line-clamp-4 hover:line-clamp-none transition-all duration-300 mb-3 bg-[#080b12]/40 p-2.5 rounded-lg border border-white/5">
                {alert.description}
              </p>

              {alert.instruction && (
                <div className="bg-[#080b12]/50 border border-white/5 rounded-lg p-2.5 mb-3">
                  <div className="text-[10px] text-amber-500 font-mono font-bold tracking-tight uppercase mb-0.5">
                    Critical Safety Instruction:
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed">{alert.instruction}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-mono border-t border-white/5 pt-2.5">
                <span>Issued: {alert.sender}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  Ends: {new Date(alert.ends).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
