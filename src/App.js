import { Switch, Route,HashRouter} from "react-router-dom";
import IndexPage from "./views/IndexPage";
import LayoutPage from "./views/LayoutPage";
import { SelectedProvider } from './context/SelectedContext'
import 'antd/dist/antd.css'
import './App.css';
function App() {
  return (
    <SelectedProvider>
      <HashRouter>
        <Switch>
          <Route path="/" component={IndexPage} exact />
          <Route path="/inicio" component={LayoutPage} />
        </Switch>
      </HashRouter>
    </SelectedProvider>

  );
}

export default App;
