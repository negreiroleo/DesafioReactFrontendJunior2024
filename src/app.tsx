import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";

interface Todo {
  id: string;
  title: string;
  isDone: boolean;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [toggleAll, setToggleAll] = useState<boolean>(false);

  useEffect(() => {
    fetch("https://my-json-server.typicode.com/EnkiGroup/DesafioReactFrontendJunior2024/todos")
      .then(response => response.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTodo.trim() !== "") {
      const newTask: Todo = {
        id: Math.random().toString(36).substr(2, 9),
        title: newTodo,
        isDone: false,
      };
      setTodos([newTask, ...todos]);
      setNewTodo("");
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.isDone;
    if (filter === "completed") return todo.isDone;
    return true;
  });

  const handleToggleAll = () => {
    const newToggleAll = !toggleAll;
    setToggleAll(newToggleAll);
    setTodos(todos.map(todo => ({ ...todo, isDone: newToggleAll })));
  };

  return (
    <Router>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={addTodo}
            autoFocus
          />
        </header>
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={toggleAll}
            onChange={handleToggleAll}
          />
          <label htmlFor="toggle-all" />
          <ul className="todo-list">
            {filteredTodos.map(todo => (
              <li key={todo.id} className={todo.isDone ? "completed" : ""}>
                <div className="view">
                  <input className="toggle" type="checkbox" checked={todo.isDone} onChange={() => {
                    setTodos(todos.map(t => t.id === todo.id ? { ...t, isDone: !t.isDone } : t));
                  }} />
                  <label>{todo.title}</label>
                  <button className="destroy" onClick={() => {
                    setTodos(todos.filter(t => t.id !== todo.id));
                  }}></button>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <footer className="footer">
          <span className="todo-count">
            <strong>{todos.filter(todo => !todo.isDone).length}</strong> items left
          </span>
          <ul className="filters">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? "selected" : ""} onClick={() => setFilter("all")}>All</NavLink>
            </li>
            <li>
              <NavLink to="/active" className={({ isActive }) => isActive ? "selected" : ""} onClick={() => setFilter("active")}>Active</NavLink>
            </li>
            <li>
              <NavLink to="/completed" className={({ isActive }) => isActive ? "selected" : ""} onClick={() => setFilter("completed")}>Completed</NavLink>
            </li>
          </ul>
          <button className="clear-completed" onClick={() => {
            setTodos(todos.filter(todo => !todo.isDone));
          }}>
            Clear completed
          </button>
        </footer>
      </section>
      <Routes>
        <Route path="/" element={<div />} />
        <Route path="/active" element={<div />} />
        <Route path="/completed" element={<div />} />
      </Routes>
    </Router>
  );
}
