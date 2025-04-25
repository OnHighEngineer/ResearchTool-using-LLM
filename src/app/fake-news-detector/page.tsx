"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout";
import { useState } from "react";
import { detectFakeNews } from "@/ai/flows/detect-fake-news";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export default function FakeNewsDetector() {
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState("text"); // 'text' or 'url'
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDetect = async () => {
    setIsLoading(true);
    try {
      const data = await detectFakeNews({ input });
      setResult(data);
    } catch (error: any) {
      console.error("Error detecting fake news:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-start min-h-[80vh] py-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="flex flex-col items-center">
            <CardTitle className="text-2xl font-bold">Fake News Detector</CardTitle>
            <CardDescription className="text-center">
              Enter text or URL to detect fake news.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <RadioGroup defaultValue="text" className="flex flex-row space-x-2" onValueChange={setInputType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text">Text</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="url" id="url" />
                <Label htmlFor="url">URL</Label>
              </div>
            </RadioGroup>

            <div className="grid gap-2">
              <Label htmlFor="input">
                {inputType === "text" ? "Enter Text" : "Enter URL"}
              </Label>
              {inputType === "text" ? (
                <Textarea
                  id="input"
                  placeholder={inputType === "text" ? "Enter article text" : "Enter URL"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              ) : (
                <Input
                  id="input"
                  placeholder={inputType === "text" ? "Enter article text" : "Enter URL"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              )}
            </div>
            <Button onClick={handleDetect} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/80">
              {isLoading ? "Detecting..." : "Detect"}
            </Button>

            {result && (
              <div className="mt-4 grid gap-4">
                <div className="grid gap-2">
                  <h3 className="text-lg font-semibold">Result: <span className={result.result === 'Fake' ? "text-destructive" : "text-green-500"}>{result.result}</span></h3>
                  <p>Score: {result.score}</p>
                  <div className="grid gap-1">
                    <p className="font-semibold">Reasoning:</p>
                    <div className="rounded-md border p-4 bg-muted">
                      <p className="text-sm">{result.reasoning}</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <h3 className="text-lg font-semibold">Cleaned Input:</h3>
                  <Textarea readOnly value={result.cleanedInput} className="w-full rounded-md border p-4" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
