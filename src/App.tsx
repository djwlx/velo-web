import { Route, Switch } from 'wouter';
import { Home } from './apps/home';
import { Tools } from './apps/tools';
import { FileList115 } from './apps/file-list-115';

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tools" component={Tools} />
      <Route path="/115" component={FileList115} />
    </Switch>
  );
}

export default App;
