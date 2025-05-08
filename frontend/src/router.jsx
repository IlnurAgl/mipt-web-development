import { createBrowserRouter } from "react-router";
import App from "./App";
import MainPage from "./pages/MainPage";
import NotFound from "./pages/NotFound";
import BulbPage from "./pages/BulbPage";
import CartPage from "./pages/CartPage";
import InfoPage from "./pages/InfoPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "/bulb/*", element: <BulbPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/cart/:id", element: <CartPage />},
      { path: "info", element: <InfoPage />},
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;