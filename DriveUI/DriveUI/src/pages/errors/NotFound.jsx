import { FileQuestion } from "lucide-react";
import ErrorShell from "./ErrorShell.jsx";

export default function NotFound() {
  return (
    <ErrorShell
      code="404"
      icon={FileQuestion}
      title="Page Not Found"
      description="The page you're looking for doesn't exist or may have been moved."
      buttonText="Go to Dashboard"
      buttonLink="/"
    />
  );
}