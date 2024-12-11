"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Boxes,
  ChevronDown,
  ChevronRight,
  LogOut,
  Settings,
  FileText,
  LayoutDashboard,
  Car,
  Users,
  Calendar,
  DollarSignIcon,
  BatteryCharging,
  Cog,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainMenuItems = [
  {
    label: "Plateforme",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
      },
      {
        title: "Allocations",
        url: "/allocations",
        icon: Calendar,
      },
      {
        title: "Véhicules",
        url: "/vehicles",
        icon: Car,
      },
      {
        title: "Conducteurs",
        url: "/drivers",
        icon: Users,
      },
      {
        title: "Revenue",
        url: "/revenues",
        icon: DollarSignIcon,
      },
      {
        title: "Maintenance",
        url: "/maintenance",
        icon: Cog,
      },
      {
        title: "Stations de Charge",
        url: "/charging-stations",
        icon: BatteryCharging,
      },
    ],
  },
  {
    label: "Système",
    items: [
      {
        title: "Documentation",
        url: "/docs",
        icon: FileText,
        hasArrow: true,
      },
      {
        title: "Paramètres",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className="border-b px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center justify-center rounded-md bg-ibi-color-1 ${
                        isCollapsed ? "h-6 w-6" : "h-8 w-8"
                      }`}
                    >
                      <Boxes className="h-6 w-6" />
                    </div>
                    {!isCollapsed && (
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">IBI Group</span>
                        <span className="text-xs text-zinc-400">
                          Enterprise
                        </span>
                      </div>
                    )}
                  </div>
                  {!isCollapsed && <ChevronDown className="h-4 w-4" />}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {mainMenuItems.map((section, index) => (
          <SidebarGroup key={index} className="py-2">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs text-zinc-400">
                {section.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="gap-2"
                      tooltip={isCollapsed ? item.title : undefined}
                    >
                      <Link href={item.url} className="flex items-center">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {item.hasArrow && (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem className="w-full flex items-center justify-center h-full p-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-center !p-0 h-full">
                  <div className="flex items-center gap-2">
                    <div
                      className={`relative overflow-hidden rounded-full ${
                        isCollapsed ? "h-6 w-6" : "h-8 w-8"
                      }`}
                    >
                      <Image
                        src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80"
                        alt="User"
                        width={isCollapsed ? 24 : 32}
                        height={isCollapsed ? 24 : 32}
                        className="aspect-square"
                      />
                    </div>
                    {!isCollapsed && (
                      <div className="flex flex-col items-start">
                        <span className="text-sm">admin</span>
                        <span className="text-xs text-zinc-400">
                          admin@ibi-group.com
                        </span>
                      </div>
                    )}
                  </div>
                  {!isCollapsed && <ChevronDown className="h-4 w-4" />}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-60"
                align="start"
                alignOffset={11}
              >
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
