import { RouterProvider, createBrowserRouter, useRoutes } from 'react-router-dom';
import JupyterNotebookDiffs from './components/JupyterNotebookDiffs';
import React from 'react';

const router = createBrowserRouter([{ path: '/kyjupdiff', element: <JupyterNotebookDiffs /> }]);

const AppWrapper = () => {
  return (
    <>
      <h1>hola</h1>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </>
  );
};

export default AppWrapper;
