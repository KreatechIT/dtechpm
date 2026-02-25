// socket.js
const socketIo = require('socket.io');
const axios = require('axios');

module.exports = (server) => {
  const io = socketIo(server);
  const API_URL = 'http://127.0.0.1:4000/scope-works';

  io.on('connection', (socket) => {
    console.log('Client connected');

    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        const data = response.data;
        socket.emit('data', data); // Emit data to the connected client
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    // Fetch data initially and then every 5 seconds
    fetchData();
    setInterval(fetchData, 5000);

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};
