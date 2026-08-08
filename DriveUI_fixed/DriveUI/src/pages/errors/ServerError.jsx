import { ServerCrash } from 'lucide-react';
import ErrorShell from './ErrorShell.jsx';

export default function ServerError() {
  return (
    <ErrorShell
      code="500"
      icon={ServerCrash}
      title="Something broke on our end"
      description="Our servers hit a snag. Try again in a moment — your files are safe."
    />
  );
}
