// 1 crear servidor
const http = require("node:http");
const socketIo = require("socket.io"); //2,1
const ChatData = require("./models/chatdata.models");

require("dotenv").config(); //para usar variables de entorno

//condig db
require("./config/db.config");

const server = http.createServer((req, res) => {
  res.end("hola hola");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);

// 2 configurar el servidor con socket io

const io = socketIo(server, {
  cors: { origin: "*" },
});

// socket io se ejecuta atravez de eventos
// 3 crear evento de conexion

io.on("connection", async (socket) => {
  console.log(" nuevo cliente conectado");
  //emision a todos menos al q se conecta
  socket.broadcast.emit("chat_message_server", {
    username: "INFO",
    message: "se ha conectado un nuevo usuario",
    type: "info",
  });

  io.emit("clients_count", io.engine.clientsCount);

  //recuperar los 5 ultimos mejsaes

  const messages = await ChatData.find().sort("-createdAt").limit(5);
  socket.emit("chat_init", messages.reverse()),
    socket.on("chat_message", async (data) => {
      //se guarda en la bbdd
      await ChatData.create(data);

      //data recibimos el valor q estamos enviandi
      io.emit("chat_message_server", data);
      //4 enviar mensaje a todos lo clientes
    });

  socket.on("disconnect", () => {
    io.emit("chat_message_server", {
      username: "INFO",
      message: "se ha desconectado la chismosa",
      type: "info",
    });
    io.emit("clientes_count", io.engine.clientsCount);
  });
});

// socket.on("chat_message", (data) => {
//     io.emit("chat_message_server", data);
//   });
