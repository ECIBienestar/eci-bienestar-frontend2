import WebSocketClient from './components/WebSocketClient';
import NotificationPermission from './components/NotificationPermission';


function App() {
  return (
    <div>
      <NotificationPermission />
      <WebSocketClient />
    </div>
  );
}

export default App; 