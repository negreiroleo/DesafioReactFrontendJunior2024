import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import "./app.css";

interface Todo {
  id: string;
  title: string;
  isDone: boolean;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [editingTodo, setEditingTodo] = useState<string>("");

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

  const editTodo = (id: string, title: string) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, title } : todo)));
    setEditingTodo("");
  };

  const renderTodos = (filter: string) => {
    const filteredTodos = todos.filter(todo => {
      if (filter === "active") return !todo.isDone;
      if (filter === "completed") return todo.isDone;
      return true;
    });

    return filteredTodos.map(todo => (
      <li key={todo.id} className={todo.isDone ? "completed" : ""}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.isDone}
            onChange={() => {
              setTodos(todos.map(t => t.id === todo.id ? { ...t, isDone: !t.isDone } : t));
            }}
          />
          {editingTodo === todo.id ? (
            <input
              className="edit"
              value={todo.title}
              onBlur={(e) => editTodo(todo.id, e.target.value)}
              onChange={(e) => {
                const updatedTitle = e.target.value;
                setTodos(todos.map(t => t.id === todo.id ? { ...t, title: updatedTitle } : t));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editTodo(todo.id, e.currentTarget.value);
                }
              }}
            />
          ) : (
            <label onDoubleClick={() => setEditingTodo(todo.id)}>
              {todo.title}
            </label>
          )}
          <button
            className="destroy"
            onClick={() => {
              setTodos(todos.filter(t => t.id !== todo.id));
            }}
          ></button>
        </div>
      </li>
    ));
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
            onChange={(e) => {
              const { checked } = e.target;
              setTodos(todos.map(todo => ({ ...todo, isDone: checked })));
            }}
            checked={todos.length > 0 && todos.every(todo => todo.isDone)}
          />
          <ul className="todo-list">
            <Routes>
              <Route path="/active" element={<>{renderTodos("active")}</>} />
              <Route path="/completed" element={<>{renderTodos("completed")}</>} />
              <Route path="/" element={<>{renderTodos("all")}</>} />
            </Routes>
          </ul>
        </section>
        <footer className="footer">
          <span className="todo-count">
            <strong>{todos.filter(todo => !todo.isDone).length}</strong> items left
          </span>
          <ul className="filters">
            <li>
              <NavLink end to="/" className={({ isActive }) => isActive ? "selected" : undefined}>All</NavLink>
            </li>
            <li>
              <NavLink to="/active" className={({ isActive }) => isActive ? "selected" : undefined}>Active</NavLink>
            </li>
            <li>
              <NavLink to="/completed" className={({ isActive }) => isActive ? "selected" : undefined}>Completed</NavLink>
            </li>
          </ul>
          <button
            className="clear-completed"
            onClick={() => {
              setTodos(todos.filter(todo => !todo.isDone));
            }}
          >
            Clear completed
          </button>
        </footer>
      </section>
    </Router>
  );
};

export default TodoApp;
