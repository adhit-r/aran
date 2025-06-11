
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
        return (
          <SidebarMenuItem key={item.label}>
            <Link href={item.href}>
              <SidebarMenuButton
                isActive={isActive}
                tooltip={item.label}
                className={cn(item.soon && "cursor-not-allowed opacity-50")}
              >
                <Icon />
                <span>{item.label}</span>
                {item.soon && (
                  <span className="ml-auto text-xs text-muted-foreground">Soon</span>
                )}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
