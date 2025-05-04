import { createBrowserRouter } from "react-router";
import App from "./App";
import MainPage from "./pages/MainPage";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;