import { io } from "socket.io-client";
import "./game.css";

const app = document.querySelector("#app");
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
      <div class="horizon-glow" aria-hidden="true"></div>
      <div class="streetlight streetlight-left" aria-hidden="true"></div>
      <div class="streetlight streetlight-right" aria-hidden="true"></div>
      <div class="road" aria-hidden="true"><span class="road-line"></span></div>
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
        <button class="button button-primary" data-action="create">Arrancar Motor <span aria-hidden="true">↗</span></button>
        <button class="button button-secondary" data-action="rules">¿Cómo se viaja? <span aria-hidden="true">i</span></button>
        <button class="button button-text" data-action="join">Tengo un código de sala <span aria-hidden="true">↗</span></button>
      </div>
      <p class="under-note">HASTA 8 VIAJEROS <span>·</span> SOLO NECESITAS UN NOMBRE</p>
    </section>`);
}

function renderEntry(kind, error = "") {
  screen = kind;
  const creating = kind === "create";
  frame(`
    <section class="stage">
      <p class="eyebrow">${creating ? "El plan empieza aquí" : "Te están esperando"}</p>
      <div class="panel">
        <div class="panel-heading">
          <div>
            <h1 class="panel-title">${creating ? "Ponte al volante" : "¿Tienes sitio?"}</h1>
            <p class="panel-copy">${creating ? "Crea una sala y pasa el código a tu gente." : "Mete el código que te han pasado y súbete."}</p>
          </div>
          <button class="icon-button" data-action="home" aria-label="Volver al menú">×</button>
        </div>
        <form class="form-stack" data-form="${creating ? "create" : "join"}">
          <label class="field-label" for="player-name">¿Cómo te llamamos?
            <input class="text-input" id="player-name" name="playerName" placeholder="Tu nombre de ruta" maxlength="24" minlength="1" autocomplete="nickname" required />
          </label>
          ${creating ? "" : `<label class="field-label" for="room-code">Código de sala
            <input class="text-input input-code" id="room-code" name="code" placeholder="Ej. 4B6282" maxlength="12" minlength="1" autocapitalize="characters" required />
          </label>`}
          ${error ? `<p class="error-message" role="alert">${escapeHtml(error)}</p>` : ""}
          <button class="button button-primary" type="submit">${creating ? "Crear sala" : "Subirme al coche"} <span aria-hidden="true">↗</span></button>
        </form>
        <button class="button button-text switch-action" data-action="${creating ? "join" : "create"}">${creating ? "Me han pasado un código" : "Prefiero crear la sala"} <span aria-hidden="true">↗</span></button>
      </div>
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
          <button class="icon-button" data-action="home" aria-label="Volver al menú">×</button>
        </div>
        <ol class="rules-list">
          <li><span class="rule-number">01</span><span>Una persona crea la sala y comparte el enlace o el código con el resto.</span></li>
          <li><span class="rule-number">02</span><span>Cada amigo entra con su nombre; aparecerá en la lista al conectarse.</span></li>
          <li><span class="rule-number">03</span><span>La sala admite hasta ocho viajeros y muestra en directo quién sigue conectado.</span></li>
          <li><span class="rule-number">04</span><span>Esperad a que llegue la cuadrilla. El viaje empieza cuando estéis todos.</span></li>
        </ol>
        <button class="button button-primary" data-action="create">Vale, arrancamos <span aria-hidden="true">↗</span></button>
      </div>
    </section>`);
}

function renderRoomLoading() {
  screen = "loading";
  frame(`
    <section class="stage">
      <p class="eyebrow">Buscando la sala</p>
      <div class="panel">
        <div class="loading-pulse" aria-label="Cargando sala"></div>
        <p class="panel-copy center-copy">Comprobando quién va en el coche…</p>
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
  const players = room?.players ?? [];
  const emptySeats = Math.max(0, (room?.maxPlayers ?? 8) - players.length);
  const myName = players.find((player) => player.id === playerId)?.name;
  frame(`
    <section class="stage stage-wide">
      <p class="eyebrow">Pasajeros a bordo</p>
      <div class="lobby-status">
        <span class="live-pill"><i class="${socketConnected ? "live-dot" : "live-dot offline"}"></i>${socketConnected ? "Conectado en directo" : "Reconectando…"}</span>
        <span class="room-status">SALA DE ESPERA</span>
      </div>
      <div class="panel lobby-panel">
        <div class="panel-heading">
          <div>
            <h1 class="panel-title">La cuadrilla</h1>
            <p class="panel-copy">${myName ? `Dentro como ${escapeHtml(myName)}.` : "La noche empieza cuando estéis todos."}</p>
          </div>
          <span class="radio-mark" aria-hidden="true">LIVE</span>
        </div>
        <div class="room-code-wrap">
          <div class="room-code-label">Código para invitar<span class="room-code">${escapeHtml(room?.code ?? roomCode)}</span></div>
          <button class="copy-button" data-action="copy">${copied ? "Copiado" : "Copiar enlace"} <span aria-hidden="true">${copied ? "✓" : "↗"}</span></button>
        </div>
        <div class="list-heading"><h2>En el coche</h2><span>${players.length} / ${room?.maxPlayers ?? 8} VIAJEROS</span></div>
        <div class="player-list">
          ${players.map((player, index) => `
            <div class="player-row">
              <span class="player-avatar ${index % 2 ? "avatar-alt" : ""}">${escapeHtml(player.name.trim().slice(0, 1).toUpperCase())}</span>
              <span class="player-name">${escapeHtml(player.name)}${player.isHost ? '<small class="host-tag">Al volante</small>' : ""}</span>
              <span class="player-state ${player.connected ? "is-online" : ""}">${player.connected ? "Conectado" : "Ausente"}</span>
            </div>`).join("")}
          ${Array.from({ length: emptySeats }, () => '<div class="empty-seat"><span>+</span>Un asiento libre para alguien de la cuadrilla</div>').join("")}
        </div>
        <p class="wait-note">${notice ? escapeHtml(notice) : "La sala está abierta. Comparte el enlace y espera a que llegue tu gente."}</p>
        <div class="lobby-actions">
          <button class="button button-secondary" data-action="home">Salir de la sala</button>
          <button class="button button-primary" data-action="copy">Invitar a la cuadrilla <span aria-hidden="true">↗</span></button>
        </div>
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

async function createGameRoom(playerName) {
  try {
    const entry = await apiRequest("/api/rooms", {
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
    renderEntry("create", error.message);
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
    else renderEntry("join", error.message);
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
  else if (action === "create") renderEntry("create");
  else if (action === "join") renderEntry("join");
  else if (action === "rules") renderRules();
  else if (action === "copy") copyInvite();
});

app.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-form]");
  if (!form) return;
  event.preventDefault();
  const values = new FormData(form);
  const name = String(values.get("playerName") ?? "").trim();
  if (!name) return;
  if (form.dataset.form === "create") createGameRoom(name);
  if (form.dataset.form === "join") joinGameRoom(String(values.get("code") ?? ""), name);
  if (form.dataset.form === "direct-join") joinGameRoom(roomCode, name);
});

window.addEventListener("popstate", loadCurrentRoute);
loadCurrentRoute();
