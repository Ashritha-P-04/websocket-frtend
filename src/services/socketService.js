import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL);
      
      this.socket.on('connect', () => {
        console.log('Connected to server');
        this.connected = true;
      });
      
      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
        this.connected = false;
      });
    }
    return this.socket;
  }

  joinRoom(room) {
    if (this.socket) {
      this.socket.emit('join', room);
    }
  }

  placeOrder(order) {
    if (this.socket) {
      this.socket.emit('newOrder', order);
    }
  }

  updateOrderStatus(orderId, status) {
    if (this.socket) {
      this.socket.emit('updateOrderStatus', { orderId, status });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService;