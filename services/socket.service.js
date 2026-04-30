const { Server } = require('socket.io');
const JwtHelperService = require('./jwt-helper.service');

class SocketService {
  // io = null;

  init(server) {
    this.io = new Server(server, {
      cors: { origin: '*' },
    });

    this.io.on('connection', (socket) => {
      console.log('Socket connected!', socket.id);

      socket.on('message', (payload) => {
        console.log('Got message from', socket.id, payload);
        socket.emit('reply', 'Hello from server');
      });

      socket.on('join', ({ room }) => {
        console.log(`${socket.userId} joined room ${room}`);
        socket.join(room);
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected', socket.id, reason);
      });
    });

    this.io.use((socket, next) => {
      try {
        const header = socket.handshake.headers['authorization'];
        if (!header?.startsWith('Bearer ')) {
          throw new Error('Missing or invalid Authorization header');
        }
        const token = header.slice(7);
        const decodedToken = JwtHelperService.verifyToken(token);
        socket.userId = decodedToken.id;
        next();
      } catch (error) {
        return next(error);
      }
    });

    console.log('Socket initlized successfully! 🟢');
  }

  emitToUser(userId, eventName, data) {
    this.io.to(userId).emit(eventName, data);
  }

  emitToAdmins(eventName, data) {
    this.io.to('admins').emit(eventName, data);
  }

  emitToAll(eventName, data) {
    this.io.emit(eventName, data);
  }
}

module.exports = new SocketService();
