import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/todos')
      .then((res) => {
        if (!res.ok) throw new Error('Something went wrong!');
        return res.json();
      })
      .then((data) => setTodos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []); 

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  console.log("Todos:", todos);

  return (
  <div className="container mt-4">
    <h1 className="mb-3">Todo List</h1>

    <ul className="list-group">
      {todos.map((t) => (
        <li 
          key={t.id} 
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          {t.title}
          <span>{t.completed ? "✅" : "⬜"}</span>
        </li>
      ))}
    </ul>
  </div>
);
}

export default App
