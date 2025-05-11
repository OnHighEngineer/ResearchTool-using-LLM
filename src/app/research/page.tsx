"use client";

import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateResearchPaper } from "@/ai/flows/generate-research-paper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout";
import { Loader2, Download, FileText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ResearchPaper = {
  title: string;
  abstract: string;
  sections: {
    title: string;
    content: string;
    subsections?: {
      title: string;
      content: string;
    }[];
  }[];
  references?: string[];
};

export default function Research() {
  const [topic, setTopic] = useState("");
  const [researchPaper, setResearchPaper] = useState<ResearchPaper | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [paperStyle, setPaperStyle] = useState("academic");
  const [wordCount, setWordCount] = useState(1500);
  const { toast } = useToast();
  const paperRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        variant: "destructive",
        title: "Topic Required",
        description: "Please enter a research topic",
      });
      return;
    }

    setIsGenerating(true);
    setResearchPaper(null);

    try {
      const result = await generateResearchPaper({ 
        topic,
        style: paperStyle,
        wordCount 
      });
      setResearchPaper(result);
    } catch (error: any) {
      console.error("Error generating research paper:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || "Failed to generate research paper",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!researchPaper || !paperRef.current) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No research paper to download",
      });
      return;
    }
  
    try {
      setIsDownloading(true);
      toast({
        title: "Preparing PDF",
        description: "Generating your research paper...",
      });
  
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;
  
      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
  
      // Generate canvas from content
      const canvas = await html2canvas(paperRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
  
      // Add to PDF
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
  
      // Create download link (works in WebView and browsers)
      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const fileName = `${researchPaper.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
  
      // Trigger download
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // Clean up
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
  
      toast({
        title: "Download Started",
        description: "Your paper will save to your downloads folder",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to generate PDF",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  return(
    <Layout>
      <div className="flex flex-col items-center justify-start min-h-[80vh] w-full px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <Card className="w-full">
            <CardHeader className="flex flex-col items-center text-center px-4 sm:px-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold flex flex-col sm:flex-row items-center gap-2">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
                <span>Research Paper Generator</span>
                <Badge variant="secondary" className="text-xs sm:text-sm mt-2 sm:mt-0">
                  Beta
                </Badge>
              </CardTitle>
              <CardDescription className="max-w-lg">
                Generate comprehensive research papers on any topic with AI assistance
              </CardDescription>
            </CardHeader>
            
            <CardContent className="grid gap-6 px-4 sm:px-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="topic" className="text-base sm:text-lg">
                    Research Topic
                  </Label>
                  <Input
                    id="topic"
                    placeholder="Enter your research topic (e.g., Climate Change Effects)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isGenerating}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Paper Style</Label>
                    <Select 
                      value={paperStyle} 
                      onValueChange={setPaperStyle}
                      disabled={isGenerating}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="concise">Concise</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Word Count</Label>
                    <Select 
                      value={wordCount.toString()} 
                      onValueChange={(val) => setWordCount(parseInt(val))}
                      disabled={isGenerating}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000">Short (1000 words)</SelectItem>
                        <SelectItem value="1500">Medium (1500 words)</SelectItem>
                        <SelectItem value="2500">Long (2500 words)</SelectItem>
                        <SelectItem value="5000">Extended (5000 words)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="gap-2 w-full sm:w-auto mx-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Paper
                    </>
                  )}
                </Button>
              </div>

              {isGenerating && !researchPaper && (
                <div className="mt-6 space-y-4 w-full">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="space-y-4 pt-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-6 w-[180px]" />
                        <Skeleton className="h-[100px] w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {researchPaper && (
                <div className="mt-6 space-y-6 w-full">
                  <div 
                    ref={paperRef}
                    className="p-4 sm:p-6 border rounded-lg bg-background research-paper-content"
                  >
                    <h1 className="text-xl sm:text-2xl font-bold text-center mb-2">{researchPaper.title}</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground text-center mb-4 sm:mb-6">
                      Generated on {new Date().toLocaleDateString()}
                    </p>
                    
                    <div className="mb-6 sm:mb-8">
                      <h2 className="text-base sm:text-lg font-semibold mb-2">Abstract</h2>
                      <p className="whitespace-pre-line text-justify text-sm sm:text-base">
                        {researchPaper.abstract}
                      </p>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                      {researchPaper.sections.map((section, index) => (
                        <div key={index} className="space-y-2 sm:space-y-3">
                          <h2 className="text-lg sm:text-xl font-semibold">{section.title}</h2>
                          <div className="whitespace-pre-line text-justify text-sm sm:text-base">
                            {section.content}
                          </div>
                          {section.subsections?.map((subsection, subIndex) => (
                            <div key={subIndex} className="mt-2 sm:mt-3 ml-2 sm:ml-4 space-y-1 sm:space-y-2">
                              <h3 className="text-base sm:text-lg font-medium">{subsection.title}</h3>
                              <p className="whitespace-pre-line text-justify text-sm sm:text-base">
                                {subsection.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    {researchPaper.references && researchPaper.references.length > 0 && (
                      <div className="mt-6 sm:mt-8">
                        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">References</h2>
                        <ul className="space-y-1 sm:space-y-2">
                          {researchPaper.references.map((ref, i) => (
                            <li key={i} className="text-xs sm:text-sm">{ref}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <Button 
                      onClick={handleDownload}
                      className="gap-2 w-full sm:w-auto"
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Preparing PDF...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
    </Layout>
  );
}
