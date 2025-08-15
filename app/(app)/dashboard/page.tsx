"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Activity,
  Eye,
  Settings
} from "lucide-react";

export default function DashboardPage() {
  // Mock data - replace with real API calls
  const stats = {
    totalRequests: 1247,
    blockedThreats: 23,
    successfulRequests: 1224,
    averageResponseTime: 245,
    costSavings: 156.78,
    uptime: 99.8,
  };

  const recentActivity = [
    { id: 1, type: "threat_blocked", message: "Prompt injection attempt blocked", time: "2 min ago", severity: "high" },
    { id: 2, type: "request_processed", message: "AI response verified successfully", time: "5 min ago", severity: "low" },
    { id: 3, type: "policy_violation", message: "Medical advice policy violation detected", time: "12 min ago", severity: "medium" },
    { id: 4, type: "request_processed", message: "AI response verified successfully", time: "15 min ago", severity: "low" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Monitor your AI security and trust metrics in real-time
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button className="gradient-primary security-glow">
            <Eye className="h-4 w-4 mr-2" />
            View Logs
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">
              +12% from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card border-destructive/20 hover:border-destructive/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Threats Blocked</CardTitle>
            <div className="p-2 rounded-lg bg-destructive/10">
              <Shield className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.blockedThreats}</div>
            <p className="text-xs text-muted-foreground mt-2">
              +3 from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card border-green-500/20 hover:border-green-500/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {((stats.successfulRequests / stats.totalRequests) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.successfulRequests} successful requests
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cost Savings</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">${stats.costSavings}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Saved this hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Threat Analysis Chart */}
        <Card className="gradient-card border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Threat Analysis</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Threats blocked over the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border border-border/50">
              <div className="text-center">
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <TrendingUp className="h-12 w-12 text-primary" />
                </div>
                <p className="text-muted-foreground mb-2">Chart component will be added here</p>
                <p className="text-sm text-muted-foreground">Using Recharts library</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="gradient-card border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Latest security events and responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-card/50 border border-border/50">
                  <div className={`
                    w-2 h-2 rounded-full mt-2 flex-shrink-0
                    ${activity.severity === 'high' ? 'bg-destructive' :
                      activity.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}
                  `} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 border-primary/30 text-primary hover:bg-primary/10">
              <Eye className="h-4 w-4 mr-2" />
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="gradient-card border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Common tasks and configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2 border-primary/30 text-primary hover:bg-primary/10">
              <Shield className="h-6 w-6" />
              <span>Configure Policies</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 border-destructive/30 text-destructive hover:bg-destructive/10">
              <AlertTriangle className="h-6 w-6" />
              <span>View Threats</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 border-primary/30 text-primary hover:bg-primary/10">
              <Clock className="h-6 w-6" />
              <span>Check Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 