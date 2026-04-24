// ================= PAGE SWITCH =================
function showPage(page) {
  const pages = ["dashboard", "tasks", "create", "logs", "profile"];

  pages.forEach(p => {
    const el = document.getElementById(p + "Page");
    if (el) el.style.display = "none";
  });

  document.getElementById(page + "Page").style.display = "block";

  if (page === "tasks") loadTasks();
  if (page === "logs") loadLogs();
  if (page === "dashboard") loadTasks();
  if (page === "profile") loadProfile();
}

// ================= LOGIN (FIXED ERROR) =================
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "./dashboard.html";
  } else {
    alert("Login failed");
  }
}

// ================= ADD TASK =================
async function addTask() {
  const token = localStorage.getItem("token");

  await fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      title: title.value,
      description: desc.value,
      assigned_to: 1,
      status: "todo"
    })
  });

  loadTasks();
}

// ================= SAFE TOKEN DECODE =================
function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    console.log("Invalid token");
    return null;
  }
}

// ================= LOAD TASKS (RBAC + TENANT SAFE) =================
async function loadTasks() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const user = decodeToken(token);
  if (!user) return;

  const res = await fetch("http://localhost:3000/tasks", {
    headers: { Authorization: "Bearer " + token }
  });

  let data = await res.json();
  if (!data) data = [];

  // tenant filter
  data = data.filter(t => t.organization_id === user.orgId);

  const container = document.getElementById("tasks");
  if (!container) return;

  container.innerHTML = "";

  data.forEach(t => {

    const canEdit = user.role === "admin" || t.created_by === user.id;
    const canDelete = user.role === "admin" || t.created_by === user.id;

    container.innerHTML += `
      <div class="task">
        <h3>${t.title}</h3>
        <p>${t.description}</p>

        <span class="status ${t.status}">${t.status}</span>

        ${canEdit ? `<button onclick="updateTask(${t.id})">Edit</button>` : ""}
        ${canDelete ? `<button onclick="deleteTask(${t.id})">Delete</button>` : ""}
      </div>
    `;
  });

  loadDashboard(data);
}

// ================= DASHBOARD =================
function loadDashboard(data) {
  if (!data) return;

  let done = 0, progress = 0, todo = 0;

  data.forEach(t => {
    if (t.status === "done") done++;
    else if (t.status === "progress") progress++;
    else todo++;
  });

  document.getElementById("dashboardPage").innerHTML = `
    <h2>Dashboard</h2>

    <div class="task-grid">

      <div class="task">
        <h3>Total Tasks</h3>
        <h1>${data.length}</h1>
      </div>

      <div class="task">
        <h3>Done</h3>
        <h1>${done}</h1>
      </div>

      <div class="task">
        <h3>Progress</h3>
        <h1>${progress}</h1>
      </div>

      <div class="task">
        <h3>Todo</h3>
        <h1>${todo}</h1>
      </div>

    </div>
  `;
}

// ================= UPDATE TASK =================
async function updateTask(id) {
  const token = localStorage.getItem("token");
  const user = decodeToken(token);

  const res = await fetch("http://localhost:3000/tasks", {
    headers: { Authorization: "Bearer " + token }
  });

  const tasks = await res.json();
  const task = tasks.find(t => t.id === id);

  if (!task) return alert("Task not found");

  if (user.role !== "admin" && task.created_by !== user.id) {
    return alert("Not allowed");
  }

  await fetch("http://localhost:3000/tasks/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      title: prompt("Title"),
      description: prompt("Description"),
      status: prompt("todo / progress / done")
    })
  });

  loadTasks();
}

// ================= DELETE TASK =================
async function deleteTask(id) {
  const token = localStorage.getItem("token");
  const user = decodeToken(token);

  const res = await fetch("http://localhost:3000/tasks", {
    headers: { Authorization: "Bearer " + token }
  });

  const tasks = await res.json();
  const task = tasks.find(t => t.id === id);

  if (!task) return alert("Task not found");

  if (user.role !== "admin" && task.created_by !== user.id) {
    return alert("Not allowed");
  }

  await fetch("http://localhost:3000/tasks/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  loadTasks();
}

// ================= SEARCH =================
function searchTask(value) {
  document.querySelectorAll(".task").forEach(task => {
    task.style.display =
      task.innerText.toLowerCase().includes(value.toLowerCase())
        ? "block"
        : "none";
  });
}

// ================= LOGS =================
function loadLogs() {
  const logs = [
    { user: "Admin", action: "CREATE", task: "UI Design", time: "10:30 AM" },
    { user: "Admin", action: "UPDATE", task: "CRUD API", time: "11:00 AM" },
    { user: "Member", action: "DELETE", task: "Old Task", time: "11:30 AM" }
  ];

  const container = document.getElementById("logs");
  container.innerHTML = "";

  logs.forEach(l => {
    container.innerHTML += `
      <div class="task">
        <b>${l.user}</b> → ${l.action} → ${l.task}
        <br><small>${l.time}</small>
      </div>
    `;
  });
}

// ================= PROFILE =================
function loadProfile() {
  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  if (!user) return;

  document.getElementById("profilePage").innerHTML = `
    <h2>Profile</h2>

    <div class="task">
      <p><b>User ID:</b> ${user.id}</p>
      <p><b>Role:</b> ${user.role}</p>
      <p><b>Organization:</b> ${user.orgId}</p>
    </div>
  `;
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// AUTO LOAD
if (window.location.pathname.includes("dashboard")) {
  loadTasks();
}