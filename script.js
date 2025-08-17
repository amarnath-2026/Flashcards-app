let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
let currentIndex = 0;

const cardFront = document.getElementById("cardFront");
const cardBack = document.getElementById("cardBack");
const flashcardEl = document.getElementById("flashcard");
const cardList = document.getElementById("cardList");

function saveFlashcards() {
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
  renderCardList();
}

function renderCardList() {
  cardList.innerHTML = "";
  flashcards.forEach((c, i) => {
    const li = document.createElement("li");
    li.textContent = `${i+1}. ${c.front || "Untitled"}`;
    li.onclick = () => showCard(i);
    cardList.appendChild(li);
  });
}

function showCard(index) {
  if (flashcards.length === 0) {
    cardFront.innerText = "No cards yet!";
    cardBack.innerText = "Add a new flashcard.";
    return;
  }
  currentIndex = (index + flashcards.length) % flashcards.length;
  const card = flashcards[currentIndex];
  cardFront.innerText = card.front || "Front (empty)";
  cardBack.innerText = card.back || "Back (empty)";
  flashcardEl.classList.remove("flipped");
}

// Add new card
document.getElementById("addCard").onclick = () => {
  const front = document.getElementById("frontText").value.trim();
  const back = document.getElementById("backText").value.trim();
  if(front && back) {
    flashcards.push({front, back, difficulty: "normal"});
    saveFlashcards();
    document.getElementById("frontText").value="";
    document.getElementById("backText").value="";
    showCard(flashcards.length-1);
  }
};

// Navigation & Flip
document.getElementById("flip").onclick = () => flashcardEl.classList.toggle("flipped");
document.getElementById("next").onclick = () => showCard(currentIndex+1);
document.getElementById("prev").onclick = () => showCard(currentIndex-1);
document.getElementById("shuffle").onclick = () => {
  flashcards = flashcards.sort(()=>Math.random()-0.5);
  saveFlashcards();
  showCard(0);
};

// Difficulty Markers
document.getElementById("markEasy").onclick = () => {
  if(flashcards[currentIndex]) {
    flashcards[currentIndex].difficulty = "easy";
    saveFlashcards();
  }
};
document.getElementById("markHard").onclick = () => {
  if(flashcards[currentIndex]) {
    flashcards[currentIndex].difficulty = "hard";
    saveFlashcards();
  }
};

// Export
document.getElementById("exportJSON").onclick = () => {
  document.getElementById("exportOutput").innerText =
    JSON.stringify(flashcards,null,2);
};

// Import
document.getElementById("importButton").onclick = () => {
  document.getElementById("fileInput").click();
};
document.getElementById("fileInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = (event)=>{
      try {
        const imported = JSON.parse(event.target.result);
        if(Array.isArray(imported)) {
          flashcards = imported;
          saveFlashcards();
          showCard(0);
        }
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  }
});

// Theme
document.getElementById("themeSwitcher").addEventListener("change", (e) => {
  document.body.classList.toggle("dark", e.target.checked);
});

// Init
renderCardList();
showCard(0);
