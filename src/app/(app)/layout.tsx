
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
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar 
        collapsible="icon" 
        className={cn(
          "border-r border-[hsl(var(--sidebar-border))]",
          "bg-[hsl(var(--sidebar-background))] backdrop-blur-lg" // Glassmorphism for sidebar
        )}
      >
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Button variant="ghost" size="icon" className="rounded-lg text-primary hover:bg-primary/10">
              <ShieldHalf size={28} />
            </Button>
            <h1 className="font-headline text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              API Sentinel
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent
          className="bg-transparent" // Content area itself is transparent if sidebar has backdrop
        >
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter 
          className={cn(
            "p-4 mt-auto border-t border-[hsl(var(--sidebar-border))]",
            "bg-[hsl(var(--sidebar-background))] backdrop-blur-lg" // Ensure footer matches sidebar style
          )}
        >
           <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">AS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium text-sidebar-foreground">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@apisentinel.com</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header 
          className={cn(
            "sticky top-0 z-30 flex h-16 items-center justify-between gap-4 px-4 sm:static sm:h-auto sm:px-6 py-4",
            "bg-background/70 backdrop-blur-md border-b border-border/50" // Glassmorphism for header
          )}
        >
          <div className="sm:hidden">
             <SidebarTrigger />
          </div>
          {/* Add breadcrumbs or page title here if needed */}
           <div> {/* Placeholder for potential header content like search or notifications */}
             {/* <Button variant="ghost" size="icon"><Search className="h-5 w-5"/></Button> */}
           </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:px-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    