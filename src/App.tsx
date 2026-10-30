import React from 'react';
import PublicLayout from './components/PublicLayout';
import Home from './pages/public/Home';

export default function App() {
  return (
    <PublicLayout>
      <Home />
    </PublicLayout>
  );
}
