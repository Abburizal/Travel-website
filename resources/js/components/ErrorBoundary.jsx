import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('❌ ErrorBoundary caught error:', error);
        console.error('❌ Error info:', errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">💔</div>
                            <h1 className="text-2xl font-bold text-red-600 mb-2">
                                Something went wrong
                            </h1>
                            <p className="text-gray-600">
                                The application encountered an error. Please refresh the page.
                            </p>
                        </div>
                        
                        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                            <p className="font-mono text-sm text-red-800">
                                {this.state.error && this.state.error.toString()}
                            </p>
                        </div>
                        
                        {this.state.errorInfo && (
                            <details className="mb-4">
                                <summary className="cursor-pointer text-blue-600 hover:underline">
                                    Show error details
                                </summary>
                                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                        
                        <div className="flex gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                            >
                                Refresh Page
                            </button>
                            <a
                                href="/"
                                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded hover:bg-gray-300 text-center"
                            >
                                Go to Home
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
