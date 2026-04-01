"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Pantero - Error</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #0a0e17; color: #ebe6da; font-family: system-ui, sans-serif; }
        `}</style>
      </head>
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <h1
              style={{
                fontSize: "5rem",
                fontWeight: 700,
                color: "#c9a54e",
                textShadow: "0 0 40px rgba(201,165,78,0.3)",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              500
            </h1>
            <p style={{ marginTop: "1rem", fontSize: "1.125rem", color: "#9a9590" }}>
              Something went wrong.
            </p>
            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={reset}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "#c9a54e",
                  padding: "0.75rem 1.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#0a0e17",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
              <a
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #1e2536",
                  padding: "0.75rem 1.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#ebe6da",
                  textDecoration: "none",
                }}
              >
                Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
