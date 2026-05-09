import { Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import AdminGate from './components/AdminGate';
import HomePage from './pages/HomePage';
import CreatePost from './pages/CreatePost';
import PostView from './pages/PostView';
import DraftsPage from './pages/DraftsPage';
import JourneyPage from './pages/JourneyPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <div className="max-w-lg mx-auto min-h-screen bg-off-white relative">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<AdminGate><CreatePost /></AdminGate>} />
        <Route path="/edit/:id" element={<AdminGate><CreatePost /></AdminGate>} />
        <Route path="/post/:id" element={<PostView />} />
        <Route path="/drafts" element={<AdminGate><DraftsPage /></AdminGate>} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
