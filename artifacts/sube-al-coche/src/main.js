import { io } from "socket.io-client";
import backgroundUrl from "@assets/generated_images/aguadulce-night-road.jpg";
import "./game.css";

const app = document.querySelector("#app");
document.documentElement.style.setProperty("--night-road-image", `url("${backgroundUrl}")`);
let roomCode = "";
let playerId = "";
let room = null;
let socket = null;
let socketConnected = false;
let copied = false;
let screen = "menu";
let notice = "";

const playerKey = (code) => `sube-player-${code}`;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function scene(content) {
  return `
    <main class="scene">
      <header class="masthead">
        <a class="wordmark" href="/" data-action="home" aria-label="Volver al inicio">
          <span class="wordmark-mark">ST</span>
          <span>Carretera sin destino</span>
        </a>
        <span class="masthead-note">Una sala · Tus colegas · La noche</span>
      </header>
      ${content}
      <footer class="scene-caption">Kilómetro 00 <span>·</span> La noche es joven</footer>
    </main>`;
}

function frame(content) {
  app.innerHTML = scene(content);
}

function renderMenu() {
  screen = "menu";
  frame(`
    <section class="stage">
      <p class="eyebrow">El plan empieza aquí</p>
      <h1 class="hero-title">¡Sube al<br><em>coche, tolai!</em></h1>
      <p class="hero-copy">Una noche cualquiera, una carretera cualquiera y tu gente de siempre. Reúne a la cuadrilla y ya veremos dónde acabamos.</p>
      <div class="menu-actions">
        <button class="button button-primary" data-action="create">Arrancamos motores 🚗</button>
        <button class="button button-secondary" data-action="rules">¿Cómo se viaja? 📖</button>
      </div>
      <p class="under-note">UNA SALA PARA TODA LA CUADRILLA</p>
    </section>`);
}

function renderRules() {
  screen = "rules";
  frame(`
    <section class="stage">
      <p class="eyebrow">Guía de carretera</p>
      <div class="panel">
        <div class="panel-heading">
          <div>
            <h1 class="panel-title">¿Cómo se viaja?</h1>
            <p class="panel-copy">Cuatro indicaciones antes de arrancar.</p>
          </div>
        </div>
        <ol class="rules-list">
          <li><span class="rule-number">01</span><span>Una persona crea la sala y comparte el enlace o el código con el resto.</span></li>
          <li><span class="rule-number">02</span><span>Cada amigo entra con su nombre; aparecerá en la lista al conectarse.</span></li>
          <li><span class="rule-number">03</span><span>La sala admite hasta ocho viajeros y muestra en directo quién sigue conectado.</span></li>
          <li><span class="rule-number">04</span><span>Esperad a que llegue la cuadrilla. El viaje empieza cuando estéis todos.</span></li>
        </ol>
        <button class="button button-secondary rules-back" data-action="home">Volver al menú</button>
      </div>
    </section>`);
}

function renderRoomLoading(message = "Comprobando quién va en el coche…") {
  screen = "loading";
  frame(`
    <section class="stage">
      <p class="eyebrow">Arrancando motores</p>
      <div class="panel">
        <div class="loading-pulse" aria-label="Cargando sala"></div>
        <p class="panel-copy center-copy">${escapeHtml(message)}</p>
      </div>
    </section>`);
}

function renderRoomError(message) {
  screen = "room-error";
  frame(`
    <section class="stage">
      <p class="eyebrow">Kilómetro desconocido</p>
      <div class="panel">
        <h1 class="panel-title">No encontramos esa sala</h1>
        <p class="panel-copy">${escapeHtml(message)}</p>
        <button class="button button-primary" data-action="home">Volver al menú <span aria-hidden="true">↗</span></button>
      </div>
    </section>`);
}

function renderGuestJoin(error = "") {
  screen = "guest";
  frame(`
    <section class="stage">
      <p class="eyebrow">Pasajeros a bordo</p>
      <div class="panel">
        <div class="panel-heading">
          <div>
            <h1 class="panel-title">Te guardamos sitio</h1>
            <p class="panel-copy">Entra con tu nombre a la sala <strong>${escapeHtml(roomCode)}</strong>.</p>
          </div>
          <button class="icon-button" data-action="home" aria-label="Volver al menú">×</button>
        </div>
        <form class="form-stack" data-form="direct-join">
          <label class="field-label" for="guest-name">Tu nombre
            <input class="text-input" id="guest-name" name="playerName" placeholder="Tu nombre de ruta" maxlength="24" minlength="1" autocomplete="nickname" required />
          </label>
          ${error ? `<p class="error-message" role="alert">${escapeHtml(error)}</p>` : ""}
          <button class="button button-primary" type="submit">Subirme al coche <span aria-hidden="true">↗</span></button>
        </form>
      </div>
    </section>`);
}

function renderLobby() {
  screen = "lobby";
  const passengers = room?.players.filter((player) => !player.isHost) ?? [];
  const isHost = room?.players.some((player) => player.id === playerId && player.isHost) ?? false;
  const hasStarted = room?.status === "started";
  frame(`
    <section class="stage stage-wide">
      <p class="eyebrow">Pasajeros a bordo</p>
      <div class="lobby-status">
        <span class="live-pill"><i class="${socketConnected ? "live-dot" : "live-dot offline"}"></i>${socketConnected ? "Conectado en directo" : "Reconectando…"}</span>
        <span class="room-status">${hasStarted ? "VIAJE EN MARCHA" : "SALA DE ESPERA"}</span>
      </div>
      <div class="panel lobby-panel">
        <div class="panel-heading">
          <div>
            <h1 class="panel-title">${hasStarted ? "¡Buen viaje!" : "Código de Sala"}</h1>
            <p class="panel-copy">${hasStarted ? "El viaje ya ha comenzado." : "Comparte el código para que suba la cuadrilla."}</p>
          </div>
          ${hasStarted ? "" : '<span class="radio-mark" aria-hidden="true">LIVE</span>'}
        </div>
        <div class="room-code-wrap room-code-large">
          <span class="room-code">${escapeHtml(room?.code ?? roomCode)}</span>
          <button class="copy-button" data-action="copy" aria-label="Copiar enlace de invitación">${copied ? "Copiado" : "Copiar enlace"}</button>
        </div>
        <section class="passengers-section" aria-live="polite">
          <h2 class="passengers-heading">Pasajeros subidos al coche:</h2>
          <div class="player-list">
          ${passengers.length ? passengers.map((player, index) => `
            <div class="player-row">
              <span class="player-avatar ${index % 2 ? "avatar-alt" : ""}">${escapeHtml(player.name.trim().slice(0, 1).toUpperCase())}</span>
              <span class="player-name">${escapeHtml(player.name)}</span>
              <span class="player-state ${player.connected ? "is-online" : ""}">${player.connected ? "Conectado" : "Ausente"}</span>
            </div>`).join("")
            : '<p class="empty-passengers">Esperando a que los tolais suban al coche...</p>'}
          </div>
        </section>
        ${notice ? `<p class="room-notice" role="status">${escapeHtml(notice)}</p>` : ""}
        ${hasStarted
          ? '<p class="trip-started" role="status">¡El viaje ha comenzado! ⚡</p>'
          : isHost
            ? '<button class="button button-primary start-trip-button" data-action="start">¡Empezar Viaje! ⚡</button>'
            : '<p class="wait-note">Esperando a que el conductor empiece el viaje.</p>'}
        ${hasStarted ? "" : `
          <details class="join-existing">
            <summary>¿Te han pasado un código? Únete a esa sala</summary>
            <form class="form-stack join-code-form" data-form="join-existing">
              <label class="field-label" for="join-name">Tu nombre
                <input class="text-input" id="join-name" name="playerName" maxlength="24" minlength="1" autocomplete="nickname" required />
              </label>
              <label class="field-label" for="join-code">Código de sala
                <input class="text-input input-code" id="join-code" name="code" maxlength="12" minlength="1" autocomplete="off" required />
              </label>
              <button class="button button-secondary" type="submit">Subirme al coche</button>
            </form>
          </details>`}
        <button class="button button-text lobby-back" data-action="home">Volver al menú</button>
      </div>
    </section>`);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "content-type": "application/json", ...options.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "No se pudo completar la solicitud.");
  return body;
}

function connectToRoom() {
  socket?.disconnect();
  socketConnected = false;
  socket = io(window.location.origin, {
    path: "/ws/game",
    auth: { roomCode, playerId },
    transports: ["websocket", "polling"],
  });
  socket.on("connect", () => {
    socketConnected = true;
    renderLobby();
  });
  socket.on("disconnect", () => {
    socketConnected = false;
    if (screen === "lobby") renderLobby();
  });
  socket.on("connect_error", () => {
    socketConnected = false;
    if (screen === "lobby") renderLobby();
  });
  const update = (nextRoom) => {
    const latest = nextRoom?.room ?? nextRoom;
    if (!latest || !Array.isArray(latest.players)) return;
    room = latest;
    if (screen === "lobby") renderLobby();
  };
  socket.on("room:state", update);
  socket.on("room:update", update);
}

async function createGameRoom() {
  renderRoomLoading("Creando una sala para la cuadrilla…");
  try {
    const entry = await apiRequest("/api/rooms", {
      method: "POST",
      body: JSON.stringify({ playerName: "Conductor" }),
    });
    roomCode = entry.room.code;
    playerId = entry.playerId;
    room = entry.room;
    localStorage.setItem(playerKey(roomCode), playerId);
    history.pushState({}, "", `/room/${roomCode}`);
    connectToRoom();
    renderLobby();
  } catch (error) {
    renderRoomError(error.message);
  }
}

async function joinGameRoom(code, playerName) {
  const normalizedCode = code.trim().toUpperCase();
  try {
    const entry = await apiRequest(`/api/rooms/${encodeURIComponent(normalizedCode)}/join`, {
      method: "POST",
      body: JSON.stringify({ playerName }),
    });
    roomCode = entry.room.code;
    playerId = entry.playerId;
    room = entry.room;
    localStorage.setItem(playerKey(roomCode), playerId);
    history.pushState({}, "", `/room/${roomCode}`);
    connectToRoom();
    renderLobby();
  } catch (error) {
    if (screen === "guest") renderGuestJoin(error.message);
    else {
      notice = error.message;
      renderLobby();
    }
  }
}

async function startTrip() {
  if (!roomCode || !playerId) return;
  notice = "";
  try {
    room = await apiRequest(`/api/rooms/${encodeURIComponent(roomCode)}/start`, {
      method: "POST",
      body: JSON.stringify({ playerId }),
    });
    renderLobby();
  } catch (error) {
    notice = error.message;
    renderLobby();
  }
}

async function openRoom(code) {
  roomCode = code.trim().toUpperCase();
  playerId = localStorage.getItem(playerKey(roomCode)) ?? "";
  room = null;
  renderRoomLoading();
  try {
    room = await apiRequest(`/api/rooms/${encodeURIComponent(roomCode)}`);
    if (!playerId || !room.players.some((player) => player.id === playerId)) {
      renderGuestJoin();
      return;
    }
    connectToRoom();
    renderLobby();
  } catch (error) {
    renderRoomError(error.message);
  }
}

async function copyInvite() {
  try {
    await navigator.clipboard.writeText(`${window.location.origin}/room/${roomCode}`);
    copied = true;
    notice = "Enlace copiado. Pásalo al grupo.";
    renderLobby();
    window.setTimeout(() => {
      copied = false;
      notice = "";
      if (screen === "lobby") renderLobby();
    }, 1800);
  } catch {
    notice = "No se pudo copiar; comparte el código de sala.";
    renderLobby();
  }
}

function goHome() {
  socket?.disconnect();
  socket = null;
  room = null;
  playerId = "";
  roomCode = "";
  notice = "";
  history.pushState({}, "", "/");
  renderMenu();
}

function loadCurrentRoute() {
  const match = window.location.pathname.match(/^\/room\/([A-Za-z0-9]+)\/?$/);
  if (match) openRoom(match[1]);
  else renderMenu();
}

app.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  event.preventDefault();
  const action = button.dataset.action;
  if (action === "home") goHome();
  else if (action === "create") createGameRoom();
  else if (action === "rules") renderRules();
  else if (action === "copy") copyInvite();
  else if (action === "start") startTrip();
});

app.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-form]");
  if (!form) return;
  event.preventDefault();
  const values = new FormData(form);
  const name = String(values.get("playerName") ?? "").trim();
  if (!name) return;
  if (form.dataset.form === "join-existing") {
    const code = String(values.get("code") ?? "");
    if (code.trim()) joinGameRoom(code, name);
  }
  if (form.dataset.form === "direct-join") joinGameRoom(roomCode, name);
});

window.addEventListener("popstate", loadCurrentRoute);
loadCurrentRoute();
