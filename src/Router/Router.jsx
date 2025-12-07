import { createBrowserRouter } from "react-router";
import HomeLayout from "../Layouts/HomeLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout></HomeLayout>,
  },
]);