import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import TermsAndConditions from "./pages/TermsAndConditions";
import Layout from "./pages/Layout/Layout";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Navigate to="/terms-conditions" replace />,
        },
        {
          path: "/terms-conditions",
          element: <TermsAndConditions />,
        },
        {
          path: "/privacy-policy",
          element: <PrivacyPolicy />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
