import React from 'react';
import ReactDOM from 'react-dom/client';
import "./App.scss"
import App from './App';
import { SWRConfig } from 'swr';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const fetcher = (url:string) => fetch(url).then((res) => res.json());


root.render(
  <React.StrictMode>
    <SWRConfig value={{
      fetcher,
      dedupingInterval:3600000,
      }}>
      <App />
    </SWRConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
