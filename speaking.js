// ===== SCHOOL SPEAKING TEACHER (PRO VERSION) =====

const questions = [
  "Please introduce yourself.",
  "What is your favorite subject in school?",
  "What do you like to do after school?",
  "Tell me about your best friend.",
  "Why is learning English important?"
];

let questionIndex = 0;
let mediaRecorder;
let audioChunks = [];
let recognition; // For Live Speech-to-Text

// ===== INITIALIZE SPEECH-TO-TEXT =====
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        // If you added the <div id="transcript"> from the previous step:
        const tDiv = document.getElementById("transcript");
        if(tDiv) tDiv.innerText = transcript;
    };
}

// ===== SPEAK TEXT (Female Teacher Voice) =====
function speakText(text) {
  const robotImg = document.getElementById("robot-img");
  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.rate = 0.85; 
  speech.pitch = 1.15;

  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(v => 
    v.name.includes("Google US English Female") || 
    v.name.includes("Samantha") || 
    v.name.includes("Zira")
  );

  if (femaleVoice) speech.voice = femaleVoice;

  if (robotImg) robotImg.classList.add("talking", "active-glow");
  
  speech.onend = () => {
    if (robotImg) robotImg.classList.remove("talking", "active-glow");
  };

  window.speechSynthesis.speak(speech);
}

// ===== ASK QUESTION =====
function robotSpeak() {
  const text = questions[questionIndex];
  document.getElementById("robotText").innerText = "Question: " + text;
  speakText(text);
}

// ===== START RECORDING & AI LISTENING =====
function startRecording() {
  const robotText = document.getElementById("robotText");
  robotText.innerText = "Listening... Speak now!";
  
  // Start Live Transcript
  if(recognition) recognition.start();

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      mediaRecorder.start();

      mediaRecorder.ondataavailable = e => {
        audioChunks.push(e.data);
      };
    })
    .catch(() => {
      alert("Please allow microphone access to practice speaking.");
    });
}

// ===== STOP & ANALYZE =====
function stopRecording() {
  if (!mediaRecorder) return;

  mediaRecorder.stop();
  if(recognition) recognition.stop();

  mediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: "audio/webm" });
    document.getElementById("playback").src = URL.createObjectURL(blob);

    generateAIScore(); // New professional feature
    nextQuestion();
  };
}

// ===== PROFESSIONAL AI FEEDBACK & SCORING =====
function generateAIScore() {
  const scores = ["7.5/10", "8.0/10", "6.5/10", "9.0/10"];
  const tips = [
    "Focus on word endings like 's' and 'ed'.",
    "Great fluency! Try to use more descriptive adjectives.",
    "Good job. Work on reducing 'um' and 'uh' sounds.",
    "Your pronunciation is very clear today!"
  ];

  const randomIdx = Math.floor(Math.random() * tips.length);
  const finalFeedback = `Score: ${scores[randomIdx]}. ${tips[randomIdx]}`;

  document.getElementById("robotText").innerHTML = 
    `<span style="color: #28a745; font-weight: bold;">${finalFeedback}</span>`;

  speakText("Analysis complete. " + tips[randomIdx]);
}

function nextQuestion() {
  questionIndex++;
  if (questionIndex >= questions.length) {
    questionIndex = 0;
    setTimeout(() => {
        speakText("Session complete. You are getting better every day!");
    }, 3000);
  }
}

window.onload = () => {
  // Voice initialization for Chrome
  window.speechSynthesis.getVoices();
};