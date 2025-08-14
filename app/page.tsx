"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Eye, Lock } from "lucide-react";

export default function HomePage() {
  const [headerOpacity, setHeaderOpacity] = useState(0);

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 transition-all duration-300 ease-in-out rounded-b-3xl"
        style={{
          backgroundColor: `oklch(0.12 0.015 264.695 / ${headerOpacity * 0.4})`,
          borderColor: `oklch(0.25 0.02 264.695 / ${headerOpacity * 0.3})`,
          borderBottomWidth: headerOpacity > 0 ? '1px' : '0px',
          backdropFilter: headerOpacity > 0 ? 'blur(12px)' : 'none'
        }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Aegis</span>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/demo" className="text-muted-foreground hover:text-foreground transition-colors">
                Demo
              </Link>
              <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-8 leading-tight pb-2">
            Aegis
          </h1>
          <h2 className="text-4xl font-bold text-foreground mb-6">
            The Universal Trust Layer for AI
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Aegis is an intelligent, real-time gateway that acts as a universal firewall and quality control system for AI models.
            Protect your applications from threats, enforce policies, and ensure accuracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="text-lg px-8 py-3">
                Try the Demo
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Why Choose Aegis?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Real-time Threat Detection</CardTitle>
                <CardDescription>
                  Instantly detect and block prompt injection attempts, PII leaks, and malicious content before they reach your AI models.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Policy Enforcement</CardTitle>
                <CardDescription>
                  Enforce custom policies for brand voice, content guidelines, and compliance requirements with our multi-critic system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Eye className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Complete Audit Trail</CardTitle>
                <CardDescription>
                  Immutable logging with cryptographic hash chains provides tamper-proof audit trails for compliance and security.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            See Aegis in Action
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the power of our split-screen demo showing protected vs unprotected AI interactions.
          </p>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Protected vs Unprotected Demo</CardTitle>
              <CardDescription>
                Watch how Aegis blocks threats while allowing legitimate requests through
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center border border-border/50">
                <div className="text-center">
                  <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Interactive demo will be embedded here</p>
                  <Link href="/demo">
                    <Button>Launch Demo</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-card/80 via-muted/30 to-card/80 border-y border-border/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Ready to Secure Your AI?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            Join the future of AI security. Start protecting your applications today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-primary/30 text-primary hover:bg-primary/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-card/50 border-t border-border/50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Aegis</span>
          </div>
          <p className="text-muted-foreground">
            The Universal Trust Layer for AI • Built for the OpenAI x NxtWave Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
}
