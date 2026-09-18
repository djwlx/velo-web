import { useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { Redirect, Route, Switch, useLocation } from 'wouter';
import { AuthPage } from './apps/auth';
import { Home } from './apps/home';
import { FileList115 } from './apps/file-list-115';
import { Pic } from './apps/pic';
import { NotFound } from './apps/not-found';
import { Layout } from './apps/layout';
import { Setting } from './apps/setting';
import { useUser } from './stores/user';

function AuthGate({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const initialized = useUser((state) => state.initialized);
  const user = useUser((state) => state.user);
  const refresh = useUser((state) => state.refresh);
  const requiresAuth = location === '/115' || location.startsWith('/115/');

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (requiresAuth && !initialized) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
        <LoaderCircle className="size-6 animate-spin text-primary" />
      </div>
    );
  }
  if (requiresAuth && !user) return <Redirect to="/login" />;
  return <>{children}</>;
}

function App() {
  return (
    <AuthGate>
      <Layout>
        <Switch>
          <Route path="/login" component={AuthPage} />
          <Route path="/register" component={AuthPage} />
          <Route path="/" component={Home} />
          <Route path="/115" component={FileList115} />
          <Route path="/pic" component={Pic} />
          <Route path="/setting" component={Setting} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </AuthGate>
  );
}

export default App;
