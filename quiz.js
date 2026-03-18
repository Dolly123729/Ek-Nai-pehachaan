// ----------------------------------------
// QUIZ DATA
// ----------------------------------------
const quizzes = {
  vocabulary: [
    { q: "What is the synonym of 'brave'?", a: ["Cowardly", "Fearful", "Courageous", "Lazy"], correct: 2 },
    { q: "Choose the correct meaning of 'enormous':", a: ["Tiny", "Huge", "Average", "Small"], correct: 1 },
    { q: "Select the correct spelling:", a: ["Acheivement", "Achievement", "Achievment", "Acheevment"], correct: 1 },
    { q: "'Rapid' means:", a: ["Slow", "Fast", "Cold", "Heavy"], correct: 1 }
  ],
  grammar: [
    { q: "Choose the correct sentence:", a: ["He go to school daily.", "He goes to school daily.", "He going to school."], correct: 1 },
    { q: "Select the past tense of 'eat':", a: ["Ate", "Eated", "Eaten"], correct: 0 }
  ],
  reading: [
    {
      q: "Ravi loves to plant trees and waters them daily. What does this show?",
      a: ["He hates nature.", "He takes care of nature.", "He is careless."],
      correct: 1
    }
  ]
};

let currentQuiz = [];
let currentCategory = "";

// ----------------------------------------
// LOAD QUIZ + ATTENDANCE
// ----------------------------------------
function loadQuiz(category) {
  currentQuiz = quizzes[category];
  currentCategory = category;

  trackAttendance(category);

  document.getElementById("quiz-title").innerText =
    category.toUpperCase() + " QUIZ";

  const box = document.getElementById("question-box");
  box.innerHTML = "";

  currentQuiz.forEach((item, i) => {
    box.innerHTML += `
      <p><b>${i + 1}. ${item.q}</b></p>
      ${item.a.map((opt, j) =>
        `<label>
          <input type="radio" name="q${i}" value="${j}">
          ${opt}
        </label><br>`
      ).join("")}
      <hr>
    `;
  });

  document.getElementById("quiz-area").classList.remove("hidden");
}

// ----------------------------------------
// ATTENDANCE TRACKING (LOCAL)
// ----------------------------------------
function trackAttendance(category) {
  const attendance =
    JSON.parse(localStorage.getItem("quizAttendance")) || [];

  attendance.push({
    quiz: category,
    date: new Date().toDateString(),
    time: new Date().toLocaleTimeString(),
    status: "started"
  });

  localStorage.setItem("quizAttendance", JSON.stringify(attendance));
}

// ----------------------------------------
// SUBMIT QUIZ
// ----------------------------------------
async function submitQuiz() {
  let score = 0;

  currentQuiz.forEach((item, i) => {
    const selected =
      document.querySelector(`input[name="q${i}"]:checked`);
    if (selected && Number(selected.value) === item.correct) {
      score++;
    }
  });

  const total = currentQuiz.length;
  const percent = Math.round((score / total) * 100);

  document.getElementById("result").innerText =
    `You scored ${score}/${total} (${percent}%)`;

  saveLocalResult(score, percent, total);
  await saveQuizResult(score, percent, total);
}

// ----------------------------------------
// SAVE LOCAL RESULT (DASHBOARD BACKUP)
// ----------------------------------------
function saveLocalResult(score, percent, total) {
  const results =
    JSON.parse(localStorage.getItem("quizResults")) || [];

  results.push({
    quiz: currentCategory,
    score,
    percent,
    total,
    date: new Date().toDateString()
  });

  localStorage.setItem("quizResults", JSON.stringify(results));
}

// ----------------------------------------
// SAVE QUIZ RESULT TO AWS
// ----------------------------------------
async function saveQuizResult(score, percent, total) {
  const payload = {
    userEmail: "student01@example.com",
    activityType: "quiz",
    quizCategory: currentCategory,
    progress: {
      score,
      percent,
      total,
      completedAt: new Date().toISOString()
    }
  };

  const apiUrl =
    "https://iccv9nzcz2.execute-api.us-east-1.amazonaws.com/prod/SaveUserProgress";

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    console.log("AWS saved:", await res.json());
  } catch (err) {
    console.error("AWS error — saved locally only", err);
  }
}
