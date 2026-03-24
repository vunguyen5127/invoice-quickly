import { ImageResponse } from "next/og";
import { marketingPages } from "@/data/marketing-pages";

export const runtime = "edge";
export const alt = "Invoice-Quickly Free Template";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const page = marketingPages.find((p) => p.slug === slug);

  const title = page?.hero.title ?? "Free Invoice Template";
  const highlight = page?.hero.highlight ?? "";
  const description = page?.metadata?.description ?? "Free professional invoice template — no signup needed.";
  const badge = page?.hero.badge ?? "Free Template";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #eff6ff 0%, #eef2ff 60%, #f5f3ff 100%)",
          padding: "0",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            width: "100%",
            height: "6px",
            background: "linear-gradient(90deg, #2563eb, #7c3aed)",
            display: "flex",
          }}
        />

        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(37,99,235,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            display: "flex",
          }}
        />

        {/* Decorative invoice mockup — right side */}
        <div
          style={{
            position: "absolute",
            right: "60px",
            top: "80px",
            width: "280px",
            height: "360px",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            padding: "28px",
            gap: "10px",
            opacity: 0.9,
            transform: "rotate(3deg)",
          }}
        >
          <div style={{ width: "80px", height: "10px", background: "#2563eb", borderRadius: "4px", display: "flex" }} />
          <div style={{ width: "120px", height: "7px", background: "#e2e8f0", borderRadius: "4px", marginTop: "8px", display: "flex" }} />
          <div style={{ width: "100px", height: "7px", background: "#e2e8f0", borderRadius: "4px", display: "flex" }} />
          <div style={{ width: "100%", height: "1px", background: "#f1f5f9", marginTop: "8px", display: "flex" }} />
          {[100, 80, 90, 70, 85].map((w, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ width: `${w}px`, height: "7px", background: "#f1f5f9", borderRadius: "3px", display: "flex" }} />
              <div style={{ width: "40px", height: "7px", background: "#dbeafe", borderRadius: "3px", display: "flex" }} />
            </div>
          ))}
          <div style={{ width: "100%", height: "1px", background: "#f1f5f9", marginTop: "4px", display: "flex" }} />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: "70px", height: "10px", background: "#2563eb", borderRadius: "4px", display: "flex" }} />
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 72px 52px 72px",
            position: "relative",
            maxWidth: "820px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
              }}
            >
              <span style={{ color: "white", fontSize: "22px", fontWeight: "bold", display: "flex" }}>⚡</span>
            </div>
            <span style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", letterSpacing: "-0.3px", display: "flex" }}>
              Invoice-Quickly
            </span>
          </div>

          {/* Badge */}
          <div style={{ display: "flex", marginTop: "32px" }}>
            <div
              style={{
                background: "white",
                border: "1.5px solid #bfdbfe",
                color: "#1d4ed8",
                borderRadius: "999px",
                padding: "8px 20px",
                fontSize: "15px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              ⭐ {badge}
            </div>
          </div>

          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
            <h1
              style={{
                fontSize: (title + highlight).length > 40 ? "44px" : "52px",
                fontWeight: "800",
                color: "#0f172a",
                lineHeight: "1.15",
                letterSpacing: "-1.5px",
                margin: "0",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {title}
              <span style={{ color: "#2563eb", display: "flex" }}>{highlight}</span>
            </h1>
            <p
              style={{
                fontSize: "19px",
                color: "#475569",
                lineHeight: "1.5",
                margin: "0",
                display: "flex",
              }}
            >
              {description.length > 100 ? description.slice(0, 100) + "…" : description}
            </p>
          </div>

          {/* CTA row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "36px" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                color: "white",
                borderRadius: "10px",
                padding: "12px 28px",
                fontSize: "16px",
                fontWeight: "700",
                display: "flex",
                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
              }}
            >
              Create Invoice Free →
            </div>
            <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "600", display: "flex" }}>
              No signup · No watermark
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
