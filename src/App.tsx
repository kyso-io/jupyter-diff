import { BrowserRouter, useRoutes } from 'react-router-dom';
import JupyterNotebookDiffs from './components/JupyterNotebookDiffs';

const App = () => {
  const routes = useRoutes([{ path: '/', element: <JupyterNotebookDiffs /> }]);
  return routes;
};

const AppWrapper = () => {
  return (
    <BrowserRouter basename="{process.env.PUBLIC_URL}">
      <h1>hola</h1>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;
