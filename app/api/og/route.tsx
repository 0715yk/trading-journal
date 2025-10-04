// app/api/og/route.tsx

import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #1a1a1a, #2d2d2d)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: "bold",
              color: "#0ecb81",
            }}
          >
            Trading
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: "bold",
              color: "#f6465d",
            }}
          >
            Journal
          </div>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#888",
          }}
        >
          원칙을 지키는 트레이딩
        </div>
      </div>
    ) as React.ReactElement,
    {
      width: 1200,
      height: 630,
    }
  );
}
