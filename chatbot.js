async function sendMessage() {
  const userInput = document.getElementById("chat-input").value.trim();
  const chatBox = document.getElementById("chat-box");

  if (!userInput) return;

  chatBox.innerHTML += `<div class="user-msg">${userInput}</div>`;
  document.getElementById("chat-input").value = "";

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userInput })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Server error");
    }

    chatBox.innerHTML += `<div class="bot-msg">${data.reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    chatBox.innerHTML += `<div class="bot-msg">Cannot connect to AI: ${error.message}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

