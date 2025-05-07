"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { useRouter } from "next/navigation";
import { FileText, ShieldAlert, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const router = useRouter();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                Beta
              </Badge>
              <CardTitle className="text-3xl font-bold">Research Intelligence Suite</CardTitle>
            </div>
            <CardDescription className="text-lg max-w-prose">
              Advanced AI-powered tools for academic research and media verification. 
              Our platform combines cutting-edge language models with rigorous analysis 
              to support your research needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 mt-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Research Paper Generator</h3>
                </div>
                <p className="text-muted-foreground pl-8">
                  Create comprehensive research papers on any topic with AI assistance. 
                  Perfect for students, researchers, and professionals.
                </p>
                <Button 
                  onClick={() => router.push("/research")} 
                  className="mt-3 gap-2 ml-8"
                  variant="outline"
                >
                  Try Tool <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Fake News Detector</h3>
                </div>
                <p className="text-muted-foreground pl-8">
                  Analyze news articles and social media posts for authenticity. 
                  Our system evaluates content using multiple credibility indicators.
                </p>
                <Button 
                  onClick={() => router.push("/fake-news-detector")} 
                  className="mt-3 gap-2 ml-8"
                  variant="outline"
                >
                  Try Tool <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>Select a tool to get started. Both tools are powered by advanced AI models.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
