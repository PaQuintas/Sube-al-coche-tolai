import { io } from "socket.io-client";
import backgroundUrl from "@assets/generated_images/aguadulce-night-road.jpg";
import "./game.css";

const app = document.querySelector("#app");
const NAMES = ["Amador", "Hindemith", "El Susurrador", "Mitsu", "Alevín01", "Josué"];
const SESSION_KEY = "sube-al-coche-session";
const inviteCode = new URLSearchParams(window.location.search).get("room")?.trim().toUpperCase() ?? "";

document.documentElement.style.setProperty("--night-road-image", `url("${backgroundUrl}")`);

let socketConnected = false;
let busy = false;
let screen = inviteCode ? "entry" : "menu";
let notice = "";
let room = null;
let session = readSession();
let entryName = randomName();
let entryCode = inviteCode;

function readSession() {
  try {
    const value = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
    return value?.roomCode && value?.playerId ? value : null;
  } catch {
    return null;
  }
}

function saveSession(value) {
  session = value;
  localStorage.setItem(SESSION_KEY, JSON.stringify(value));
}

function clearSession() {
  session = null;
  room = null;
  localStorage.removeItem(SESSION_KEY);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function randomName() {
  return NAMES[Math.floor(Math.random() * NAMES.length)];
}

function scene(content) {
  return `
    <main class="scene">
      <header class="masthead">
        <div class="wordmark">
          <span class="wordmark-mark">ST</span>
          <span>Carretera sin destino</span>
        </div>
        <span class="masthead-note">UNA SALA · TUS COLEGAS · LA NOCHE</span>
      </header>
      ${content}
      <footer class="scene-caption">UNA SALA PARA TODA LA CUADRILLA <span>·</span> ALMERÍA</footer>
    </main>`;
}

function render(content) {
  if (app) app.innerHTML = scene(content);
}

function connectionNote() {
  return `<p class="connection-note ${socketConnected ? "is-connected" : ""}" role="status">
    <span class="connection-dot"></span>${socketConnected ? "Conectado en directo" : "Conectando con el servidor…"}
  </p>`;
}

function renderMenu() {
  screen = "menu";
  render(`
    <section class="stage">
      <p class="eyebrow">36.8123° N, 2.5694° W</p>
      <h1 class="hero-title">¡Sube al<br><em>coche, tolai!</em></h1>
      <p class="hero-copy">Una noche tranquila se transforma rápidamente en una noche de ALL IN. Reúne a la cuadrilla y descubre quién se atreve a seguir dentro.</p>
      <div class="menu-actions">
        <button class="button button-primary" data-action="play">Arrancamos motores 🚗</button>
        <button class="button button-secondary" data-action="rules">¿Cómo se viaja? 📖</button>
      </div>
      ${connectionNote()}
    </section>`);
}

function renderEntry() {
  screen = "entry";
  render(`
    <section class="stage">
      <p class="eyebrow">PUESTA A PUNTO</p>
      <h1 class="screen-title">Sube al Land Cruiser</h1>
      <div class="panel entry-panel">
        <label class="field-label" for="player-name">¿Cómo te llamas, tolai?</label>
        <input class="text-input" id="player-name" name="playerName" maxlength="24" value="${escapeHtml(entryName)}" autocomplete="nickname" />
        <form class="form-stack entry-form" data-form="create-room">
          <button class="button button-primary" type="submit" ${busy ? "disabled" : ""}>${busy ? "Conectando…" : "Crear Land Cruiser"}</button>
        </form>
        <div class="entry-divider"><span>o únete a tus amigos</span></div>
        <form class="form-stack join-entry-form" data-form="join-room">
          <label class="field-label" for="room-code">Código de sala
            <input class="text-input input-code" id="room-code" name="roomCode" maxlength="9" minlength="9" value="${escapeHtml(entryCode)}" placeholder="TOLAS7B2A" autocomplete="off" required />
          </label>
          <button class="button button-secondary" type="submit" ${busy ? "disabled" : ""}>Unirme al coche</button>
        </form>
        ${notice ? `<p class="room-notice" role="alert">${escapeHtml(notice)}</p>` : ""}
        <button class="button button-text" data-action="menu">Volver al menú</button>
      </div>
    </section>`);
}

function renderRules() {
  screen = "rules";
  render(`
    <section class="stage stage-wide">
      <p class="eyebrow">GUÍA DE CARRETERA</p>
      <h1 class="screen-title">¿Cómo se viaja?</h1>
      <div class="panel rules-panel">
        <ol class="rules-list">
          <li><span class="rule-number">01</span><span>El anfitrión crea una sala y comparte el código TOLAS con hasta 7 amigos más.</span></li>
          <li><span class="rule-number">02</span><span>Por turnos, subid la apuesta numérica. Quien tenga el turno también puede cerrar la puja; un TRIPLAZO cierra la puja al instante.</span></li>
          <li><span class="rule-number">03</span><span>Cuando se cierra la puja, cada pasajero decide si se queda dentro o se baja. El capitán se queda en el coche.</span></li>
          <li><span class="rule-number">04</span><span>Si la apuesta no supera la respuesta, el coche llega: capitán +3 (o +5 con TRIPLAZO), pasajeros dentro +2 (o +3 con TRIPLAZO), quienes bajaron 0.</span></li>
          <li><span class="rule-number">05</span><span>Si la apuesta supera la respuesta, hay siniestro: capitán −2 (o −4 con TRIPLAZO), pasajeros dentro −2 y quienes bajaron +2.</span></li>
        </ol>
        <button class="button button-primary rules-back" data-action="menu">Volver al menú</button>
      </div>
    </section>`);
}

function currentPlayer() {
  return room?.players.find((player) => player.id === session?.playerId);
}

function renderPlayers() {
  return (room?.players ?? []).map((player) => {
    const score = room.game?.scores?.[player.id] ?? 0;
    return `<div class="player-row">
      <span class="player-avatar">${escapeHtml(player.name.slice(0, 1).toUpperCase())}</span>
      <span class="player-name">${escapeHtml(player.name)}${player.isHost ? '<span class="host-tag">Anfitrión</span>' : ""}</span>
      <span class="player-state ${player.connected ? "is-online" : ""}">${player.connected ? "En línea" : "Desconectado"}</span>
      <strong class="score-chip">${score} pts</strong>
    </div>`;
  }).join("");
}

function renderLobby() {
  screen = "lobby";
  const isHost = currentPlayer()?.isHost;
  const count = room?.players?.length ?? 0;
  const connectedCount = room?.players?.filter((player) => player.connected).length ?? 0;
  const canStart = connectedCount >= 2 && socketConnected && !busy;
  render(`
    <section class="stage stage-wide">
      <p class="eyebrow">SALA DE ESPERA</p>
      <div class="panel lobby-panel">
        <div class="panel-heading">
          <div><h1 class="panel-title">Código de Sala</h1><p class="panel-copy">Comparte el código para que suba la cuadrilla.</p></div>
          <span class="room-status">${count}/8 PASAJEROS</span>
        </div>
        <div class="room-code-wrap room-code-large">
          <span class="room-code">${escapeHtml(room.code)}</span>
          <button class="copy-button" data-action="copy-code">Copiar código</button>
        </div>
        <section class="passengers-section" aria-live="polite">
          <h2 class="passengers-heading">Pasajeros subidos al coche:</h2>
          <div class="player-list">${renderPlayers() || '<p class="empty-passengers">Esperando a que los tolais suban al coche...</p>'}</div>
        </section>
        ${isHost ? `<button class="button button-primary start-trip-button" data-action="start-game" ${canStart ? "" : "disabled"}>¡Empezar Viaje! ⚡</button>
          <p class="wait-note">${connectedCount < 2 ? "Hace falta al menos otro pasajero conectado para arrancar." : "La partida empezará con todos los que están en la sala."}</p>` : '<p class="wait-note">Esperando a que el anfitrión empiece el viaje.</p>'}
        ${notice ? `<p class="room-notice" role="alert">${escapeHtml(notice)}</p>` : ""}
        ${connectionNote()}
        <button class="button button-text lobby-back" data-action="leave-room">Salir de la sala</button>
      </div>
    </section>`);
}

function renderGame() {
  screen = "game";
  const game = room.game;
  const me = currentPlayer();
  const isMyTurn = me?.id === game.turnPlayerId;
  const hasCaptain = Boolean(game.captainId);
  render(`
    <section class="stage stage-wide game-stage">
      <p class="eyebrow">RONDA ${game.roundNumber} · PUJAS POR TURNOS</p>
      <div class="game-question panel">
        <span class="field-label">PREGUNTA DE LA PARADA</span>
        <h1>${escapeHtml(game.question)}</h1>
        <div class="bet-readout">
          <span>APUESTA ACTUAL</span><strong>${game.currentBid.toLocaleString("es-ES")}</strong>
          <small>${game.captainName ? `Capitán: ${escapeHtml(game.captainName)}` : "Aún no hay apuesta"}</small>
        </div>
      </div>
      <div class="panel game-panel">
        <div class="game-turn ${isMyTurn ? "your-turn" : ""}" role="status">
          ${isMyTurn ? "¡Te toca, tolai!" : `Turno de ${escapeHtml(game.turnPlayerName || "…")}`}
        </div>
        ${isMyTurn ? `
          <label class="field-label bid-label" for="bid-input">Introduce una apuesta superior a ${game.currentBid.toLocaleString("es-ES")}
            <input class="text-input bid-input" id="bid-input" type="number" min="${Math.max(1, game.currentBid + 1)}" step="1" inputmode="numeric" placeholder="Tu número" ${busy ? "disabled" : ""} />
          </label>
          <div class="game-actions">
            <button class="button button-primary" data-action="raise-bet" ${busy ? "disabled" : ""}>Subir apuesta</button>
            <button class="button triplazo-button" data-action="triplazo" ${busy ? "disabled" : ""}>TRIPLAZO ⚡</button>
            ${hasCaptain ? '<button class="button button-secondary" data-action="close-auction" ' + (busy ? "disabled" : "") + '>Cerrar puja</button>' : ""}
          </div>
          <p class="wait-note">Con TRIPLAZO se cierra la puja inmediatamente. Cerrar la puja mantiene la apuesta actual.</p>
        ` : '<p class="wait-note">Espera tu turno para subir la apuesta, hacer TRIPLAZO o cerrar la puja.</p>'}
        ${notice ? `<p class="room-notice" role="alert">${escapeHtml(notice)}</p>` : ""}
      </div>
      <div class="player-list game-player-list">${renderPlayers()}</div>
      ${connectionNote()}
    </section>`);
}

function renderDecision() {
  screen = "decision";
  const game = room.game;
  const isCaptain = session?.playerId === game.captainId;
  const hasSubmitted = game.submittedPlayerIds.includes(session?.playerId);
  const required = Math.max(0, room.players.length - 1);
  const submitted = Math.max(0, game.submittedPlayerIds.length - 1);
  render(`
    <section class="stage">
      <p class="eyebrow">PUJA CERRADA · RONDA ${game.roundNumber}</p>
      <div class="panel decision-panel">
        <h1 class="screen-title">La apuesta final es ${game.currentBid.toLocaleString("es-ES")}</h1>
        <p class="panel-copy">Capitán: <strong>${escapeHtml(game.captainName)}</strong>${game.isTriplazo ? " · TRIPLAZO ⚡" : ""}</p>
        ${isCaptain
          ? '<div class="decision-locked">Eres el capitán y te quedas dentro del coche. 👑</div>'
          : hasSubmitted
            ? '<div class="decision-locked">Decisión registrada. Esperando al resto de pasajeros…</div>'
            : `<div class="decision-actions">
                <button class="button button-primary stay-button" data-action="stay" ${busy ? "disabled" : ""}>Quedarse dentro 🚗</button>
                <button class="button leave-button" data-action="leave" ${busy ? "disabled" : ""}>¡Me bajo! 🛑</button>
              </div>`}
        <p class="wait-note">Decisiones registradas: ${submitted}/${required}</p>
        ${notice ? `<p class="room-notice" role="alert">${escapeHtml(notice)}</p>` : ""}
      </div>
      <div class="player-list game-player-list">${renderPlayers()}</div>
      ${connectionNote()}
    </section>`);
}

function renderResults() {
  screen = "results";
  const game = room.game;
  const success = game.outcome === "SUCCESS";
  const rows = (game.results ?? []).map((result) => `
    <tr>
      <td>${result.isCaptain ? "👑 " : ""}${escapeHtml(result.name)}</td>
      <td>${result.isCaptain ? "Capitán · dentro" : result.decision === "STAY" ? "Dentro" : "Se bajó"}</td>
      <td class="${result.pointsEarned < 0 ? "negative-points" : "positive-points"}">${result.pointsEarned > 0 ? "+" : ""}${result.pointsEarned}</td>
      <td>${result.scoreTotal}</td>
    </tr>`).join("");
  const isHost = currentPlayer()?.isHost;
  render(`
    <section class="stage stage-wide results-stage">
      <p class="eyebrow">RONDA ${game.roundNumber} · RESULTADOS</p>
      <div class="panel results-panel">
        <h1 class="screen-title ${success ? "success-title" : "crash-title"}">${success ? "¡No os habéis estrellado!" : "¡Siniestro!"}</h1>
        <p class="panel-copy">${escapeHtml(game.question)}</p>
        <div class="result-numbers">
          <span>APUESTA <strong>${game.currentBid.toLocaleString("es-ES")}</strong></span>
          <span>VALOR REAL <strong>${game.actualValue?.toLocaleString("es-ES") ?? "—"}</strong></span>
        </div>
        <div class="table-wrap">
          <table class="results-table">
            <thead><tr><th>Pasajero</th><th>Decisión</th><th>Esta ronda</th><th>Total</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        ${isHost
          ? `<button class="button button-primary start-trip-button" data-action="next-round" ${busy ? "disabled" : ""}>Siguiente ronda ↻</button>`
          : '<p class="wait-note">Esperando a que el anfitrión abra la siguiente ronda.</p>'}
        ${notice ? `<p class="room-notice" role="alert">${escapeHtml(notice)}</p>` : ""}
        <button class="button button-text" data-action="leave-room">Salir de la partida</button>
      </div>
    </section>`);
}

function renderRoom() {
  if (!room) return renderMenu();
  if (room.phase === "LOBBY") return renderLobby();
  if (room.phase === "BETTING") return renderGame();
  if (room.phase === "DECISION") return renderDecision();
  return renderResults();
}

function setRoom(value) {
  room = value;
  if (value?.code && session) {
    saveSession({ ...session, roomCode: value.code });
    renderRoom();
  }
}

function emitWithAck(eventName, payload, onSuccess) {
  notice = "";
  busy = true;
  if (room) renderRoom();
  else if (screen === "entry") renderEntry();

  const send = () => {
    socket.timeout(8000).emit(eventName, payload, (timeoutError, response) => {
      busy = false;
      if (timeoutError) {
        notice = "El servidor no respondió. Comprueba la conexión e inténtalo otra vez.";
      } else if (!response?.success) {
        notice = response?.message ?? "No se pudo completar la acción.";
      } else {
        notice = "";
        if (response.room) setRoom(response.room);
        onSuccess?.(response);
      }
      if (room) renderRoom();
      else if (screen === "entry") renderEntry();
      else renderMenu();
    });
  };

  if (socket.connected) {
    send();
    return;
  }
  const onConnect = () => {
    socket.off("connect_error", onError);
    send();
  };
  const onError = () => {
    socket.off("connect", onConnect);
    busy = false;
    notice = "No se pudo conectar con el servidor. Vuelve a intentarlo.";
    if (screen === "entry") renderEntry();
    else renderMenu();
  };
  socket.once("connect", onConnect);
  socket.once("connect_error", onError);
  socket.connect();
}

function nameFromEntry() {
  return document.getElementById("player-name")?.value.trim() || randomName();
}

function leaveCurrentRoom() {
  if (!room || !session) {
    clearSession();
    screen = "menu";
    notice = "";
    renderMenu();
    return;
  }
  emitWithAck("leaveRoom", { roomCode: room.code }, () => {
    clearSession();
    screen = "menu";
    notice = "";
    renderMenu();
  });
}

app?.addEventListener("submit", (event) => {
  const form = event.target.closest("form[data-form]");
  if (!form) return;
  event.preventDefault();
  if (busy) return;
  const playerName = nameFromEntry();

  if (form.dataset.form === "create-room") {
    emitWithAck("createRoom", { playerName }, (response) => {
      saveSession({ roomCode: response.room.code, playerId: response.playerId, playerName });
      setRoom(response.room);
    });
  } else if (form.dataset.form === "join-room") {
    const roomCode = new FormData(form).get("roomCode")?.toString().trim().toUpperCase() ?? "";
    if (!/^TOLAS[A-Z0-9]{4}$/.test(roomCode)) {
      notice = "El código debe tener el formato TOLAS7B2A.";
      renderEntry();
      return;
    }
    emitWithAck("joinRoom", { roomCode, playerName }, (response) => {
      saveSession({ roomCode, playerId: response.playerId, playerName });
      setRoom(response.room);
    });
  }
});

app?.addEventListener("input", (event) => {
  if (event.target.id === "player-name") entryName = event.target.value;
  if (event.target.id === "room-code") entryCode = event.target.value.toUpperCase();
});

app?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button || button.disabled) return;
  const action = button.dataset.action;

  if (action === "play") {
    notice = "";
    renderEntry();
  } else if (action === "rules") {
    renderRules();
  } else if (action === "menu") {
    screen = "menu";
    notice = "";
    renderMenu();
  } else if (action === "copy-code") {
    if (!navigator.clipboard) {
      notice = `Comparte este código: ${room.code}`;
      renderRoom();
    } else {
      navigator.clipboard.writeText(room.code).then(() => {
        notice = "Código copiado.";
        renderRoom();
      }).catch(() => {
        notice = `Comparte este código: ${room.code}`;
        renderRoom();
      });
    }
  } else if (action === "start-game") {
    emitWithAck("startGame", { roomCode: room.code });
  } else if (action === "raise-bet" || action === "triplazo") {
    const bet = Number(document.getElementById("bid-input")?.value);
    if (!Number.isSafeInteger(bet) || bet <= room.game.currentBid) {
      notice = "Introduce un número entero mayor que la apuesta actual.";
      renderGame();
      return;
    }
    emitWithAck("playerBet", { roomCode: room.code, bet, isTriplazo: action === "triplazo" });
  } else if (action === "close-auction") {
    emitWithAck("closeAuction", { roomCode: room.code });
  } else if (action === "stay" || action === "leave") {
    emitWithAck("submitDecision", { roomCode: room.code, decision: action === "stay" ? "STAY" : "LEAVE" });
  } else if (action === "next-round") {
    emitWithAck("nextRound", { roomCode: room.code });
  } else if (action === "leave-room") {
    leaveCurrentRoom();
  }
});

const socket = io({
  path: "/ws/game",
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  timeout: 8000,
});

socket.on("connect", () => {
  socketConnected = true;
  if (session) {
    emitWithAck("resumeRoom", { roomCode: session.roomCode, playerId: session.playerId }, (response) => {
      setRoom(response.room);
    });
  } else if (screen === "entry") {
    renderEntry();
  } else {
    renderMenu();
  }
});

socket.on("disconnect", () => {
  socketConnected = false;
  if (room) renderRoom();
  else if (screen === "entry") renderEntry();
  else renderMenu();
});

socket.on("connect_error", () => {
  socketConnected = false;
});

socket.on("roomState", (state) => {
  setRoom(state);
});

socket.on("gameError", (payload) => {
  notice = payload?.message ?? "Ha ocurrido un error en la partida.";
  if (room) renderRoom();
});

if (session) {
  screen = "connecting";
  render(`<section class="stage"><p class="eyebrow">RECONECTANDO</p><h1 class="screen-title">Volviendo a la sala…</h1>${connectionNote()}</section>`);
} else if (inviteCode) {
  renderEntry();
} else {
  renderMenu();
}
