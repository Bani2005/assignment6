import { useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Complete React Assignment",
    description: "Build the Task Manager application with React Router.",
    priority: "High",
    category: "Academic",
    raisedAt: "18 Sep 2026, 09:00 AM",
    dueDate: "28 Aug 2026",
    status: "Pending",
  },
  {
    id: 2,
    title: "Buy groceries",
    description: "Purchase vegetables, fruits and other household items.",
    priority: "Medium",
    category: "Personal",
    raisedAt: "17 Sep 2026, 06:30 PM",
    dueDate: "20 Sep 2026",
    status: "Raised",
  },
  {
    id: 3,
    title: "Read JavaScript Notes",
    description: "Revise important JavaScript concepts and examples.",
    priority: "Low",
    category: "Academic",
    raisedAt: "16 Sep 2026, 08:15 PM",
    dueDate: "22 Sep 2026",
    status: "Closed",
  },
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = (task) => {
    setTasks((prev) => [
      ...prev,
      {
        ...task,
        id: Date.now(),
        raisedAt: new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "Raised",
      },
    ]);
  };

  const updateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const completeTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, status: "Closed" }
          : task
      )
    );
  };

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/dashboard"
          element={<Layout tasks={tasks} />}
        >
          <Route
            index
            element={<Dashboard tasks={tasks} />}
          />

          <Route
            path="tasks"
            element={
              <Tasks
                tasks={tasks}
                deleteTask={deleteTask}
                completeTask={completeTask}
              />
            }
          />

          <Route
            path="add-task"
            element={<AddTask addTask={addTask} />}
          />

          <Route
            path="tasks/:taskId"
            element={
              <TaskDetails
                tasks={tasks}
                updateTask={updateTask}
                deleteTask={deleteTask}
                completeTask={completeTask}
              />
            }
          />

          <Route
            path="completed"
            element={<CompletedTasks tasks={tasks} />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </div>
  );
}

/* ================= LAYOUT ================= */

import { Outlet } from "react-router-dom";

function Layout({ tasks }) {
  const pending = tasks.filter(
    (task) => task.status !== "Closed"
  ).length;

  const completed = tasks.filter(
    (task) => task.status === "Closed"
  ).length;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✓</div>

          <div>
            <h2>TaskFlow</h2>
            <span>Task Manager</span>
          </div>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">MAIN MENU</p>

          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>▦</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/dashboard/tasks"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>☷</span>
            All Tasks
            <b>{pending}</b>
          </NavLink>

          <NavLink
            to="/dashboard/add-task"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>＋</span>
            Add Task
          </NavLink>

          <NavLink
            to="/dashboard/completed"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>✓</span>
            Completed
            <b>{completed}</b>
          </NavLink>
        </div>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">B</div>

            <div>
              <strong>My Workspace</strong>
              <span>Personal Account</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="topbar-date">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h1>Good morning! 👋</h1>
          </div>

          <div className="topbar-right">
            <button className="notification">♢</button>

            <div className="user-mini">
              <div className="avatar small">B</div>
              <span>My Account</span>
            </div>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

/* ================= DASHBOARD ================= */

function Dashboard({ tasks }) {
  const navigate = useNavigate();

  const total = tasks.length;
  const pending = tasks.filter(
    (task) => task.status === "Pending"
  ).length;
  const raised = tasks.filter(
    (task) => task.status === "Raised"
  ).length;
  const completed = tasks.filter(
    (task) => task.status === "Closed"
  ).length;

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h2>Dashboard</h2>
          <p>Keep track of your work and stay organised.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/dashboard/add-task")}
        >
          + Add New Task
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Tasks"
          value={total}
          icon="▦"
          text="All your tasks"
        />

        <StatCard
          title="Pending"
          value={pending}
          icon="◷"
          text="Needs attention"
        />

        <StatCard
          title="Raised"
          value={raised}
          icon="↗"
          text="Recently created"
        />

        <StatCard
          title="Completed"
          value={completed}
          icon="✓"
          text="Successfully done"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">RECENT ACTIVITY</span>
              <h3>Recent Tasks</h3>
            </div>

            <button
              className="text-btn"
              onClick={() => navigate("/dashboard/tasks")}
            >
              View all →
            </button>
          </div>

          <div className="recent-list">
            {tasks.slice(0, 4).map((task) => (
              <TaskRow
                key={task.id}
                task={task}
              />
            ))}
          </div>
        </section>

        <section className="panel progress-panel">
          <span className="eyebrow">PROGRESS</span>
          <h3>Task Completion</h3>

          <div className="progress-circle">
            <strong>
              {total
                ? Math.round((completed / total) * 100)
                : 0}
              %
            </strong>
            <span>Completed</span>
          </div>

          <p>
            {completed} of {total} tasks completed
          </p>
        </section>
      </div>
    </>
  );
}

function StatCard({ title, value, icon, text }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>
        <span>{text}</span>
      </div>

      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  );
}

/* ================= TASKS ================= */

function Tasks({ tasks, deleteTask, completeTask }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((task) => task.status === filter);

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">TASK MANAGEMENT</span>
          <h2>All Tasks</h2>
          <p>View, manage and organise all your tasks.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/dashboard/add-task")}
        >
          + Add New Task
        </button>
      </div>

      <div className="filter-bar">
        {["All", "Raised", "Pending", "Closed"].map(
          (item) => (
            <button
              key={item}
              className={
                filter === item
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          )
        )}
      </div>

      <section className="task-table panel">
        <div className="table-header">
          <span>Task</span>
          <span>Category</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Due Date</span>
          <span>Action</span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="no-tasks">
            No tasks found.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div className="table-row" key={task.id}>
              <div className="task-title-cell">
                <div className="task-check">
                  {task.status === "Closed" ? "✓" : "○"}
                </div>

                <div>
                  <strong>{task.title}</strong>
                  <span>{task.description}</span>
                </div>
              </div>

              <span className="category-tag">
                {task.category}
              </span>

              <span
                className={`priority ${task.priority.toLowerCase()}`}
              >
                {task.priority}
              </span>

              <span
                className={`status ${task.status.toLowerCase()}`}
              >
                {task.status}
              </span>

              <span className="due-date">
                {task.dueDate}
              </span>

              <div className="action-buttons">
                <button
                  onClick={() =>
                    navigate(`/dashboard/tasks/${task.id}`)
                  }
                  title="View"
                >
                  →
                </button>

                {task.status !== "Closed" && (
                  <button
                    onClick={() => completeTask(task.id)}
                    title="Complete"
                  >
                    ✓
                  </button>
                )}

                <button
                  onClick={() => deleteTask(task.id)}
                  title="Delete"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}

/* ================= ADD TASK ================= */

function AddTask({ addTask }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Academic",
    dueDate: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    addTask(form);
    navigate("/dashboard/tasks");
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">CREATE</span>
          <h2>Add New Task</h2>
          <p>Create a new task and keep your work organised.</p>
        </div>
      </div>

      <section className="form-panel panel">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full">
              <label>Task Header</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter task title"
              />
            </div>

            <div className="form-group full">
              <label>Task Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your task..."
                rows="5"
              />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option>Academic</option>
                <option>Personal</option>
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/dashboard/tasks")}
            >
              Cancel
            </button>

            <button type="submit" className="primary-btn">
              Create Task →
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

/* ================= TASK DETAILS ================= */

function TaskDetails({
  tasks,
  updateTask,
  deleteTask,
  completeTask,
}) {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const task = tasks.find(
    (item) => item.id.toString() === taskId
  );

  if (!task) {
    return (
      <div className="not-found panel">
        <h2>Task not found</h2>
        <p>The task you are looking for does not exist.</p>

        <button
          className="primary-btn"
          onClick={() => navigate("/dashboard/tasks")}
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  const handlePriorityChange = (e) => {
    updateTask({
      ...task,
      priority: e.target.value,
    });
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">TASK DETAILS</span>
          <h2>{task.title}</h2>
          <p>View and manage the selected task.</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => navigate("/dashboard/tasks")}
        >
          ← Back to Tasks
        </button>
      </div>

      <section className="details-grid">
        <div className="details-main panel">
          <div className="detail-status-row">
            <span className={`status ${task.status.toLowerCase()}`}>
              {task.status}
            </span>

            <span
              className={`priority ${task.priority.toLowerCase()}`}
            >
              {task.priority} Priority
            </span>
          </div>

          <h3>{task.title}</h3>

          <p className="detail-description">
            {task.description || "No description added."}
          </p>

          <div className="detail-info">
            <div>
              <span>Category</span>
              <strong>{task.category}</strong>
            </div>

            <div>
              <span>Raised Date & Time</span>
              <strong>{task.raisedAt}</strong>
            </div>

            <div>
              <span>Due Date</span>
              <strong>{task.dueDate || "Not set"}</strong>
            </div>
          </div>
        </div>

        <div className="details-side panel">
          <h3>Manage Task</h3>

          <label>Change Priority</label>

          <select
            value={task.priority}
            onChange={handlePriorityChange}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          {task.status !== "Closed" && (
            <button
              className="primary-btn full-btn"
              onClick={() => completeTask(task.id)}
            >
              ✓ Mark as Completed
            </button>
          )}

          <button
            className="danger-btn full-btn"
            onClick={() => {
              deleteTask(task.id);
              navigate("/dashboard/tasks");
            }}
          >
            Delete Task
          </button>
        </div>
      </section>
    </>
  );
}

/* ================= COMPLETED ================= */

function CompletedTasks({ tasks }) {
  const completed = tasks.filter(
    (task) => task.status === "Closed"
  );

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">COMPLETED</span>
          <h2>Completed Tasks</h2>
          <p>A record of everything you have finished.</p>
        </div>
      </div>

      <section className="panel completed-panel">
        {completed.length === 0 ? (
          <div className="no-tasks">
            No completed tasks yet.
          </div>
        ) : (
          completed.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
            />
          ))
        )}
      </section>
    </>
  );
}

/* ================= TASK ROW ================= */

function TaskRow({ task }) {
  const navigate = useNavigate();

  return (
    <div
      className="task-row"
      onClick={() =>
        navigate(`/dashboard/tasks/${task.id}`)
      }
    >
      <div className="task-check">
        {task.status === "Closed" ? "✓" : "○"}
      </div>

      <div className="task-row-info">
        <strong>{task.title}</strong>
        <span>{task.category}</span>
      </div>

      <span
        className={`priority ${task.priority.toLowerCase()}`}
      >
        {task.priority}
      </span>

      <span
        className={`status ${task.status.toLowerCase()}`}
      >
        {task.status}
      </span>

      <span className="arrow">→</span>
    </div>
  );
}

export default App;