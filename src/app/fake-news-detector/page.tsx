"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout";
import { useState, useRef } from "react";
import { detectFakeNews } from "@/ai/flows/detect-fake-news";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle, CheckCircle2, Link, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { format } from "date-fns";

export default function FakeNewsDetector() {
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState<"text" | "url">("text");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const { toast } = useToast();
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  const handleDetect = async () => {
    if (!input.trim()) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please enter some text or a URL to analyze",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const data = await detectFakeNews({ input, type: inputType });
      
      setHistory(prev => [{
        input: input.slice(0, 50) + (input.length > 50 ? "..." : ""),
        result: data.result,
        score: data.score,
        timestamp: new Date()
      }, ...prev.slice(0, 4)]);
      
      setResult(data);
    } catch (error: any) {
      console.error("Error detecting fake news:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to analyze content. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
    inputRef.current?.focus();
  };

  const handleExample = () => {
    const exampleText = "The moon landing was faked by NASA in a Hollywood studio.";
    setInput(exampleText);
    setInputType("text");
    toast({
      title: "Example Loaded",
      description: "An example claim has been loaded for testing",
    });
  };

  return (
    <TooltipProvider>
      <Layout>
        <div className="flex flex-col items-center justify-start min-h-[80vh] py-8 px-4">
          <Card className="w-full max-w-4xl">
            <CardHeader className="flex flex-col items-center">
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                <span>Fake News Detector</span>
                <Badge variant="outline" className="text-sm">
                  Beta
                </Badge>
              </CardTitle>
              <CardDescription className="text-center max-w-lg">
                Analyze news articles or social media posts for authenticity using advanced AI detection
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg">Input Type</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExample}
                      disabled={isLoading}
                    >
                      Load Example
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleClear}
                      disabled={isLoading}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                
                <RadioGroup 
                  value={inputType} 
                  onValueChange={(val: "text" | "url") => setInputType(val)}
                  className="flex flex-row space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="text" />
                    <Label htmlFor="text" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" /> Text
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="url" id="url" />
                    <Label htmlFor="url" className="flex items-center gap-1">
                      <Link className="h-4 w-4" /> URL
                    </Label>
                  </div>
                </RadioGroup>

                <div className="grid gap-2">
                  <Label htmlFor="input" className="text-lg">
                    {inputType === "text" ? "Article Text" : "Article URL"}
                  </Label>
                  {inputType === "text" ? (
                    <Textarea
                      ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                      id="input"
                      placeholder="Paste news article or social media post content here..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="min-h-[150px]"
                      disabled={isLoading}
                    />
                  ) : (
                    <Input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      id="input"
                      placeholder="https://example.com/news/article"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isLoading}
                    />
                  )}
                </div>
                
                <Button 
                  onClick={handleDetect} 
                  disabled={isLoading || !input.trim()}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Detect Fake News"
                  )}
                </Button>
              </div>

              {isLoading && !result && (
                <div className="mt-6 space-y-4">
                  <Skeleton className="h-8 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-[100px] w-full" />
                </div>
              )}

              {result && (
                <div className="mt-6 space-y-6">
                  <div className="flex flex-col gap-4 p-4 border rounded-lg bg-background">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        {result.result === 'Fake' ? (
                          <>
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            <span className="text-destructive">Potential Fake News</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span className="text-green-500">Likely Genuine</span>
                          </>
                        )}
                      </h3>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="secondary">
                            Confidence: {Math.round(result.score * 100)}%
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Higher percentage indicates stronger confidence in the result</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    <div className={result.result === 'Fake' ? "[&>div]:bg-destructive" : "[&>div]:bg-green-500"}>
                       <Progress value={result.score * 100} className="h-2" />
                    </div>
                    
                    <div className="grid gap-2">
                      <h4 className="font-medium">Analysis Reasoning:</h4>
                      <div className="rounded-md border p-4 bg-muted/50">
                        <p className="whitespace-pre-line">{result.reasoning}</p>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <h4 className="font-medium">Processed Content:</h4>
                      <Textarea 
                        readOnly 
                        value={result.cleanedInput} 
                        className="w-full min-h-[100px]" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {history.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-3">Recent Analyses</h3>
                  <div className="space-y-2">
                    {history.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {item.result === 'Fake' ? (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                          <span className="truncate max-w-[200px]">{item.input}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{Math.round(item.score * 100)}%</span>
                          <span>•</span>
                          <span>{format(item.timestamp, 'HH:mm')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    </TooltipProvider>
  );
}