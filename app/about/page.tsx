// app/about/page.tsx

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Shield, BarChart3 } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Commitrade는 감정적 거래를 방지하고 체계적인 매매 원칙을 통해 일관성 있는 트레이딩을 돕는 매매일지 플랫폼입니다.",
};

export default function AboutPage() {
  const features = [
    {
      icon: CheckCircle2,
      title: "체크리스트 시스템",
      description: "매매 전 반드시 확인해야 할 원칙들을 체계적으로 점검합니다.",
    },
    {
      icon: TrendingUp,
      title: "3개 근거 원칙",
      description:
        "최소 3개 이상의 진입 근거를 요구하며, 그 중 하나는 캔들 패턴이어야 합니다.",
    },
    {
      icon: Shield,
      title: "30분 분석 타이머",
      description:
        "충분한 시장 분석 시간을 확보하여 충동적인 매매를 방지합니다.",
    },
    {
      icon: BarChart3,
      title: "리스크-리워드 계산",
      description: "손절가와 목표가를 명확히 설정하고 리스크를 관리합니다.",
    },
  ];

  const principles = [
    "감정이 아닌 데이터로 트레이딩하기",
    "모든 매매에 명확한 근거 갖기",
    "충분한 분석 시간 확보하기",
    "리스크를 먼저 생각하기",
    "원칙을 절대 타협하지 않기",
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <Image
                src="/icon.png"
                alt="Commitrade Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-[#0ecb81] to-[#f6465d] bg-clip-text text-transparent">
              Commitrade
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            원칙을 지키는 트레이딩
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            감정적 거래와 뇌동매매를 방지하고, 체계적인 매매 원칙을 통해 일관성
            있는 트레이딩을 실현하는 매매일지 플랫폼입니다.
          </p>
        </section>

        {/* Mission Section */}
        <section className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Why Commitrade?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                트레이딩에서 가장 큰 적은 시장이 아닌 자기 자신입니다. 감정에
                휘둘려 원칙을 저버리는 순간, 손실이 시작됩니다.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Commitrade는 매매 전 강제적인 체크리스트와 타이머를 통해
                충동적인 결정을 막고, 데이터 기반의 합리적인 판단을 돕습니다.
              </p>
              <p className="text-lg font-semibold text-[#0ecb81]">
                &quot;Commit to your rules, trade with discipline.&quot;
              </p>
            </div>
            <div className="relative aspect-square md:aspect-auto md:h-96">
              <Image
                src="/og-image.png"
                alt="Commitrade Dashboard"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            핵심 기능
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-[#0ecb81] transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-[#0ecb81]/10">
                      <feature.icon className="h-6 w-6 text-[#0ecb81]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Principles Section */}
        <section className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            트레이딩 원칙
          </h2>
          <Card className="border-2">
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {principles.map((principle, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-[#0ecb81] flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{principle}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Process Section */}
        <section className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            매매 프로세스
          </h2>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0ecb81] text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-xl mb-2">체크리스트 작성</h3>
                <p className="text-muted-foreground">
                  진입 근거 3개 이상 작성 (캔들 패턴 1개 필수)
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0ecb81] text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-xl mb-2">30분 시장 분석</h3>
                <p className="text-muted-foreground">
                  타이머를 통해 충분한 분석 시간 확보
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0ecb81] text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-xl mb-2">리스크-리워드 계산</h3>
                <p className="text-muted-foreground">
                  손절가, 목표가, 레버리지 설정 및 검증
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#f6465d] text-white flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-xl mb-2">매매 실행 및 기록</h3>
                <p className="text-muted-foreground">
                  인증서 발급 후 매매 정보 기록 및 추적
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6 py-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            지금 바로 시작하세요
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            원칙 있는 트레이딩으로 일관된 수익을 만들어보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#0ecb81] text-white hover:bg-[#0ecb81]/90 h-10 px-8 text-base"
            >
              대시보드로 이동
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
