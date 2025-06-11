"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, LineChart, CartesianGrid, XAxis, YAxis, Bar, Line, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer } from "recharts";
import { Activity, AlertTriangle, ShieldCheck, Clock } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

const apiTrafficData = [
  { month: "Jan", requests: 1200, latency: 150 },
  { month: "Feb", requests: 1500, latency: 140 },
  { month: "Mar", requests: 1300, latency: 160 },
  { month: "Apr", requests: 1700, latency: 130 },
  { month: "May", requests: 1900, latency: 120 },
  { month: "Jun", requests: 2100, latency: 110 },
];

const securityEventsData = [
  { event: "Auth Failure", count: 45 },
  { event: "Rate Limit", count: 120 },
  { event: "SQL Injection", count: 5 },
  { event: "XSS Attempt", count: 12 },
];

const chartConfig = {
  requests: {
    label: "API Requests",
    color: "hsl(var(--chart-1))",
  },
  latency: {
    label: "Avg. Latency (ms)",
    color: "hsl(var(--chart-2))",
  },
  count: {
    label: "Count",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-semibold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Threats Detected</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">243</div>
            <p className="text-xs text-muted-foreground">+12 since last hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Security Policies</CardTitle>
            <ShieldCheck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">Covering 95% of APIs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128ms</div>
            <p className="text-xs text-muted-foreground">-3ms from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API Traffic Overview</CardTitle>
            <CardDescription>Monthly API requests and average latency.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={apiTrafficData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line yAxisId="left" type="monotone" dataKey="requests" stroke="var(--color-requests)" strokeWidth={2} dot={true} />
                <Line yAxisId="right" type="monotone" dataKey="latency" stroke="var(--color-latency)" strokeWidth={2} dot={true} />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Events</CardTitle>
            <CardDescription>Breakdown of security events in the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
               <BarChart data={securityEventsData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis dataKey="event" type="category" tickLine={false} axisLine={false} tickMargin={8} width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
