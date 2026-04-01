const readingQuestions = [
  {
    text: "Ravi goes to school every day. He likes English.",
    question: "What subject does Ravi like?",
    options: ["Math", "English", "Science"],
    answer: "English"
  },
  {
    text: "The train arrives at 9 AM.",
    question: "When does the train arrive?",
    options: ["8 AM", "9 AM", "10 AM"],
    answer: "9 AM"
  }
  // 👉 add more
];

function loadReading() {
  const q = readingQuestions[Math.floor(Math.random() * readingQuestions.length)];

  document.getElementById("readingText").innerText = q.text;
  document.getElementById("readingQuestion").innerText = q.question;

  const optionsDiv = document.getElementById("readingOptions");
  optionsDiv.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => {
      document.getElementById("readingFeedback").innerText =
        opt === q.answer
          ? "✅ Correct!"
          : "❌ Read again and try.";
    };
    optionsDiv.appendChild(btn);
  });
}

loadReading();
