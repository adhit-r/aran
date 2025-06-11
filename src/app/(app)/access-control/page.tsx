"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { PlusCircle, UserPlus, Edit3, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[]; // Role IDs
  status: "active" | "invited" | "suspended";
}

const initialRoles: Role[] = [
  { id: "admin", name: "Administrator", description: "Full access to all resources and settings.", permissions: ["manage_users", "manage_roles", "manage_policies", "view_catalog", "discover_apis", "view_dashboard"] },
  { id: "developer", name: "Developer", description: "Access to view API catalog, documentation, and their own API keys.", permissions: ["view_catalog", "view_dashboard_limited"] },
  { id: "security_analyst", name: "Security Analyst", description: "Access to view security dashboards, threats, and policies.", permissions: ["view_dashboard", "view_threats", "view_policies"] },
  { id: "viewer", name: "Viewer", description: "Read-only access to dashboards and API catalog.", permissions: ["view_dashboard_limited", "view_catalog"] },
];

const allPermissions = [
    { id: "manage_users", label: "Manage Users" },
    { id: "manage_roles", label: "Manage Roles" },
    { id: "manage_policies", label: "Manage Policies" },
    { id: "view_catalog", label: "View API Catalog" },
    { id: "discover_apis", label: "Discover APIs" },
    { id: "view_dashboard", label: "View Full Dashboard" },
    { id: "view_dashboard_limited", label: "View Limited Dashboard" },
    { id: "view_threats", label: "View Threats" },
    { id: "view_policies", label: "View Policies" },
];

const initialUsers: User[] = [
  { id: "1", name: "Alice Wonderland", email: "alice@example.com", roles: ["admin"], status: "active" },
  { id: "2", name: "Bob The Builder", email: "bob@example.com", roles: ["developer"], status: "active" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", roles: ["security_analyst", "viewer"], status: "invited" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", roles: ["viewer"], status: "suspended" },
];


export default function AccessControlPage() {
  const [roles, setRoles] = React.useState<Role[]>(initialRoles);
  const [users, setUsers] = React.useState<User[]>(initialUsers);

  const [isRoleDialogOpen, setIsRoleDialogOpen] = React.useState(false);
  const [newRoleName, setNewRoleName] = React.useState("");
  const [newRoleDescription, setNewRoleDescription] = React.useState("");
  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([]);

  const [isUserDialogOpen, setIsUserDialogOpen] = React.useState(false);
  const [newUserName, setNewUserName] = React.useState("");
  const [newUserEmail, setNewUserEmail] = React.useState("");
  const [selectedUserRoles, setSelectedUserRoles] = React.useState<string[]>([]);


  const handleAddRole = () => {
    const newRole: Role = {
      id: newRoleName.toLowerCase().replace(/\s+/g, '_'),
      name: newRoleName,
      description: newRoleDescription,
      permissions: selectedPermissions,
    };
    setRoles([...roles, newRole]);
    setIsRoleDialogOpen(false);
    setNewRoleName("");
    setNewRoleDescription("");
    setSelectedPermissions([]);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissions(prev => 
      checked ? [...prev, permissionId] : prev.filter(p => p !== permissionId)
    );
  };

  const handleAddUser = () => {
    const newUser: User = {
      id: String(users.length + 1),
      name: newUserName,
      email: newUserEmail,
      roles: selectedUserRoles,
      status: "invited",
    };
    setUsers([...users, newUser]);
    setIsUserDialogOpen(false);
    setNewUserName("");
    setNewUserEmail("");
    setSelectedUserRoles([]);
  };

  const handleUserRoleChange = (roleId: string, checked: boolean) => {
    setSelectedUserRoles(prev => 
      checked ? [...prev, roleId] : prev.filter(r => r !== roleId)
    );
  };

  const getStatusBadgeVariant = (status: User["status"]) => {
    switch (status) {
      case "active": return "default";
      case "invited": return "secondary";
      case "suspended": return "destructive";
      default: return "outline";
    }
  }


  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-semibold">Access Control</h1>
      <Tabs defaultValue="roles">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Roles</CardTitle>
                <CardDescription>Define roles and their associated permissions.</CardDescription>
              </div>
              <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Role
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add New Role</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="roleName">Role Name</Label>
                      <Input id="roleName" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="roleDescription">Description</Label>
                      <Input id="roleDescription" value={newRoleDescription} onChange={(e) => setNewRoleDescription(e.target.value)} />
                    </div>
                    <div className="grid gap-1.5">
                        <Label>Permissions</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1 border rounded-md">
                            {allPermissions.map(perm => (
                                <div key={perm.id} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`perm-${perm.id}`} 
                                        checked={selectedPermissions.includes(perm.id)}
                                        onCheckedChange={(checked) => handlePermissionChange(perm.id, !!checked)}
                                    />
                                    <Label htmlFor={`perm-${perm.id}`} className="text-sm font-normal">{perm.label}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddRole}>Add Role</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{role.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{role.permissions.length} permissions</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" disabled><Edit3 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" disabled className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>Invite users and assign them roles.</CardDescription>
              </div>
              <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">
                    <UserPlus className="mr-2 h-4 w-4" /> Invite User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Invite New User</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="userName">Full Name</Label>
                      <Input id="userName" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="userEmail">Email Address</Label>
                      <Input id="userEmail" type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
                    </div>
                     <div className="grid gap-1.5">
                        <Label>Assign Roles</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1 border rounded-md">
                            {roles.map(role => (
                                <div key={role.id} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`user-role-${role.id}`} 
                                        checked={selectedUserRoles.includes(role.id)}
                                        onCheckedChange={(checked) => handleUserRoleChange(role.id, !!checked)}
                                    />
                                    <Label htmlFor={`user-role-${role.id}`} className="text-sm font-normal">{role.name}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsUserDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddUser}>Send Invitation</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((roleId) => {
                            const role = roles.find(r => r.id === roleId);
                            return role ? <Badge key={roleId} variant="outline">{role.name}</Badge> : null;
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user.status)} className="capitalize">{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" disabled><Edit3 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" disabled className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
