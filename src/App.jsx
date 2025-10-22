import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import TermsAndConditions from "./pages/TermsAndConditions";
import Layout from "./pages/Layout/Layout";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DeleteAuth from "./pages/DeleteRequest/DeleteAuth";
import EmployeeProfileWebView from "./pages/EmployeeProfileWebView/EmployeeProfileWebView";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function App() {
  const { i18n } = useTranslation();
  const queryClient = new QueryClient();
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
        {
          path: "/delete-request",
          element: <DeleteAuth />,
        },
        {
          path: "/:id",
          element: <EmployeeProfileWebView />,
        },
      ],
    },
  ]);

  useEffect(() => {
    const updateDirections = () => {
      document.documentElement.setAttribute("dir", i18n.dir());
      document.documentElement.setAttribute("lang", i18n.language);
    };
    updateDirections();

    i18n.on("languageChanged", updateDirections);

    return () => {
      i18n.off("languageChanged", updateDirections);
    };
  }, [i18n]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
