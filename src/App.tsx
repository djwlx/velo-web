import { Route, Switch } from 'wouter';
import { Home } from './apps/home';
import { Tools } from './apps/tools';

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tools" component={Tools} />
    </Switch>
  );
}

export default App;
