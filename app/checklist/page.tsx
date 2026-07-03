"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";

type Task = {
  id: string;
  session: "hello" | "main" | "goodbye";
  title: string;
  description: string;
  sort_order: number;
};

type Student = {
  id: string;
  year: number;
  semester: string;
  name: string;
};

const SESSIONS: { key: Task["session"]; label: string }[] = [
  { key: "hello", label: "hello" },
  { key: "main", label: "main" },
  { key: "goodbye", label: "good bye" },
];

function ChecklistInner() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id");

  const [student, setStudent] = useState<Student | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [toggleError, setToggleError] = useState("");
  const [descTask, setDescTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!studentId) {
      setLoadError("먼저 시작 화면에서 정보를 입력해 주세요.");
      setLoading(false);
      return;
    }

    async function load() {
      const [studentRes, tasksRes, completionsRes] = await Promise.all([
        supabase
          .from("students")
          .select("id, year, semester, name")
          .eq("id", studentId)
          .maybeSingle(),
        supabase
          .from("tasks")
          .select("id, session, title, description, sort_order")
          .order("session")
          .order("sort_order"),
        supabase
          .from("task_completions")
          .select("task_id")
          .eq("student_id", studentId),
      ]);

      if (studentRes.error || !studentRes.data) {
        setLoadError("학생 정보를 찾을 수 없어요. 시작 화면에서 다시 입력해 주세요.");
        setLoading(false);
        return;
      }
      if (tasksRes.error || completionsRes.error) {
        setLoadError("체크리스트를 불러오지 못했어요. 새로고침해 주세요.");
        setLoading(false);
        return;
      }

      setStudent(studentRes.data);
      setTasks(tasksRes.data ?? []);
      setCheckedIds(new Set((completionsRes.data ?? []).map((c) => c.task_id)));
      setLoading(false);
    }

    load();
  }, [studentId]);

  async function toggleTask(task: Task, checked: boolean) {
    if (!studentId) return;
    setToggleError("");

    const next = new Set(checkedIds);
    if (checked) next.add(task.id);
    else next.delete(task.id);
    setCheckedIds(next);

    const { error } = checked
      ? await supabase
          .from("task_completions")
          .insert({ student_id: studentId, task_id: task.id })
      : await supabase
          .from("task_completions")
          .delete()
          .eq("student_id", studentId)
          .eq("task_id", task.id);

    if (error) {
      const reverted = new Set(checkedIds);
      setCheckedIds(reverted);
      setToggleError("체크 상태를 저장하지 못했어요. 다시 시도해 주세요.");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">불러오는 중...</p>
      </main>
    );
  }

  if (loadError || !student) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-red-600">{loadError}</p>
        <Link href="/" className="text-primary underline">
          시작 화면으로 가기
        </Link>
      </main>
    );
  }

  const total = tasks.length;
  const done = tasks.filter((t) => checkedIds.has(t.id)).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-foreground">
          {student.year}년 {student.semester} {student.name}님을 환영합니다
        </h1>
        <p className="text-sm text-muted-foreground">
          실제로 업무를 진행했으면 체크박스를 체크해 주세요.
        </p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-primary">전체 진행률</span>
            <span className="text-muted-foreground">
              {done}/{total}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </header>

      <Tabs defaultValue="hello">
        <TabsList>
          {SESSIONS.map((s) => (
            <TabsTrigger key={s.key} value={s.key}>
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {SESSIONS.map((s) => {
          const sessionTasks = tasks.filter((t) => t.session === s.key);
          return (
            <TabsContent key={s.key} value={s.key} className="flex flex-col gap-2">
              {sessionTasks.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  등록된 업무가 없습니다.
                </p>
              ) : (
                sessionTasks.map((task) => {
                  const checked = checkedIds.has(task.id);
                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4"
                    >
                      <div className="flex flex-1 items-center gap-3">
                        <Checkbox
                          id={task.id}
                          checked={checked}
                          onCheckedChange={(v) => toggleTask(task, v === true)}
                        />
                        <label
                          htmlFor={task.id}
                          className={
                            checked
                              ? "cursor-pointer text-muted-foreground line-through"
                              : "cursor-pointer text-foreground"
                          }
                        >
                          {task.title}
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDescTask(task)}
                        className="shrink-0 rounded-full bg-secondary px-3 py-1.5 text-sm text-primary hover:bg-secondary/80"
                      >
                        설명
                      </button>
                    </div>
                  );
                })
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {toggleError && <p className="text-sm text-red-600">{toggleError}</p>}

      <Dialog open={!!descTask} onOpenChange={(open) => !open && setDescTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{descTask?.title}</DialogTitle>
            <DialogDescription>{descTask?.description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function ChecklistPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">불러오는 중...</p>
        </main>
      }
    >
      <ChecklistInner />
    </Suspense>
  );
}
