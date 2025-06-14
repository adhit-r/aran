
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react"; // Import useState
import {
  LayoutDashboard,
  BookText,
  ShieldCheck,
  UsersRound,
  SearchCode,
  Siren,
  Cpu,
  FolderLock, // For API Security parent
  Network, // For MCP Security parent
  ChevronDown, // For accordion
  FileText, // For Doc Inventory
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface NavItem {
  href?: string; // Optional for parent items
  label: string;
  icon: LucideIcon;
  soon?: boolean;
  children?: NavItem[]; // For nested items
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/api-documentation", label: "Doc Inventory", icon: FileText },
  {
    label: "API Security",
    icon: FolderLock,
    children: [
      { href: "/api-catalog", label: "API Catalog", icon: BookText },
      { href: "/api-discovery", label: "API Discovery", icon: SearchCode },
      { href: "/threat-detection", label: "API Threats", icon: Siren }, // Updated label
    ],
  },
  {
    label: "MCP Security",
    icon: Network,
    children: [
      { href: "/mcp-catalog", label: "MCP Catalog", icon: Cpu },
      { href: "/mcp-discovery", label: "MCP Discovery", icon: SearchCode }, // New item
      { href: "/mcp-threats", label: "MCP Threats", icon: Siren },       // New item
    ],
  },
  { href: "/security-policies", label: "Security Policies", icon: ShieldCheck },
  { href: "/access-control", label: "Access Control", icon: UsersRound },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const renderNavItem = (item: NavItem, isChild: boolean = false, parentLabel?: string) => {
    const Icon = item.icon;
    const isOpen = parentLabel ? openSections[parentLabel] : openSections[item.label];

    // isActive for children, or for top-level non-parent items
    const isActiveDirect = !item.children && item.href && (pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/"));
    // A parent section is considered active if one of its children is active
    const isActiveParent = item.children && item.children.some(child => child.href && (pathname === child.href || pathname.startsWith(child.href)));
    const isActive = isActiveDirect || isActiveParent;


    const baseClasses = "w-full flex items-center gap-3 px-3 rounded-lg text-sm transition-all duration-200 ease-in-out text-sidebar-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:gap-0";
    // Active classes for children or top-level active items
    const activeChildClasses = "bg-accent text-accent-foreground font-semibold hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
    // Inactive classes for children or top-level non-active items
    const inactiveChildClasses = "hover:bg-accent/10 hover:text-accent focus-visible:bg-accent/10 focus-visible:text-accent";

    // Specific styling for parent items (category headers)
    const parentItemClasses = "font-medium text-sidebar-foreground/90 hover:bg-muted/50";
    const activeParentClass = "text-accent-foreground"; // When a child is active

    let itemSpecificClassName;

    if (item.children) { // Parent item
      itemSpecificClassName = cn(
        baseClasses,
        "py-2", // Slightly less vertical padding for parents
        parentItemClasses,
        isActiveParent && activeParentClass, // Highlight parent if a child is active
        item.soon && "cursor-not-allowed opacity-60"
      );
    } else { // Child item or top-level non-parent
      itemSpecificClassName = cn(
        baseClasses,
        "py-2.5", // Original padding for clickable items
        isActiveDirect ? activeChildClasses : inactiveChildClasses,
        isChild && "group-data-[collapsible=true]:pl-0 pl-7 text-xs", // Indentation for children
        item.soon && "cursor-not-allowed opacity-60 hover:bg-transparent hover:text-sidebar-foreground"
      );
    }

    if (item.children) {
      // Parent item - now clickable for accordion
      return (
        <SidebarMenuItem key={item.label} className="flex flex-col items-start">
          <button
            onClick={() => toggleSection(item.label)}
            className={cn(itemSpecificClassName, "w-full")}
            aria-expanded={isOpen}
          >
            <Icon className="h-5 w-5 shrink-0 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6" />
            <span className="group-data-[collapsible=icon]:hidden flex-grow text-left">{item.label}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[collapsible=icon]:hidden",
                isOpen && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "w-full flex flex-col items-start overflow-hidden transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden",
              isOpen ? "max-h-[1000px] opacity-100 mt-1" : "max-h-0 opacity-0" // Basic animation
            )}
          >
            {item.children.map((child) => renderNavItem(child, true, item.label))}
          </div>
        </SidebarMenuItem>
      );
    }

    // Leaf item (actual link)
    return (
      <SidebarMenuItem key={item.label}>
        <Link href={item.href || "#"} passHref className={cn(item.soon && "pointer-events-none")}>
          <SidebarMenuButton
            isActive={!!isActiveDirect}
            tooltip={item.label}
            className={itemSpecificClassName}
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
  };

  return (
    <SidebarMenu>
      {navItems.map((item) => renderNavItem(item))}
    </SidebarMenu>
  );
}
