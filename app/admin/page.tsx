// app/admin/page.tsx

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Check, Edit2, Trash2, Plus, Lock } from "lucide-react";
import { quotesApi } from "@/lib/supabase/api";
import { ADMIN_PASSWORD } from "@/lib/constants/admin";

interface Quote {
  id: string;
  content: string;
  author: string | null;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [newQuote, setNewQuote] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError("");
      loadQuotes();
    } else {
      setAuthError("비밀번호가 올바르지 않습니다.");
    }
  };

  const loadQuotes = async () => {
    try {
      const data = await quotesApi.getAll();
      setQuotes(data);
    } catch {
      setError("명언 목록을 불러오는데 실패했습니다.");
    }
  };

  const handleCreate = async () => {
    if (!newQuote.trim()) {
      setError("명언 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await quotesApi.create(newQuote, newAuthor || undefined);
      setNewQuote("");
      setNewAuthor("");
      setSuccess("명언이 추가되었습니다.");
      await loadQuotes();
    } catch {
      setError("명언 추가에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (quote: Quote) => {
    setEditingId(quote.id);
    setEditContent(quote.content);
    setEditAuthor(quote.author || "");
  };

  const handleUpdate = async (id: string) => {
    if (!editContent.trim()) {
      setError("명언 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await quotesApi.update(id, editContent, editAuthor || undefined);
      setEditingId(null);
      setSuccess("명언이 수정되었습니다.");
      await loadQuotes();
    } catch {
      setError("명언 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await quotesApi.delete(id);
      setSuccess("명언이 삭제되었습니다.");
      await loadQuotes();
    } catch {
      setError("명언 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              관리자 인증
            </CardTitle>
            <CardDescription>비밀번호를 입력하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="비밀번호 입력"
              />
            </div>
            {authError && (
              <Alert variant="destructive">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            <Button onClick={handleLogin} className="w-full" size="lg">
              로그인
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-[150px]">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">명언 관리</h1>
          <p className="text-muted-foreground">트레이딩 명언을 관리합니다</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>새 명언 추가</CardTitle>
            <CardDescription>새로운 명언을 추가하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newQuote">명언 내용 *</Label>
              <Textarea
                id="newQuote"
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                placeholder="시장은 조급한 사람의 돈을 인내심 있는 사람에게 옮겨준다."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newAuthor">작가 (선택)</Label>
              <Input
                id="newAuthor"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="워렌 버핏"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 bg-green-50">
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleCreate}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              {loading ? "추가 중..." : "명언 추가"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>명언 목록 ({quotes.length})</CardTitle>
            <CardDescription>등록된 명언을 관리하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quotes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  등록된 명언이 없습니다.
                </div>
              ) : (
                quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    {editingId === quote.id ? (
                      <>
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="mb-2"
                        />
                        <Input
                          value={editAuthor}
                          onChange={(e) => setEditAuthor(e.target.value)}
                          placeholder="작가 (선택)"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleUpdate(quote.id)}
                            disabled={loading}
                            size="sm"
                            className="flex-1"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            저장
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingId(null)}
                            disabled={loading}
                            size="sm"
                            className="flex-1"
                          >
                            취소
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-base">{quote.content}</p>
                          {quote.author && (
                            <p className="text-sm text-muted-foreground mt-1">
                              - {quote.author}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleEdit(quote)}
                            disabled={loading}
                            size="sm"
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            수정
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(quote.id)}
                            disabled={loading}
                            size="sm"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            삭제
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
