const herbKnowledge = {
  kamille: {
    aliases: ["kamille", "chamomile"],
    summary: "Kamille staat bekend om een zachte, bloemige smaak en wordt vaak gebruikt in rustgevende thee.",
    uses: [
      "thee voor een kalm avondritueel",
      "stoombad of kompres voor een zachte wellnessroutine",
      "milde toevoeging aan honing of citroeninfusies"
    ],
    pairing: ["honing", "citroen", "lavendel", "munt"],
    caution: "Gebruik voorzichtig bij allergie voor planten uit de composietenfamilie."
  },
  munt: {
    aliases: ["munt", "pepermunt", "mint"],
    summary: "Munt geeft een frisse, koele smaak en werkt goed in warme en koude dranken.",
    uses: [
      "verfrissende thee of ijsthee",
      "smaakmaker in salades en zomerse desserts",
      "aromatische topping voor water met komkommer of limoen"
    ],
    pairing: ["limoen", "komkommer", "pure chocolade", "citroenmelisse"],
    caution: "Pepermunt kan voor sommige mensen te intens zijn bij een gevoelige maag."
  },
  rozemarijn: {
    aliases: ["rozemarijn", "rosemary"],
    summary: "Rozemarijn heeft een harsachtig, hartig aroma dat veel wordt gebruikt in mediterrane gerechten.",
    uses: [
      "aardappels, focaccia en geroosterde groenten",
      "kruidenolie of marinade voor hartige gerechten",
      "geurige toevoeging aan badzout of huisparfum"
    ],
    pairing: ["citroen", "knoflook", "tijm", "olijfolie"],
    caution: "Gebruik culinair met mate; sterk geconcentreerde toepassingen vragen extra voorzichtigheid."
  },
  lavendel: {
    aliases: ["lavendel", "lavender"],
    summary: "Lavendel heeft een bloemig en licht zoet profiel en wordt vaak ingezet voor geur en ontspanning.",
    uses: [
      "in kleine hoeveelheid door koekjes, siroop of suiker",
      "aromatische thee-blends met kamille",
      "sachet of geurzakje voor linnenkasten"
    ],
    pairing: ["blauwe bessen", "vanille", "kamille", "honing"],
    caution: "De smaak kan snel overheersen; begin met een kleine hoeveelheid."
  },
  gember: {
    aliases: ["gember", "ginger"],
    summary: "Gember geeft warmte en pit en is populair in thee, soepen en roerbakgerechten.",
    uses: [
      "verse thee met citroen",
      "basis voor curry, wok of bouillon",
      "kruidige shot of siroop voor koude dagen"
    ],
    pairing: ["citroen", "kurkuma", "honing", "sinaasappel"],
    caution: "De pittigheid kan sterk zijn; pas hoeveelheid aan op smaak en persoonlijke tolerantie."
  },
  basilicum: {
    aliases: ["basilicum", "basil"],
    summary: "Basilicum is zoet-kruidig en onmisbaar in veel Italiaanse en zomerse gerechten.",
    uses: [
      "pesto, pastasaus en caprese",
      "frisse afwerking voor pizza of soep",
      "infusie in limonade met aardbei"
    ],
    pairing: ["tomaat", "mozzarella", "aardbei", "citroen"],
    caution: "Voeg basilicum bij warme gerechten liefst laat toe voor het beste aroma."
  }
};

const suggestionPrompts = [
  "Welke kruiden helpen bij een ontspannende thee?",
  "Wat past goed bij rozemarijn in de keuken?",
  "Geef ideeën met munt voor in de zomer.",
  "Wat is een zachte start als ik lavendel wil gebruiken?"
];

const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const suggestions = document.getElementById("suggestions");
const messageTemplate = document.getElementById("message-template");

function addMessage(role, author, content) {
  const fragment = messageTemplate.content.cloneNode(true);
  const message = fragment.querySelector(".message");
  const avatar = fragment.querySelector(".message-avatar");
  const authorNode = fragment.querySelector(".message-author");
  const textNode = fragment.querySelector(".message-text");

  message.dataset.role = role;
  avatar.textContent = role === "user" ? "🧑" : "🌿";
  authorNode.textContent = author;
  textNode.innerHTML = content;
  chatLog.appendChild(fragment);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function renderSuggestions() {
  suggestionPrompts.forEach((prompt) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion-chip";
    button.textContent = prompt;
    button.addEventListener("click", () => {
      userInput.value = prompt;
      userInput.focus();
    });
    suggestions.appendChild(button);
  });
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildHerbResponse(entryName, herb) {
  const uses = herb.uses.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const pairings = herb.pairing.map(escapeHtml).join(", ");

  return [
    `<p><strong>${escapeHtml(capitalize(entryName))}</strong>: ${escapeHtml(herb.summary)}</p>`,
    `<p><strong>Ideeën:</strong></p><ul>${uses}</ul>`,
    `<p><strong>Combinaties:</strong> ${pairings}.</p>`,
    `<p><strong>Let op:</strong> ${escapeHtml(herb.caution)}</p>`
  ].join("");
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function detectHerbs(prompt) {
  const lower = prompt.toLowerCase();
  return Object.entries(herbKnowledge)
    .filter(([, herb]) => herb.aliases.some((alias) => lower.includes(alias)))
    .map(([name]) => name);
}

function answerPrompt(prompt) {
  const detected = detectHerbs(prompt);

  if (detected.length > 0) {
    return detected
      .map((name) => buildHerbResponse(name, herbKnowledge[name]))
      .join("<hr>");
  }

  const lower = prompt.toLowerCase();

  if (lower.includes("ontspann") || lower.includes("rust") || lower.includes("slaap")) {
    return [
      "<p>Voor een ontspannend moment zijn kamille en lavendel populaire keuzes.</p>",
      "<p>Je kunt starten met een milde blend van kamille, een klein beetje lavendel en wat honing voor balans.</p>",
      "<p><strong>Let op:</strong> gebruik kruiden bewust en vraag bij gezondheidsvragen een arts of apotheker om advies.</p>"
    ].join("");
  }

  if (lower.includes("keuken") || lower.includes("koken") || lower.includes("recept")) {
    return [
      "<p>Voor koken kun je grofweg zo kiezen:</p>",
      "<ul><li><strong>Rozemarijn</strong> voor aardse, hartige gerechten.</li><li><strong>Basilicum</strong> voor fris-zomerse gerechten.</li><li><strong>Gember</strong> voor warmte en pit.</li><li><strong>Munt</strong> voor frisheid in drankjes en desserts.</li></ul>",
      "<p>Noem gerust een ingrediënt of gerecht, dan stel ik kruidencombinaties voor.</p>"
    ].join("");
  }

  return [
    "<p>Ik kan je helpen met kruiden zoals kamille, munt, rozemarijn, lavendel, gember en basilicum.</p>",
    "<p>Vraag bijvoorbeeld naar smaakcombinaties, toepassingen in thee of ideeën voor koken.</p>",
    "<p><strong>Voorbeeld:</strong> ‘Waarvoor gebruik je gember?’ of ‘Welke kruiden passen bij tomaat?’</p>"
  ].join("");
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const prompt = userInput.value.trim();

  if (!prompt) {
    return;
  }

  addMessage("user", "Jij", `<p>${escapeHtml(prompt)}</p>`);

  window.setTimeout(() => {
    const response = answerPrompt(prompt);
    addMessage("assistant", "Kruiden AI", response);
  }, 250);

  chatForm.reset();
  userInput.focus();
});

renderSuggestions();
addMessage(
  "assistant",
  "Kruiden AI",
  [
    "<p>Hoi! Ik ben je kruidenassistent.</p>",
    "<p>Vraag me naar kruiden voor thee, koken, geur of smaakcombinaties.</p>",
    "<p><strong>Tip:</strong> noem een kruid zoals kamille, munt of rozemarijn om meteen gerichte ideeën te krijgen.</p>"
  ].join("")
);
