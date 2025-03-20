import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./components/Homepage";
import PaymentPage from "./components/PaymentPage";
import SuccessPage from "./components/SuccessPage";
import FailurePage from "./components/FailurePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/payment",
    element: <PaymentPage />,
  },
  {
    path: "/success",
    element: <SuccessPage></SuccessPage>,
  },
  {
    path: "/failure",
    element: <FailurePage></FailurePage>,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
