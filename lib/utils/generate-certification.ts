// lib/utils/generate-certification.ts

import { CERTIFICATION_REWARDS } from "@/lib/constants/trading-rules";
import type { Checklist } from "@/lib/types/trade";

export const generateCertificationImage = (checklist: Checklist): string => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context not available");

  canvas.width = 800;
  canvas.height = 600;

  // 배경 그라데이션 (네이비 블루)
  const gradient = ctx.createLinearGradient(0, 0, 0, 600);
  gradient.addColorStop(0, "#001f54");
  gradient.addColorStop(1, "#034078");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 600);

  // 장식용 도형들
  ctx.beginPath();
  ctx.arc(120, 500, 100, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fill();

  ctx.fillStyle = "rgba(99, 155, 255, 0.2)";
  ctx.beginPath();
  ctx.roundRect(650, 100, 60, 150, 30);
  ctx.fill();

  // 왼쪽 상단 황금 뱃지 (리본)
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(80, 80, 40, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#fef3c7";
  ctx.beginPath();
  ctx.arc(80, 80, 28, 0, Math.PI * 2);
  ctx.fill();

  // 리본
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.moveTo(68, 115);
  ctx.lineTo(68, 145);
  ctx.lineTo(60, 153);
  ctx.lineTo(68, 160);
  ctx.lineTo(76, 153);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(92, 115);
  ctx.lineTo(92, 145);
  ctx.lineTo(100, 153);
  ctx.lineTo(92, 160);
  ctx.lineTo(84, 153);
  ctx.closePath();
  ctx.fill();

  // 뱃지 체크 마크
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(68, 80);
  ctx.lineTo(76, 88);
  ctx.lineTo(92, 72);
  ctx.stroke();

  // 타이틀
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("매매 원칙 준수 인증서", 400, 120);

  // 상세 정보
  const emotionalState = checklist.finalChecks.emotionalState as number;

  const details = [
    { label: "분석 시간", value: `${checklist.analysisTime}분` },
    { label: "진입 근거", value: `${checklist.entryReasons.length}개` },
    {
      label: "리스크 비율",
      value: `1:${checklist.riskReward.ratio.toFixed(2)}`,
    },
    { label: "감정 상태", value: `${emotionalState}/5` },
  ];

  let yPos = 220;
  details.forEach((detail) => {
    ctx.textAlign = "left";
    ctx.fillStyle = "#94a3b8";
    ctx.font = "22px sans-serif";
    ctx.fillText(detail.label, 150, yPos);

    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(detail.value, 650, yPos);

    yPos += 70;
  });

  // 리워드 뱃지
  const reasonsCount = checklist.entryReasons.length;
  const analysisTime = checklist.analysisTime;

  const reasonReward = CERTIFICATION_REWARDS.reasons.find(
    (r) => reasonsCount >= r.min && reasonsCount <= r.max
  );

  const timeReward = CERTIFICATION_REWARDS.analysisTime.find(
    (r) => analysisTime >= r.min && analysisTime <= r.max
  );

  yPos = 530;
  ctx.textAlign = "center";
  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 20px sans-serif";

  const rewards = [];
  if (reasonReward) rewards.push(`🏆 ${reasonReward.title}`);
  if (timeReward) rewards.push(`⏱️ ${timeReward.title}`);

  if (rewards.length > 0) {
    ctx.fillText(rewards.join("  ·  "), 400, yPos);
  }

  // 타임스탬프
  ctx.fillStyle = "#64748b";
  ctx.font = "16px monospace";
  ctx.fillText(new Date().toLocaleString("ko-KR"), 400, 570);

  return canvas.toDataURL("image/png");
};
