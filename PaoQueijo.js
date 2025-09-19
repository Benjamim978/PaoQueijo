const socket = io();
let nick = "";
let sala = "";

function criarSala() {
  nick = document.getElementById("nick").value.trim();
  sala = document.getElementById("sala").value.trim();
  if (!nick || !sala) return alert("Preencha o nick e o nome da sala.");
  socket.emit("criarSala", { sala, nick });
  iniciarInterface();
}

function entrarSala() {
  nick = document.getElementById("nick").value.trim();
  sala = document.getElementById("sala").value.trim();
  if (!nick || !sala) return alert("Preencha o nick e o nome da sala.");
  socket.emit("entrarSala", { sala, nick });
  iniciarInterface();
}

function iniciarInterface() {
  document.getElementById("entrada").style.display = "none";
  document.getElementById("jogo").style.display = "block";
  document.getElementById("nomeJogador").innerText = nick;
  document.getElementById("nomeSala").innerText = sala;
}

function enviarMensagem() {
  const texto = document.getElementById("chatInput").value.trim();
  if (texto) {
    socket.emit("mensagem", { sala, nick, texto });
    document.getElementById("chatInput").value = "";
  }
}

function enviarAcao(tipo) {
  const alvo = prompt("Escolha o jogador alvo:");
  if (alvo) {
    socket.emit("acao", { sala, nick, tipo, alvo });
  }
}

socket.on("salasAtivas", (salas) => {
  const lista = document.getElementById("listaSalas");
  lista.innerHTML = "";
  salas.forEach(s => {
    const li = document.createElement("li");
    li.innerText = s;
    lista.appendChild(li);
  });
});

socket.on("mensagemRecebida", ({ nick, texto }) => {
  const chat = document.getElementById("chatMensagens");
  const msg = document.createElement("div");
  msg.innerText = `${nick}: ${texto}`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
});

socket.on("acaoRecebida", ({ nick, tipo, alvo }) => {
  const log = document.getElementById("log");
  const linha = document.createElement("div");
  let emoji = tipo === "curar" ? "💚" : tipo === "matar" ? "💀" : "🧀";
  linha.innerText = `${emoji} ${nick} usou ${tipo} em ${alvo}`;
  log.appendChild(linha);
  log.scrollTop = log.scrollHeight;
});
