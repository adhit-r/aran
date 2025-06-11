
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookText,
  ShieldCheck,
  UsersRound,
  SearchCode,
  Siren,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  soon?: boolean;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/api-catalog", label: "API Catalog", icon: BookText },
  { href: "/security-policies", label: "Security Policies", icon: ShieldCheck },
  { href: "/access-control", label: "Access Control", icon: UsersRound },
  { href: "/api-discovery", label: "API Discovery", icon: SearchCode },
  { href: "/threat-detection", label: "Threat Detection", icon: Siren },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");

        const baseClasses = "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out text-sidebar-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:gap-0";
        
        const activeClasses = "bg-primary text-primary-foreground shadow-lg font-semibold transform hover:scale-[1.02] focus:scale-[1.02] hover:bg-primary/90";
        const inactiveClasses = "hover:bg-primary/10 hover:text-primary";
        
        const buttonClassName = cn(
          baseClasses,
          isActive ? activeClasses : inactiveClasses,
          item.soon && "cursor-not-allowed opacity-60 hover:bg-transparent hover:text-sidebar-foreground" // Adjusted soon styling
        );

        return (
          <SidebarMenuItem key={item.label}>
            <Link href={item.href} passHref className={cn(item.soon && "pointer-events-none")}>
              <SidebarMenuButton
                isActive={isActive} // Still pass for potential internal logic/accessibility via data-active
                tooltip={item.label}
                className={buttonClassName}
              >
                <Icon className="h-5 w-5 shrink-0 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6" />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                {item.soon && (
                  <span className="ml-auto text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">Soon</span>
                )}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

