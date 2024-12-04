document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    const manageServerLink = document.getElementById("manage-server-link");
    let servers = JSON.parse(localStorage.getItem("servers")) || [];
    let currentServerIndex = null;
  
    // Opret server-side
    function loadCreateServer() {
      manageServerLink.style.display = "none";
      mainContent.innerHTML = `
        <h2>Opret Server</h2>
        <form id="server-form">
          <input type="text" id="server-name" placeholder="Server Navn" required>
          <button type="submit">Tilføj Server</button>
        </form>
        <div>
          ${servers
            .map(
              (server, index) => `
            <div class="card">
              <h3>${server.name}</h3>
              <button class="manage-button" data-index="${index}">Administrer</button>
            </div>`
            )
            .join("")}
        </div>`;
  
      document.getElementById("server-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const serverName = document.getElementById("server-name").value;
        const newServer = {
          name: serverName,
          todos: [],
          staff: [],
          projects: [],
          notes: [],
          activityLog: []
        };
        servers.push(newServer);
        saveServers();
        loadCreateServer();
      });
  
      // Tilføj klik-lyttere til "Administrer"-knapper
      document.querySelectorAll(".manage-button").forEach((button) => {
        button.addEventListener("click", () => {
          const index = button.getAttribute("data-index");
          selectServer(parseInt(index, 10));
        });
      });
    }
  
    // Vælg server-side
    function selectServer(index) {
      currentServerIndex = index;
      loadManageServer();
    }
  
    // Administrer server
    function loadManageServer() {
      manageServerLink.style.display = "block";
      const currentServer = servers[currentServerIndex];
      mainContent.innerHTML = `
        <h2>Administrer: ${currentServer.name}</h2>
        <div>
          <button onclick="loadTodoList()">To-Do Liste</button>
          <button onclick="loadStaffList()">Staff</button>
          <button onclick="loadProjects()">Projekter</button>
          <button onclick="loadNotes()">Noter</button>
          <button onclick="loadActivityLog()">Aktivitetslog</button>
        </div>
        <div id="server-content"></div>`;
    }
  
    // To-Do Liste
    window.loadTodoList = function () {
      const content = document.getElementById("server-content");
      const currentServer = servers[currentServerIndex];
      content.innerHTML = `
        <h3>To-Do Liste</h3>
        <form id="todo-form">
          <input type="text" id="todo-task" placeholder="Ny opgave" required>
          <button type="submit">Tilføj</button>
        </form>
        <ul>
          ${currentServer.todos
            .map(
              (todo, index) => `
          <li>
            ${todo.task} - Status: ${todo.status} 
            <button onclick="editTodo(${index})">Rediger</button>
            <button onclick="deleteTodo(${index})">Slet</button>
          </li>`
            )
            .join("")}
        </ul>`;
  
      document.getElementById("todo-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const task = document.getElementById("todo-task").value;
        const newTodo = { task, status: "Pending" };
        currentServer.todos.push(newTodo);
        currentServer.activityLog.push(`Tilføjet opgave: "${task}"`);
        saveServers();
        loadTodoList();
      });
    };
  
    // Rediger To-Do
    window.editTodo = function (index) {
      const currentServer = servers[currentServerIndex];
      const todo = currentServer.todos[index];
      const newStatus = prompt("Ændre status (Pending, Completed, In Progress):", todo.status);
      const newTask = prompt("Ændre opgave:", todo.task);
      if (newTask) {
        currentServer.todos[index].task = newTask;
      }
      if (newStatus) {
        currentServer.todos[index].status = newStatus;
      }
      currentServer.activityLog.push(`Opdateret opgave: "${newTask}" med status: "${newStatus}"`);
      saveServers();
      loadTodoList();
    };
  
    // Slet To-Do med bekræftelse
    window.deleteTodo = function (index) {
      if (confirm("Er du sikker på, at du vil slette denne opgave?")) {
        const currentServer = servers[currentServerIndex];
        const todo = currentServer.todos[index];
        currentServer.activityLog.push(`Slettet opgave: "${todo.task}"`);
        currentServer.todos.splice(index, 1);
        saveServers();
        loadTodoList();
      }
    };
  
    // Staff Liste
    window.loadStaffList = function () {
      const content = document.getElementById("server-content");
      const currentServer = servers[currentServerIndex];
      content.innerHTML = `
        <h3>Staff Liste</h3>
        <form id="staff-form">
          <input type="text" id="staff-name" placeholder="Medarbejder Navn" required>
          <input type="text" id="staff-rank" placeholder="Rank" required>
          <input type="text" id="staff-responsibility" placeholder="Ansvar" required>
          <button type="submit">Tilføj</button>
        </form>
        <ul>
          ${currentServer.staff
            .map(
              (staff, index) => `
          <li>
            ${staff.name} (${staff.rank}, ${staff.responsibility})
            <button onclick="editStaff(${index})">Rediger</button>
            <button onclick="deleteStaff(${index})">Slet</button>
          </li>`
            )
            .join("")}
        </ul>`;
  
      document.getElementById("staff-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("staff-name").value;
        const rank = document.getElementById("staff-rank").value;
        const responsibility = document.getElementById("staff-responsibility").value;
        currentServer.staff.push({ name, rank, responsibility });
        currentServer.activityLog.push(`Tilføjet staff: ${name} med rank: ${rank} og ansvar: ${responsibility}`);
        saveServers();
        loadStaffList();
      });
    };
  
    // Rediger Staff
    window.editStaff = function (index) {
      const currentServer = servers[currentServerIndex];
      const staff = currentServer.staff[index];
      const newRank = prompt("Ændre rank:", staff.rank);
      const newResponsibility = prompt("Ændre ansvar:", staff.responsibility);
      if (newRank) staff.rank = newRank;
      if (newResponsibility) staff.responsibility = newResponsibility;
      currentServer.activityLog.push(`Opdateret staff: ${staff.name} med rank: ${newRank} og ansvar: ${newResponsibility}`);
      saveServers();
      loadStaffList();
    };
  
    // Slet Staff med bekræftelse
    window.deleteStaff = function (index) {
      if (confirm("Er du sikker på, at du vil slette denne medarbejder?")) {
        const currentServer = servers[currentServerIndex];
        const staff = currentServer.staff[index];
        currentServer.activityLog.push(`Slettet staff: ${staff.name}`);
        currentServer.staff.splice(index, 1);
        saveServers();
        loadStaffList();
      }
    };
  
    // Projekter
    window.loadProjects = function () {
      const content = document.getElementById("server-content");
      const currentServer = servers[currentServerIndex];
      content.innerHTML = `
        <h3>Projekter</h3>
        <form id="project-form">
          <input type="text" id="project-name" placeholder="Projekt Navn" required>
          <button type="submit">Tilføj</button>
        </form>
        <ul>
          ${currentServer.projects
            .map(
              (project, index) => `
          <li>
            ${project} 
            <button onclick="editProject(${index})">Rediger</button>
            <button onclick="deleteProject(${index})">Slet</button>
          </li>`
            )
            .join("")}
        </ul>`;
  
      document.getElementById("project-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const project = document.getElementById("project-name").value;
        currentServer.projects.push(project);
        currentServer.activityLog.push(`Tilføjet projekt: "${project}"`);
        saveServers();
        loadProjects();
      });
    };
  
    // Rediger Projekt
    window.editProject = function (index) {
      const currentServer = servers[currentServerIndex];
      const project = currentServer.projects[index];
      const newProject = prompt("Ændre projekt navn:", project);
      if (newProject) {
        currentServer.projects[index] = newProject;
        currentServer.activityLog.push(`Opdateret projekt: "${newProject}"`);
        saveServers();
        loadProjects();
      }
    };
  
    // Slet Projekt med bekræftelse
    window.deleteProject = function (index) {
      if (confirm("Er du sikker på, at du vil slette dette projekt?")) {
        const currentServer = servers[currentServerIndex];
        const project = currentServer.projects[index];
        currentServer.activityLog.push(`Slettet projekt: "${project}"`);
        currentServer.projects.splice(index, 1);
        saveServers();
        loadProjects();
      }
    };
  
    // Noter
    window.loadNotes = function () {
      const content = document.getElementById("server-content");
      const currentServer = servers[currentServerIndex];
      content.innerHTML = `
        <h3>Noter</h3>
        <form id="note-form">
          <textarea id="note-text" placeholder="Skriv en note" required></textarea>
          <button type="submit">Tilføj</button>
        </form>
        <ul>
          ${currentServer.notes
            .map(
              (note, index) => `
          <li>
            ${note} 
            <button onclick="editNote(${index})">Rediger</button>
            <button onclick="deleteNote(${index})">Slet</button>
          </li>`
            )
            .join("")}
        </ul>`;
  
      document.getElementById("note-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const note = document.getElementById("note-text").value;
        currentServer.notes.push(note);
        currentServer.activityLog.push(`Tilføjet note: "${note}"`);
        saveServers();
        loadNotes();
      });
    };
  
    // Rediger Note
    window.editNote = function (index) {
      const currentServer = servers[currentServerIndex];
      const note = currentServer.notes[index];
      const newNote = prompt("Ændre note:", note);
      if (newNote) {
        currentServer.notes[index] = newNote;
        currentServer.activityLog.push(`Opdateret note: "${newNote}"`);
        saveServers();
        loadNotes();
      }
    };
  
    // Slet Note med bekræftelse
    window.deleteNote = function (index) {
      if (confirm("Er du sikker på, at du vil slette denne note?")) {
        const currentServer = servers[currentServerIndex];
        const note = currentServer.notes[index];
        currentServer.activityLog.push(`Slettet note: "${note}"`);
        currentServer.notes.splice(index, 1);
        saveServers();
        loadNotes();
      }
    };
  
    // Aktivitetslog
    window.loadActivityLog = function () {
      const content = document.getElementById("server-content");
      const currentServer = servers[currentServerIndex];
      content.innerHTML = `
        <h3>Aktivitetslog</h3>
        <ul>
          ${currentServer.activityLog.map((log) => `<li>${log}</li>`).join("")}
        </ul>`;
    };
  
    // Gem servere i LocalStorage
    function saveServers() {
      localStorage.setItem("servers", JSON.stringify(servers));
    }
  
    // Links
    document.getElementById("create-server-link").addEventListener("click", loadCreateServer);
  
    loadCreateServer();
  });
  