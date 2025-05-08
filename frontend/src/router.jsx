import { createBrowserRouter } from "react-router";
import App from "./App";
import MainPage from "./pages/MainPage";
import NotFound from "./pages/NotFound";
import BulbPage from "./pages/BulbPage";
import CartPage from "./pages/CartPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "/bulb/*", element: <BulbPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;