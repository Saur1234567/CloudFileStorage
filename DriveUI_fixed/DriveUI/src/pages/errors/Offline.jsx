import { WifiOff } from 'lucide-react';
import ErrorShell from './ErrorShell.jsx';

export default function Offline() {
  return (
    <ErrorShell
      code="OFFLINE"
      icon={WifiOff}
      title="You're offline"
      description="Check your internet connection. DriveX will reconnect automatically once you're back online."
    />
  );
}