import { Namespace, Server } from "socket.io";

interface RoomState {
  videoUrl: string;
  playState: boolean;
  timestamp: number;
}

const rooms: Record<string, RoomState> = {};

export function setupVideoNamespace(io: Server): Namespace {
  const videoNamespace = io.of("/video");
  videoNamespace.on("connection", (socket) => {
    console.log("Usuário conectado ao namespace de vídeo");

    socket.on("createRoom", ({ roomId, videoUrl }) => {
      if (rooms[roomId]) {
        socket.emit("error", "Sala já existe");
        return;
      }

      rooms[roomId] = { videoUrl, playState: false, timestamp: 0 };
      socket.join(roomId);
      socket.emit("roomCreated", roomId);
    });

    socket.on("joinRoom", (roomId) => {
      if (!rooms[roomId]) {
        socket.emit("error", "Sala não encontrada");
        return;
      }

      socket.join(roomId);
      socket.emit("joinedRoom", roomId, rooms[roomId]);
    });

    socket.on("updateState", ({ roomId, state }) => {
      if (!rooms[roomId]) {
        socket.emit("error", "Sala não encontrada");
        return;
      }

      rooms[roomId] = { ...rooms[roomId], ...state };
      socket.to(roomId).emit("stateUpdated", rooms[roomId]);
    });

    socket.on("disconnect", () => {
      console.log("Usuário desconectado");
    });
  });

  return videoNamespace;
}
