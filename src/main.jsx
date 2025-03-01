import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./Pages/Home";
import { AuthLayout } from "./Components";
import Editpost from "./Pages/Editpost";
import Addpost from "./Pages/Addpost";
import Allposts from "./Pages/Allposts";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Post from "./Pages/Post"
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "./",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/all-posts",
        element: (
          <AuthLayout authentication>
            {" "}
            <Allposts />
          </AuthLayout>
        ),
      },
      {
        path: "/add-post",
        element: (
          <AuthLayout authentication>
            {" "}
            <Addpost />
          </AuthLayout>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <AuthLayout authentication>
            {" "}
            <Editpost />
          </AuthLayout>
        ),
      },
      {
        path: "/post/:slug",
        element: <Post />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>``
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);
