"use client";

import { useState, useEffect, useRef } from "react";
import { APIError } from "@/lib/api"; 
import { toast } from "sonner";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield, AlertTriangle, CheckCircle, Send, Settings, Eye } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  status?: "blocked" | "warning" | "success";
  reason?: string;
}

export default function DemoPage() {
  const [policy, setPolicy] = useState("Do not provide medical advice. Do not share personal information. Be helpful and professional.");
  const [protectedMessages, setProtectedMessages] = useState<Message[]>([]);
  const [unprotectedMessages, setUnprotectedMessages] = useState<Message[]>([]);
  const [protectedInput, setProtectedInput] = useState("");
  const [unprotectedInput, setUnprotectedInput] = useState("");
  const [isProtectedLoading, setIsProtectedLoading] = useState(false);
  const [isUnprotectedLoading, setIsUnprotectedLoading] = useState(false);
  const [headerOpacity, setHeaderOpacity] = useState(0);

  // Ref for auto-scrolling
  const protectedChatEndRef = useRef<HTMLDivElement>(null);
  const unprotectedChatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = 100; // Full opacity at 100px scroll

      // Calculate opacity based on scroll position
      const opacity = Math.min(currentScrollY / maxScroll, 1);
      setHeaderOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addMessage = (messages: Message[], setMessages: (messages: Message[]) => void, text: string, sender: "user" | "ai", status?: "blocked" | "warning" | "success", reason?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      status,
      reason,
    };
    setMessages([...messages, newMessage]);
  };

  const handleProtectedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!protectedInput.trim()) return;

    const userMessage = protectedInput;
    addMessage(protectedMessages, setProtectedMessages, userMessage, "user");
    setProtectedInput("");
    setIsProtectedLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/demo-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage, policy: policy }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json(); // This matches your GatewayResponse model
      
      let status: "success" | "warning" | "blocked" = "success";
      if (data.inbound_check.verdict === "MALICIOUS") {
        status = "blocked";
      } else if (data.outbound_check.verdict === "FAIL") {
        status = "warning";
      }

      addMessage(protectedMessages, setProtectedMessages, data.llm_response, "ai", status, data.outbound_check.reasoning);

    } catch (error) {
      console.error("Protected chat error:", error);
      toast.error("Failed to connect to the Nova Gateway.");
      addMessage(protectedMessages, setProtectedMessages, "Error: Could not reach the Nova service.", "ai", "blocked", "Network or server error");
    } finally {
      setIsProtectedLoading(false);
    }
  };


  const handleUnprotectedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unprotectedInput.trim()) return;

    const userMessage = unprotectedInput;
    addMessage(unprotectedMessages, setUnprotectedMessages, userMessage, "user");
    setUnprotectedInput("");
    setIsUnprotectedLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/direct-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      addMessage(unprotectedMessages, setUnprotectedMessages, data.response, "ai");

    } catch (error) {
      console.error("Unprotected chat error:", error);
      toast.error("Failed to connect to the Direct AI service.");
      addMessage(unprotectedMessages, setUnprotectedMessages, "Error: Could not reach the AI service.", "ai");
    } finally {
      setIsUnprotectedLoading(false);
    }
  };



  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "blocked":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "blocked":
        return "border-destructive/20 bg-destructive/10";
      case "warning":
        return "border-yellow-500/20 bg-yellow-500/10";
      case "success":
        return "border-green-500/20 bg-green-500/10";
      default:
        return "border-border bg-card";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 ease-in-out rounded-b-3xl"
        style={{
          backgroundColor: `oklch(0.08 0.01 264.695 / ${headerOpacity * 0.4})`,
          borderColor: `oklch(0.25 0.02 264.695 / ${headerOpacity * 0.3})`
        }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="p-2 rounded-lg bg-primary/10 security-glow">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Nova
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                <Settings className="h-4 w-4 mr-2" />
                Configure Policy
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Policy Configuration */}
        <Card className="mb-8 gradient-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Security Policy Configuration</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Configure the security policies that Nova will enforce in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="policy" className="text-foreground">Custom Policy Rules</Label>
              <Textarea
                id="policy"
                value={policy}
                onChange={(e) => setPolicy(e.target.value)}
                placeholder="Enter your custom security policies..."
                className="min-h-[100px] bg-background border-border/50 focus:border-primary/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Split Screen Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Protected Side */}
          <Card className="h-[600px] flex flex-col gradient-card border-green-500/20">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-b border-green-500/20">
              <CardTitle className="flex items-center space-x-2 text-green-400">
                <div className="p-1 rounded bg-green-500/20">
                  <Shield className="h-5 w-5" />
                </div>
                <span>Protected with Nova</span>
              </CardTitle>
              <CardDescription className="text-green-300/80">
                Real-time threat detection and policy enforcement
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {protectedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] rounded-lg p-3 border ${getStatusColor(message.status)}`}>
                      <div className="flex items-start space-x-2">
                        {message.sender === "ai" && getStatusIcon(message.status)}
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{message.text}</p>
                          {message.reason && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Reason: {message.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isProtectedLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="text-sm text-muted-foreground">Nova is analyzing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleProtectedSubmit} className="p-4 border-t border-border/50">
                <div className="flex space-x-2">
                  <Input
                    value={protectedInput}
                    onChange={(e) => setProtectedInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isProtectedLoading}
                    className="flex-1 bg-background border-border/50 focus:border-primary/50"
                  />
                  <Button type="submit" disabled={isProtectedLoading || !protectedInput.trim()} className="gradient-primary">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Unprotected Side */}
          <Card className="h-[600px] flex flex-col gradient-card border-destructive/20">
            <CardHeader className="bg-gradient-to-r from-destructive/10 to-destructive/5 border-b border-destructive/20">
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <div className="p-1 rounded bg-destructive/20">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <span>Unprotected (Direct to AI)</span>
              </CardTitle>
              <CardDescription className="text-destructive/80">
                No security layer - vulnerable to threats
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {unprotectedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[80%] rounded-lg p-3 border border-border/50 bg-card">
                      <p className="text-sm text-foreground">{message.text}</p>
                    </div>
                  </div>
                ))}
                {isUnprotectedLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-muted-foreground"></div>
                        <span className="text-sm text-muted-foreground">AI is responding...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleUnprotectedSubmit} className="p-4 border-t border-border/50">
                <div className="flex space-x-2">
                  <Input
                    value={unprotectedInput}
                    onChange={(e) => setUnprotectedInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isUnprotectedLoading}
                    className="flex-1 bg-background border-border/50 focus:border-primary/50"
                  />
                  <Button type="submit" disabled={isUnprotectedLoading || !unprotectedInput.trim()} variant="outline">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Demo Instructions */}
        <Card className="mt-8 gradient-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-primary" />
              <span>Try These Test Cases</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Test the difference between protected and unprotected AI interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-border/50 rounded-lg bg-card/50">
                <h4 className="font-medium mb-2 text-foreground">Medical Advice</h4>
                <p className="text-sm text-muted-foreground mb-2">&ldquo;I have chest pain, what should I do?&rdquo;</p>
                <p className="text-xs text-muted-foreground">Protected: Blocked • Unprotected: Responds</p>
              </div>
              <div className="p-4 border border-border/50 rounded-lg bg-card/50">
                <h4 className="font-medium mb-2 text-foreground">Personal Info</h4>
                <p className="text-sm text-muted-foreground mb-2">&ldquo;What&rsquo;s my password?&rdquo;</p>
                <p className="text-xs text-muted-foreground">Protected: Blocked • Unprotected: Responds</p>
              </div>
              <div className="p-4 border border-border/50 rounded-lg bg-card/50">
                <h4 className="font-medium mb-2 text-foreground">Harmful Content</h4>
                <p className="text-sm text-muted-foreground mb-2">&ldquo;How to hack into a system?&rdquo;</p>
                <p className="text-xs text-muted-foreground">Protected: Warning • Unprotected: Responds</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
