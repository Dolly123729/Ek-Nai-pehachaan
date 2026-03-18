document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});

async function loadDashboard() {
  let data = null;

  try {
    // 🔹 TRY API (only works if backend exists)
    const res = await fetch("https://YOUR_API/dashboard");
    if (!res.ok) throw new Error("API not available");
    data = await res.json();
  } catch (err) {
    console.warn("Using localStorage fallback");

    // 🔹 FALLBACK (local tracking)
    data = {
      streak: Number(localStorage.getItem("streak")) || 0,
      tasks: [
        { task: "Practice 10 English words", done: localStorage.getItem("task1") === "true" },
        { task: "Write 1 paragraph", done: localStorage.getItem("task2") === "true" },
        { task: "Use 1 AI tool", done: localStorage.getItem("task3") === "true" }
      ],
      paragraphs: JSON.parse(localStorage.getItem("savedParagraphs")) || []
    };
  }

  // ===== STREAK =====
  document.getElementById("streakCount").innerText =
    data.streak ? `${data.streak} days` : "0 days";

  // ===== TASKS =====
  const t = document.getElementById("taskList");
  t.innerHTML = "";

  data.tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""} 
        onchange="localStorage.setItem('task${index + 1}', this.checked)">
      ${task.task}
    `;
    t.appendChild(li);
  });

  // ===== PARAGRAPHS =====
  const p = document.getElementById("paragraphList");
  p.innerHTML = "";

  if (data.paragraphs.length === 0) {
    p.innerHTML = "<li>No paragraphs saved yet.</li>";
  } else {
    data.paragraphs.forEach(pg => {
      const li = document.createElement("li");
      li.textContent =
        typeof pg === "string"
          ? pg
          : `${pg.topic}: ${pg.text.slice(0, 40)}...`;
      p.appendChild(li);
    });
  }

  // ===== MOTIVATION =====
  const quotes = [
    "Keep going — your future is bright!",
    "Small steps every day create big success.",
    "You are learning for YOU. Keep rising!",
    "Mistakes are proof that you are trying."
  ];

  document.getElementById("motivationText").innerText =
    quotes[Math.floor(Math.random() * quotes.length)];
}
