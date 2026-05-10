"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import PowerButton from "./components/PowerButton";
import RadarBars from "./components/RadarBars";

const CarScene = dynamic(() => import("./components/CarScene"), { ssr: false });

type AlertState = "idle" | "safe" | "warn" | "danger";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const ALERT_COLORS: Record<AlertState, string> = {
  idle:   "var(--color-muted)",
  safe:   "var(--color-green)",
  warn:   "var(--color-amber)",
  danger: "var(--color-red)",
};

const ALERT_CONFIG: Record<AlertState, { icon: string; text: string; borderColor: string }> = {
  idle:   { icon: "○", text: "SISTEMA PRONTO — AGUARDANDO ATIVAÇÃO", borderColor: "var(--color-border)" },
  safe:   { icon: "●", text: "SEGURO — CONTINUE NORMALMENTE",         borderColor: "var(--color-green)" },
  warn:   { icon: "◆", text: "ATENÇÃO — REDUZA A VELOCIDADE",         borderColor: "var(--color-amber)" },
  danger: { icon: "▲", text: "PERIGO — PARE IMEDIATAMENTE",           borderColor: "var(--color-red)" },
};

export default function HomePage() {
  const [isActive, setIsActive]     = useState(false);
  const [distance, setDistance]     = useState<number | null>(null);
  const [alert, setAlert]           = useState<AlertState>("idle");
  const [statusText, setStatusText] = useState("--");
  const [beepsPerSec, setBeepsPerSec] = useState("--");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res  = await fetch(`${API_URL}/api/status`);
        const data = await res.json();
        setIsActive(data.active);
        setDistance(data.distance);
        setAlert((data.alert as AlertState) ?? "idle");
        setStatusText(data.statusText ?? "--");
        setBeepsPerSec(data.beepsPerSec ?? "--");
      } catch {
        // backend indisponível — mantém estado anterior
      }
    };

    fetchStatus();
    const id = setInterval(fetchStatus, 500);
    return () => clearInterval(id);
  }, []);

  const togglePower = useCallback(async () => {
    try {
      const res  = await fetch(`${API_URL}/api/toggle`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ active: !isActive }),
      });
      const data = await res.json();
      setIsActive(data.active);
    } catch (e) {
      console.error("[ReDuino] toggle falhou:", e);
    }
  }, [isActive]);

  const displayDist  = distance ?? 200;
  const displayColor = ALERT_COLORS[alert];
  const alertCfg     = ALERT_CONFIG[alert];

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
            distance={displayDist}
            isActive={isActive}
            statusColor={displayColor}
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
            { label: "DISTÂNCIA", value: isActive && distance !== null ? `${distance}` : "--", unit: "cm", color: displayColor },
            { label: "STATUS",    value: statusText,  unit: "",   color: displayColor },
            { label: "BEEPS/S",  value: beepsPerSec, unit: "",   color: displayColor },
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
          <RadarBars distance={displayDist} isActive={isActive} color={displayColor} />
        </div>

        {/* Alert bar */}
        <div
          className={isActive && alert === "danger" ? "danger-blink" : ""}
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
            color: displayColor,
            transition: "border-color 0.3s, color 0.3s",
            minHeight: "40px",
          }}
        >
          <span style={{ fontSize: "12px" }}>{alertCfg.icon}</span>
          <span>{alertCfg.text}</span>
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
