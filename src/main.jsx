import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

// Clerk ki Key jo aapne nikali thi
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Bhai! Aapne .env.local file mein apni Clerk Key nahi dali. Pehle wo check karein.")
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ClerkProvider puri website ko login feature dega */}
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)