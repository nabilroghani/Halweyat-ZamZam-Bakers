// Shared Socket.IO instance holder - avoids circular dependency between server.js and routes
let io = null;

export function setIO(ioInstance) {
  io = ioInstance;
}

export function getIO() {
  return io || { emit: () => {} };
}
