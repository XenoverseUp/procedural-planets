import "@/index.css";
import App from "@/routes/index";
import Showcase from "@/routes/showcase";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/showcase",
    Component: Showcase,
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider {...{ router }} />,
);
