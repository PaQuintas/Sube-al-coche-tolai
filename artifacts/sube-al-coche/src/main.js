import { io } from "socket.io-client";
import backgroundUrl from "@assets/generated_images/aguadulce-night-road.jpg";
import "./game.css";

const app = document.querySelector("#app");
const NAMES = ["Amador", "Candimir", "El Susurrador", "Mitsu", "Alevín01", "Josué"];
const SESSION_KEY = "sube-al-coche-session";

document.documentElement.style.setProperty("--night-road-image", `url("${backgroundUrl}")`);

let socketConnected = false;
let busy = false;
let screen = "menu";
let notice = "";
let room = null;
let session = readSession();
let entryName = randomName();
let entryCode = "";

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
        <span class="masthead-note">UNA SALA · LOS CHAVALES · LA NOCHE</span>
      </header>
      ${content}
      <footer class="scene-caption">
  <div>TODAY IS THE LAST NIGHT</div>
  <div style="margin-top: 4px; opacity: 0.8;">ARE YOU READY FOR TONIGHT?</div>
</footer>
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
      <p class="hero-copy">Una noche tranquila se transforma rápidamente en una noche de ALL IN. ¿Serás el más vasilón?.</p>
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
            <input class="text-input input-code" id="room-code" name="roomCode" maxlength="9" minlength="9" value="${escapeHtml(entryCode)}" autocomplete="off" required />
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
        <h2 style="font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; color: #f59e0b; margin-bottom: 12px;">Mecánica del viaje</h2>
        <ol class="rules-list">
          <li><span class="rule-number">01</span><span>El anfitrión crea la sala y comparte el código con hasta 7 colegas.</span></li>
          <li><span class="rule-number">02</span><span>En tu turno, sube la apuesta numérica o plántate para salir de las pujas de la ronda.</span></li>
          <li><span class="rule-number">03</span><span>La puja termina cuando todos se plantan: el último en pujar se convierte en el <strong>Capitán</strong>.</span></li>
          <li><span class="rule-number">04</span><span><strong>TRIPLAZO:</strong> solo disponible en tu primer turno. Cierra la puja al instante y dices la cifra exacta.</span></li>
          <li><span class="rule-number">05</span><span>El Capitán conduce sí o sí. Los demás deciden: <strong>¿se quedan en el coche o van en seat-pata?</strong></span></li>
        </ol>

        <h2 style="font-size: 1.05rem; text-transform: uppercase; letter-spacing: 1.2px; color: #f59e0b; margin-top: 24px; margin-bottom: 14px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
          ⚖️ Tabla de Puntuaciones
        </h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-bottom: 24px;">
          <!-- Tarjeta 1: Coche llega sano -->
          <div style="background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.25); border-radius: 8px; padding: 14px; font-size: 0.85rem; line-height: 1.5;">
            <div style="font-weight: 700; color: #4ade80; margin-bottom: 8px; font-size: 0.92rem;">🟢 El coche NO se estrella</div>
            <div style="color: #a1a1aa; font-size: 0.76rem; margin-bottom: 8px;">(Apuesta ≤ Respuesta real)</div>
            <div>👑 <strong>Capitán:</strong> +5 pts <span style="color: #4ade80; font-size: 0.78rem;">(+6 si clava el número)</span></div>
            <div>👥 <strong>Tripulantes:</strong> +2 pts <span style="color: #4ade80; font-size: 0.78rem;">(+3 en pleno)</span></div>
            <div>🚶‍♂️ <strong>Máquinas que bajaron:</strong> -1 pto</div>
          </div>

          <!-- Tarjeta 2: Hostión -->
          <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 8px; padding: 14px; font-size: 0.85rem; line-height: 1.5;">
            <div style="font-weight: 700; color: #f87171; margin-bottom: 8px; font-size: 0.92rem;">💥 El coche SE ESTRELLA</div>
            <div style="color: #a1a1aa; font-size: 0.76rem; margin-bottom: 8px;">(Apuesta &gt; Respuesta real)</div>
            <div>👑 <strong>Capitán:</strong> -3 pts</div>
            <div>👥 <strong>Tripulantes:</strong> -2 pts</div>
            <div>🏃‍♂️ <strong>Los que bajaron:</strong> +2 pts</div>
          </div>

          <!-- Tarjeta 3: TRIPLAZO -->
          <div style="background: rgba(234, 179, 8, 0.08); border: 1px solid rgba(234, 179, 8, 0.25); border-radius: 8px; padding: 14px; font-size: 0.85rem; line-height: 1.5; grid-column: 1 / -1;">
            <div style="font-weight: 700; color: #facc15; margin-bottom: 8px; font-size: 0.92rem;">🚀 Modo TRIPLAZO (Todo o Nada)</div>
            <div style="margin-bottom: 4px;">🎯 <strong>Si acierta exacto:</strong> Capitán +8 pts · Pasajeros +4 pts · Máquinas -1 pto</div>
            <div>💀 <strong>Si falla:</strong> Capitán -5 pts · Pasajeros -3 pts · Personas que bajaron +2 pts</div>
          </div>
        </div>

        <button class="button button-primary rules-back" data-action="menu">Volver al menú</button>
      </div>
      </div>
    </section>`);
}

function currentPlayer() {
  return room?.players.find((player) => player.id === session?.playerId);
}

function renderPlayers() {
  return (room?.players ?? []).map((player) => {
    const score = room.game?.scores?.[player.id] ?? 0;
    const status = !player.connected
      ? "Desconectado"
      : room.phase === "BETTING"
        ? player.folded
          ? "Plantado"
          : player.id === room.game.turnPlayerId
            ? "Su turno"
            : player.hasActed
              ? "Ha pujado"
              : "En puja"
        : room.phase === "DECISION" && room.game.submittedPlayerIds.includes(player.id)
          ? "Decisión lista"
          : "En línea";
    return `<div class="player-row">
      <span class="player-avatar">${escapeHtml(player.name.slice(0, 1).toUpperCase())}</span>
      <span class="player-name">${escapeHtml(player.name)}${player.isHost ? '<span class="host-tag">Anfitrión</span>' : ""}</span>
      <span class="player-state ${player.connected ? "is-online" : ""}">${status}</span>
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
      ${(() => {
        const tips = [
          "Debate con los demás, que esto no es el bingo.",
          "Si ves que alguien se pasa pujando o solo dice tonterías, no dudes en decirle que es un Tolas.",
          "Tirar un Triplazo te da +8 puntos si clavas la cifra exacta, pero si te estrellas te comerás un -5. Piensa bien si te compensa la vacilada.",
          "Si no te fías del capitán porque es un tolai y crees que se va a equivoca, bájate del coche: salvarte de una buena hostia te da +2 puntos gratis.",
          "Meter un farol con una cifra loca puede forzar a los demás a plantarse... salvo que te quedes solo y te toque comerte un mojón.",
          "El capitán se lleva +4 puntos si acierta, pero si se estrella pierde -3. La avaricia rompe el saco, tolai.",
          "Callate un poco y juega, que eres un tolas",
          "Recuerda que puede que tengas la razón, pero que a lo mejor importa una mierda."
        ];
        if (room && !room._lobbyTip) {
          room._lobbyTip = tips[Math.floor(Math.random() * tips.length)];
        }
        const chosenTip = (room && room._lobbyTip) || tips[0];
        return `
          <div style="margin: 22px auto 14px; padding: 10px 16px; border-radius: 8px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); font-size: 0.82rem; color: #a1a1aa; line-height: 1.45; text-align: center; max-width: 440px;">
            💡 <strong style="color: #e4e4e7;">Protip:</strong> ${chosenTip}
          </div>
        `;
      })()}
      <button class="button button-text lobby-back" data-action="leave-room">Salir de la sala</button>
    </div>
  </section>`);
}

function renderGame() {
  screen = "game";
  const game = room.game;
  const me = currentPlayer();
  const isMyTurn = me?.id === game.turnPlayerId;
  const activePlayers = room.players.filter((player) => player.connected && !player.folded).length;
  const canStand = Boolean(game.captainId) || activePlayers > 1;
  render(`
    <section class="stage stage-wide game-stage">
      <p class="eyebrow">RONDA ${game.roundNumber} · PUJAS POR TURNOS</p>
      <div class="game-question panel">
        <span class="field-label">PREGUNTA DE LA PARADA</span>
        <h1>${escapeHtml(game.question)}</h1>
       <div class="bet-readout">
         <span>APUESTA ACTUAL</span><strong>${game.currentBid.toLocaleString("es-ES")}</strong>
         <small>${game.captainName ? `Capitán: ${escapeHtml(game.captainName)}` : "Aún no hay apuesta"}</small>
         ${(() => {
  if (!game.bidsHistory || game.bidsHistory.length === 0) return '';
           const latestByPlayer = Object.values(
             game.bidsHistory.reduce((acc, b) => { acc[b.playerName] = b; return acc; }, {})
           );
           // Ordenar apuestas de mayor a menor
           latestByPlayer.sort((a, b) => (Number(b.bid) || 0) - (Number(a.bid) || 0));
           if (latestByPlayer.length === 0) return '';
  return `
    <div style="margin-top: 8px; font-size: 0.72rem; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; align-items: center; opacity: 0.85;">
      <span style="font-size: 0.65rem; text-transform: uppercase; color: #a1a1aa; font-weight: 600; letter-spacing: 0.5px;">Últimas apuestas:</span>
      ${latestByPlayer.map((b) => `
        <span style="background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); display: inline-flex; align-items: center; gap: 3px;">
          ${escapeHtml(b.playerName)}: <strong>${Number(b.bid).toLocaleString("es-ES")}</strong>${b.isTriplazo ? ' 🚀' : ''}
        </span>
      `).join('')}
    </div>
  `;
})()}
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
            <button class="button button-secondary" data-action="plant" ${busy || !canStand ? "disabled" : ""}>Plantarse</button>
            ${me?.hasActed ? "" : `<button class="button triplazo-button" data-action="triplazo" ${busy ? "disabled" : ""}>TRIPLAZO ⚡</button>`}
          </div>
          <p class="wait-note">${!canStand ? "Aún no hay una apuesta; alguien tendrá que pujar para que la ronda pueda cerrarse." : me?.hasActed ? "Ya usaste tu primer turno: TRIPLAZO no está disponible." : "TRIPLAZO solo se puede usar en tu primer turno y cierra la puja."} Plantarse te deja fuera de las pujas de esta ronda.</p>
        ` : '<p class="wait-note">Espera tu turno para subir la apuesta, plantarte o hacer TRIPLAZO si aún es tu primer turno.</p>'}
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
        ${game.questionNote ? `
          <div style="margin: 10px auto 14px; max-width: 440px; background: rgba(59, 130, 246, 0.14); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 8px; padding: 8px 14px; font-size: 0.84rem; color: #bfdbfe; display: flex; align-items: center; justify-content: center; gap: 8px; line-height: 1.4; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
            <span style="font-size: 1.1rem; flex-shrink: 0;">💡</span>
            <span>${escapeHtml(game.questionNote)}</span>
          </div>
        ` : ''}
        <div class="table-wrap">
          <table class="results-table">
            <thead><tr><th>Pasajero</th><th>Decisión</th><th>Esta ronda</th><th>Total</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
  ${(() => {
// Detectamos la ronda actual se llame como se llame en el servidor
        const currentRound = room.roundNumber ?? room.round ?? room.game?.roundNumber ?? room.game?.round ?? 1;

        // Si no hemos llegado a la ronda 20, no mostramos el cartel de fin de partida
        if (currentRound < 20) return "";

        // Función para leer los puntos reales de cada jugador
    const getScore = (p) => {
       if (!p) return 0;
       const pid = p.id || p.socketId;
       const val = p.score ?? p.totalScore ?? p.points ?? p.pts ??
                   room.scores?.[pid] ?? room.game?.scores?.[pid] ??
                   room.leaderboard?.[pid] ?? room.game?.leaderboard?.[pid] ?? 0;
       return Number(val) || 0;
     };
     const playersList = Array.isArray(room.players) ? room.players : Object.values(room.players || {});
     const sorted = [...playersList].sort((a, b) => getScore(b) - getScore(a));
     const winner = sorted[0];
     const winnerScore = winner ? getScore(winner) : 0;

        return `
          <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; padding: 22px; border-radius: 16px; text-align: center; margin: 18px 0; box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);">
            <div style="font-size: 46px; margin-bottom: 6px;">🏆👑🏆</div>
            <h2 style="font-size: 24px; font-weight: 900; margin: 0; text-transform: uppercase;">¡FIN DE LA PARTIDA!</h2>
            <p style="font-size: 19px; font-weight: 700; margin: 10px 0 0 0;">
              ¡Campeón/a: <span style="text-decoration: underline;">${escapeHtml(winner?.name ?? "Jugador")}</span> con ${winnerScore} puntos!
            </p>
          </div>
        `;
      })()}
      ${isHost
        ? `<button class="button button-primary start-trip-button" data-action="next-round" ${busy ? "disabled" : ""}>${(room.roundNumber ?? room.round ?? room.game?.roundNumber ?? room.game?.round ?? 1) >= 20 ? "🏆 Volver a la sala (Nueva partida)" : "Siguiente ronda ↻"}</button>`
        : `<p class="wait-note">${(room.roundNumber ?? room.round ?? room.game?.roundNumber ?? room.game?.round ?? 1) >= 20 ? "¡Partida terminada! Esperando al anfitrión para volver a la sala." : "Esperando a que el anfitrión abra la siguiente ronda."}</p>`}
      ${notice ? `<p class="room-notice" role="alert">${escapeHtml(notice)}</p>` : ""}
<button class="button button-text" data-action="leave-room" style="margin-top: 35px; opacity: 0.8; font-size: 14px;">Salir de la partida</button>
    </div>
  </section>`);
}
function renderRoom() {
  if (!room) {
    renderMenu();
    return;
  }

  // 1. Si estamos en la sala de espera, SIEMPRE mostramos el Lobby
  if (room.phase === "LOBBY" || !room.phase) {
    renderLobby();
    return;
  }

  // 2. Si estamos en fase de tomar decisión
  if (room.phase === "DECISION") {
    renderDecision();
    return;
  }

  // 3. Si la ronda o partida ha terminado, mostramos resultados
  if (
    room.phase === "RESULTS" ||
    room.phase === "ROUND_OVER" ||
    room.phase === "GAME_OVER" ||
    room.phase === "FINISHED" ||
    Boolean(room.game?.outcome)
  ) {
    renderResults();
    return;
  }

  // 4. Para cualquier otra fase del juego activa (apuestas, preguntas...), mostramos el juego
  renderGame();
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
      notice = "El código debe empezar por TOLAS y tener 9 caracteres.";
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
    entryCode = "";
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
  } else if (action === "plant") {
    emitWithAck("playerStand", { roomCode: room.code });
  } else if (action === "stay" || action === "leave") {
    emitWithAck("submitDecision", { roomCode: room.code, decision: action === "stay" ? "STAY" : "LEAVE" });
  } else if (action === "next-round") {
emitWithAck("nextRound", { roomCode: room.code });
  } else if (action === "leave-room") {
    if (!confirm("¿Asín vas a ser de salirte?")) return;
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
} else {
  renderMenu();
}

// --- BLINDAJE ANTI-TRAMPAS IA (BLOQUEO DE COPIADO) ---
// 1. Bloquear clic derecho (excepto en casillas donde escriben su nombre o código)
document.addEventListener('contextmenu', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  e.preventDefault();
}, false);

// 2. Bloquear atajos Ctrl+C, Ctrl+A, Ctrl+U y Cmd+C en Mac
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if ((e.ctrlKey || e.metaKey) && ['c', 'C', 'x', 'X', 'u', 'U', 'a', 'A'].includes(e.key)) {
    e.preventDefault();
  }
});

// 3. Bloquear la orden de copiar del navegador
document.addEventListener('copy', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  e.preventDefault();
});

// 4. Evitar que arrastren el texto con el ratón hacia otra pestaña
document.addEventListener('dragstart', (e) => {
  e.preventDefault();
});