
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
import { TrendingUp, Zap, AlertCircle, ShieldAlert, Timer, Activity, Percent, ArrowRight, CheckCircle, ShieldCheck, AlertTriangle, Network, Orbit, SlidersHorizontal, Users } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  element?: keyof JSX.IntrinsicElements;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, element = 'div' }) => {
  const Component = element;
  return (
    <Component className={cn(
      "bg-card/10 dark:bg-card/20 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl shadow-2xl shadow-primary/10 dark:shadow-black/20",
      className
    )}>
      {children}
    </Component>
  );
};


interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ElementType;
  iconColor?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon, iconColor, className }) => (
  <GlassCard className={cn("p-5", className)}>
    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
      <h3 className="text-sm font-medium text-foreground/80">{title}</h3>
      <Icon className={cn("h-5 w-5", iconColor || 'text-muted-foreground')} />
    </div>
    <div>
      <div className="text-3xl font-bold text-foreground">{value}</div>
      {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
    </div>
  </GlassCard>
);

interface InsightCardProps {
  title: string;
  icon: React.ElementType;
  iconBgColor?: string;
  children: React.ReactNode;
  actionText?: string;
  onActionClick?: () => void;
  className?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, icon: Icon, iconBgColor = "bg-primary/10", children, actionText, onActionClick, className }) => (
  <GlassCard className={cn("flex flex-col p-5", className)}>
    <div className="flex items-center gap-3 mb-3">
      <div className={cn("p-3 rounded-xl", iconBgColor)}>
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    </div>
    <div className="flex-grow space-y-2 text-sm text-foreground/90">
      {children}
    </div>
    {actionText && onActionClick && (
      <div className="mt-4">
        <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 font-semibold" onClick={onActionClick}>
          {actionText} <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    )}
  </GlassCard>
);


export default function DashboardPage() {
  const recentAnomaly = { api: "/auth/login", score: 0.85, time: "2 mins ago", user: "attacker@example.com", threatLevel: "high" };
  const topPerformingApi = { name: "Product Catalog API", rps: 2500, latency: "35ms", uptime: "99.99%" };
  const policyCompliance = { compliant: 18, total: 20, lastCheck: "1 hour ago" };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-4xl font-bold text-foreground">Aran Dashboard</h1>
        <Button variant="default" className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
          <SlidersHorizontal className="mr-2 h-5 w-5"/> Customize View
        </Button>
      </div>
      
      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Main Interactive 3D Placeholder */}
        <GlassCard className="lg:col-span-2 xl:col-span-2 row-span-2 p-0 overflow-hidden flex flex-col">
          <CardHeader className="p-5">
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                    <Orbit className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">Interactive API Ecosystem</CardTitle>
            </div>
            <CardDescription className="text-foreground/70 mt-1">Visualize your API landscape in 3D. (Conceptual)</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center relative">
            <Image 
              src="https://placehold.co/800x500.png" 
              alt="Interactive 3D API Map Placeholder" 
              layout="fill"
              objectFit="cover"
              className="opacity-30"
              data-ai-hint="3d network graph" 
            />
            <div className="z-10 text-center p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-2">Coming Soon</h3>
                <p className="text-foreground/80">An interactive 3D visualization of your API dependencies, traffic flow, and health status.</p>
                <Button variant="secondary" className="mt-6 shadow-md hover:shadow-lg transition-shadow">Learn More</Button>
            </div>
          </CardContent>
        </GlassCard>

        {/* Stat Cards */}
        <StatCard title="API Uptime" value="99.92%" description="Last 24 hours" icon={TrendingUp} iconColor="text-green-500" />
        <StatCard title="Avg. API Latency" value="72ms" description="-13ms from last hour" icon={Zap} iconColor="text-blue-400" />
        
        <StatCard title="API Error Rate" value="0.07%" description="Target < 0.1%" icon={AlertCircle} iconColor="text-orange-400" className="xl:col-start-3"/>
        <StatCard title="Total APIs Monitored" value="200" description="+5 since last week" icon={Network} iconColor="text-purple-400" />

        {/* API Performance Trends Chart */}
        <GlassCard className="lg:col-span-3 xl:col-span-2 p-5 xl:row-start-3">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg font-semibold text-foreground">API Performance Trends</CardTitle>
            <CardDescription className="text-foreground/70">Latency, error rate, and RPS over the last 24 hours.</CardDescription>
          </CardHeader>
          <ChartContainer config={chartConfig} className="h-[280px] w-full text-foreground/80">
            <LineChart data={apiPerformanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis yAxisId="center" orientation="right" stroke="hsl(var(--chart-5))" tickLine={false} axisLine={false} tickMargin={8} domain={[0, 'dataMax + 0.1']}/>
              {/* <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-3))" tickLine={false} axisLine={false} tickMargin={8} /> */}
              <RechartsTooltip 
                content={<ChartTooltipContent indicator="line" nameKey="name" labelKey="time" />} 
                cursor={{stroke: 'hsl(var(--primary))', strokeWidth:1, strokeDasharray: "3 3"}}
                wrapperStyle={{ outline: 'none', boxShadow: 'none' }}
                contentStyle={{ backgroundColor: 'hsl(var(--background)/0.8)', backdropFilter: 'blur(4px)', border: '1px solid hsl(var(--border)/0.5)', borderRadius: 'var(--radius)' }}
              />
              <Line yAxisId="left" type="monotone" dataKey="latency" strokeWidth={2.5} dot={{r:4, fill:'hsl(var(--background))', stroke:'hsl(var(--chart-1))'}} activeDot={{r:6}} stroke="hsl(var(--chart-1))" name={chartConfig.latency.label} />
              <Line yAxisId="center" type="monotone" dataKey="errorRate" strokeWidth={2.5} dot={{r:4, fill:'hsl(var(--background))', stroke:'hsl(var(--chart-5))'}} activeDot={{r:6}} stroke="hsl(var(--chart-5))" name={chartConfig.errorRate.label} />
              {/* <Line yAxisId="right" type="monotone" dataKey="rps" strokeWidth={2} dot={{r:4, fill:'hsl(var(--background))', stroke:'hsl(var(--chart-3))'}} activeDot={{r:6}} stroke="hsl(var(--chart-3))" name={chartConfig.rps.label} /> */}
              <ChartLegend content={<ChartLegendContent wrapperStyle={{paddingTop: '16px'}} />} />
            </LineChart>
          </ChartContainer>
        </GlassCard>

        {/* Key Insights in Bento Grid */}
        <InsightCard 
            title="Recent High Severity Anomaly" 
            icon={AlertTriangle} 
            iconBgColor="bg-red-500/10 text-red-400" 
            actionText="View Details" 
            onActionClick={() => { /* Navigate or show modal */ }}
            className="xl:row-start-3"
        >
            <p><span className="font-medium text-foreground/80">API:</span> <Badge variant="destructive" className="font-code bg-red-700/20 text-red-300 border-red-600/50">{recentAnomaly.api}</Badge></p>
            <p><span className="font-medium text-foreground/80">Score:</span> <Badge variant="destructive">{recentAnomaly.score}</Badge></p>
            <p><span className="font-medium text-foreground/80">User:</span> <span className="text-muted-foreground">{recentAnomaly.user}</span></p>
        </InsightCard>
        
        <GlassCard className="lg:col-span-1 xl:col-span-1 p-5 xl:row-start-4">
            <CardHeader className="p-0 mb-3">
                <CardTitle className="text-lg font-semibold text-foreground">Overall API Health</CardTitle>
                <CardDescription className="text-foreground/70">Distribution of API health status.</CardDescription>
            </CardHeader>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full max-h-[200px]">
            <PieChart>
                <RechartsTooltip 
                    content={<ChartTooltipContent hideLabel nameKey="name" />}
                    wrapperStyle={{ outline: 'none', boxShadow: 'none' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--background)/0.8)', backdropFilter: 'blur(4px)', border: '1px solid hsl(var(--border)/0.5)', borderRadius: 'var(--radius)' }}
                />
                <Pie data={overallHealthData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={45} labelLine={false}>
                {overallHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} className="focus:outline-none" />
                ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" className="mt-4 text-xs" />} />
            </PieChart>
            </ChartContainer>
        </GlassCard>

      </div>
    </div>
  );
}

    
