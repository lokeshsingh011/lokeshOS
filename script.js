// ⏰ Live Time Display
function updateTime() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeElement = document.getElementById('time');
  if (timeElement) timeElement.textContent = time;
}

// 🪟 Show Any Window
function showWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;

  win.style.display = 'block';
  win.style.zIndex = Date.now();

  document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
  win.classList.add('active');

  const dockIcon = document.querySelector(`[data-window="${id}"]`);
  if (dockIcon) dockIcon.classList.remove('minimized');

  makeDraggable(win);
  makeResizable(win);
}

// ❌ Close Any Window
function closeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.style.display = 'none';
  win.classList.remove('maximized', 'active');

  const dockIcon = document.querySelector(`[data-window="${id}"]`);
  if (dockIcon) dockIcon.classList.remove('minimized');
}

// 🟡 Minimize Window
function minimizeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.style.display = 'none';

  const dockIcon = document.querySelector(`[data-window="${id}"]`);
  if (dockIcon) dockIcon.classList.add('minimized');
}

// 🟢 Maximize / Restore Window
function toggleMaximize(id) {
  const win = document.getElementById(id);
  if (!win) return;

  if (win.classList.contains('maximized')) {
    win.style.width = win.dataset.originalWidth;
    win.style.height = win.dataset.originalHeight;
    win.style.top = win.dataset.originalTop;
    win.style.left = win.dataset.originalLeft;
    win.classList.remove('maximized');
  } else {
    win.dataset.originalWidth = win.style.width;
    win.dataset.originalHeight = win.style.height;
    win.dataset.originalTop = win.style.top;
    win.dataset.originalLeft = win.style.left;

    win.style.top = '0';
    win.style.left = '0';
    win.style.width = '100vw';
    win.style.height = '100vh';
    win.classList.add('maximized');
  }
}

// 🖱 Make Any Window Draggable
function makeDraggable(win) {
  const header = win.querySelector('.window-header');
  if (!header || header.getAttribute('data-draggable') === 'true') return;

  let isDragging = false;
  let startX, startY, initialX, initialY;

  header.setAttribute('data-draggable', 'true');

  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = win.offsetLeft;
    initialY = win.offsetTop;
    win.style.zIndex = Date.now();
    document.body.style.userSelect = 'none';
  });

  header.addEventListener('dblclick', () => toggleMaximize(win.id));

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    win.style.left = `${initialX + dx}px`;
    win.style.top = `${initialY + dy}px`;
    const distanceToTop = win.getBoundingClientRect().top;
    if (distanceToTop <= 10 && !win.classList.contains('maximized')) {
      toggleMaximize(win.id);
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = 'auto';
  });
}

// 🧩 Resizable from All Edges/Corners
function makeResizable(win) {
  const resizers = win.querySelectorAll('.resizer');
  let isResizing = false;
  let currentResizer;

  resizers.forEach(resizer => {
    resizer.addEventListener('mousedown', e => {
      e.preventDefault();
      isResizing = true;
      currentResizer = resizer;
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResize);
    });
  });

  function resize(e) {
    if (!isResizing) return;

    const rect = win.getBoundingClientRect();

    if (currentResizer.classList.contains('bottom-right')) {
      win.style.width = e.clientX - rect.left + 'px';
      win.style.height = e.clientY - rect.top + 'px';
    } else if (currentResizer.classList.contains('bottom-left')) {
      win.style.width = rect.right - e.clientX + 'px';
      win.style.left = e.clientX + 'px';
      win.style.height = e.clientY - rect.top + 'px';
    } else if (currentResizer.classList.contains('top-right')) {
      win.style.width = e.clientX - rect.left + 'px';
      win.style.height = rect.bottom - e.clientY + 'px';
      win.style.top = e.clientY + 'px';
    } else if (currentResizer.classList.contains('top-left')) {
      win.style.width = rect.right - e.clientX + 'px';
      win.style.left = e.clientX + 'px';
      win.style.height = rect.bottom - e.clientY + 'px';
      win.style.top = e.clientY + 'px';
    } else if (currentResizer.classList.contains('right')) {
      win.style.width = e.clientX - rect.left + 'px';
    } else if (currentResizer.classList.contains('left')) {
      win.style.width = rect.right - e.clientX + 'px';
      win.style.left = e.clientX + 'px';
    } else if (currentResizer.classList.contains('top')) {
      win.style.height = rect.bottom - e.clientY + 'px';
      win.style.top = e.clientY + 'px';
    } else if (currentResizer.classList.contains('bottom')) {
      win.style.height = e.clientY - rect.top + 'px';
    }
  }

  function stopResize() {
    isResizing = false;
    window.removeEventListener('mousemove', resize);
    window.removeEventListener('mouseup', stopResize);
  }
}

// 🚀 Boot Init + Time
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('boot-screen').style.display = 'none';
    document.getElementById('desktop').classList.remove('hidden');
  }, 3500);

  updateTime();
  setInterval(updateTime, 1000);

  document.querySelectorAll('.window').forEach(win => {
    makeDraggable(win);
    makeResizable(win);
  });
});

// 🌓 Theme Toggle
const toggleBtn = document.getElementById('theme-toggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  toggleBtn.textContent = isDark ? '🌞' : '🌙';
});

window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    toggleBtn.textContent = '🌞';
  } else {
    toggleBtn.textContent = '🌙';
  }
});

// 🧑‍💻 Terminal Commands
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

document.addEventListener('DOMContentLoaded', () => {
  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleTerminalCommand(terminalInput.value);
      }
    });
  }
});

function handleTerminalCommand(command) {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const lower = command.trim().toLowerCase();
  let response = '';

  switch (lower) {
    case 'help':
      response = `
<pre>Available commands:
- help          Show this help message
- about         Show About info
- resume        Open resume window
- projects      Open projects window
- contact       Show contact info
- clear         Clear the terminal
- exit          Close the terminal window</pre>`;
      break;
    case 'about':
      response = "👨‍💻 I'm Lokesh Kumar — a creative technologist passionate about building unique web experiences.";
      break;
    case 'resume':
      showWindow('resume-window');
      response = "📂 Opening Resume window...";
      break;
    case 'projects':
      showWindow('projects-window');
      response = "🛠 Opening Projects window...";
      break;
    case 'contact':
      response = `📧 Email: lkmahaur111@gmail.com | GitHub: lokeshsingh011 | LinkedIn: lokesh-kumar-ab41a819a`;
      break;
    case 'exit':
      closeWindow('terminal-window');
      return;
    case 'clear':
      terminalOutput.innerHTML = '';
      input.value = '';
      return;
    default:
      response = `❓ Unknown command: "${command}". Type "help" to see available commands.`;
      break;
  }

  output.innerHTML += `<div><span style="color:#0f0;">$ ${command}</span><br>${response}</div>`;
  output.scrollTop = output.scrollHeight;
  input.value = '';
}

// 🔁 Command History and Autocomplete
let commandHistory = [];
let historyIndex = -1;
const validCommands = ["help", "about", "resume", "projects", "contact", "clear", "exit"];

terminalInput.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    if (commandHistory.length === 0) return;
    historyIndex = Math.max(0, historyIndex - 1);
    terminalInput.value = commandHistory[historyIndex];
    e.preventDefault();
  }

  if (e.key === "ArrowDown") {
    if (commandHistory.length === 0) return;
    historyIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
    terminalInput.value = commandHistory[historyIndex] || "";
    e.preventDefault();
  }

  if (e.key === "Tab") {
    e.preventDefault();
    const current = terminalInput.value.trim().toLowerCase();
    const matches = validCommands.filter(cmd => cmd.startsWith(current));
    if (matches.length === 1) {
      terminalInput.value = matches[0];
    } else if (matches.length > 1) {
      terminalOutput.innerHTML += `<div><span style="color:#0f0;">$ ${current}</span><br>Suggestions: ${matches.join(", ")}</div>`;
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  }
});

// ✨ Store commands to history after execution
function handleTerminalCommand(command) {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const lower = command.trim().toLowerCase();
  let response = '';

  if (command.trim()) {
    commandHistory.push(command.trim());
    historyIndex = commandHistory.length;
  }

  switch (lower) {
    case 'help':
      response = `
<pre>Available commands:
- help          Show this help message
- about         Show About info
- resume        Open resume window
- projects      Open projects window
- contact       Show contact info
- explorer      Open file explorer window
- clear         Clear the terminal
- exit          Close the terminal window</pre>`;
      break;
    case 'about':
      response = "👨‍💻 I'm Lokesh Kumar — a creative technologist passionate about building unique web experiences.";
      break;
    case 'resume':
      showWindow('resume-window');
      response = "📂 Opening Resume window...";
      break;
    case 'projects':
      showWindow('projects-window');
      response = "🛠 Opening Projects window...";
      break;
    case 'contact':
      response = `📧 Email: lkmahaur111@gmail.com | GitHub: lokeshsingh011 | LinkedIn: lokesh-kumar-ab41a819a`;
      break;
    case 'exit':
      closeWindow('terminal-window');
      return;
    case 'clear':
      terminalOutput.innerHTML = '';
      input.value = '';
      return;
    case 'explorer':
      showWindow('explorer-window');
      response = "🗂 Opening File Explorer window...";
      break;
    default:
      response = `❓ Unknown command: "${command}". Type "help" to see available commands.`;
      break;
  }

  output.innerHTML += `<div><span style="color:#0f0;">$ ${command}</span><br>${response}</div>`;
  output.scrollTop = output.scrollHeight;
  input.value = '';
}

// 🗂️ FAKE FILE EXPLORER LOGIC

// Sample file structure
const fakeFileSystem = {
  'Documents': ['Report.docx', 'Budget.xlsx'],
  'Projects': ['Portfolio.html', 'App.js'],
  'Resume.pdf': 'assets/resume.pdf',
  'todo.txt': 'Buy groceries\nFinish portfolio\nPush to GitHub',
  'easter-egg.sh': '#!/bin/bash\necho "You found the egg!"'
};

// 📂 Open Fake File/Folder
function openFakeFile(name) {
  const content = fakeFileSystem[name];
  const explorer = document.getElementById('explorer-window');
  const viewer = document.getElementById('file-viewer');

  if (!explorer || !viewer) return;

  viewer.innerHTML = ''; // Clear old content

  const backButton = document.createElement('button');
  backButton.textContent = '⬅ Back';
  backButton.style.marginBottom = '10px';
  backButton.onclick = () => renderRootExplorer();
  viewer.appendChild(backButton);

  if (Array.isArray(content)) {
    const list = document.createElement('ul');
    list.className = 'file-list';

    content.forEach(item => {
      const li = document.createElement('li');
      li.className = 'file-item file';
      li.textContent = item;
      li.ondblclick = () => alert(`Preview of "${item}" not implemented`);
      list.appendChild(li);
    });

    viewer.appendChild(list);
  } else if (typeof content === 'string') {
    if (name.endsWith('.pdf')) {
      const iframe = document.createElement('iframe');
      iframe.src = content;
      iframe.style.width = '100%';
      iframe.style.height = '80vh';
      iframe.style.border = 'none';
      viewer.appendChild(iframe);
    } else {
      const pre = document.createElement('pre');
      pre.textContent = content;
      viewer.appendChild(pre);
    }
  } else {
    viewer.innerHTML += `<p>Unknown file type or content.</p>`;
  }
}

// 📁 Show Root Directory
function renderRootExplorer() {
  const viewer = document.getElementById('file-viewer');
  const folderList = document.getElementById('folder-list');
  if (!viewer || !folderList) return;

  viewer.innerHTML = '<p>Select a folder or file to view its contents here.</p>';

  // Reset search if needed
  const search = document.getElementById('file-search');
  if (search) search.value = '';

  // Show all folder list items
  folderList.querySelectorAll('.file-item').forEach(item => item.style.display = 'block');
}

// 🔍 Search Files in Sidebar
function searchFiles(query) {
  const allItems = document.querySelectorAll('#folder-list .file-item');
  allItems.forEach(item => {
    const match = item.textContent.toLowerCase().includes(query.toLowerCase());
    item.style.display = match ? 'block' : 'none';
  });
}

// 📋 Context Menu for Files
document.addEventListener('contextmenu', function (e) {
  const menu = document.getElementById('context-menu');
  if (!menu) return;

  if (e.target.classList.contains('file-item')) {
    e.preventDefault();
    menu.style.display = 'block';
    menu.style.top = `${e.pageY}px`;
    menu.style.left = `${e.pageX}px`;
    menu.dataset.target = e.target.textContent;
  } else {
    menu.style.display = 'none';
  }
});

document.addEventListener('click', () => {
  const menu = document.getElementById('context-menu');
  if (menu) menu.style.display = 'none';
});

// 🏁 Initialize root view when explorer is opened
document.querySelector('[data-window="explorer-window"]')?.addEventListener('click', renderRootExplorer);

// 📄 PDF Viewer Logic
let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    canvas = document.getElementById('pdf-canvas'),
    ctx = canvas.getContext('2d');

function loadPDF(url) {
  pdfjsLib.getDocument(url).promise.then(doc => {
    pdfDoc = doc;
    pageNum = 1;
    document.getElementById('page-count').textContent = doc.numPages;
    renderPage(pageNum);
    showWindow('pdf-viewer-window');
  });
}

function renderPage(num) {
  pageRendering = true;
  pdfDoc.getPage(num).then(page => {
    const scale = 2;
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    page.render(renderContext).promise.then(() => {
      pageRendering = false;
      document.getElementById('page-num').textContent = pageNum;
    });
  });
}

function prevPage() {
  if (pageNum <= 1) return;
  pageNum--;
  renderPage(pageNum);
}

function nextPage() {
  if (pageNum >= pdfDoc.numPages) return;
  pageNum++;
  renderPage(pageNum);
}


const dockIcons = document.querySelectorAll('#dock .dock-icon');

dockIcons.forEach(icon => {
  icon.addEventListener('mousemove', e => {
    dockIcons.forEach(i => i.style.transform = 'scale(1)');
    icon.style.transform = 'scale(1.8)';
    const prev = icon.previousElementSibling;
    const next = icon.nextElementSibling;
    if (prev) prev.style.transform = 'scale(1.4)';
    if (next) next.style.transform = 'scale(1.4)';
  });
});

document.getElementById('dock').addEventListener('mouseleave', () => {
  dockIcons.forEach(i => i.style.transform = 'scale(1)');
});
