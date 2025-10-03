// lib/constants/trading-rules.ts

export const INITIAL_CAPITAL = 10000000; // 초기 자산 (1000만원)

export const TRADING_RULES = {
  MIN_ENTRY_REASONS: 3,
  MIN_RISK_REWARD_RATIO: 1,
  MIN_EMOTIONAL_STATE: 3,
} as const;

export const ACCOUNT_TYPES = [
  { value: "scalp", label: "단타", emoji: "⚡", color: "blue" },
  { value: "trend", label: "추세", emoji: "📈", color: "green" },
  { value: "sniper", label: "스나이퍼", emoji: "🎯", color: "red" },
] as const;

// 모든 캔들 패턴을 REASON_TYPES에 통합
export const REASON_TYPES = [
  // 캔들 패턴들 (required: true - 첫 번째 근거로만 사용)
  { value: "도지", label: "도지", required: true },
  { value: "하이웨이브 캔들", label: "하이웨이브 캔들", required: true },
  { value: "팽이형", label: "팽이형", required: true },
  { value: "망치형", label: "망치형", required: true },
  { value: "교수형", label: "교수형", required: true },
  { value: "역망치형", label: "역망치형", required: true },
  { value: "유성형", label: "유성형", required: true },
  { value: "상승 장악형", label: "상승 장악형", required: true },
  { value: "하락 장악형", label: "하락 장악형", required: true },
  { value: "관통형", label: "관통형", required: true },
  { value: "흑운형", label: "흑운형", required: true },
  { value: "샛별형", label: "샛별형", required: true },
  { value: "저녁별형", label: "저녁별형", required: true },
  { value: "하라미 (기본)", label: "하라미 (기본)", required: true },
  { value: "하라미 (고가)", label: "하라미 (고가)", required: true },
  { value: "하라미 (저가)", label: "하라미 (저가)", required: true },
  { value: "하라미 크로스", label: "하라미 크로스", required: true },
  { value: "반격형", label: "반격형", required: true },
  { value: "타스키형 (상승갭)", label: "타스키형 (상승갭)", required: true },
  { value: "타스키형 (하락갭)", label: "타스키형 (하락갭)", required: true },
  { value: "적삼병", label: "적삼병", required: true },
  { value: "흑삼병", label: "흑삼병", required: true },
  { value: "삼산형 천장", label: "삼산형 천장", required: true },
  { value: "삼천형 바닥", label: "삼천형 바닥", required: true },
  { value: "삼불형 천장", label: "삼불형 천장", required: true },
  { value: "삼불형 바닥", label: "삼불형 바닥", required: true },
  { value: "상승 삼법형", label: "상승 삼법형", required: true },
  { value: "하락 삼법형", label: "하락 삼법형", required: true },
  { value: "탑형 천장", label: "탑형 천장", required: true },
  { value: "탑형 바닥", label: "탑형 바닥", required: true },
  { value: "만두형 천장", label: "만두형 천장", required: true },
  { value: "프라이팬형 바닥", label: "프라이팬형 바닥", required: true },
  { value: "하락창", label: "하락창", required: true },
  { value: "상승창", label: "상승창", required: true },
  { value: "고가 갭핑 플레이", label: "고가 갭핑 플레이", required: true },
  { value: "저가 갭핑 플레이", label: "저가 갭핑 플레이", required: true },
  { value: "나란히형 (상승)", label: "나란히형 (상승)", required: true },
  { value: "나란히형 (하락)", label: "나란히형 (하락)", required: true },
  { value: "갈림길형", label: "갈림길형", required: true },
  { value: "연속기록경신형", label: "연속기록경신형", required: true },
  { value: "최종장악형 (상승)", label: "최종장악형 (상승)", required: true },
  { value: "최종장악형 (하락)", label: "최종장악형 (하락)", required: true },

  // 기타 근거 타입들 (required: false)
  { value: "indicator", label: "보조지표", required: false },
  { value: "support_resistance", label: "지지/저항선", required: false },
  { value: "volume", label: "거래량", required: false },
  { value: "news", label: "뉴스/펀더멘털", required: false },
  { value: "other", label: "기타", required: false },
] as const;

// 인증서 리워드 타이틀
export const CERTIFICATION_REWARDS = {
  reasons: [
    { min: 3, max: 3, title: "규칙 준수" },
    { min: 4, max: 4, title: "근거 있는 매매" },
    { min: 5, max: Infinity, title: "완벽주의자" },
  ],
  analysisTime: [
    { min: 30, max: 59, title: "기본 달성" },
    { min: 60, max: 89, title: "분석의 달인" },
    { min: 90, max: Infinity, title: "고심의 왕" },
  ],
} as const;
