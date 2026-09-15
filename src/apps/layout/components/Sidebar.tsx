import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Navigation } from './Navigation';

const sidebarSurfaceClassName =
  'w-72 shrink-0 border-r bg-popover text-popover-foreground ';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

export function Sidebar({ mobileOpen, onMobileOpenChange }: SidebarProps) {
  return (
    <>
      <aside
        className={cn(
          sidebarSurfaceClassName,
          'hidden h-full md:flex md:flex-col'
        )}
      >
        <div className="flex h-full flex-col">
          <Navigation />
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          side="left"
          className={cn(sidebarSurfaceClassName, 'p-0 pt-8 md:hidden')}
        >
          <Navigation onNavigate={() => onMobileOpenChange(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
