import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sensor de Ré | IoT Dashboard",
  description: "Sistema de sensor de ré com Arduino",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
