import { Menu } from 'lucide-react';
import { Link } from 'wouter';

import { Button } from '@/components/ui/button';

interface HeaderProps {
  showMenu?: boolean;
  onMenuClick?: () => void;
}

export function Header({ showMenu = false, onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center border-b px-4">
      {showMenu ? (
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={onMenuClick}
          aria-label="打开导航菜单"
        >
          <Menu />
        </Button>
      ) : null}
      <Link href="/" className="text-lg font-medium">
        Velo
      </Link>
    </header>
  );
}
