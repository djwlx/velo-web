import { Route, Switch } from 'wouter';
import { Home } from './apps/home';
import { FileList115 } from './apps/file-list-115';
import { Pic } from './apps/pic';
import { NotFound } from './apps/not-found';
import { Layout } from './apps/layout';
import { Setting } from './apps/setting';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/115" component={FileList115} />
        <Route path="/pic" component={Pic} />
        <Route path="/setting" component={Setting} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default App;
