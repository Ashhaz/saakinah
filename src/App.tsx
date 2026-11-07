import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { ProgressProvider } from './journey/progress';
import Layout from './components/Layout';
import Home from './pages/Home';
import TopicPage from './pages/TopicPage';
import PrayerTimesPage from './pages/PrayerTimes';
import { AboutPage, DuasPage, NotFound, ReferencesPage } from './pages/Simple';
import DhikrPage from './pages/Dhikr';
import JourneyPage from './journey/JourneyPage';
import LessonPage from './journey/LessonPage';

export default function App() {
  return (
    <AppProvider>
      <ProgressProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="topic/:slug" element={<TopicPage />} />
              <Route path="journey" element={<JourneyPage />} />
              <Route path="journey/:id" element={<LessonPage />} />
              <Route path="dhikr" element={<DhikrPage />} />
              <Route path="prayer-times" element={<PrayerTimesPage />} />
              <Route path="duas" element={<DuasPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="references" element={<ReferencesPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HashRouter>
      </ProgressProvider>
    </AppProvider>
  );
}
