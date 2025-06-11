
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { LineChart, BarChart, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Bar, Line, ResponsiveContainer } from "recharts";
import { TrendingUp, Zap, AlertCircle, ShieldAlert, Timer, Activity, Percent } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

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
  { name: 'Healthy', value: 180, fill: "hsl(var(--chart-2))" }, // chart-2 is neon green
  { name: 'Warnings', value: 15, fill: "hsl(var(--chart-4))" }, // chart-4 is orange/yellow
  { name: 'Critical', value: 5, fill: "hsl(var(--destructive))" } // destructive is red
];

const chartConfig = {
  latency: {
    label: "Avg. Latency (ms)",
    color: "hsl(var(--chart-1))",
    icon: Timer,
  },
  errorRate: {
    label: "Error Rate (%)",
    color: "hsl(var(--chart-5))", // Purple
    icon: Percent,
  },
  rps: {
    label: "RPS",
    color: "hsl(var(--chart-3))", // Another blue
    icon: Activity,
  },
  healthyApis: {
    label: "Healthy",
    color: overallHealthData[0].fill,
  },
  warningApis: {
    label: "Warnings",
    color: overallHealthData[1].fill,
  },
  criticalApis: {
    label: "Critical",
    color: overallHealthData[2].fill,
  },
} satisfies ChartConfig;


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-semibold">API Health Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Uptime</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.92%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. API Latency</CardTitle>
            <Zap className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85ms</div>
            <p className="text-xs text-muted-foreground">-5ms from last hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Error Rate</CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.08%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours, target &lt; 0.1%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Security Alerts</CardTitle>
            <ShieldAlert className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API Performance Trends</CardTitle>
            <CardDescription>Latency, error rate, and requests per second (RPS) over the last 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={apiPerformanceData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis yAxisId="left" orientation="left" stroke="var(--color-latency)" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis yAxisId="center" orientation="right" stroke="var(--color-errorRate)" tickLine={false} axisLine={false} tickMargin={8} domain={[0, 'dataMax + 0.1']}/>
                <YAxis yAxisId="right" orientation="right" stroke="var(--color-rps)" tickLine={false} axisLine={false} tickMargin={8} label={{ value: 'RPS', angle: 90, position: 'insideRight', fill: 'currentColor', fontSize: 12, offset:25 }} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <Line yAxisId="left" type="monotone" dataKey="latency" stroke="var(--color-latency)" strokeWidth={2} dot={true} name="Avg. Latency (ms)" />
                <Line yAxisId="center" type="monotone" dataKey="errorRate" stroke="var(--color-errorRate)" strokeWidth={2} dot={true} name="Error Rate (%)" />
                <Line yAxisId="right" type="monotone" dataKey="rps" stroke="var(--color-rps)" strokeWidth={2} dot={true} name="RPS" />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall API Health Status</CardTitle>
            <CardDescription>Distribution of API health across the system.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={chartConfig} className="h-[300px] w-[300px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={overallHealthData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={70} // Makes it a donut chart
                  labelLine={false}
                >
                  {overallHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    