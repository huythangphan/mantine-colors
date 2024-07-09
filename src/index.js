import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// styles
import '@mantine/core/styles.css'


const Providers = ({ children }) => (
  <MantineProvider>
   {children}
  </MantineProvider>
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Providers>
      <ColorSchemeScript />

      <App />
    </Providers>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
