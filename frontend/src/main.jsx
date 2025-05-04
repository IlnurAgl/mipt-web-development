import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from './components/ui/provider'
import router from "./router";
import { RouterProvider } from "react-router";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)