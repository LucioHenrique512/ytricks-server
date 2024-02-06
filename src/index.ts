import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupVideoNamespace } from "./videoController";

const app = express();
const server = createServer(app);
const io = new Server(server);

// Define a rota raiz
app.get("/", (req, res) => {
  res.send("Servidor Socket.IO com TypeScript");
});

// Configura o namespace para o controle de vídeo
setupVideoNamespace(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
