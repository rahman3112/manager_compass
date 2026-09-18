import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  label: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Keeps a crash in one view from blanking the whole app — every top-level view
 * is mounted at once (only hidden via CSS when inactive), so without this a
 * render error anywhere would take down every tab, not just the broken one.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error(`Manager Compass: error in ${this.props.label}`, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card empty-tasks">
          Something went wrong loading {this.props.label}. Try refreshing the page.
        </div>
      );
    }

    return this.props.children;
  }
}
