import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import JupyterNotebookDiffs from './components/JupyterNotebookDiffs';

const App = () => {
  const routes = useRoutes([{ path: '/', element: <JupyterNotebookDiffs /> }]);
  return routes;
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;