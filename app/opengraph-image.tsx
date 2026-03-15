import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Invoice-Quickly — Free Invoice Generator Online. Create & Download PDF Invoices for Free.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        padding: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "32px",
            fontWeight: 800,
          }}
        >
          IQ
        </div>
        <span
          style={{
            fontSize: "36px",
            fontWeight: 700,
            color: "white",
          }}
        >
          Invoice-Quickly
        </span>
      </div>

      <h1
        style={{
          fontSize: "56px",
          fontWeight: 800,
          color: "white",
          textAlign: "center",
          lineHeight: 1.2,
          margin: "0 0 20px 0",
          maxWidth: "900px",
        }}
      >
        Free Invoice Generator Online
      </h1>

      <p
        style={{
          fontSize: "24px",
          color: "#94a3b8",
          textAlign: "center",
          margin: "0 0 40px 0",
          maxWidth: "700px",
          lineHeight: 1.5,
        }}
      >
        Create & download professional PDF invoices in seconds. No signup, no watermark — free forever.
      </p>

      <div
        style={{
          display: "flex",
          gap: "30px",
          color: "#60a5fa",
          fontSize: "18px",
          fontWeight: 600,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Free PDF Download</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>No Watermark</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>20+ Languages</span>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
