"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit3, Trash2, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  apisAppliedTo: string[]; // Could be API IDs or names
  status: "enabled" | "disabled";
  rules: { type: string; config: Record<string, any> }[]; // Example: { type: "rate_limit", config: { requests: 100, window: "1m" } }
}

const initialPolicies: SecurityPolicy[] = [
  { 
    id: "1", 
    name: "Global Rate Limiting", 
    description: "Default rate limiting for all public APIs.", 
    apisAppliedTo: ["User Service", "Product Catalog API"], 
    status: "enabled",
    rules: [{ type: "rate_limit", config: { requests: 1000, window: "1h" } }]
  },
  { 
    id: "2", 
    name: "Strict Authentication for Admin APIs", 
    description: "Requires MFA and IP whitelisting for admin endpoints.", 
    apisAppliedTo: ["Admin Dashboard API"], 
    status: "enabled",
    rules: [{ type: "mfa_required", config: {} }, { type: "ip_whitelist", config: { ips: ["192.168.1.0/24"] } }]
  },
  { 
    id: "3", 
    name: "Input Validation - Financial Transactions", 
    description: "Strict input validation for APIs handling financial data.", 
    apisAppliedTo: ["Order Management", "Legacy Payment Gateway"], 
    status: "disabled",
    rules: [{ type: "input_schema_validation", config: { schemaId: "financial_tx_v1" } }]
  },
];

export default function SecurityPoliciesPage() {
  const [policies, setPolicies] = React.useState<SecurityPolicy[]>(initialPolicies);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [selectedPolicy, setSelectedPolicy] = React.useState<SecurityPolicy | null>(null);

  // Form state for new policy
  const [newPolicyName, setNewPolicyName] = React.useState("");
  const [newPolicyDescription, setNewPolicyDescription] = React.useState("");
  const [newPolicyStatus, setNewPolicyStatus] = React.useState<boolean>(true);


  const handleCreatePolicy = () => {
    const newPolicy: SecurityPolicy = {
        id: String(policies.length + 1),
        name: newPolicyName,
        description: newPolicyDescription,
        apisAppliedTo: [], // Simplified for now
        status: newPolicyStatus ? "enabled" : "disabled",
        rules: [], // Simplified for now
    };
    setPolicies([...policies, newPolicy]);
    setIsCreateDialogOpen(false);
    // Reset form fields
    setNewPolicyName("");
    setNewPolicyDescription("");
    setNewPolicyStatus(true);
  };

  const handleViewPolicy = (policy: SecurityPolicy) => {
    setSelectedPolicy(policy);
    setIsViewDialogOpen(true);
  };

  const togglePolicyStatus = (policyId: string) => {
    setPolicies(policies.map(p => 
      p.id === policyId ? { ...p, status: p.status === "enabled" ? "disabled" : "enabled" } : p
    ));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-semibold">Security Policies</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Security Policy</DialogTitle>
              <DialogDescription>
                Define rules and configurations for your new security policy.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-1.5">
                <Label htmlFor="policyName">Policy Name</Label>
                <Input id="policyName" value={newPolicyName} onChange={(e) => setNewPolicyName(e.target.value)} />
              </div>
              <div className="grid items-center gap-1.5">
                <Label htmlFor="policyDescription">Description</Label>
                <Textarea id="policyDescription" value={newPolicyDescription} onChange={(e) => setNewPolicyDescription(e.target.value)} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="policyStatus" checked={newPolicyStatus} onCheckedChange={setNewPolicyStatus} />
                <Label htmlFor="policyStatus">Enable Policy</Label>
              </div>
              {/* Add rule configuration UI here later */}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={handleCreatePolicy}>Create Policy</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {policies.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {policies.map((policy) => (
            <Card key={policy.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {policy.name}
                  <Badge variant={policy.status === "enabled" ? "default" : "secondary"} className="capitalize">
                    {policy.status}
                  </Badge>
                </CardTitle>
                <CardDescription>{policy.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm font-medium mb-1">APIs Applied To:</p>
                {policy.apisAppliedTo.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {policy.apisAppliedTo.map(apiName => (
                        <Badge key={apiName} variant="outline" className="text-xs">{apiName}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Not applied to any APIs yet.</p>
                )}
                <p className="text-sm font-medium mt-3 mb-1">Rules:</p>
                 {policy.rules.length > 0 ? (
                    <ul className="list-disc list-inside text-xs text-muted-foreground">
                        {policy.rules.map(rule => <li key={rule.type}>{rule.type.replace(/_/g, ' ')}</li>)}
                    </ul>
                 ) : (
                    <p className="text-xs text-muted-foreground">No rules configured.</p>
                 )}
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t pt-4">
                <Switch 
                  checked={policy.status === "enabled"} 
                  onCheckedChange={() => togglePolicyStatus(policy.id)}
                  aria-label={`Toggle ${policy.name} status`}
                />
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleViewPolicy(policy)} aria-label={`View ${policy.name} details`}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" disabled aria-label={`Edit ${policy.name}`}> {/* Edit disabled for now */}
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" disabled className="text-destructive hover:text-destructive" aria-label={`Delete ${policy.name}`}> {/* Delete disabled for now */}
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No security policies defined yet. Get started by creating one!</p>
          </CardContent>
        </Card>
      )}

      {selectedPolicy && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedPolicy.name}</DialogTitle>
              <DialogDescription>{selectedPolicy.description}</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div>
                    <h4 className="font-medium text-sm">Status</h4>
                    <Badge variant={selectedPolicy.status === "enabled" ? "default" : "secondary"} className="capitalize">{selectedPolicy.status}</Badge>
                </div>
                <div>
                    <h4 className="font-medium text-sm">APIs Applied To</h4>
                     {selectedPolicy.apisAppliedTo.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedPolicy.apisAppliedTo.map(apiName => (
                            <Badge key={apiName} variant="outline" className="text-xs">{apiName}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Not applied to any APIs yet.</p>
                    )}
                </div>
                 <div>
                    <h4 className="font-medium text-sm">Rules</h4>
                     {selectedPolicy.rules.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                            {selectedPolicy.rules.map(rule => <li key={rule.type}>{rule.type.replace(/_/g, ' ')}: {JSON.stringify(rule.config)}</li>)}
                        </ul>
                     ) : (
                        <p className="text-xs text-muted-foreground">No rules configured.</p>
                     )}
                </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
