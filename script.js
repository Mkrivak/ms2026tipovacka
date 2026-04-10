// ===== DATA =====
let matches = JSON.parse(localStorage.getItem("matches")) || [
  { id: 1, home: "Česko", away: "Švédsko", result: null }
];

let tips = JSON.parse(localStorage.getItem("tips")) || {};
let player = localStorage.getItem("player") || "";

// ===== INIT =====
document.getElementById("playerName").value = player;
render();

// ===== FUNKCE =====
function saveName() {
  player = document.getElementById("playerName").value.trim();
  localStorage.setItem("player", player);
  render();
}

function saveTip(matchId) {
  if (!player) return alert("Nejdřív zadej jméno!");

  const h = Number(document.getElementById(`h_${matchId}`).value);
  const a = Number(document.getElementById(`a_${matchId}`).value);

  tips[player] = tips[player] || {};
  tips[player][matchId] = { h, a };

  localStorage.setItem("tips", JSON.stringify(tips));
  render();
}

function saveResult(matchId) {
  const h = Number(document.getElementById(`rh_${matchId}`).value);
  const a = Number(document.getElementById(`ra_${matchId}`).value);

  const m = matches.find(m => m.id === matchId);
  m.result = { h, a };

  localStorage.setItem("matches", JSON.stringify(matches));
  render();
}

// ===== BODOVÁNÍ =====
function points(tip, res) {
  if (!tip || !res) return 0;

  if (tip.h === res.h && tip.a === res.a) return 25;

  const outcome = Math.sign(tip.h - tip.a);
  const real = Math.sign(res.h - res.a);
  const diff = Math.abs(tip.h - res.h) + Math.abs(tip.a - res.a);

  if (outcome === real) return Math.max(0, 20 - diff);
  return Math.max(0, 10 - diff);
}

// ===== RENDER =====
function render() {
  const div = document.getElementById("matches");
  div.innerHTML = "";

  matches.forEach(m => {
    div.innerHTML += `
      <div>
        <b>${m.home} – ${m.away}</b><br>
        Tip:
        <input id="h_${m.id}" type="number" min="0"> :
        <input id="a_${m.id}" type="number" min="0">
        <button onclick="saveTip(${m.id})">Uložit tip</button>
      </div>
    `;
  });

  const admin = document.getElementById("admin");
  admin.innerHTML = "";

  matches.forEach(m => {
    admin.innerHTML += `
      <div>
        Výsledek ${m.home} – ${m.away}:
        <input id="rh_${m.id}" type="number" min="0"> :
        <input id="ra_${m.id}" type="number" min="0">
        <button onclick="saveResult(${m.id})">Uložit</button>
      </div>
    `;
  });

  const leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = "";

  const scores = {};
  for (const p in tips) {
    scores[p] = 0;
    matches.forEach(m => {
      scores[p] += points(tips[p][m.id], m.result);
    });
  }

  Object.entries(scores)
    .sort((a,b) => b[1] - a[1])
    .forEach(([p,s]) => {
      leaderboard.innerHTML += `<li>${p}: ${s} bodů</li>`;
    });
}
``
