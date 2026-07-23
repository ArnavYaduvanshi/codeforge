import type React from "react";
import {SidebarProvider} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/features/dashboard/dashboard-sidebar"
import {getAllPlaygroundForUser} from "@/features/dashboard/actions";
export default async function DashboardLayout({children}: {children: React.ReactNode}) {
  const playgroundData= await getAllPlaygroundForUser();
  const technologyIconMap: Record<string, string> = {
    REACT: "Zap",
    NEXTJS: "Lightbulb",
    EXPRESS: "Database",
    VUE: "Compass",
    HONO: "FlameIcon",
    ANGULAR: "Terminal",
  }
  const formattedPlaygroundData = playgroundData?.map((item) => ({
    id: item.id,
    name: item.title,
    starred:false,
    icon: technologyIconMap[item.template] || "Code2"
  }));
  return (
  <SidebarProvider>
    <div className="flex min-h-screen w-full overflow-x-hidden">

      {/* Sidebar */}
      {/* @ts-ignore */}
      <DashboardSidebar initialPlaygroundData={formattedPlaygroundData} />
      <main className="flex-1">{children}</main>
    </div>
    </SidebarProvider>
  )
}