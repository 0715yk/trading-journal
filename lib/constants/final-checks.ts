// lib/constants/final-checks.ts

export interface CheckItem {
  id: string;
  type: "boolean" | "rating";
  question: string;
  passCondition: "true" | "false" | "min" | "max";
  threshold?: number; // rating일 때만 사용
  options?: {
    value: string;
    label: string;
  }[];
  ratingLabels?: Record<number, string>; // rating일 때만 사용
  failMessage: string;
}

export const FINAL_CHECK_ITEMS: CheckItem[] = [
  {
    id: "previousInfluence",
    type: "boolean",
    question: "이전 매매 결과에 영향받고 있나요?",
    passCondition: "false",
    options: [
      { value: "false", label: "아니요, 이번은 새로운 매매입니다" },
      { value: "true", label: "네, 이전 손익이 신경 쓰입니다" },
    ],
    failMessage:
      "이전 매매의 영향을 받고 있다면 오늘은 매매를 쉬는 것이 좋습니다. 각 매매는 독립적이어야 합니다.",
  },
  {
    id: "emotionalState",
    type: "rating",
    question: "현재 감정 상태는 어떤가요?",
    passCondition: "min",
    threshold: 3,
    ratingLabels: {
      1: "매우 나쁨",
      2: "나쁨",
      3: "보통",
      4: "좋음",
      5: "매우 좋음",
    },
    failMessage: "감정 상태가 좋지 않습니다. 최소 3점 이상일 때 매매하세요.",
  },
  {
    id: "gamblersFallacy",
    type: "boolean",
    question: '"연속 손실/이익이 있었으니 이번엔 반대로 될 것"이라 생각하나요?',
    passCondition: "false",
    options: [
      { value: "false", label: "아니요, 각 매매는 독립적입니다" },
      { value: "true", label: "네, 그런 생각이 듭니다" },
    ],
    failMessage:
      "도박사의 오류입니다. 이전 결과는 다음 매매에 영향을 주지 않습니다. 각 매매는 독립적으로 판단해야 합니다.",
  },
  {
    id: "revengeTrading",
    type: "boolean",
    question: "손실을 만회하려는 목적으로 매매하려는 건 아닌가요?",
    passCondition: "false",
    options: [
      { value: "false", label: "아니요, 순수하게 분석 결과입니다" },
      { value: "true", label: "네, 손실 만회가 목적입니다" },
    ],
    failMessage:
      "복수 매매는 위험합니다. 손실을 만회하려는 목적이 아닌, 분석에 기반한 매매만 해야 합니다.",
  },
];
