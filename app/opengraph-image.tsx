import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "InvoiceQuickly — Free Invoice Generator Online. Create & Download PDF Invoices for Free.";
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
          InvoiceQuickly
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
          gap: "32px",
          color: "#60a5fa",
          fontSize: "18px",
          fontWeight: 600,
        }}
      >
        <span>✓ Free PDF Download</span>
        <span>✓ No Watermark</span>
        <span>✓ 20+ Languages</span>
      </div>
    </div>,
    { ...size },
  );
}
