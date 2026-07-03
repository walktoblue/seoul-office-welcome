"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

const SEMESTERS = ["1학기", "여름", "2학기", "겨울"];
const STUDENT_NUMBERS = Array.from({ length: 21 }, (_, i) => 35 - i).map((n) =>
  String(n).padStart(2, "0")
);

export default function Home() {
  const router = useRouter();
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [semester, setSemester] = useState("");
  const [studentNumber, setStudentNumber] = useState(
    String(new Date().getFullYear() % 100).padStart(2, "0")
  );
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^\d{4}$/.test(year) || !semester || !studentNumber || !name.trim()) {
      setError("모든 항목을 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const { data: existing, error: findError } = await supabase
        .from("students")
        .select("id")
        .eq("year", Number(year))
        .eq("semester", semester)
        .eq("student_number", studentNumber)
        .eq("name", name.trim())
        .maybeSingle();

      if (findError) throw findError;

      let studentId = existing?.id;

      if (!studentId) {
        const { data: created, error: insertError } = await supabase
          .from("students")
          .insert({
            year: Number(year),
            semester,
            student_number: studentNumber,
            name: name.trim(),
          })
          .select("id")
          .single();

        if (insertError) throw insertError;
        studentId = created.id;
      }

      router.push(`/checklist?id=${studentId}`);
    } catch {
      setError("시작하지 못했어요. 잠시 후 다시 시도해 주세요.");
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hyundonghall.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="absolute left-6 top-6 z-10 rounded-md bg-white/95 px-3 py-2 shadow">
        <Image
          src="/handong-logo.jpg"
          alt="한동대학교"
          width={140}
          height={47}
          className="h-8 w-auto"
        />
      </div>

      <div className="relative z-10 mx-4 flex w-full max-w-md flex-col gap-6 rounded-lg bg-card/95 px-6 py-8 shadow-lg backdrop-blur">
        <header className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            한동대학교 서울사무소
            <br />
            근로학생 Welcome
          </h1>
          <p className="text-sm text-muted-foreground">
            업무 시작을 위해 정보를 입력해 주세요
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="year">연도</Label>
              <Input
                id="year"
                type="number"
                inputMode="numeric"
                placeholder="2026"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="semester">학기</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger id="semester" className="w-full">
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="student_number">학번</Label>
            <Select value={studentNumber} onValueChange={setStudentNumber}>
              <SelectTrigger id="student_number" className="w-full">
                <SelectValue placeholder="학번 선택" />
              </SelectTrigger>
              <SelectContent>
                {STUDENT_NUMBERS.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}학번
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" size="lg" className="mt-2" disabled={submitting}>
            {submitting ? "확인 중..." : "시작하기"}
          </Button>
        </form>
      </div>
    </main>
  );
}
