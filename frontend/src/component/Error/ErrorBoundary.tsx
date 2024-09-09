import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

const ErrorFallback: React.FC<{
  error: Error;
  resetErrorBoundary: () => void;
}> = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    //-- Navigate to the error page when an error is caught
    navigate("/error");
  }, [navigate]);

  return (
    <div>
      {/* Optionally render some UI for the error fallback */}
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
