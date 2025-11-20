import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTodo, setNewTodo] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/todos");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      setAdding(true);
      await fetch("http://localhost:8080/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo, completed: false }),
      });

      setNewTodo("");
      loadTodos();
    } catch (err) {
      alert("Error adding todo: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  const toggleCompleted = async (todo) => {
    try {
      await fetch(`http://localhost:8080/api/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...todo,
          completed: !todo.completed,
        }),
      });
      loadTodos();
    } catch (err) {
      alert("Error updating todo: " + err.message);
    }
  };
  
  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/todos/${id}`, {
        method: 'DELETE'
      });
      loadTodos();
    } catch (err) {
      alert('Error deleting todo: ' + err.message);
    }
  };

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-3">Todo List</h1>

      <form className="mb-4" onSubmit={addTodo}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Add new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button className="btn btn-primary" disabled={adding}>
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </form>

      <ul className="list-group">
        {todos.map((t) => (
          <li
            key={t.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="form-check">
              <input
                className="form-check-input"
                checked={t.completed}
                type="checkbox"
                onChange={() => toggleCompleted(t)}
              />
              <label className="form-check-label ms-2">{t.title}</label>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteTodo(t.id)}
            >Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
