const express = require('express');
const app = express();

// Middleware-Funktion für die HTTPS-Umleitung
function requireHTTPS(req, res, next) {
  // Überprüfen, ob die Anfrage nicht über HTTPS kommt
  if (req.header('x-forwarded-proto') !== 'https') {
    // Umleitung auf HTTPS
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

// Middleware-Funktion aktivieren, damit alle Anfragen über HTTPS umgeleitet werden
app.use(requireHTTPS);

const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  socket.on("newuser", function (username) {
    socket.broadcast.emit("update", username + " ist dem Chat beigetreten");
  });

  socket.on("exituser", function (username) {
    socket.broadcast.emit("update", username + " hat den Chat verlassen");
  });

  socket.on("chat", function (message) {
    socket.broadcast.emit("chat", message);
  });
});

const PORT = process.env.PORT || 5000; 
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
