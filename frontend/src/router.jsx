import { createBrowserRouter } from "react-router";
import App from "./App";
import MainPage from "./MainPage";
import NotFound from "./NotFound";
import BulbPage from "./BulbPage";
import CartPage from "./CartPage";
import InfoPage from "./InfoPage";
import AdminPage from "./AdminPage";
import AdminProductsPage from "./AdminProductsPage";
import AdminProductPage from "./AdminProductPage";
import AdminProductAddPage from "./AdminProductAddPage";
import AdminOrdersPage from "./AdminOrdersPage";
import AdminOrderDetailPage from "./AdminOrderDetailPage";
import AuthPage from "./AuthPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "/bulb/:id", element: <BulbPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "info", element: <InfoPage />},
      { path: "/admin", element: <AdminPage />},
      { path: "/admin/product", element: <AdminProductsPage />},
      { path: "/admin/product/add", element: <AdminProductAddPage />},
      { path: "/admin/product/:id", element: <AdminProductPage />},
      { path: "/admin/orders", element: <AdminOrdersPage />},
      { path: "/admin/orders/:id", element: <AdminOrderDetailPage />},
      { path: "/auth", element: <AuthPage />},
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;