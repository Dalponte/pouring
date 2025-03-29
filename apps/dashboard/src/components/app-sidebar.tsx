import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "./theme-toggle"
import { Beer, Users, Gauge, MonitorCog } from "lucide-react"

const APP_NAME = import.meta.env.VITE_APP_NAME || "Dashboard"
const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL
const APP_ENV = import.meta.env.VITE_APP_ENV

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h3 className="p-2 text-1xl font-bold flex items-center gap-2">
          <MonitorCog className=" stroke-[1.5]" /> {APP_NAME}
        </h3>
      </SidebarHeader>
      <SidebarContent>

        <SidebarGroup key="panels">
          <SidebarGroupLabel>Panels</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="taps-panel">
                <SidebarMenuButton asChild isActive={false}>
                  <a href={"#"} className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-blue-500 stroke-[1.5]" />
                    Taps Panel
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup key="management">
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="clients">
                <SidebarMenuButton asChild isActive={false}>
                  <a href={"#"} className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-500 stroke-[1.5]" />
                    Clients
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="taps">
                <SidebarMenuButton asChild isActive={false}>
                  <a href={"#"} className="flex items-center gap-2">
                    <Beer className="h-5 w-5 text-amber-500 stroke-[1.5]" />
                    Taps
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {APP_ENV === "dev" && (
          <SidebarGroup key="settings">
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <ul className="flex pl-2 flex-col gap-2 text-accent text-xs">
                <li>{APP_ENV}</li>
                <li>{APP_NAME}</li>
                <li>{GRAPHQL_URL}</li>
              </ul>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar >
  )
}
