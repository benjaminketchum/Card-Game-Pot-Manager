let pot = 0;
let startingMoney = 100;
let MIN_BET = 10;

const MAX_PLAYERS = 8;
const MIN_PLAYERS = 2;

let players = [
  createPlayer("Player 1"),
  createPlayer("Player 2")
];

function createPlayer(name) {
  return {
    name,
    wallet: startingMoney,
    active: true,
    dealer: false,
    customBet: MIN_BET
  };
}

const playersDiv = document.getElementById("players");
const potValue = document.getElementById("pot-value");

// ---------------------- Rendering ----------------------
function renderPlayers() {
  playersDiv.innerHTML = "";
  players.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = `player ${!p.active ? "broke" : ""} ${p.dealer ? "dealer" : ""}`;

    div.innerHTML = `
      <span onclick="toggleDealer(${i})">${p.name}</span>
      <span class="wallet" id="wallet-${i}">$${p.wallet}</span>
      <input type="number" id="bet-${i}" value="${p.customBet}" min="${MIN_BET}" max="${p.wallet}">
      <button onclick="allIn(${i})">ALL IN</button>
      <button onclick="declareWinner(${i})">WIN</button>
    `;
    playersDiv.appendChild(div);
  });
}

// ---------------------- Animations ----------------------
function animateNumber(el, start, end) {
  let current = start;
  function step() {
    if (current === end) return;
    const diff = end - current;
    const increment = Math.max(1, Math.floor(Math.abs(diff)/5));
    current += Math.sign(diff) * increment;
    el.textContent = `$${current}`;
    setTimeout(step, 10);
  }
  step();
}

function updatePot(amount) {
  const old = pot;
  pot += amount;
  animateNumber(potValue, old, pot);
}

// ---------------------- Game Logic ----------------------
function takeAntes() {
  MIN_BET = Number(document.getElementById("minBet").value) || 10;
  
  players.forEach((p, i) => {
    if (!p.active) return;

    // enforce minimum bet
    const input = document.getElementById(`bet-${i}`);
    let bet = Number(input.value);
    if (isNaN(bet) || bet < MIN_BET) bet = MIN_BET;
    if (bet > p.wallet) bet = p.wallet;

    p.customBet = bet;
    const oldWallet = p.wallet;
    p.wallet -= bet;
    if (p.wallet <= 0) p.active = false;
    updatePot(bet);
    animateNumber(document.getElementById(`wallet-${i}`), oldWallet, p.wallet);
  });
}

function declareWinner(index) {
  if (pot === 0) return;

  const winner = players[index];
  const old = winner.wallet;
  winner.wallet += pot;

  const playerDiv = playersDiv.children[index];
  playerDiv.classList.add("winner");

  animateNumber(document.getElementById(`wallet-${index}`), old, winner.wallet);

  pot = 0;
  potValue.textContent = "$0";

  // only flashes winner for this round
  setTimeout(() => playerDiv.classList.remove("winner"), 2000);
}

function allIn(index) {
  const p = players[index];
  if (!p.active || p.wallet === 0) return;

  const old = p.wallet;
  updatePot(p.wallet);
  p.wallet = 0;
  p.active = false;
  animateNumber(document.getElementById(`wallet-${index}`), old, p.wallet);
  renderPlayers();
}

function nextRound() {
  takeAntes();
  renderPlayers();
}

// ---------------------- Player Management ----------------------
function addPlayer() {
  if (players.length >= MAX_PLAYERS) return;
  players.push(createPlayer(`Player ${players.length + 1}`));
  renderPlayers();
}

function removePlayer() {
  if (players.length <= MIN_PLAYERS) return;
  players.pop();
  renderPlayers();
}

function toggleDealer(index) {
  players.forEach(p => p.dealer = false);
  players[index].dealer = true;
  renderPlayers();
}

// ---------------------- Game Reset ----------------------
function resetGame() {
  startingMoney = Number(document.getElementById("startingMoney").value) || 100;
  MIN_BET = Number(document.getElementById("minBet").value) || 10;
  pot = 0;
  potValue.textContent = "$0";

  players = players.map((p, i) => ({
    ...p,
    wallet: startingMoney,
    active: true,
    dealer: i === 0,
    customBet: MIN_BET
  }));

  renderPlayers();
}

// ---------------------- Init ----------------------
renderPlayers();
