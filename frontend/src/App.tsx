import { useRef, useState } from 'react';
import './App.css';
import { Rail, type ViewName } from './components/Rail';
import { Topbar } from './components/Topbar';
import { HomeView } from './components/HomeView';
import { CompassView } from './components/CompassView';
import { InsightsView } from './components/InsightsView';
import { ResourcesView } from './components/ResourcesView';
import { Toast } from './components/Toast';

function App() {
  const [currentView, setCurrentView] = useState<ViewName>('home');
  const [prefillToken, setPrefillToken] = useState(0);
  const [prefillText, setPrefillText] = useState('');
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
        <Topbar onHelp={() => showToast('Prototype note: complex, sensitive, or uncertain questions should route to HR.')} />

        <HomeView
          active={currentView === 'home'}
          onGoToCompass={goToCompassWithText}
          onNavigate={navigate}
          onShowToast={showToast}
        />
        <CompassView
          active={currentView === 'compass'}
          prefillToken={prefillToken}
          prefillText={prefillText}
          onNavigateHome={() => navigate('home')}
        />
        <InsightsView active={currentView === 'insights'} onNavigateHome={() => navigate('home')} />
        <ResourcesView active={currentView === 'resources'} onNavigateHome={() => navigate('home')} />
      </main>

      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
}

export default App;
