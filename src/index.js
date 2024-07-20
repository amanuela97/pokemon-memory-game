import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { GameContextProvider } from "./utils/state";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Menu from "./components/menu/Menu";
import Game from "./components/game";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Menu />,
  },
  {
    path: "/game",
    element: <Game />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GameContextProvider>
      <div className="app">
        <RouterProvider router={router} />
      </div>
    </GameContextProvider>
  </React.StrictMode>
);
