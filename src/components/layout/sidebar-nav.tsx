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
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.label}
                className={cn(item.soon && "cursor-not-allowed opacity-50")}
              >
                <a> {/* Link component needs an anchor tag as child when asChild is used this way in older Next versions, or wrap SidebarMenuButton in Link directly */}
                  <Icon />
                  <span>{item.label}</span>
                  {item.soon && (
                    <span className="ml-auto text-xs text-muted-foreground">Soon</span>
                  )}
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
