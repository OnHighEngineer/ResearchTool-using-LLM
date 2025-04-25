"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout";
import { useState } from "react";
import { generateResearchPaper } from "@/ai/flows/generate-research-paper";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

export default function Research() {
  const [topic, setTopic] = useState("");
  const [researchPaper, setResearchPaper] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generateResearchPaper({ topic });
      setResearchPaper(result);
    } catch (error: any) {
      console.error("Error generating research paper:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!researchPaper) return;

    const data = JSON.stringify(researchPaper, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "research_paper.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Research paper downloaded successfully!",
    });
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-start min-h-[80vh] py-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="flex flex-col items-center">
            <CardTitle className="text-2xl font-bold">Research Tool</CardTitle>
            <CardDescription className="text-center">
              Enter a topic and generate a research paper.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="Enter topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <Button onClick={handleGenerate} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/80">
              {isLoading ? "Generating..." : "Generate"}
            </Button>

            {researchPaper && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold">{researchPaper.title}</h2>
                <p className="text-muted-foreground">{researchPaper.abstract}</p>
                <div className="mt-4 grid gap-4">
                  {researchPaper.sections.map((section: any, index: number) => (
                    <div key={index} className="grid gap-2">
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                        <Textarea readOnly value={section.content} className="h-full w-full" />
                      </ScrollArea>
                    </div>
                  ))}
                </div>
                <Button onClick={handleDownload} className="mt-4 bg-accent text-accent-foreground hover:bg-accent/80">
                  Download
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

