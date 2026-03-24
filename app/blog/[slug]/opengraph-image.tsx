import { ImageResponse } from "next/og";
import { blogPosts } from "@/data/blog-posts";

export const runtime = "edge";
export const alt = "Invoice-Quickly Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Guide:      { bg: "#dbeafe", text: "#1d4ed8" },
  Tips:       { bg: "#dcfce7", text: "#15803d" },
  Education:  { bg: "#fef9c3", text: "#a16207" },
  Comparison: { bg: "#ede9fe", text: "#7c3aed" },
  Template:   { bg: "#fce7f3", text: "#be185d" },
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  const title = post?.title ?? "Invoice-Quickly Blog";
  const description = post?.description ?? "Invoicing tips and guides for freelancers";
  const category = post?.category ?? "Guide";
  const readTime = post?.readTime ?? "5 min read";
  const colors = CATEGORY_COLORS[category] ?? { bg: "#dbeafe", text: "#1d4ed8" };

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #f8faff 0%, #eef2ff 50%, #f0f4ff 100%)",
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

        {/* Grid pattern background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(37,99,235,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 72px 52px 72px",
            position: "relative",
          }}
        >
          {/* Top row: Logo + Category */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Logo mark */}
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
                <div style={{ color: "white", fontSize: "22px", fontWeight: "bold", display: "flex" }}>⚡</div>
              </div>
              <span style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", letterSpacing: "-0.3px", display: "flex" }}>
                Invoice-Quickly
              </span>
            </div>

            {/* Category + read time */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  background: colors.bg,
                  color: colors.text,
                  border: `1.5px solid ${colors.text}30`,
                  borderRadius: "999px",
                  padding: "6px 18px",
                  fontSize: "15px",
                  fontWeight: "700",
                  display: "flex",
                }}
              >
                {category}
              </div>
              <div
                style={{
                  background: "white",
                  color: "#64748b",
                  borderRadius: "999px",
                  padding: "6px 16px",
                  fontSize: "14px",
                  fontWeight: "600",
                  border: "1.5px solid #e2e8f0",
                  display: "flex",
                }}
              >
                {readTime}
              </div>
            </div>
          </div>

          {/* Main title */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "32px" }}>
            <h1
              style={{
                fontSize: title.length > 60 ? "42px" : "50px",
                fontWeight: "800",
                color: "#0f172a",
                lineHeight: "1.2",
                letterSpacing: "-1.5px",
                margin: "0",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "20px",
                color: "#475569",
                lineHeight: "1.5",
                margin: "0",
                display: "-webkit-box",
                maxWidth: "820px",
              }}
            >
              {description.length > 120 ? description.slice(0, 120) + "…" : description}
            </p>
          </div>

          {/* Bottom row: URL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "white",
                border: "1.5px solid #e2e8f0",
                borderRadius: "10px",
                padding: "10px 20px",
              }}
            >
              <span style={{ fontSize: "15px", color: "#2563eb", fontWeight: "600", display: "flex" }}>
                📄 invoice-quickly.com/blog
              </span>
            </div>
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
              Read Article →
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
