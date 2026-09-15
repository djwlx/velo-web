import { FileText, House, Image, type LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'wouter';

import { cn } from '@/lib/utils';

interface NavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navigationItems: NavigationItem[] = [
  { href: '/', label: '首页', icon: House },
  { href: '/115', label: '115 文件', icon: FileText },
  { href: '/pic', label: '随机图片', icon: Image },
];

interface NavigationProps {
  onNavigate?: () => void;
}

export function Navigation({ onNavigate }: NavigationProps) {
  const [location] = useLocation();

  return (
    <nav aria-label="主导航" className="flex flex-col gap-1 p-3">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === '/' ? location === '/' : location.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
              'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
            )}
          >
            <Icon data-icon="inline-start" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
