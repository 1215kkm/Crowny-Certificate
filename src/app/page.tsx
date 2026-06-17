"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  Crown,
  BookOpen,
  ClipboardCheck,
  ArrowRight,
  GraduationCap,
  Award,
  Shield,
  Target,
  FileCheck,
  Sparkles,
  Cpu,
  Code,
  Rocket,
} from "lucide-react";

const GRADES = [
  {
    grade: "3급",
    title: "AI 기초 활용",
    description: "AI 도구 5종 이상 활용, 프롬프트 엔지니어링 기본",
    format: "객관식 40문항 + 실습 2개",
    time: "60분",
    color: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
    icon: Sparkles,
  },
  {
    grade: "2급",
    title: "AI UI 제작",
    description: "AI를 활용한 UI 디자인 및 프론트엔드 구현",
    format: "실기 시험 (화면 녹화)",
    time: "120분",
    color: "from-purple-500 to-purple-600",
    bgLight: "bg-purple-50",
    textColor: "text-purple-600",
    icon: Cpu,
  },
  {
    grade: "1급",
    title: "AI 풀스택 제작",
    description: "UI/UX + 프론트엔드 + 백엔드 API 연동 완성",
    format: "프로젝트 제출 + 코드 리뷰",
    time: "7일",
    color: "from-orange-500 to-orange-600",
    bgLight: "bg-orange-50",
    textColor: "text-orange-600",
    icon: Code,
  },
  {
    grade: "특급",
    title: "AI 문제해결",
    description: "실제 비즈니스 문제를 AI로 해결하는 솔루션 제작",
    format: "실무 과제 해결 (해커톤)",
    time: "48시간",
    color: "from-red-500 to-red-600",
    bgLight: "bg-red-50",
    textColor: "text-red-600",
    icon: Rocket,
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "체계적인 커리큘럼",
    description: "단계별로 설계된 AI 활용 교육과정으로 기초부터 실무까지 체계적으로 학습합니다.",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    icon: Shield,
    title: "공신력 있는 인증",
    description: "민간자격 등록 기반의 공식 자격증으로 AI 역량을 객관적으로 증명합니다.",
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
  {
    icon: Target,
    title: "실무 중심 평가",
    description: "실제 업무 환경과 동일한 과제를 통해 현장 적용 가능한 역량을 평가합니다.",
    color: "text-orange-500",
    bgColor: "bg-orange-100",
  },
  {
    icon: FileCheck,
    title: "공식 인증서 발급",
    description: "QR코드 검증이 가능한 디지털/실물 인증서를 발급하여 공식적으로 활용 가능합니다.",
    color: "text-green-500",
    bgColor: "bg-green-100",
  },
];

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      vx: number;
      vy: number;
    }[] = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 text-white py-24 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.3),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(59,130,246,0.3),_transparent_50%)]" />
        <ParticleCanvas />
        <div className="relative max-w-[1400px] mx-auto text-center z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
              <Crown className="w-12 h-12 text-yellow-300" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Crowny AI 활용 자격증
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-white/90 font-medium">
            AI 시대, 당신의 역량을 증명하세요
          </p>
          <p className="text-base md:text-lg mb-10 text-white/70 max-w-2xl mx-auto leading-relaxed">
            프롬프트 엔지니어링부터 AI 풀스택 개발까지.
            <br />
            체계적인 강의와 실무 중심 시험으로 AI 활용 능력을 검증합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="group inline-flex items-center justify-center gap-2 bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/90 transition-all shadow-lg shadow-black/10"
            >
              <BookOpen className="w-5 h-5" />
              강의 둘러보기
            </Link>
            <Link
              href="/exams"
              className="group inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/60 transition-all backdrop-blur-sm"
            >
              <ClipboardCheck className="w-5 h-5" />
              시험 신청하기
            </Link>
          </div>
        </div>
      </section>

      {/* Grade System Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <GraduationCap className="w-4 h-4" />
              등급 체계
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              등급별 자격증 체계
            </h2>
            <p className="text-muted-foreground text-lg">
              단계별로 AI 활용 역량을 인증받으세요
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GRADES.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.grade}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`bg-gradient-to-r ${item.color} text-white p-5 flex items-center justify-between`}
                  >
                    <div>
                      <span className="text-3xl font-extrabold">{item.grade}</span>
                      <h3 className="text-base font-semibold mt-1 opacity-95">
                        {item.title}
                      </h3>
                    </div>
                    <div className="bg-white/20 rounded-xl p-2.5">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="space-y-2.5 text-sm mb-5">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">시험 형식</span>
                        <span className="font-medium text-foreground text-right text-xs">
                          {item.format}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">시험 시간</span>
                        <span className="font-medium text-foreground">
                          {item.time}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/exams?grade=${item.grade}`}
                      className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl ${item.bgLight} ${item.textColor} font-semibold text-sm hover:opacity-80 transition-all group-hover:gap-3`}
                    >
                      시험 신청
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Award className="w-4 h-4" />
              특징
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              왜 Crowny 자격증인가요?
            </h2>
            <p className="text-muted-foreground text-lg">
              AI 역량 인증의 새로운 기준을 제시합니다
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`${feature.bgColor} ${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-5`}
                  >
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <ClipboardCheck className="w-4 h-4" />
              취득 과정
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              자격증 취득 과정
            </h2>
            <p className="text-muted-foreground text-lg">
              4단계로 간편하게 자격증을 취득하세요
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "강의 수강",
                desc: "등급별 맞춤 온라인 강의로 AI 활용 역량을 키우세요.",
                icon: BookOpen,
                color: "from-blue-500 to-blue-600",
              },
              {
                step: "02",
                title: "시험 신청 & 결제",
                desc: "원하는 등급의 시험에 신청하고 응시료를 결제하세요.",
                icon: ClipboardCheck,
                color: "from-purple-500 to-purple-600",
              },
              {
                step: "03",
                title: "온라인 시험 응시",
                desc: "시간과 장소에 구애받지 않는 온라인 CBT 시험을 봅니다.",
                icon: Target,
                color: "from-orange-500 to-orange-600",
              },
              {
                step: "04",
                title: "인증서 발급",
                desc: "합격 시 디지털(PDF) 또는 실물 인증서를 발급받으세요.",
                icon: Award,
                color: "from-green-500 to-green-600",
              },
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.step}
                  className="flex items-center gap-5 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div
                    className={`bg-gradient-to-br ${item.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Step {item.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 text-white py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.2),_transparent_60%)]" />
        <div className="relative max-w-[1400px] mx-auto text-center z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3">
              <Crown className="w-8 h-8 text-yellow-300" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 시작하세요
          </h2>
          <p className="text-lg mb-8 text-white/80">
            회원가입 후 무료 샘플 강의를 확인해보세요.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/90 transition-all shadow-lg shadow-black/10"
          >
            <GraduationCap className="w-5 h-5" />
            무료 회원가입
          </Link>
        </div>
      </section>
    </div>
  );
}
