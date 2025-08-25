// --- UTILITAIRES ---
const gameScreen = document.getElementById("game-screen");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalSub = document.getElementById("modal-sub");


// --- INITIALISATION ---
function initPossible() {
possible = [];
for (let i = 0; i <= 999; i++) {
possible.push(i.toString().padStart(3, "0"));
}
}


function randomSecret() {
return Math.floor(Math.random() * 1000).toString().padStart(3, "0");
}


// --- LANCEMENT ---


document.getElementById("btn-start").onclick = () => {
const secret = document.getElementById("player-secret").value;
if (!validNumber(secret)) {
document.getElementById("start-error").textContent = "Veuillez entrer un nombre à 3 chiffres.";
return;
}
playerSecret = secret;
aiSecret = randomSecret();
initPossible();
startScreen.classList.add("hidden");
gameScreen.classList.remove("hidden");
};


// --- TOUR JOUEUR ---
document.getElementById("btn-submit-guess").onclick = () => {
const guess = document.getElementById("player-guess").value;
if (!validNumber(guess)) return alert("Entrez un nombre valide à 3 chiffres");
const fb = computeFeedback(aiSecret, guess);
const line = `${guess} → ${fb.bulls} bien placé(s), ${fb.cows} mal placé(s)`;
document.getElementById("player-history").innerHTML += line + "<br>";
if (fb.bulls === 3) return endGame("Joueur", "Vous avez trouvé le nombre secret de l'IA!");
aiTurn();
};


// --- TOUR IA ---
function aiTurn() {
document.getElementById("ai-status").textContent = "L'IA réfléchit...";
currentAIGuess = possible[Math.floor(Math.random() * possible.length)];
document.getElementById("ai-guess").textContent = currentAIGuess;
document.getElementById("ai-turn").classList.remove("hidden");
}


// --- FEEDBACK IA ---
let fbBulls = 0, fbCows = 0;
document.querySelectorAll("[data-fb]").forEach(btn => {
btn.onclick = () => {
const type = btn.getAttribute("data-fb");
if (type === "bulls++" && fbBulls < 3) fbBulls++;
if (type === "bulls--" && fbBulls > 0) fbBulls--;
if (type === "cows++" && fbCows < 3) fbCows++;
if (type === "cows--" && fbCows > 0) fbCows--;
document.getElementById("fb-bulls").textContent = fbBulls;
document.getElementById("fb-cows").textContent = fbCows;
};
});


document.getElementById("btn-submit-feedback").onclick = () => {
document.getElementById("ai-history").innerHTML += `${currentAIGuess} → ${fbBulls}B, ${fbCows}C<br>`;
if (fbBulls === 3) return endGame("IA", "L'IA a trouvé votre nombre secret!");
// filtrage des possibilités
possible = possible.filter(num => {
const fb = computeFeedback(num, currentAIGuess);
return fb.bulls === fbBulls && fb.cows === fbCows;
});
fbBulls = 0; fbCows = 0;
document.getElementById("fb-bulls").textContent = 0;
document.getElementById("fb-cows").textContent = 0;
document.getElementById("ai-status").textContent = "En attente de votre tour…";
document.getElementById("ai-turn").classList.add("hidden");
};


// --- FIN DE JEU ---
function endGame(winner, msg) {
modal.classList.remove("hidden");
modalTitle.textContent = `${winner} gagne!`;
modalSub.textContent = msg;
}


// --- MODALE ---
document.getElementById("btn-restart").onclick = () => window.location.reload();
document.getElementById("btn-close").onclick = () => modal.classList.add("hidden");


// --- ABANDON ---
document.getElementById("btn-give-up").onclick = () => {
endGame("IA", `Vous avez abandonné. Le nombre secret de l'IA était ${aiSecret}.`);
};