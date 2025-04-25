"use client";

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-secondary py-4">
        <div className="container flex items-center justify-between">
          <Button onClick={() => router.push("/")} variant="link" className="text-lg font-semibold">
            VeriScope
          </Button>
          <nav>
            <Button onClick={() => router.push("/research")} variant="ghost" className="mr-4">
              Research
            </Button>
            <Button onClick={() => router.push("/fake-news-detector")} variant="ghost">
              Fake News
            </Button>
          </nav>
        </div>
      </header>
      <main className="container flex-grow p-4">{children}</main>
      <footer className="bg-secondary py-4">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} VeriScope. All rights reserved.
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
