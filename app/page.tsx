"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import PowerButton from "./components/PowerButton";
import RadarBars from "./components/RadarBars";

const CarScene = dynamic(() => import("./components/CarScene"), { ssr: false });

type AlertState = "idle" | "safe" | "warn" | "danger";

interface SensorState {
  distance: number;
  alert: AlertState;
  statusText: string;
  beepsPerSec: string;
  color: string;
}

function getSensorState(dist: number): SensorState {
  if (dist > 120) return { distance: dist, alert: "safe", statusText: "SEGURO", beepsPerSec: "1", color: "var(--color-green)" };
  if (dist > 60)  return { distance: dist, alert: "warn",  statusText: "ATENÇÃO", beepsPerSec: "3", color: "var(--color-amber)" };
  if (dist > 25)  return { distance: dist, alert: "danger", statusText: "PERIGO", beepsPerSec: "8", color: "var(--color-red)" };
  return { distance: dist, alert: "danger", statusText: "COLISÃO!", beepsPerSec: "∞", color: "var(--color-red)" };
}

const ALERT_CONFIG = {
  idle:   { icon: "○", text: "SISTEMA PRONTO — AGUARDANDO ATIVAÇÃO", borderColor: "var(--color-border)" },
  safe:   { icon: "●", text: "SEGURO — CONTINUE NORMALMENTE",          borderColor: "var(--color-green)" },
  warn:   { icon: "◆", text: "ATENÇÃO — REDUZA A VELOCIDADE",          borderColor: "var(--color-amber)" },
  danger: { icon: "▲", text: "PERIGO — PARE IMEDIATAMENTE",            borderColor: "var(--color-red)" },
};

export default function HomePage() {
  const [isActive, setIsActive] = useState(false);
  const [sliderDist, setSliderDist] = useState(200);

  const togglePower = useCallback(() => setIsActive((v) => !v), []);

  const sensor = getSensorState(sliderDist);
  const alertCfg = isActive ? ALERT_CONFIG[sensor.alert] : ALERT_CONFIG.idle;
  const displayColor = isActive ? sensor.color : "var(--color-muted)";

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      background: "var(--color-bg)",
      fontFamily: "var(--font-mono)",
    }}>
      {/* Panel */}
      <div style={{
        width: "100%",
        maxWidth: "560px",
        background: "var(--color-surface)",
        border: `1px solid ${isActive ? "rgba(0,200,122,0.2)" : "var(--color-border)"}`,
        borderRadius: "16px",
        padding: "28px 24px 24px",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.5s",
        boxShadow: isActive ? "0 0 60px rgba(0,200,122,0.06)" : "none",
      }}>
        {/* Ambient glow */}
        {isActive && (
          <div style={{
            position: "absolute",
            top: 0, left: "50%",
            transform: "translateX(-50%)",
            width: "300px",
            height: "80px",
            background: "radial-gradient(ellipse, rgba(0,200,122,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
        )}

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <div style={{
              fontFamily: "var(--font-hud)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "4px",
              color: "var(--color-muted)",
              textTransform: "uppercase",
            }}>
              Sensor de Ré
            </div>
            <div style={{ fontSize: "10px", letterSpacing: "2px", color: "var(--color-border2)", marginTop: "2px" }}>
              Arduino IoT v1.0
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: isActive ? "var(--color-green)" : "var(--color-border2)",
              boxShadow: isActive ? "0 0 10px var(--color-green)" : "none",
              transition: "all 0.4s",
            }} />
            <span style={{
              fontSize: "10px",
              letterSpacing: "2px",
              color: isActive ? "var(--color-green)" : "var(--color-muted)",
              transition: "color 0.4s",
            }}>
              {isActive ? "ATIVO" : "INATIVO"}
            </span>
          </div>
        </div>

        {/* Power Button */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <PowerButton isActive={isActive} onToggle={togglePower} />
        </div>

        {/* Car Scene */}
        <div style={{
          height: "210px",
          marginBottom: "20px",
          opacity: isActive ? 1 : 0.25,
          transition: "opacity 0.5s",
          border: "0.5px solid var(--color-border)",
          borderRadius: "8px",
          overflow: "hidden",
          background: "#08090b",
        }}>
          <CarScene
            distance={sliderDist}
            isActive={isActive}
            statusColor={sensor.color}
          />
        </div>

        {/* Metric cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "10px",
          marginBottom: "16px",
          opacity: isActive ? 1 : 0.3,
          transition: "opacity 0.5s",
        }}>
          {[
            { label: "DISTÂNCIA", value: isActive ? `${sliderDist}` : "--", unit: "cm", color: displayColor },
            { label: "STATUS", value: isActive ? sensor.statusText : "--", unit: "", color: displayColor },
            { label: "BEEPS/S", value: isActive ? sensor.beepsPerSec : "--", unit: "", color: displayColor },
          ].map(({ label, value, unit, color }) => (
            <div key={label} style={{
              background: "var(--color-surface2)",
              border: "0.5px solid var(--color-border)",
              borderRadius: "8px",
              padding: "12px 10px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "var(--color-muted)", marginBottom: "6px" }}>
                {label}
              </div>
              <div style={{
                fontFamily: "var(--font-hud)",
                fontSize: label === "STATUS" ? "11px" : "20px",
                fontWeight: 900,
                color,
                transition: "color 0.3s",
                paddingTop: label === "STATUS" ? "4px" : "0",
                letterSpacing: label === "STATUS" ? "1px" : "0",
              }}>
                {value}
              </div>
              {unit && (
                <div style={{ fontSize: "9px", color: "var(--color-muted)", marginTop: "2px" }}>{unit}</div>
              )}
            </div>
          ))}
        </div>

        {/* Radar bars */}
        <div style={{
          opacity: isActive ? 1 : 0.2,
          transition: "opacity 0.5s",
          marginBottom: "14px",
        }}>
          <RadarBars distance={sliderDist} isActive={isActive} color={sensor.color} />
        </div>

        {/* Alert bar */}
        <div
          className={isActive && sensor.alert === "danger" ? "danger-blink" : ""}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "var(--color-surface2)",
            border: `0.5px solid ${alertCfg.borderColor}`,
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "10px",
            letterSpacing: "2px",
            color: isActive ? sensor.color : "var(--color-muted)",
            transition: "border-color 0.3s, color 0.3s",
            minHeight: "40px",
          }}
        >
          <span style={{ fontSize: "12px" }}>{alertCfg.icon}</span>
          <span>{alertCfg.text}</span>
        </div>

        {/* Simulator slider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginTop: "16px",
          opacity: isActive ? 1 : 0.3,
          transition: "opacity 0.5s",
        }}>
          <span style={{ fontSize: "9px", letterSpacing: "2px", color: "var(--color-muted)", whiteSpace: "nowrap" }}>
            SIMULAR DIST.
          </span>
          <input
            type="range"
            min="5"
            max="200"
            step="1"
            value={sliderDist}
            onChange={(e) => setSliderDist(Number(e.target.value))}
            disabled={!isActive}
            style={{ flex: 1, accentColor: "var(--color-green)", cursor: isActive ? "pointer" : "not-allowed" }}
          />
          <span style={{ fontSize: "9px", color: "var(--color-muted)", minWidth: "40px", textAlign: "right" }}>
            {sliderDist}cm
          </span>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          paddingTop: "16px",
          borderTop: "0.5px solid var(--color-border)",
        }}>
          <span style={{ fontSize: "9px", letterSpacing: "1px", color: "var(--color-border2)" }}>
            NRF24L01 · ARDUINO NANO
          </span>
          <span style={{ fontSize: "9px", letterSpacing: "1px", color: "var(--color-border2)" }}>
            HC-SR04 ULTRASSÔNICO
          </span>
        </div>
      </div>
    </main>
  );
}
