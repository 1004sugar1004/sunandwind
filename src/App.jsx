import { useState } from 'react';
import Home from './pages/Home';
import Vocabulary from './pages/Vocabulary';
import DiceGame from './pages/DiceGame';
import SentenceBuilder from './pages/SentenceBuilder';

export default function App() {
  const [page, setPage] = useState('home');
  return (
    <div className="app-root">
      {page === 'home'       && <Home onNavigate={setPage} />}
      {page === 'vocabulary' && <Vocabulary onNavigate={setPage} />}
      {page === 'game'       && <DiceGame onNavigate={setPage} />}
      {page === 'sentence'   && <SentenceBuilder onNavigate={setPage} />}
    </div>
  );
}
