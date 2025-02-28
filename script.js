﻿let dialogueBox = document.getElementById("dialogue-text"); // Pobiera element pola dialogowego
let choicesContainer = document.getElementById("dialogue-choices"); // Pobiera kontener opcji dialogowych
let npcImage = document.getElementById("npc-image"); // Pobiera obraz NPC
let npcName = document.getElementById("npc-name"); // Pobiera nazwę NPC
let locationContainer = document.querySelector("section.fade-in"); // Pobiera kontener sekcji, aby zmieniać tło lokacji

let data;
let currentLocation = "npc1"; // Domyślna lokacja na start

// Wczytuje dane z pliku JSON
fetch("dialogs.json")
    .then(response => response.json())
    .then(json => {
        data = json;
        startLocation(currentLocation); // Rozpoczyna grę od domyślnej lokacji
    });

// Funkcja do zmiany lokacji
function startLocation(location) {
    currentLocation = location;
    let locationData = data[location];

    if (!locationData) {
        console.error(`Lokacja "${location}" nie istnieje.`);
        return;
    }

    // Zmiana nazwy NPC na nazwę lokacji
    npcName.textContent = locationData.name;

    // Ukrywanie obrazu NPC
    removeImage();

    


    // Jeśli lokacja ma przypisane tło, zmienia je dynamicznie
    if (locationData.background) {
        locationContainer.style.backgroundImage = `url(${locationData.background})`;
    } else {
        locationContainer.style.backgroundImage = ""; // Resetowanie tła, jeśli brak
    }

    // Jeśli lokacja zawiera NPC, pozwala wybrać rozmówcę
    if (locationData.npcs) {
        dialogueBox.innerHTML = `<p>Jesteś w ${locationData.name}. Z kim chcesz rozmawiać?</p>`;
        choicesContainer.innerHTML = "";

        locationData.npcs.forEach(npcKey => {
            let npc = data[npcKey];
            if (!npc) return;

            let div = document.createElement("div");
            div.classList.add("sub-box");
            div.textContent = npc.name;
            div.style.cursor = "pointer";

            div.onclick = () => startDialogue(npcKey); // Przypisuje akcję kliknięcia do wyboru NPC
            choicesContainer.appendChild(div);
        });

        // Dodanie opcji powrotu, jeśli jest dostępna
        if (locationData.back) {
            let backButton = document.createElement("div");
            backButton.classList.add("sub-box", "back-option");
            backButton.textContent = "Powrót";
            backButton.style.cursor = "pointer";
            backButton.onclick = () => startLocation(locationData.back);
            choicesContainer.appendChild(backButton);
        }
    } else {
        startDialogue(location); // Jeśli to pojedynczy NPC, rozpoczyna dialog
    }
}

// Funkcja rozpoczynająca dialog z wybranym NPC
function startDialogue(npcKey) {
    let npc = data[npcKey];
    if (!npc) {
        console.error(`NPC "${npcKey}" nie istnieje.`);
        return;
    }

    addImage();

    // Pokazuje obraz NPC
    const npcImage = document.querySelector(".circle-image img");
    npcImage.src = npc.image; // Ustawia obraz NPC
    npcName.textContent = npc.name; // Ustawia nazwę NPC

    updateDialogue(npc, 0); // Wyświetla pierwszy dialog NPC
}

// Funkcja aktualizująca dialog NPC w zależności od wyboru
function updateDialogue(npc, index) {
    let dialog = npc.dialog[index];
    if (!dialog) return;

    dialogueBox.innerHTML = `<p>${dialog.text}</p>`; // Wyświetla aktualny tekst dialogu
    choicesContainer.innerHTML = "";

    dialog.choices.forEach(choice => {
        let div = document.createElement("div");
        div.classList.add("sub-box");
        div.textContent = choice.text;
        div.setAttribute("tabindex", "0"); // Umożliwia interakcję klawiszem Enter
        div.style.cursor = "pointer";

        div.onclick = () => handleChoice(choice, npc); // Obsługa kliknięcia na opcję
        div.onkeydown = (event) => {
            if (event.key === "Enter") handleChoice(choice, npc); // Obsługa klawisza Enter
        };

        choicesContainer.appendChild(div);
    });
}

// Obsługuje wybór gracza i decyduje, co się wydarzy dalej
function handleChoice(choice, npc) {
    if (choice.npc) {
        startDialogue(choice.npc); // Przejście do innego NPC
    } else if (choice.next !== undefined) {
        updateDialogue(npc, choice.next); // Kontynuacja dialogu
    } else if (choice.location) {
        startLocation(choice.location); // Przejście do nowej lokacji
    } else {
        // Zakończenie dialogu
        dialogueBox.innerHTML = "<p>Rozmowa zakończona.</p>";
        choicesContainer.innerHTML = "";
    }
}
// Funkcja usuwania obrazu
function removeImage() {
    const circleImage = document.querySelector(".circle-image");
    if (circleImage) {
        circleImage.remove(); // Usuwa element
    }
    // Po usunięciu centrowanie content
    document.querySelector(".bottom-container").style.justifyContent = "center";
    
}

// Funkcja dodawania obrazu
function addImage() {
    const bottomContainer = document.querySelector(".bottom-container");

    // Sprawdź, czy obraz już istnieje (aby uniknąć duplikatów)
    if (document.querySelector(".circle-image")) return;

    // Stwórz nowy element dla obrazu
    const newCircleImage = document.createElement("div");
    newCircleImage.classList.add("circle-image");

    // Dodaj zawartość do elementu (img tag)
    const img = document.createElement("img");
    img.src = ""; // Domyślna ścieżka do obrazu, zostanie nadpisana w `startDialogue`
    img.alt = "NPC Image";
    newCircleImage.appendChild(img);

    // Dodaj nowy element z powrotem do kontenera
    bottomContainer.appendChild(newCircleImage);

    // Po dodaniu zmień układ
    document.querySelector(".bottom-container").style.justifyContent = "space-between";
    document.querySelector(".bottom-container").style.gap = "20px";
}