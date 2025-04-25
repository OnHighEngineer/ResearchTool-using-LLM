"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-center">
            <CardTitle className="text-2xl font-bold">VeriScope</CardTitle>
            <CardDescription className="text-center">
              Your trusted source for research and fake news detection.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button onClick={() => router.push("/research")} className="bg-primary text-primary-foreground hover:bg-primary/80">
              Research Tool
            </Button>
            <Button onClick={() => router.push("/fake-news-detector")} className="bg-primary text-primary-foreground hover:bg-primary/80">
              Fake News Detector
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

