// app/trade/new/entry/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, ChevronRight } from "lucide-react";
import { generateCertificationImage } from "@/lib/utils/generate-certification";
import type { Checklist } from "@/lib/types/trade";
import { draftStorage } from "@/lib/storage/draft-storage";

export default function EntryPage() {
  const router = useRouter();
  const [certificationImage, setCertificationImage] = useState<string>("");
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const draft = draftStorage.getDraft();

    if (!draft?.checklist) {
      router.push("/trade/new/checklist");
      return;
    }

    setChecklist(draft.checklist);

    try {
      const imageData = generateCertificationImage(draft.checklist);
      setCertificationImage(imageData);

      draftStorage.saveDraft({
        checklist: draft.checklist,
        certificationImage: imageData,
      });
    } catch (error) {
      console.error("Failed to generate certification:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [router]);

  const handleDownload = () => {
    if (!certificationImage) return;

    const link = document.createElement("a");
    link.download = `certification-${Date.now()}.png`;
    link.href = certificationImage;
    link.click();
  };

  const handleContinue = () => {
    router.push("/trade/new/details");
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-4xl">⏳</div>
              <p className="text-lg font-medium">인증서 생성 중...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!checklist || !certificationImage) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            인증서 생성에 실패했습니다. 체크리스트를 다시 작성해주세요.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-[150px]">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>매매 원칙 준수 인증서</CardTitle>
            <CardDescription>
              체크리스트를 모두 통과했습니다. 이제 매매 정보를 입력하세요.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <img
                src={certificationImage}
                alt="매매 원칙 준수 인증서"
                className="rounded-lg shadow-lg max-w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex-1"
                size="lg"
              >
                <Download className="mr-2 h-4 w-4" />
                다운로드
              </Button>
              <Button onClick={handleContinue} className="flex-1" size="lg">
                매매 정보 입력
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
