import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Rail, type ViewName } from './components/Rail';
import { Topbar } from './components/Topbar';
import { HomeView } from './components/HomeView';
import { CompassView } from './components/CompassView';
import { TasksView } from './components/TasksView';
import { ResourcesView } from './components/ResourcesView';
import { HowItWorksView } from './components/HowItWorksView';
import { Toast } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem('mc-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
  } catch {
    // localStorage/matchMedia unavailable — fall back to light
  }
  return 'light';
}

function App() {
  const [currentView, setCurrentView] = useState<ViewName>('home');
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('mc-theme', theme);
    } catch {
      // ignore storage errors (private browsing, etc.)
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }
  const [prefillToken, setPrefillToken] = useState(0);
  const [prefillText, setPrefillText] = useState('');
  const [categoryToken, setCategoryToken] = useState(0);
  const [prefillCategoryId, setPrefillCategoryId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function navigate(view: ViewName) {
    setCurrentView(view);
  }

  function goToCompassWithText(text: string) {
    setPrefillText(text);
    setPrefillToken((token) => token + 1);
    setCurrentView('compass');
  }

  function goToCompassWithCategory(categoryId: string) {
    setPrefillCategoryId(categoryId);
    setCategoryToken((token) => token + 1);
    setCurrentView('compass');
  }

  function showToast(message: string) {
    setToastMessage(message);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3200);
  }

  return (
    <div className="app-shell">
      <Rail currentView={currentView} onNavigate={navigate} />

      <main className="main">
        <Topbar
          onViewUserGuide={() => navigate('help')}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <ErrorBoundary label="Home">
          <HomeView
            active={currentView === 'home'}
            onGoToCompass={goToCompassWithText}
            onGoToCompassWithCategory={goToCompassWithCategory}
            onNavigate={navigate}
            onShowToast={showToast}
          />
        </ErrorBoundary>
        <ErrorBoundary label="Compass">
          <CompassView
            active={currentView === 'compass'}
            prefillToken={prefillToken}
            prefillText={prefillText}
            categoryToken={categoryToken}
            prefillCategoryId={prefillCategoryId}
            onNavigateHome={() => navigate('home')}
          />
        </ErrorBoundary>
        <ErrorBoundary label="Plans">
          <TasksView active={currentView === 'tasks'} onNavigateHome={() => navigate('home')} />
        </ErrorBoundary>
        <ErrorBoundary label="Resources">
          <ResourcesView active={currentView === 'resources'} onNavigateHome={() => navigate('home')} />
        </ErrorBoundary>
        <ErrorBoundary label="How it works">
          <HowItWorksView active={currentView === 'help'} onNavigateHome={() => navigate('home')} />
        </ErrorBoundary>
      </main>

      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
}

export default App;
