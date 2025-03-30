import * as React from "react"
import { NavLink } from "react-router-dom"

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

const envs = import.meta.env

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const envVars = Object.entries(envs).map(([key, value]) => {
    return value ? (
      <li key={key} className="text-xs">{value}</li>
    ) : undefined
  })


  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h3 className="p-2 text-1xl font-bold flex items-center gap-2">
          <MonitorCog className=" stroke-[1.5]" /> {envs.VITE_APP_NAME}
        </h3>
      </SidebarHeader>
      <SidebarContent>

        <SidebarGroup key="panels">
          <SidebarGroupLabel>Panels</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="taps-panel">
                <SidebarMenuButton asChild isActive={false}>
                  <NavLink to="/" className={({ isActive }) => `flex items-center gap-2 ${isActive ? 'font-bold' : ''}`}>
                    <Gauge className="h-5 w-5 text-blue-500 stroke-[1.5]" />
                    Taps Panel
                  </NavLink>
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
                  <NavLink to="/clients" className={({ isActive }) => `flex items-center gap-2 ${isActive ? 'font-bold' : ''}`}>
                    <Users className="h-5 w-5 text-green-500 stroke-[1.5]" />
                    Clients
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="taps">
                <SidebarMenuButton asChild isActive={false}>
                  <NavLink to="/taps" className={({ isActive }) => `flex items-center gap-2 ${isActive ? 'font-bold' : ''}`}>
                    <Beer className="h-5 w-5 text-amber-500 stroke-[1.5]" />
                    Taps
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {envs.VITE_APP_ENV === "dev" && (
          <SidebarGroup key="settings">
            <SidebarGroupLabel>Environment (while dev)</SidebarGroupLabel>
            <SidebarGroupContent>
              <ul className="flex pl-2 flex-col gap-2 text-accent text-xs">
                {envVars}
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
