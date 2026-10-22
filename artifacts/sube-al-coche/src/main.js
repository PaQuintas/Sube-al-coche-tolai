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

const NOMBRES_AZAR = [
  "Virgen98",
  "Amador",
  "Hindemith",
  "El Susurrador",
  "RompeBragas",
  "Josué",
  "Pajerín",
  "Mitsu",
  "Alevín01"
];

function obtenerNombreUsuario() {
    const inputNombre = document.getElementById("nombre-jugador");
    if (inputNombre && inputNombre.value.trim() !== "") {
        return inputNombre.value.trim();
    }
    const indiceRandom = Math.floor(Math.random() * NOMBRES_AZAR.length);
    return NOMBRES_AZAR[indiceRandom];
}

function escapeHtml(value) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "'"
  };
  return String(value).replace(/[&<>"']/g, (character) => map[character]);
}

function scene(content) {
  return `
    <main class="scene">
      ${content}
      <footer class="scene-caption">ARE YOU READY FOR TONIGHT? <span>·</span> ¿SERÁS EL MÁS INCREÍBLE?</footer>
    </main>`;
}

function frame(content) {
  if (app) app.innerHTML = scene(content);
}

function renderMenu() {
  screen = "menu";
  frame(`
    <section class="stage">
      <p class="eyebrow">36.8123° N, 2.5694° W</p>
      <h1 class="hero-title">¡Sube al<br><em>coche, tolai!</em></h1>
      <p class="hero-copy">Una noche tranquila se transforma rápidamente en una noche de ALL IN, ¿serás el más vacilón?</p>
      <div class="menu-actions">
        <button class="button button-primary" onclick="window.mostrarMenuLandCruiser()">Arrancamos motores 🚗</button>
        <button class="button button-secondary" onclick="window.renderRules()">¿Cómo se viaja? 📖</button>
      </div>
      <p class="under-note">TONIGHT IS THE LAST NIGHT</p>
    </section>`);
}

window.renderRules = function() {
  screen = "rules";
  frame(`
    <section class="stage">
      <p class="eyebrow">Guía de carretera</p>
      <div class="panel" style="color: white; text-align: center; padding: 20px;">
        <p>Normas de la carretera: Sube al coche y prepárate para el ALL IN.</p>
        <button class="button button-secondary" onclick="window.location.reload()" style="margin-top: 20px;">Volver al menú</button>
      </div>
    </section>`);
}

    window.mostrarMenuLandCruiser = function() {
      const indiceRandom = Math.floor(Math.random() * NOMBRES_AZAR.length);
      const nombrePredeterminado = NOMBRES_AZAR[indiceRandom];

      frame(`
          <section class="stage">
              <p class="eyebrow">PUESTA A PUNTO</p>
              <h2 class="hero-title" style="font-size: 2rem;">Sube al Land Cruiser</h2>

              <div style="margin-bottom: 25px; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                  <label style="color: #f4c956; font-size: 0.9rem; font-weight: bold; letter-spacing: 1px;">¿CÓMO TE LLAMAS, TOLAI?</label>
                  <input type="text" id="nombre-jugador" value="${nombrePredeterminado}" placeholder="Dejar vacío para nombre al azar" style="padding: 12px; border-radius: 6px; border: 1px solid #f4c956; background: #090d17; color: white; text-align: center; font-size: 1rem; width: 100%; max-width: 280px;">
              </div>
              <div class="menu-actions" style="flex-direction: column; gap: 15px;">
                  <button class="button button-primary" onclick="window.crearPartidaLC()">Crear Land Cruiser</button>
                  <div style="display: flex; gap: 10px; margin-top: 10px; width: 100%; justify-content: center;">
                      <input type="text" id="codigo-entrada" placeholder="Código de sala" style="padding: 12px; border-radius: 6px; border: 1px solid #333; background: #090d17; color: white; text-align: center; font-size: 1rem;">
                      <button class="button button-secondary" onclick="window.unirsePartidaLC()">Unirse</button>
                  </div>
                  <button class="button button-secondary" onclick="window.location.reload()" style="margin-top: 10px; width: auto;">Volver al menú principal ↩</button>
              </div>
          </section>
      `);
    };

    window.crearPartidaLC = function() {
    const nombre = obtenerNombreUsuario();
    socket.emit("createRoom", { playerName: nombre });
    };

    window.mostrarSalaEspera = function(codigo, pasajeros) {
    let listaHTML = "";
    for (let i = 0; i < pasajeros.length; i++) {
      listaHTML += `<div style="margin: 12px 0; font-size: 1.2rem; color: #fff;">🚗 ` + pasajeros[i] + `</div>`;
    }


frame(`
<section class="stage" style="max-width: 500px;">
<p class="eyebrow">SALA DE ESPERA</p>
<h3 style="color: white; font-size: 1.5rem; margin-bottom: 5px;">Código del Coche: <span style="color: #f4c956; font-size: 2rem; font-weight: bold; display: block; margin-top: 5px;">` + codigo + `</span></h3>
<p style="color: #ccc; margin: 10px 0;">Capacidad: ` + pasajeros.length + `/8 pasajeros dentro del Land Cruiser.</p>
<p style="font-style: italic; color: #888; font-size: 0.9rem; margin-bottom: 20px;">*En este coche caben 8 personas y fue mi primer coche.*</p>

<div style="margin: 20px auto; padding: 15px; background: rgba(0,0,0,0.4); border: 1px solid #333; width: 100%; border-radius: 8px; text-align: left;">
  ` + listaHTML + `
</div>

<div style="font-weight: bold; color: #f4c956; margin-top: 15px;">El motor ya está rugiendo, esperando a la gente...</div>
<button class="button button-secondary" onclick="window.location.reload()" style="margin-top: 25px; width: auto;">Salir de la sala ↩</button>
</section>
`);
};

window.unirsePartidaLC = function() {
const nombre = obtenerNombreUsuario();
const inputCodigo = document.getElementById("codigo-entrada");
if (!inputCodigo) return;

const codigoInput = inputCodigo.value.trim().toUpperCase();
if (!codigoInput.startsWith("TOLAS") || codigoInput.length !== 9) {
alert("¡Ese código no es un Land Cruiser válido, tolai!");
return;
}

socket.emit("joinRoom", { roomCode: codigoInput, playerName: nombre }, (response) => {
if (response && response.success) {
roomCode = codigoInput;
playerId = response.playerId;
localStorage.setItem(playerKey(roomCode), playerId);
} else {
alert(response.message || "Error al subir al coche.");
}
});
};

let estadoJuego = {
preguntaActual: "",
numeroActual: 0,
esTriplazo: false,
capitanActual: "",
jugadores: [],
turnoIndex: 0,
puntuaciones: {}
};

let bufferTeclado = "";

socket = io(window.location.hostname === "localhost" ? "http://localhost:3000" : "/");

socket.on("connect", () => {
socketConnected = true;
});

socket.on("roomUpdated", (roomData) => {
room = roomData;
roomCode = roomData.code;
const pasajeros = roomData.players.map(p => p.name);
window.mostrarSalaEspera(roomCode, pasajeros);
});

socket.on("gameStarted", (data) => {
screen = "gameplay";
estadoJuego = data.estadoJuego;
bufferTeclado = "";
window.renderSalpicadero();
});

socket.on("turnUpdated", (data) => {
estadoJuego = data.estadoJuego;
bufferTeclado = "";
window.renderSalpicadero();
});

socket.on("votingPhase", (data) => {
screen = "decision";
estadoJuego = data.estadoJuego;
window.activarMenuDecision();
});

  socket.on("roundResolved", (data) => {
    screen = "results";
    window.renderResultados(data.resultados, data.valorReal, data.numeroActual, data.preguntaTexto);
  });

  window.presionarTecla = function(num) {
    bufferTeclado += num;
    const visor = document.getElementById("visor-numero");
    if (visor) visor.innerText = bufferTeclado;
  };

  window.borrarTecla = function() {
    bufferTeclado = bufferTeclado.slice(0, -1);
    const visor = document.getElementById("visor-numero");
    if (visor) visor.innerText = bufferTeclado || "0";
  };

  window.renderSalpicadero = function() {
    const jugadorActivo = estadoJuego.jugadores[estadoJuego.turnoIndex];
    const miNombre = obtenerNombreUsuario();
    const esMiTurno = jugadorActivo === miNombre;

    let monigotesHTML = "";
    estadoJuego.jugadores.forEach(jugador => {
      const esTurno = jugador === jugadorActivo ? "border: 2px solid #f4c956; background: #1a233d;" : "background: rgba(0,0,0,0.3);";
      const esCapitan = jugador === estadoJuego.capitanActual ? "👑 " : "";
      const pts = estadoJuego.puntuaciones[jugador] || 0;
      monigotesHTML += `
        <div style="padding: 10px; border-radius: 6px; text-align: center; font-size: 0.9rem; min-width: 90px; ` + esTurno + `">
          <div style="font-size: 1.5rem;">🧍</div>
          <div style="color: white; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">` + esCapitan + jugador + `</div>
          <div style="color: #f4c956; font-size: 0.8rem;">Puntos: ` + pts + `</div>
        </div>
      `;
    });

    frame(`
      <section class="stage" style="max-width: 650px;">
        <p class="eyebrow" style="color: #f4c956;">PANTALLA DEL LAND CRUISER</p>

        <div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 15px; width: 100%;">
          <p style="color: #888; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Pregunta de la parada:</p>
          <h3 style="color: white; font-size: 1.25rem; margin: 0;">"` + estadoJuego.preguntaActual + `"</h3>
        </div>

        <div style="display: flex; gap: 15px; width: 100%; margin-bottom: 15px; flex-wrap: wrap; justify-content: center;">
          <div style="flex: 1; min-width: 250px; background: #090d17; border: 2px solid #f4c956; border-radius: 8px; padding: 15px; text-align: center; display: flex; flex-direction: column; justify-content: center;">
            <span style="color: #888; font-size: 0.8rem; letter-spacing: 1px;">NÚMERO ACTUAL DEL CAPITÁN</span>
            <div style="font-size: 2.5rem; font-weight: bold; color: #fff; margin: 5px 0;">` + estadoJuego.numeroActual + `</div>
            <span style="color: #f4c956; font-size: 0.9rem; font-weight: bold;">Capitán actual: ` + (estadoJuego.capitanActual || "Nadie") + `</span>
          </div>

          <div style="background: rgba(0,0,0,0.6); padding: 12px; border-radius: 8px; border: 1px solid #333; width: 220px; opacity: ` + (esMiTurno ? "1" : "0.4") + `; pointer-events: ` + (esMiTurno ? "auto" : "none") + `;">
            <div id="visor-numero" style="background: #000; color: #0f0; font-family: monospace; text-align: right; padding: 6px; font-size: 1.2rem; border-radius: 4px; margin-bottom: 8px; min-height: 30px;">0</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 8px;">
              <button class="button" style="padding: 8px 0;" onclick="window.presionarTecla(1)">1</button>
              <button class="button" style="padding: 8px 0;" onclick="window.presionarTecla(2)">2</button>
              <button class="button" style="padding: 8px 0;" onclick="window.presionarTecla(3)">3</button>
              <button class="button" style="padding: 8px 0;" onclick="window.presionarTecla(4)">4</button>
              <button class="button" style="padding: 8px 0;" onclick="window.presionarTecla(5)">5</button>
              <button class="button" style="padding: 8px 0;" onclick="window.presionarTecla(6)">6</button>
              <button class="button" style="padding: 8px 0;" onclick="window.presionarTecla(7)">7</button>
              <button class="button" style="padding: 8px 0;" onclick="window.presionarTecla(8)">8</button>
              <button class="button" style="padding: 8px 0;" onclick="window.presionarTecla(9)">9</button>
              <button class="button" style="padding: 8px 0; background: #d9534f;" onclick="window.borrarTecla()">⌫</button>
              <button class="button" style="padding: 8px 0;" onclick="window.presionarTecla(0)">0</button>
              <button class="button" style="padding: 8px 0; font-size: 0.7rem; font-weight: bold; background: #f4c956; color: black;" onclick="window.enviarApuesta(true)">TRIPLAZO</button>
            </div>
            <button class="button button-primary" style="width: 100%; padding: 10px 0; font-size: 0.9rem;" onclick="window.enviarApuesta(false)">Subir Apuesta 🚗</button>
          </div>
        </div>

        <div style="width: 100%; background: rgba(0,0,0,0.4); padding: 10px; border-radius: 8px; display: flex; gap: 10px; justify-content: space-around; margin-bottom: 15px; border: 1px solid #222;">
          ` + monigotesHTML + `
        </div>

        <div style="color: #aaa; text-align: center; font-size: 0.9rem; font-weight: bold; background: rgba(244, 201, 86, 0.1); padding: 8px; border-radius: 4px; width: 100%;">
          📢 Turno de: <span style="color: #f4c956;">` + (esMiTurno ? "¡TU TURNO, TOLAI!" : jugadorActivo) + `</span>
        </div>
      </section>
    `);
  };

  window.enviarApuesta = function(esTriplazoAdrede) {
    const numeroIntroducido = parseInt(bufferTeclado, 10);
    bufferTeclado = "";

    if (isNaN(numeroIntroducido) || numeroIntroducido <= estadoJuego.numeroActual) {
      alert("¡Tienes que decir un número MÁS ALTO que el del Capitán actual, tolai!");
      window.renderSalpicadero();
      return;
    }

    socket.emit("playerBet", { roomCode, bet: numeroIntroducido, isTriplazo: esTriplazoAdrede });
  };

  window.activarMenuDecision = function() {
    frame(`
      <section class="stage" style="max-width: 500px;">
        <p class="eyebrow" style="color: #f4c956;">💥 ¡PUJA CERRADA! 💥</p>
        <h2 class="hero-title" style="font-size: 2.2rem; margin-bottom: 5px;">El número final es:</h2>
        <div style="font-size: 4rem; font-weight: bold; color: white; text-shadow: 0 0 10px #f4c956; margin: 10px 0;">` + estadoJuego.numeroActual + `</div>
        <p style="color: #ccc; margin-bottom: 20px;">Fijado por el Capitán 👑 <strong>` + estadoJuego.capitanActual + `</strong> ` + (estadoJuego.esTriplazo ? "(¡Hizo TRIPLAZO!)" : "") + `</p>

        <div class="menu-actions" style="gap: 15px; width: 100%;">
          <button class="button button-primary" onclick="window.enviarDecision('STAY')" style="background: #5cb85c;">🚗 Quedarse dentro</button>
          <button class="button button-secondary" onclick="window.enviarDecision('LEAVE')" style="background: #d9534f; color: white; border: none;">🛑 ¡Me bajo!</button>
        </div>
      </section>
    `);
  };

  window.enviarDecision = function(eleccion) {
    socket.emit("submitDecision", { roomCode, decision: eleccion });
  };

  window.renderResultados = function(resultados, valorReal, numeroFinal, pregunta) {
    let tablaHTML = "";
    resultados.forEach(r => {
      tablaHTML += `
        <tr style="border-bottom: 1px solid #222;">
          <td style="padding: 10px; color: white;">` + (r.isCaptain ? "👑 " : "") + r.name + `</td>
          <td style="padding: 10px; color: #aaa;">` + (r.decision === "STAY" ? "🚗 Dentro" : "🛑 Bajado") + `</td>
          <td style="padding: 10px; font-weight: bold; color: ` + (r.puntosGanados >= 0 ? "#5cb85c" : "#d9534f") + `;">` + (r.puntosGanados >= 0 ? "+" : "") + r.puntosGanados + `</td>
          <td style="padding: 10px; color: #f4c956;">` + r.scoreTotal + `</td>
        </tr>
      `;
    });

    frame(`
      <section class="stage" style="max-width: 550px;">
        <p class="eyebrow">RESULTADOS DE LA PARADA</p>
        <h3 style="color: #aaa; font-size: 1rem; margin-bottom: 15px;">"` + pregunta + `"</h3>

        <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;">
          <div style="background: #000; padding: 10px 15px; border-radius: 6px; border: 1px solid #333;">
            <div style="font-size: 0.8rem; color: #888;">NÚMERO FINAL</div>
            <div style="font-size: 1.8rem; font-weight: bold; color: white;">` + numeroFinal + `</div>
          </div>
          <div style="background: #000; padding: 10px 15px; border-radius: 6px; border: 1px solid #f4c956;">
            <div style="font-size: 0.8rem; color: #f4c956;">VALOR REAL</div>
            <div style="font-size: 1.8rem; font-weight: bold; color: #f4c956;">` + valorReal + `</div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; text-align: left; background: rgba(0,0,0,0.2); border-radius: 6px; overflow: hidden;">
          <thead>
            <tr style="background: #111; color: #888; font-size: 0.8rem;">
              <th style="padding: 10px;">PASAJERO</th>
              <th style="padding: 10px;">DECISIÓN</th>
              <th style="padding: 10px;">PUNTOS</th>
              <th style="padding: 10px;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ` + tablaHTML + `
          </tbody>
        </table>

        <button class="button button-primary" onclick="window.location.reload()" style="margin-top: 25px;">Volver al menú principal</button>
      </section>
    `);
  };

 window.enviarApuesta = function(esTriplazoAdrede) {
  socket.emit("playerBet", { roomCode, bet: numeroIntroducido, isTriplazo: esTriplazoAdrede });
};

window.activarMenuDecision = function() {
  frame(`

    <section class="stage" style="max-width: 500px;">
      <p class="eyebrow" style="color: #f4c956;">💥 ¡PUJA CERRADA! 💥</p>
      <h2 class="hero-title" style="font-size: 2.2rem; margin-bottom: 5px;">El número final es:</h2>
      <div style="font-size: 4rem; font-weight: bold; color: white; text-shadow: 0 0 10px #f4c956; margin: 10px 0;">` + estadoJuego.numeroActual + `</div>
      <p style="color: #ccc; margin-bottom: 20px;">Fijado por el Capitán 👑 <strong>` + estadoJuego.capitanActual + `</strong> ` + (estadoJuego.esTriplazo ? "(¡Hizo TRIPLAZO!)" : "") + `</p>
    </section>
  `);
};

renderMenu();
