import 'core-js/stable'
import { QueryClient, QueryClientProvider } from 'react-query'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const queryClient = new QueryClient()
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
