"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { detectMcpThreatsAction, type DetectMcpThreatsActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldAlert, ShieldCheck, AlertCircle, Info, Network, Cpu } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Analyze MCP Traffic
    </Button>
  );
}

export default function MCPThreatsPage() {
  const initialState: DetectMcpThreatsActionState = { message: "" };
  const [state, formAction] = useFormState(detectMcpThreatsAction, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.message && !state.error && !state.inputErrors) {
      // Optionally reset form if desired, though for analysis, keeping inputs might be useful
      // formRef.current?.reset(); 
    }
  }, [state]);

  const getErrorForField = (fieldName: string) => {
    return state.inputErrors?.find(err => err.path.includes(fieldName))?.message;
  }
  
  const getThreatLevelBadgeVariant = (threatLevel?: 'low' | 'medium' | 'high') => {
    switch (threatLevel) {
      case 'low': return 'default'; 
      case 'medium': return 'secondary'; 
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  const getSeverityBadgeVariant = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return 'default'; 
      case 'medium': return 'secondary'; 
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-semibold">MCP Threats</h1>
      <p className="text-muted-foreground">
        Monitor and analyze potential threats to Model Context Protocol (MCP) implementations and their security posture.
      </p>

      <Alert variant="default" className="bg-blue-900/20 border-blue-700 text-blue-300 [&>svg]:text-blue-400">
        <Info className="h-4 w-4" />
        <AlertTitle>Data Processing Notice</AlertTitle>
        <AlertDescription>
          Your MCP request/response data is processed locally using rule-based analysis. 
          No data is sent to external AI services. However, ensure sensitive information is 
          appropriately masked or redacted <strong className="font-semibold">before submission</strong> 
          for compliance with data privacy regulations.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Analyze MCP Call</CardTitle>
            <CardDescription>
              Enter the details of an MCP call to check for anomalies and security threats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={formAction} className="space-y-4">
              <div>
                <Label htmlFor="mcpEndpoint">MCP Endpoint</Label>
                <Input 
                  id="mcpEndpoint" 
                  name="mcpEndpoint" 
                  placeholder="/mcp/db/query" 
                  defaultValue="/mcp/db/query" 
                />
                {getErrorForField("mcpEndpoint") && <p className="text-sm text-destructive mt-1">{getErrorForField("mcpEndpoint")}</p>}
              </div>
              <div>
                <Label htmlFor="requestData">Request Data (JSON)</Label>
                <Textarea 
                  id="requestData" 
                  name="requestData" 
                  rows={3} 
                  placeholder='{ "query": "SELECT * FROM users", "action": "read" }' 
                  className="font-code"
                  defaultValue='{ "query": "SELECT * FROM users", "action": "read" }'
                />
                {getErrorForField("requestData") && <p className="text-sm text-destructive mt-1">{getErrorForField("requestData")}</p>}
              </div>
              <div>
                <Label htmlFor="responseData">Response Data (JSON)</Label>
                <Textarea 
                  id="responseData" 
                  name="responseData" 
                  rows={3} 
                  placeholder='{ "status": "success", "data": [...] }' 
                  className="font-code"
                  defaultValue='{ "status": "success", "data": [{"id": 1, "name": "John"}] }'
                />
                {getErrorForField("responseData") && <p className="text-sm text-destructive mt-1">{getErrorForField("responseData")}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="userRole">User Role</Label>
                  <Input 
                    id="userRole" 
                    name="userRole" 
                    placeholder="admin, user, guest" 
                    defaultValue="user"
                  />
                  {getErrorForField("userRole") && <p className="text-sm text-destructive mt-1">{getErrorForField("userRole")}</p>}
                </div>
                <div>
                  <Label htmlFor="trafficVolume">Traffic Volume</Label>
                  <Input 
                    id="trafficVolume" 
                    name="trafficVolume" 
                    placeholder="1000" 
                    defaultValue="150"
                  />
                  {getErrorForField("trafficVolume") && <p className="text-sm text-destructive mt-1">{getErrorForField("trafficVolume")}</p>}
                </div>
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Sample MCP Threats</CardTitle>
            <CardDescription>
              Common threat patterns to watch for in MCP implementations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Unauthorized Data Access</span>
              </div>
              <p className="text-xs text-muted-foreground">
                AI applications accessing sensitive data without proper authorization.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Destructive Operations</span>
              </div>
              <p className="text-xs text-muted-foreground">
                AI tools performing DELETE, DROP, or other destructive actions.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">High Traffic Volume</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Unusually high number of requests to MCP endpoints.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Administrative Access</span>
              </div>
              <p className="text-xs text-muted-foreground">
                AI applications attempting to access admin-level MCP functions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {state.message && !state.error && state.threatAnalysis && (
        <Alert variant="default" className="bg-accent/30 border-accent">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Analysis Complete!</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      {state.error && (
         <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
         </Alert>
      )}

      {state.threatAnalysis && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Threat Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{state.threatAnalysis.anomalyScore}</div>
                  <div className="text-sm text-muted-foreground">Anomaly Score</div>
                </div>
                <div className="text-center">
                  <Badge variant={getThreatLevelBadgeVariant(state.threatAnalysis.threatLevel)} className="text-lg px-4 py-2">
                    {state.threatAnalysis.threatLevel.toUpperCase()}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-2">Threat Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{state.threatAnalysis.detectedThreats.length}</div>
                  <div className="text-sm text-muted-foreground">Detected Threats</div>
                </div>
              </div>

              {state.threatAnalysis.detectedThreats.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Detected Threats</h4>
                  <div className="space-y-2">
                    {state.threatAnalysis.detectedThreats.map((threat, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <ShieldAlert className="h-4 w-4 text-destructive" />
                        <span className="text-sm">{threat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-3">Risk Factors</h4>
                <div className="space-y-2">
                  {state.threatAnalysis.riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Badge variant={getSeverityBadgeVariant(factor.severity)} className="shrink-0">
                        {factor.severity}
                      </Badge>
                      <div>
                        <div className="text-sm font-medium">{factor.factor}</div>
                        <div className="text-xs text-muted-foreground">{factor.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Recommendations</h4>
                <div className="space-y-2">
                  {state.threatAnalysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-accent/20 border border-accent/30 rounded-lg">
                      <Cpu className="h-4 w-4 text-accent-foreground mt-0.5" />
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
