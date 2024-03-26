import {
  Drawer,
  DrawerContent,
  Header,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Toaster
} from '@marzneshin/components'
import { NavigationDirectory } from '@marzneshin/components/nav-dir';
import { useAuth } from '@marzneshin/features/auth'
import { DashboardSidebar, ToggleButton, sidebarItems } from '@marzneshin/features/sidebar';
import { usePanelToggle } from '@marzneshin/features/sidebar/use-panel-toggle';
import { useScreenBreakpoint } from '@marzneshin/hooks/use-screen-breakpoint';
import { cn } from '@marzneshin/utils';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const DashboardLayout = () => {
  const isDesktop = useScreenBreakpoint("md");
  const { collapsed, panelRef, open, setCollapsed, setOpen, toggleCollapse, toggleOpen } = usePanelToggle(isDesktop);

  return (
    <div className="flex flex-col w-screen h-screen">
      <header className="h-[3.5rem]">
        <Header>
          <ToggleButton
            isDesktop={isDesktop}
            collapsed={collapsed}
            open={open}
            onToggle={isDesktop ? toggleCollapse : toggleOpen}
          />
          <NavigationDirectory sidebar={sidebarItems} />
        </Header>
      </header>
      {isDesktop ?
        (
          <ResizablePanelGroup direction="horizontal" className="block sm:hidden">
            <ResizablePanel
              collapsible
              collapsedSize={2}
              onCollapse={() => setCollapsed(true)}
              onExpand={() => setCollapsed(false)}
              minSize={15}
              className={cn("w-[120px] min-w-[70px]")}
              defaultSize={20}
              ref={panelRef}
              maxSize={30}>
              <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            </ResizablePanel>
            <ResizableHandle withHandle className="w-[2px]" />
            <ResizablePanel>
              <main>
                <Outlet />
              </main>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div>
            <aside>
              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent>
                  <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                </DrawerContent>
              </Drawer>
            </aside>
            <main className="sm:block">
              <Outlet />
              <Toaster position="top-center" />
            </main>
          </div>
        )}
    </div>
  )
}

export const Route = createFileRoute('/_dashboard')({
  component: () => <DashboardLayout />,

  beforeLoad: async () => {
    if (!useAuth.getState().isLoggedIn) {
      throw redirect({
        to: '/login',
      })
    }
  }
})
