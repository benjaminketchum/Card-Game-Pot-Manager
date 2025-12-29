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
    bet: MIN_BET
  };
}

const playersDiv = document.getElementById("players");
const potValue = document.getElementById("pot-value");

/* ========= RENDER ========= */
function renderPlayers() {
  playersDiv.innerHTML = "";

  players.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = `player ${!p.active ? "broke" : ""} ${p.dealer ? "dealer" : ""}`;

    div.innerHTML = `
      <span onclick="toggleDealer(${i})">${p.name}</span>
      <span class="wallet" id="wallet-${i}">$${p.wallet}</span>
      <input type="number" min="${MIN_BET}" max="${p.wallet}" value="${p.bet}"
        onchange="pBet(${i}, this.value)">
      <button onclick="allIn(${i})">ALL IN</button>
      <button onclick="declareWinner(${i})">WIN</button>
    `;

    playersDiv.appendChild(div);
  });
}

/* ========= BET CONTROL ========= */
function pBet(i, val) {
  val = Number(val);
  if (isNaN(val) || val < MIN_BET) val = MIN_BET;
  if (val > players[i].wallet) val = players[i].wallet;
  players[i].bet = val;
}

/* ========= NUMBER ANIM ========= */
function animateNumber(el, start, end) {
  let current = start;
  function step() {
    if (current === end) return;
    const diff = end - current;
    current += Math.sign(diff) * Math.max(1, Math.floor(Math.abs(diff) / 3));
    el.textContent = `$${current}`;
    setTimeout(step, 6);
  }
  step();
}

/* ========= ROUND ========= */
function nextRound() {
  MIN_BET = Number(document.getElementById("minBet").value) || 10;

  players.forEach((p, i) => {
    if (!p.active) return;

    let bet = Math.max(MIN_BET, p.bet);
    bet = Math.min(bet, p.wallet);

    const old = p.wallet;
    p.wallet -= bet;
    pot += bet;

    animateNumber(document.getElementById(`wallet-${i}`), old, p.wallet);
    animateNumber(potValue, pot - bet, pot);

    if (p.wallet < MIN_BET) p.active = false;
  });
}

/* ========= WIN ========= */
function declareWinner(i) {
  if (pot === 0) return;

  const p = players[i];
  const old = p.wallet;
  p.wallet += pot;

  const div = playersDiv.children[i];
  div.classList.add("winner", "neon-win");

  animateNumber(document.getElementById(`wallet-${i}`), old, p.wallet);
  triggerChipRain();

  pot = 0;
  potValue.textContent = "$0";

  setTimeout(() => {
    div.classList.remove("winner", "neon-win");
  }, 2000);
}

/* ========= ALL IN ========= */
function allIn(i) {
  const p = players[i];
  if (!p.active) return;

  const reserve = 10;
  if (p.wallet <= reserve) return;

  const amt = p.wallet - reserve;
  const old = p.wallet;

  p.wallet = reserve;
  pot += amt;

  animateNumber(document.getElementById(`wallet-${i}`), old, p.wallet);
  animateNumber(potValue, pot - amt, pot);
}

/* ========= MGMT ========= */
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

function toggleDealer(i) {
  players.forEach(p => p.dealer = false);
  players[i].dealer = true;
  renderPlayers();
}

function resetGame() {
  startingMoney = Number(document.getElementById("startingMoney").value) || 100;
  MIN_BET = Number(document.getElementById("minBet").value) || 10;
  pot = 0;
  potValue.textContent = "$0";

  players = players.map((p, i) => ({
    ...p,
    wallet: startingMoney,
    active: true,
    bet: MIN_BET,
    dealer: i === 0
  }));

  renderPlayers();
}

/* ========= CHIP RAIN ========= */
function triggerChipRain() {
  spawn("chipRainLeft");
  spawn("chipRainRight");
  setTimeout(() => {
    chipRainLeft.innerHTML = "";
    chipRainRight.innerHTML = "";
  }, 1000);
}

function spawn(id) {
  const el = document.getElementById(id);
  const icons = ["🪙", "♠", "♦", "♣"];
  for (let i = 0; i < 30; i++) {
    const c = document.createElement("div");
    c.className = "chip";
    c.textContent = icons[Math.floor(Math.random() * icons.length)];
    c.style.left = Math.random() * 100 + "%";
    c.style.fontSize = 14 + Math.random() * 12 + "px";
    c.style.animationDuration = 0.8 + Math.random() * 0.4 + "s";
    el.appendChild(c);
  }
}

/* ========= INIT ========= */
renderPlayers();
