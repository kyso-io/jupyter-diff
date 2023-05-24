import { RouterProvider, createBrowserRouter, useRoutes } from 'react-router-dom';
import JupyterNotebookDiffs from './components/JupyterNotebookDiffs';
import React from 'react';

const router = createBrowserRouter([{ path: '/kyjupdiff', element: <JupyterNotebookDiffs /> }]);

const AppWrapper = () => {
  return (
    <>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </>
  );
};

export default AppWrapper;
