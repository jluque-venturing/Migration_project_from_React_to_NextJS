import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top, rgba(6,182,212,0.28), rgba(15,23,42,1) 54%), #020817",
          color: "#e2e8f0",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "12px 22px",
              borderRadius: 18,
              border: "1px solid rgba(34,211,238,0.45)",
              background: "rgba(15,23,42,0.7)",
              boxShadow: "0 0 28px rgba(34,211,238,0.18)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: "linear-gradient(135deg, #06b6d4, #67e8f9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#082f49",
                fontWeight: 800,
                fontSize: 28,
              }}
            >
              F
            </div>
            <div style={{ fontSize: 54, fontWeight: 700, letterSpacing: -2 }}>FormForge</div>
          </div>
          <div style={{ fontSize: 28, maxWidth: 780, opacity: 0.9 }}>
            Laboratorio de validación de formularios
          </div>
        </div>
      </div>
    ),
    size
  );
}
