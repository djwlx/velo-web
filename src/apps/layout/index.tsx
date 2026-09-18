import { useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'wouter';

import { useUser } from '@/stores/user';
import { Header, Sidebar } from './components';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [location] = useLocation();
  const showSidebar = location === '/setting';
  const user = useUser((state) => state.user);
  const isAuthPage = location === '/login' || location === '/register';
  const page = (
    <div key={location} className="page-transition h-full">
      {children}
    </div>
  );

  if (isAuthPage) return page;

  return (
    <div className="w-screen h-dvh flex flex-col">
      <Header
        showMenu={showSidebar}
        userProfile={user}
        onMenuClick={() => setMobileSidebarOpen(true)}
      />
      <div className="flex-1 flex min-h-0">
        {showSidebar ? (
          <Sidebar
            mobileOpen={mobileSidebarOpen}
            onMobileOpenChange={setMobileSidebarOpen}
          />
        ) : null}
        <div className="flex-1 min-h-0 overflow-scroll">{page}</div>
      </div>
    </div>
  );
}
