import type { PropsWithChildren } from "react";
import { ShieldHalf } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Button variant="ghost" size="icon" className="rounded-lg text-primary">
              <ShieldHalf size={28} />
            </Button>
            <h1 className="font-headline text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">
              API Sentinel
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border">
           <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium text-foreground">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@apisentinel.com</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
          <div className="sm:hidden">
             <SidebarTrigger />
          </div>
          {/* Add breadcrumbs or page title here if needed */}
        </header>
        <main className="flex-1 overflow-auto p-4 sm:px-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
