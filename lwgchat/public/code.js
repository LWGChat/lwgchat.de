(function () {
  const app = document.querySelector(".app");
  const socket = io();

  let uname;

  app.querySelector(".join-screen #join-user").addEventListener("click", function () {
    let username = app.querySelector(".join-screen #username").value;
    if (username.length == 0) {
      return;
    }
    socket.emit("newuser", username);
    uname = username; // Declare and assign uname locally
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
  });

  app.querySelector(".chat-screen #send-message").addEventListener("click", sendMessage);

  app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
    socket.emit("exituser", uname);
    window.location.href = window.location.href;
  });

  socket.on("update", function(update) {
    renderMessage("update", update);
  });

  socket.on("chat", function(message) {
    renderMessage("other", message);
  });

  const messageInput = document.getElementById('message-input');

  messageInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      // Wenn die Eingabetaste gedrückt wird, rufe die Funktion zum Absenden der Nachricht auf.
      sendMessage();
    }
  });

  function sendMessage() {
    const message = messageInput.value;
    // Beispiel: Sende die Nachricht an den Server oder handle sie in irgendeiner Weise.
    console.log('Nachricht gesendet:', message);

    // Nach dem Absenden der Nachricht kannst du das Eingabefeld zurücksetzen.
    messageInput.value = '';

    if (message.length === 0) {
      return;
    }

    renderMessage("my", {
      username: uname,
      text: message,
    });
    socket.emit("chat", {
      username: uname,
      text: message,
    });
    app.querySelector(".chat-screen #message-input").value = "";
  }

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type == "my") {
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
        <div>
          <div className="name">You</div>
          <div className="text">${message.text}</div>
        </div>
      `;
      messageContainer.appendChild(el);
    } else if (type == "other") {
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
        <div>
          <div className="name">${message.username}</div>
          <div className="text">${message.text}</div>
        </div>
      `;
      messageContainer.appendChild(el);
    } else if (type == "update") {
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerText = message;
      messageContainer.appendChild(el);
    }
    // Scroll chat to end
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
  }

})();
