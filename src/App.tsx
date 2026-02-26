import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { Home } from './pages/Home';
import { Sandbox } from './pages/Sandbox';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sandbox" element={<Sandbox />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
