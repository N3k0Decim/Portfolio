document.addEventListener("DOMContentLoaded", () => {
    fetch("dialogs.json")
        .then(response => response.json())
        .then(data => startDialogue(data.npc1));
});

function startDialogue(npc) {
    let index = 0;
    document.getElementById("npc-name").textContent = npc.name;
    document.getElementById("npc-image").src = npc.image;
    updateDialogue(npc, index);
}

function updateDialogue(npc, index) {
    const dialogueBox = document.getElementById("dialogue-text");
    const choicesContainer = document.getElementById("dialogue-choices");

    const currentDialogue = npc.dialog[index];
    dialogueBox.textContent = currentDialogue.text;

    choicesContainer.innerHTML = "";
    currentDialogue.choices.forEach(choice => {
        const button = document.createElement("div");
        button.textContent = choice.text;
        button.classList.add("sub-box");
        button.onclick = () => updateDialogue(npc, choice.next);
        choicesContainer.appendChild(button);
    });
}
