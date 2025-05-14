import './style.css'
import _ from 'underscore';

let cartas = [];
let cartasJugador = [];
let cartasPC = [];
let puntajeJugador = 0;
let puntajePC = 0;

const boton_juego = document.getElementById("boton_juegoNuevo");
const boton_pedir = document.getElementById("boton_Pedir");
const boton_parar = document.getElementById("boton_parar");

const jugador_div = document.getElementById("Jugador_Div");
const pc_div = document.getElementById("PC_Div");
const puntajeJugador_span = document.getElementById("puntajeJugador");
const puntajePC_span = document.getElementById("puntajePC");

boton_pedir.disabled = true;
boton_parar.disabled = true;

const crearCartas = () => {
  let figuras = ['C', 'D', 'H', 'S'];
  let numeros = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'K', 'Q'];
  let cartas = [];

  for (let f of figuras) {
    for (let n of numeros) {
      cartas.push(`${n}${f}`);
    }
  }

  return _.shuffle(cartas);
};

const valorCarta = (carta, puntajeActual) => {
  const valor = carta.slice(0, -1); // Quita la última letra (figura)

  if (['J', 'Q', 'K'].includes(valor)) return 10;
  if (valor === 'A') return (puntajeActual + 11 > 21) ? 1 : 11;
  return parseInt(valor);
};

const crearImagenCarta = (carta, destino) => {
  const imagenCarta = document.createElement("img");
  imagenCarta.setAttribute('class', 'carta');
  imagenCarta.setAttribute('id', carta);
  imagenCarta.src = `assets/cartas/${carta}.png`;
  destino.appendChild(imagenCarta);
};

const juegoNuevo = () => {
  cartasJugador.forEach(carta => {
    const el = document.getElementById(carta);
    if (el) el.remove();
  });
  cartasPC.forEach(carta => {
    const el = document.getElementById(carta);
    if (el) el.remove();
  });

  cartas = crearCartas();
  cartasJugador = [];
  cartasPC = [];
  puntajeJugador = 0;
  puntajePC = 0;

  puntajeJugador_span.textContent = '0';
  puntajePC_span.textContent = '0';

  boton_juego.disabled = true;
  boton_pedir.disabled = false;
  boton_parar.disabled = false;
};

const pedirCarta = () => {
  const carta = cartas.pop();
  cartasJugador.push(carta);

  const valor = valorCarta(carta, puntajeJugador);
  puntajeJugador += valor;
  puntajeJugador_span.textContent = puntajeJugador;

  crearImagenCarta(carta, jugador_div);

  if (puntajeJugador > 21) {
    finDelTurno();
  }
};

const turnoPC = () => {
  while (puntajePC < puntajeJugador && puntajeJugador <= 21) {
    const carta = cartas.pop();
    cartasPC.push(carta);
    const valor = valorCarta(carta, puntajePC);
    puntajePC += valor;
    crearImagenCarta(carta, pc_div);
    puntajePC_span.textContent = puntajePC;
  }

  setTimeout(() => {
    determinarGanador();
  }, 500); // Espera para que se vean las cartas de la PC
};

const determinarGanador = () => {
  let mensaje = '';

  if (puntajeJugador > 21) {
    mensaje = '¡Perdiste! Tu puntaje superó 21.';
  } else if (puntajePC > 21) {
    mensaje = '¡Ganaste! La PC se pasó de 21.';
  } else if (puntajeJugador > puntajePC) {
    mensaje = '¡Ganaste! Tienes más puntos.';
  } else if (puntajeJugador < puntajePC) {
    mensaje = '¡Perdiste! La PC tiene más puntos.';
  } else {
    mensaje = '¡Empate!';
  }

  alert(mensaje);
  boton_juego.disabled = false;
  boton_pedir.disabled = true;
  boton_parar.disabled = true;
};

const finDelTurno = () => {
  boton_pedir.disabled = true;
  boton_parar.disabled = true;
  turnoPC();
};

boton_juego.addEventListener("click", juegoNuevo);
boton_pedir.addEventListener("click", pedirCarta);
boton_parar.addEventListener("click", finDelTurno);
