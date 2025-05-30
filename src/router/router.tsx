import {createBrowserRouter} from "react-router-dom";
import Layout from "@/components/layout/layout.tsx";
import Home from "@/pages/home/home.tsx";
import Analysis from "@/pages/analysis/analysis.tsx";

const routes = [
  {
    path: "/",
    element: <Layout/>,
    children: [
      /* Home */
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/app",
        element: <Home />,
      },
      /* Analysis */
      {
        path: "/analysis/:projectUuid",
        element: <Analysis />,
      }
    ],
  },
];


const router = createBrowserRouter(routes, {
  basename: '/',
});

export default router;