let dialogueBox = document.getElementById("dialogue-text");
let choicesContainer = document.getElementById("dialogue-choices");
let npcImage = document.getElementById("npc-image");
let npcName = document.getElementById("npc-name");

let data;

// Wczytaj dane z pliku JSON
fetch("dialogs.json")
    .then(response => response.json())
    .then(json => {
        data = json;
        startDialogue(data["npc1"]); // Rozpocznij od pierwszego NPC
    });

function startDialogue(npc) {
    if (!npc) return;
    npcImage.src = npc.image;
    npcName.textContent = npc.name;
    updateDialogue(npc, 0);
}

function updateDialogue(npc, index) {
    let dialog = npc.dialog[index];
    if (!dialog) return;

    // Aktualizacja tekstu dialogu
    dialogueBox.innerHTML = `<p>${dialog.text}</p>`;
    choicesContainer.innerHTML = "";

    // Tworzenie opcji wyboru w .sub-box zamiast <button>
    dialog.choices.forEach(choice => {
        let div = document.createElement("div");
        div.classList.add("sub-box");
        div.textContent = choice.text;

        div.onclick = () => {
            if (choice.npc) {
                // Jeśli wybór prowadzi do innego NPC, zmieniamy rozmówcę
                startDialogue(data[choice.npc]);
            } else if (choice.next !== null) {
                // Jeśli istnieje następny indeks, przechodzimy do niego
                updateDialogue(npc, choice.next);
            } else {
                // Jeśli next === null, kończymy rozmowę
                dialogueBox.innerHTML = "<p>Rozmowa zakończona.</p>";
                choicesContainer.innerHTML = "";
            }
        };

        choicesContainer.appendChild(div);
    });
}
