const MIN_BET = 10;
const STARTING_WALLET = 100;

let pot = 0;
let players = [
  { name: "Player 1", wallet: STARTING_WALLET, active: true },
  { name: "Player 2", wallet: STARTING_WALLET, active: true },
  { name: "Player 3", wallet: STARTING_WALLET, active: true }
];

const playersDiv = document.getElementById("players");
const potValue = document.getElementById("pot-value");

function renderPlayers() {
  playersDiv.innerHTML = "";
  players.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "player" + (!p.active ? " broke" : "");
    div.innerHTML = `
      <span>${p.name}</span>
      <span class="wallet" id="wallet-${i}">$${p.wallet}</span>
      <button onclick="declareWinner(${i})">WIN</button>
    `;
    playersDiv.appendChild(div);
  });
}

function animateNumber(el, start, end) {
  let current = start;
  const step = () => {
    current += Math.sign(end - current);
    el.textContent = `$${current}`;
    if (current !== end) {
      setTimeout(step, 20 + Math.abs(end - current));
    }
  };
  step();
}

function updatePot(amount) {
  const old = pot;
  pot += amount;
  animateNumber(potValue, old, pot);
}

function takeAntes() {
  players.forEach((p, i) => {
    if (!p.active) return;
    if (p.wallet < MIN_BET) {
      p.active = false;
      return;
    }
    const old = p.wallet;
    p.wallet -= MIN_BET;
    updatePot(MIN_BET);
    animateNumber(document.getElementById(`wallet-${i}`), old, p.wallet);
  });
}

function declareWinner(index) {
  const winner = players[index];
  const old = winner.wallet;
  winner.wallet += pot;
  animateNumber(document.getElementById(`wallet-${index}`), old, winner.wallet);
  pot = 0;
  potValue.textContent = "$0";
}

function nextRound() {
  takeAntes();
  renderPlayers();
}

renderPlayers();
