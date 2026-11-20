import { io } from "socket.io-client";

// Initialize socket connection to backend
const SOCKET_URL = "http://localhost:5000";

export const socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ["websocket", "polling"],
});
