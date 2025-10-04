// app/api/og/route.tsx

import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* 배경 패턴 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "20%",
                height: "20%",
                border: "1px solid #0ecb81",
              }}
            />
          ))}
        </div>

        {/* 메인 콘텐츠 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                fontSize: 96,
                fontWeight: "bold",
                color: "#0ecb81",
              }}
            >
              Trading
            </div>
            <div
              style={{
                fontSize: 96,
                fontWeight: "bold",
                color: "#f6465d",
              }}
            >
              Journal
            </div>
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#888",
              letterSpacing: "2px",
            }}
          >
            원칙을 지키는 트레이딩
          </div>

          {/* 하단 데코레이션 */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginTop: "60px",
              fontSize: 20,
              color: "#666",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  background: "#0ecb81",
                  borderRadius: "50%",
                }}
              />
              <span>체크리스트</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  background: "#0ecb81",
                  borderRadius: "50%",
                }}
              />
              <span>리스크 관리</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  background: "#0ecb81",
                  borderRadius: "50%",
                }}
              />
              <span>통계 분석</span>
            </div>
          </div>
        </div>
      </div>
    ) as React.ReactElement,
    {
      width: 1200,
      height: 630,
    }
  );
}
