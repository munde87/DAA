import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-card">
            <div className="error-boundary-icon">
              <AlertTriangle size={36} className="text-red" />
            </div>
            <h2 className="error-boundary-title">Something went wrong</h2>
            <p className="error-boundary-desc">
              An unexpected error occurred while rendering the visualization.
            </p>
            {this.state.error && (
              <pre className="error-boundary-details">
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <button
              type="button"
              className="btn-primary"
              onClick={this.handleReload}
              style={{ marginTop: '1rem' }}
            >
              <RotateCcw size={16} />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
