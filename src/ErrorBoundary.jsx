import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: 'var(--danger, #9e4f44)', background: 'var(--surface, #f7f3ee)', minHeight: '100vh', fontFamily: 'var(--font, sans-serif)' }}>
          <h2>Diçka shkoi keq (Kthim gabimi nga React).</h2>
          <pre style={{ background: 'white', padding: 20, borderRadius: 6, overflowX: 'auto' }}>
            {this.state.error?.toString()}
          </pre>
          <details style={{ marginTop: 20 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Shiko detajet e komponentit</summary>
            <pre style={{ background: 'white', padding: 20, borderRadius: 6, marginTop: 10, overflowX: 'auto', fontSize: 12 }}>
              {this.state.info?.componentStack}
            </pre>
          </details>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }} 
            style={{ marginTop: 20, padding: '11px 20px', background: 'var(--danger, #9e4f44)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
          >
            Pastro të dhënat dhe kthehu në fillim
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
