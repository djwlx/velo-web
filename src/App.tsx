import { Route, Switch } from 'wouter';
import { Home } from './apps/home';
import { FileList115 } from './apps/file-list-115';
import { Pic } from './apps/pic';
import { NotFound } from './apps/not-found';

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/115" component={FileList115} />
      <Route path="/pic" component={Pic} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
