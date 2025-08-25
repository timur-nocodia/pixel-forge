import React from 'react';
import { AppProvider } from './context/AppContext';
import TelegramApp from './components/TelegramApp';

function App() {
  return (
    <AppProvider>
      <TelegramApp />
    </AppProvider>
  );
}

export default App;