import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingGrid from "./LoadingGrid";
import { Badge } from "./ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarInset, SidebarTrigger } from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";

export default function ClassroomPageLoading() {
  return (
    <SidebarInset>
      <header className="flex h-16 sticky z-40 bg-sidebar dark:bg-neutral-950 top-0 left-0 shrink-0 items-center justify-between pr-4 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <a href="/dashboard">Dashboard</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage>Loading...</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex md:flex-row flex-col gap-4 md:items-center justify-between">
          <div className="flex flex-col gap-2">
            <Badge className="rounded-sm">
              Code du classroom:
              <Skeleton className="w-16 h-3" />
            </Badge>
            <Skeleton className="w-48 h-5" />
          </div>
        </div>
        <Tabs defaultValue="courses">
          <TabsList className="h-auto w-full justify-start gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground">
            <TabsTrigger
              value="courses"
              className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
            >
              Cours & devoirs
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
            >
              Membres
            </TabsTrigger>
          </TabsList>

          {/* Onglet Cours & Devoirs */}
          <TabsContent value="courses" className="py-2">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <LoadingGrid count={3} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  );
}
