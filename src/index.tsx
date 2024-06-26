import React from "react";
import ReactDOM from "react-dom";
import TodoApp from "./app";
import reportWebVitals from "./reportWebVitals";
import "./app.css";

ReactDOM.render(
  <React.StrictMode>
    <TodoApp />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
