"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  student_number: string;
  name: string;
};

const SESSIONS: { key: Task["session"]; label: string }[] = [
  { key: "hello", label: "hello" },
  { key: "main", label: "main" },
  { key: "goodbye", label: "good bye" },
];

export default function AdminPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [students, setStudents] = useState<Student[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completionsBySession, setCompletionsBySession] = useState<
    Map<string, Record<Task["session"], number>>
  >(new Map());
  const [completedTaskIdsByStudent, setCompletedTaskIdsByStudent] = useState<
    Map<string, Set<string>>
  >(new Map());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSession, setNewSession] = useState<Task["session"]>("hello");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [savingNew, setSavingNew] = useState(false);
  const [addError, setAddError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/admin/login");
        return;
      }
      setCheckingAuth(false);
    });
  }, [router]);

  useEffect(() => {
    if (checkingAuth) return;
    loadData();
  }, [checkingAuth]);

  async function loadData() {
    setLoading(true);
    setLoadError("");

    const [studentsRes, tasksRes, completionsRes] = await Promise.all([
      supabase
        .from("students")
        .select("id, year, semester, student_number, name")
        .order("year", { ascending: false })
        .order("semester"),
      supabase
        .from("tasks")
        .select("id, session, title, description, sort_order")
        .order("session")
        .order("sort_order"),
      supabase.from("task_completions").select("student_id, task_id"),
    ]);

    if (studentsRes.error || tasksRes.error || completionsRes.error) {
      setLoadError("데이터를 불러오지 못했어요. 새로고침해 주세요.");
      setLoading(false);
      return;
    }

    const taskSessionById = new Map<string, Task["session"]>();
    for (const t of tasksRes.data ?? []) {
      taskSessionById.set(t.id, t.session);
    }

    const bySession = new Map<string, Record<Task["session"], number>>();
    const completedIds = new Map<string, Set<string>>();
    for (const row of completionsRes.data ?? []) {
      const session = taskSessionById.get(row.task_id);
      if (!session) continue;
      const current = bySession.get(row.student_id) ?? {
        hello: 0,
        main: 0,
        goodbye: 0,
      };
      current[session] += 1;
      bySession.set(row.student_id, current);

      const idSet = completedIds.get(row.student_id) ?? new Set<string>();
      idSet.add(row.task_id);
      completedIds.set(row.student_id, idSet);
    }

    setStudents(studentsRes.data ?? []);
    setTasks(tasksRes.data ?? []);
    setCompletionsBySession(bySession);
    setCompletedTaskIdsByStudent(completedIds);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  function openEditDialog(task: Task) {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditError("");
  }

  async function handleSaveEdit() {
    if (!editingTask) return;
    if (!editTitle.trim()) {
      setEditError("업무명을 입력해 주세요.");
      return;
    }

    setSavingEdit(true);
    setEditError("");
    const { error } = await supabase
      .from("tasks")
      .update({ title: editTitle.trim(), description: editDescription.trim() })
      .eq("id", editingTask.id);
    setSavingEdit(false);

    if (error) {
      setEditError("저장하지 못했어요. 다시 시도해 주세요.");
      return;
    }

    setEditingTask(null);
    loadData();
  }

  function openAddDialog() {
    setNewSession("hello");
    setNewTitle("");
    setNewDescription("");
    setAddError("");
    setShowAddDialog(true);
  }

  async function handleSaveNew() {
    if (!newTitle.trim()) {
      setAddError("업무명을 입력해 주세요.");
      return;
    }

    setSavingNew(true);
    setAddError("");

    const maxOrder = tasks
      .filter((t) => t.session === newSession)
      .reduce((max, t) => Math.max(max, t.sort_order), 0);

    const { error } = await supabase.from("tasks").insert({
      session: newSession,
      title: newTitle.trim(),
      description: newDescription.trim(),
      sort_order: maxOrder + 1,
    });
    setSavingNew(false);

    if (error) {
      setAddError("추가하지 못했어요. 다시 시도해 주세요.");
      return;
    }

    setShowAddDialog(false);
    loadData();
  }

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">확인 중...</p>
      </main>
    );
  }

  const totalBySession: Record<Task["session"], number> = {
    hello: tasks.filter((t) => t.session === "hello").length,
    main: tasks.filter((t) => t.session === "main").length,
    goodbye: tasks.filter((t) => t.session === "goodbye").length,
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">관리자 대시보드</h1>
          <p className="text-sm text-muted-foreground">
            학생들의 온보딩 현황과 업무를 관리하세요.
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          로그아웃
        </Button>
      </header>

      {loading ? (
        <p className="text-muted-foreground">불러오는 중...</p>
      ) : loadError ? (
        <p className="text-red-600">{loadError}</p>
      ) : (
        <Tabs defaultValue="students">
          <TabsList>
            <TabsTrigger value="students">학생 현황</TabsTrigger>
            <TabsTrigger value="tasks">업무 관리</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="pt-4">
            {students.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                아직 등록된 학생이 없습니다.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>연도</TableHead>
                      <TableHead>학기</TableHead>
                      <TableHead>학번</TableHead>
                      <TableHead>이름</TableHead>
                      {SESSIONS.map((s) => (
                        <TableHead key={s.key} className="w-[180px]">
                          {s.label}
                        </TableHead>
                      ))}
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((s) => {
                      const perSession = completionsBySession.get(s.id) ?? {
                        hello: 0,
                        main: 0,
                        goodbye: 0,
                      };
                      return (
                        <TableRow key={s.id}>
                          <TableCell>{s.year}</TableCell>
                          <TableCell>{s.semester}</TableCell>
                          <TableCell>{s.student_number}</TableCell>
                          <TableCell>{s.name}</TableCell>
                          {SESSIONS.map((session) => {
                            const done = perSession[session.key];
                            const total = totalBySession[session.key];
                            const percent = total === 0 ? 0 : Math.round((done / total) * 100);
                            return (
                              <TableCell key={session.key}>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                                    <div
                                      className="h-full rounded-full bg-primary"
                                      style={{ width: `${percent}%` }}
                                    />
                                  </div>
                                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                                    {done}/{total}
                                  </span>
                                </div>
                              </TableCell>
                            );
                          })}
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewingStudent(s)}
                            >
                              자세히 보기
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tasks" className="flex flex-col gap-6 pt-4">
            <div className="flex justify-end">
              <Button onClick={openAddDialog}>+ 새 업무 추가</Button>
            </div>

            {SESSIONS.map((s) => {
              const sessionTasks = tasks.filter((t) => t.session === s.key);
              return (
                <div key={s.key} className="flex flex-col gap-3">
                  <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">
                    {s.label}
                  </h2>
                  {sessionTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">업무가 없습니다.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {sessionTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">
                              {task.title}
                            </p>
                            <p className="truncate text-sm text-muted-foreground">
                              {task.description || "설명 없음"}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0"
                            onClick={() => openEditDialog(task)}
                          >
                            수정
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>업무 수정</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-title">업무명</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-description">설명</Label>
              <Textarea
                id="edit-description"
                rows={4}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            {editError && <p className="text-sm text-red-600">{editError}</p>}
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEdit} disabled={savingEdit}>
              {savingEdit ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 업무 추가</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-session">세션</Label>
              <Select
                value={newSession}
                onValueChange={(v) => setNewSession(v as Task["session"])}
              >
                <SelectTrigger id="new-session" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SESSIONS.map((s) => (
                    <SelectItem key={s.key} value={s.key}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-title">업무명</Label>
              <Input
                id="new-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-description">설명</Label>
              <Textarea
                id="new-description"
                rows={4}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            {addError && <p className="text-sm text-red-600">{addError}</p>}
          </div>
          <DialogFooter>
            <Button onClick={handleSaveNew} disabled={savingNew}>
              {savingNew ? "추가 중..." : "추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingStudent} onOpenChange={(open) => !open && setViewingStudent(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewingStudent &&
                `${viewingStudent.year}년 ${viewingStudent.semester} ${viewingStudent.name} (${viewingStudent.student_number}학번)`}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            {viewingStudent &&
              SESSIONS.map((s) => {
                const completed =
                  completedTaskIdsByStudent.get(viewingStudent.id) ?? new Set<string>();
                const sessionTasks = tasks.filter((t) => t.session === s.key);
                return (
                  <div key={s.key} className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{s.label}</h3>
                    <ul className="flex flex-col gap-1.5">
                      {sessionTasks.map((task) => {
                        const done = completed.has(task.id);
                        return (
                          <li
                            key={task.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            {done ? (
                              <CheckCircle2 className="size-4 shrink-0 text-primary" />
                            ) : (
                              <Circle className="size-4 shrink-0 text-muted-foreground" />
                            )}
                            <span
                              className={
                                done
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }
                            >
                              {task.title}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
