"use client";

import React from "react";
import { useParams } from "next/navigation";
import { usePlayground } from "@/features/playground/hooks/usePlayground";
import { SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip"; // or "@radix-ui/react-tooltip"
import { TemplateFileTree } from "@/features/playground/components/playground-explorer";

const MainPlaygroundPage = () => {
  const { id } = useParams<{ id: string }>();
  const { playgroundData, templateData, isLoading, saveTemplateData } = usePlayground(id);

  if (isLoading) {
    return (
      <SidebarInset className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading playground...</p>
      </SidebarInset>
    );
  }
  const activeFile = 'sample.txt'; // Replace with actual logic to determine the active file

  return (
    <TooltipProvider>
         <TemplateFileTree
          data={templateData!}
          onFileSelect={()=> {}}
          selectedFile={activeFile}
          title="File Explorer"
          onAddFile={()=> {}}
          onAddFolder={()=> {}}
          onDeleteFile={()=> {}}
          onDeleteFolder={()=> {}}
          onRenameFile={()=> {}}
          onRenameFolder={()=> {}}
        />
      <SidebarInset className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-medium">
              {playgroundData?.name || "Code Playground"}
            </h1>
          </div>
        </header>

        {/* Playground Content Area */}
        <div className="flex flex-1 overflow-hidden p-4">
          {/* Main workspace, editor, or file tree goes here */}
        </div>
      </SidebarInset>
    </TooltipProvider>
  );
};

export default MainPlaygroundPage;