
"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { LineChart, BarChart, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Bar, Line, ResponsiveContainer } from "recharts";
import { TrendingUp, Zap, AlertCircle, ShieldAlert, Timer, Activity, Percent, ArrowRight, CheckCircle, ShieldCheck, AlertTriangle } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

const apiPerformanceData = [
  { time: "00:00", latency: 90, errorRate: 0.12, rps: 1500 },
  { time: "03:00", latency: 85, errorRate: 0.10, rps: 1600 },
  { time: "06:00", latency: 95, errorRate: 0.15, rps: 1400 },
  { time: "09:00", latency: 80, errorRate: 0.08, rps: 1700 },
  { time: "12:00", latency: 100, errorRate: 0.10, rps: 1800 },
  { time: "15:00", latency: 105, errorRate: 0.09, rps: 1650 },
  { time: "18:00", latency: 90, errorRate: 0.11, rps: 1750 },
  { time: "21:00", latency: 110, errorRate: 0.14, rps: 1550 },
];

const overallHealthData = [
  { name: 'Healthy', value: 180, fill: "hsl(var(--chart-2))" }, 
  { name: 'Warnings', value: 15, fill: "hsl(var(--chart-4))" }, 
  { name: 'Critical', value: 5, fill: "hsl(var(--destructive))" }
];

const chartConfig = {
  latency: { label: "Avg. Latency (ms)", color: "hsl(var(--chart-1))", icon: Timer },
  errorRate: { label: "Error Rate (%)", color: "hsl(var(--chart-5))", icon: Percent },
  rps: { label: "RPS", color: "hsl(var(--chart-3))", icon: Activity },
  healthyApis: { label: "Healthy", color: overallHealthData[0].fill },
  warningApis: { label: "Warnings", color: overallHealthData[1].fill },
  criticalApis: { label: "Critical", color: overallHealthData[2].fill },
} satisfies ChartConfig;

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ElementType;
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon, iconColor }) => (
  <Card className="shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${iconColor || 'text-muted-foreground'}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

interface InsightCardProps {
  title: string;
  icon: React.ElementType;
  iconBgColor?: string;
  bgColor?: string;
  children: React.ReactNode;
  actionText?: string;
  onActionClick?: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, icon: Icon, iconBgColor = "bg-primary/10", bgColor = "bg-card", children, actionText, onActionClick }) => (
  <Card className={`shadow-lg ${bgColor} flex flex-col`}>
    <CardHeader>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${iconBgColor}`}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="flex-grow space-y-2 text-sm">
      {children}
    </CardContent>
    {actionText && onActionClick && (
      <CardFooter>
        <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80" onClick={onActionClick}>
          {actionText} <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    )}
  </Card>
);


export default function DashboardPage() {
  // Mock data for insights
  const recentAnomaly = { api: "/auth/login", score: 0.85, time: "2 mins ago", user: "attacker@example.com", threatLevel: "high" };
  const topPerformingApi = { name: "Product Catalog API", rps: 2500, latency: "35ms", uptime: "99.99%" };
  const policyCompliance = { compliant: 18, total: 20, lastCheck: "1 hour ago" };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6">
      <h1 className="font-headline text-4xl font-semibold text-foreground">Check your API Health</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area (Left/Center) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="relative aspect-[4/3] w-full">
                  <Image 
                    src="https://placehold.co/600x450.png" 
                    alt="API Health Abstract Visual" 
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                    data-ai-hint="api health security abstract" 
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Key Metrics</h2>
                  <StatCard title="API Uptime" value="99.92%" description="Last 24 hours" icon={TrendingUp} iconColor="text-green-500" />
                  <StatCard title="Avg. API Latency" value="85ms" description="-5ms from last hour" icon={Zap} iconColor="text-blue-500" />
                  <StatCard title="API Error Rate" value="0.08%" description="Target < 0.1%" icon={AlertCircle} iconColor="text-orange-500" />
                  <StatCard title="Critical Security Alerts" value="5" description="Requiring immediate attention" icon={ShieldAlert} iconColor="text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>API Performance Trends</CardTitle>
              <CardDescription>Latency, error rate, and requests per second (RPS) over the last 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <LineChart data={apiPerformanceData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} stroke="hsl(var(--muted-foreground))" />
                  <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis yAxisId="center" orientation="right" stroke="hsl(var(--chart-5))" tickLine={false} axisLine={false} tickMargin={8} domain={[0, 'dataMax + 0.1']}/>
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-3))" tickLine={false} axisLine={false} tickMargin={8} />
                  <RechartsTooltip content={<ChartTooltipContent indicator="line" />} cursor={{stroke: 'hsl(var(--muted-foreground))', strokeWidth:1, strokeDasharray: "3 3"}}/>
                  <Line yAxisId="left" type="monotone" dataKey="latency" strokeWidth={2} dot={{r:4, fill:'hsl(var(--background))', stroke:'hsl(var(--chart-1))'}} activeDot={{r:6}} stroke="hsl(var(--chart-1))" name={chartConfig.latency.label} />
                  <Line yAxisId="center" type="monotone" dataKey="errorRate" strokeWidth={2} dot={{r:4, fill:'hsl(var(--background))', stroke:'hsl(var(--chart-5))'}} activeDot={{r:6}} stroke="hsl(var(--chart-5))" name={chartConfig.errorRate.label} />
                  <Line yAxisId="right" type="monotone" dataKey="rps" strokeWidth={2} dot={{r:4, fill:'hsl(var(--background))', stroke:'hsl(var(--chart-3))'}} activeDot={{r:6}} stroke="hsl(var(--chart-3))" name={chartConfig.rps.label} />
                  <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Insights Column (Right) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-xl">
             <CardHeader>
                <CardTitle className="text-xl">Key Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InsightCard title="Recent High Severity Anomaly" icon={AlertTriangle} iconBgColor="bg-red-500/10" actionText="View Details" onActionClick={() => { /* Navigate or show modal */ }}>
                <p><span className="font-medium">API:</span> <Badge variant="outline" className="font-code">{recentAnomaly.api}</Badge></p>
                <p><span className="font-medium">Score:</span> <Badge variant="destructive">{recentAnomaly.score}</Badge></p>
                <p><span className="font-medium">User:</span> <span className="text-muted-foreground">{recentAnomaly.user}</span></p>
                <p><span className="font-medium">Time:</span> <span className="text-muted-foreground">{recentAnomaly.time}</span></p>
              </InsightCard>

              <InsightCard title="Top Performing API" icon={TrendingUp} iconBgColor="bg-green-500/10" actionText="Optimize Further" onActionClick={() => {}}>
                <p><span className="font-medium">Name:</span> <Badge variant="secondary">{topPerformingApi.name}</Badge></p>
                <p><span className="font-medium">RPS:</span> <span className="text-green-600 font-semibold">{topPerformingApi.rps}</span></p>
                <p><span className="font-medium">Latency:</span> <span className="text-green-600 font-semibold">{topPerformingApi.latency}</span></p>
                <p><span className="font-medium">Uptime:</span> <span className="text-muted-foreground">{topPerformingApi.uptime}</span></p>
              </InsightCard>

              <InsightCard title="Policy Compliance" icon={ShieldCheck} iconBgColor="bg-blue-500/10" actionText="Review Policies" onActionClick={() => {}}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge className="bg-accent text-accent-foreground">
                    {policyCompliance.compliant} / {policyCompliance.total} Compliant
                  </Badge>
                </div>
                <ResponsiveContainer width="100%" height={80}>
                  <PieChart>
                    <Pie
                      data={[{name: 'Compliant', value: policyCompliance.compliant}, {name: 'Non-Compliant', value: policyCompliance.total - policyCompliance.compliant}]}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={30}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="hsl(var(--accent))" />
                      <Cell fill="hsl(var(--destructive))" />
                    </Pie>
                    <RechartsTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground text-center">Last check: {policyCompliance.lastCheck}</p>
              </InsightCard>
            </CardContent>
          </Card>

           <Card className="shadow-xl">
            <CardHeader>
                <CardTitle>Overall API Health Status</CardTitle>
                <CardDescription>Distribution of API health across the system.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-[300px]">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full max-h-[250px]">
                <PieChart>
                    <RechartsTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                    <Pie data={overallHealthData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50} labelLine={false}>
                    {overallHealthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                    ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent nameKey="name" className="mt-4" />} />
                </PieChart>
                </ChartContainer>
            </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
