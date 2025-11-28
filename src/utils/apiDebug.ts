// Add this to main.tsx or create a separate debug utility
// This helps identify API connectivity issues

export function setupAPIDebug() {
  // Log all API calls
  const originalFetch = window.fetch;
  
  window.fetch = function(...args) {
    const [resource, config] = args;
    const method = (config?.method || 'GET').toUpperCase();
    
    console.log(`🌐 API Request: ${method} ${resource}`);
    
    return originalFetch.apply(this, args)
      .then(response => {
        console.log(`✅ Response: ${response.status} ${response.statusText}`);
        return response;
      })
      .catch(error => {
        console.error(`❌ Fetch Error: ${error.message}`);
        console.error('  URL:', resource);
        console.error('  Config:', config);
        throw error;
      });
  };
}

// In your App component:
// useEffect(() => {
//   setupAPIDebug();
// }, []);

// This will show all network requests in console for debugging
