//Server.js
const express = require('express');
const http = require('http');
const socket = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socket(server);

// Serve arquivos da pasta PaoQueijo/
app.use(express.static(path.join(__dirname, 'PaoQueijo')));

let salas = {};

io.on('connection', (socket) => {
  socket.on('criarSala', ({ sala, nick }) => {
    if (!salas[sala]) salas[sala] = [];
    salas[sala].push({ id: socket.id, nick });
    socket.join(sala);
    io.emit('salasAtivas', Object.keys(salas));
    io.to(sala).emit('jogadoresSala', salas[sala]);
  });

  socket.on('entrarSala', ({ sala, nick }) => {
    if (salas[sala]) {
      salas[sala].push({ id: socket.id, nick });
      socket.join(sala);
      io.to(sala).emit('jogadoresSala', salas[sala]);
    }
  });

  socket.on('mensagem', ({ sala, nick, texto }) => {
    io.to(sala).emit('mensagemRecebida', { nick, texto });
  });

  socket.on('acao', ({ sala, nick, tipo, alvo }) => {
    io.to(sala).emit('acaoRecebida', { nick, tipo, alvo });
  });

  socket.on('disconnect', () => {
    for (const sala in salas) {
      salas[sala] = salas[sala].filter(j => j.id !== socket.id);
      io.to(sala).emit('jogadoresSala', salas[sala]);
      if (salas[sala].length === 0) delete salas[sala];
    }
    io.emit('salasAtivas', Object.keys(salas));
  });
});

server.listen(3000, () => console.log('Servidor rodando na porta 3000'));


