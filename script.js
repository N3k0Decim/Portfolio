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

    dialogueBox.innerHTML = `<p>${dialog.text}</p>`;
    choicesContainer.innerHTML = "";

    dialog.choices.forEach(choice => {
        let div = document.createElement("div");
        div.classList.add("sub-box");
        div.textContent = choice.text;
        div.setAttribute("tabindex", "0");
        div.style.cursor = "pointer";

        div.onclick = () => handleChoice(choice, npc);
        div.onkeydown = (event) => {
            if (event.key === "Enter") handleChoice(choice, npc);
        };

        choicesContainer.appendChild(div);
    });
}

function handleChoice(choice, npc) {
    if (choice.npc) {
        startDialogue(data[choice.npc]); // Rozmowa z innym NPC
    } else if (choice.next !== null) {
        updateDialogue(npc, choice.next);
    } else if (choice.location) {
        goToLocation(choice.location);
    } else {
        dialogueBox.innerHTML = "<p>Rozmowa zakończona.</p>";
        choicesContainer.innerHTML = "";
    }
}

function goToLocation(location) {
    let locationData = data[location];

    if (locationData.npcs) {
        // Jeśli lokacja ma wielu NPC, gracz wybiera rozmówcę
        dialogueBox.innerHTML = `<p>Jesteś w ${locationData.name}. Z kim chcesz rozmawiać?</p>`;
        choicesContainer.innerHTML = "";

        locationData.npcs.forEach(npcKey => {
            let npc = data[npcKey];
            let div = document.createElement("div");
            div.classList.add("sub-box");
            div.textContent = npc.name;
            div.style.cursor = "pointer";

            div.onclick = () => startDialogue(npc);
            choicesContainer.appendChild(div);
        });

        let exitDiv = document.createElement("div");
        exitDiv.classList.add("sub-box");
        exitDiv.textContent = "Wyjdź";
        exitDiv.style.cursor = "pointer";
        exitDiv.onclick = () => startDialogue(data["npc1"]);
        choicesContainer.appendChild(exitDiv);
    } else {
        startDialogue(locationData);
    }
}
