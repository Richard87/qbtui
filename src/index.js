import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';
import './index.css'
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <SnackbarProvider maxSnack="3">
    <React.StrictMode>
        <App />
    </React.StrictMode>
  </SnackbarProvider>,
  document.getElementById('root')
);