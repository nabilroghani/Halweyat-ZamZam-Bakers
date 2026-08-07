import { create } from 'zustand';
import { io } from 'socket.io-client';

const RAW_SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SOCKET_URL = RAW_SOCKET_URL.replace(/\/+$/, '').replace(/\/api$/, '');

let socketInstance = null;

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      transports: ['websocket', 'polling']
    });
  }
  return socketInstance;
};

export const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,

  connect: () => {
    const socket = getSocket();

    if (socket.connected) {
      set({ socket, isConnected: true });
      return;
    }

    socket.on('connect', () => {
      console.log('🔌 Socket.IO connected:', socket.id);
      set({ isConnected: true });
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket.IO disconnected:', reason);
      set({ isConnected: false });
    });

    socket.on('connect_error', (err) => {
      console.warn('🔌 Socket.IO connection error:', err.message);
    });

    socket.connect();
    set({ socket });
  },

  disconnect: () => {
    const socket = getSocket();
    socket.disconnect();
    set({ isConnected: false });
  }
}));

// Export raw socket getter for use in useEffect listeners
export { getSocket };
