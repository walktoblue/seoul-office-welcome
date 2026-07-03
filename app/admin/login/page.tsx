"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "admin@seoul-office-welcome.local";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("비밀번호를 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });
    setSubmitting(false);

    if (signInError) {
      setError("비밀번호가 올바르지 않습니다.");
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="mb-2 text-center">
          <h2 className="text-xl font-bold tracking-tight text-primary">
            서울사무소 웰컴가이드
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">관리자 페이지</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-foreground">관리자 로그인</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              보안을 위해 비밀번호를 입력해 주세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "확인 중..." : "로그인"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
