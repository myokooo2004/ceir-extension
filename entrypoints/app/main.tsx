import React from 'react';
import ReactDOM from 'react-dom/client';
import CeirApp from './CeirApp';

export function renderCeirApp(container: HTMLElement) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <CeirApp />
    </React.StrictMode>
  );
  return {
    unmount: () => root.unmount()
  };
}
