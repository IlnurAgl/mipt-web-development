import { createBrowserRouter } from "react-router";
import App from "./App";
import MainPage from "./MainPage";
import NotFound from "./NotFound";
import BulbPage from "./BulbPage";
import CartPage from "./CartPage";
import InfoPage from "./InfoPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "/bulb/:id", element: <BulbPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "info", element: <InfoPage />},
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;