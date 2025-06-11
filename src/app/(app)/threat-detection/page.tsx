
"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { detectApiAnomalyAction, type DetectApiAnomalyActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ShieldAlert, ShieldCheck, AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Analyze Traffic
    </Button>
  );
}

export default function ThreatDetectionPage() {
  const initialState: DetectApiAnomalyActionState = { message: "" };
  const [state, formAction] = useFormState(detectApiAnomalyAction, initialState);
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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-semibold">AI-Powered Threat Detection</h1>
      <p className="text-muted-foreground">
        Analyze API traffic patterns to identify unusual behavior and potential security threats.
      </p>

      <Alert variant="default" className="bg-blue-900/20 border-blue-700 text-blue-300 [&>svg]:text-blue-400">
        <Info className="h-4 w-4" />
        <AlertTitle>Data Privacy Notice</AlertTitle>
        <AlertDescription>
          If your API request/response data contains PII, CPNI, or other sensitive information, 
          ensure it is appropriately masked or redacted <strong className="font-semibold">before submission</strong>. 
          This application sends the provided data to an AI model for analysis. 
          Properly sanitizing sensitive data is crucial for compliance with data privacy regulations.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Analyze API Call</CardTitle>
            <CardDescription>
              Enter the details of an API call to check for anomalies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={formAction} className="space-y-4">
              <div>
                <Label htmlFor="apiEndpoint">API Endpoint</Label>
                <Input 
                  id="apiEndpoint" 
                  name="apiEndpoint" 
                  placeholder="/v1/users/123" 
                  defaultValue="https://jsonplaceholder.typicode.com/posts/1" 
                />
                {getErrorForField("apiEndpoint") && <p className="text-sm text-destructive mt-1">{getErrorForField("apiEndpoint")}</p>}
              </div>
              <div>
                <Label htmlFor="requestData">Request Data (JSON)</Label>
                <Textarea 
                  id="requestData" 
                  name="requestData" 
                  rows={3} 
                  placeholder='{ "action": "update", "value": "example" }' 
                  className="font-code"
                  defaultValue='{}'
                />
                {getErrorForField("requestData") && <p className="text-sm text-destructive mt-1">{getErrorForField("requestData")}</p>}
              </div>
              <div>
                <Label htmlFor="responseData">Response Data (JSON)</Label>
                <Textarea 
                  id="responseData" 
                  name="responseData" 
                  rows={3} 
                  placeholder='{ "status": "success", "id": "123" }' 
                  className="font-code"
                  defaultValue='{ "userId": 1, "id": 1, "title": "sunt aut facere ...", "body": "quia et suscipit ..." }'
                />
                {getErrorForField("responseData") && <p className="text-sm text-destructive mt-1">{getErrorForField("responseData")}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="responseTime">Response Time (ms)</Label>
                  <Input 
                    id="responseTime" 
                    name="responseTime" 
                    type="number" 
                    placeholder="150" 
                    defaultValue="80"
                  />
                  {getErrorForField("responseTime") && <p className="text-sm text-destructive mt-1">{getErrorForField("responseTime")}</p>}
                </div>
                <div>
                  <Label htmlFor="trafficVolume">Traffic Volume (reqs/min)</Label>
                  <Input 
                    id="trafficVolume" 
                    name="trafficVolume" 
                    type="number" 
                    placeholder="60" 
                    defaultValue="10"
                  />
                  {getErrorForField("trafficVolume") && <p className="text-sm text-destructive mt-1">{getErrorForField("trafficVolume")}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="userRoles">User Roles (comma-separated)</Label>
                <Input 
                  id="userRoles" 
                  name="userRoles" 
                  placeholder="user, editor" 
                  defaultValue="public_user"
                />
                 {getErrorForField("userRoles") && <p className="text-sm text-destructive mt-1">{getErrorForField("userRoles")}</p>}
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
            <CardDescription>The outcome of the API traffic analysis will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.message && !state.error && state.analysisResult && (
              <Alert variant={state.analysisResult.isAnomalous ? "destructive" : "default"} className={!state.analysisResult.isAnomalous ? "bg-accent/30 border-accent": ""}>
                {state.analysisResult.isAnomalous ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                <AlertTitle>{state.analysisResult.isAnomalous ? "Anomaly Detected!" : "No Anomaly Detected"}</AlertTitle>
                <AlertDescription>
                  {state.message}
                </AlertDescription>
              </Alert>
            )}
            {state.error && (
              <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Analysis Error</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            {!state.analysisResult && !state.error && !state.message && (
                <div className="text-center text-muted-foreground py-8">
                    <p>Submit API call data to see the analysis results.</p>
                </div>
            )}

            {state.analysisResult && (
              <div className="space-y-3 rounded-md border p-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Is Anomalous:</span>
                  <Badge variant={state.analysisResult.isAnomalous ? "destructive" : "default"}>
                    {state.analysisResult.isAnomalous ? "Yes" : "No"}
                  </Badge>
                </div>
                 <div className="flex justify-between">
                  <span className="text-sm font-medium">Anomaly Score:</span>
                  <span className="text-sm font-mono">{state.analysisResult.anomalyScore.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Threat Level:</span>
                   <Badge variant={getThreatLevelBadgeVariant(state.analysisResult.threatLevel)} className="capitalize">
                    {state.analysisResult.threatLevel}
                   </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Explanation:</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">{state.analysisResult.explanation || "N/A"}</p>
                </div>
                 <div>
                  <h4 className="text-sm font-medium mb-1">Suggested Actions:</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">{state.analysisResult.suggestedActions || "N/A"}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
