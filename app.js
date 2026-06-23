const herbKnowledge = {
  kamille: {
    tags: ["rust", "avond", "thee", "zacht"],
    uses: "Kamille is geliefd in milde avondthee en wordt vaak gekozen voor een zachte, bloemige infusie.",
    pairings: "Combineert mooi met lavendel, citroenmelisse en een beetje honing.",
    caution: "Gebruik bij medische vragen of zwangerschap altijd aanvullend professioneel advies.",
  },
  munt: {
    tags: ["fris", "spijsvertering", "drank", "zomer"],
    uses: "Munt geeft direct frisheid in thee, water, desserts en zomerse drankjes.",
    pairings: "Past goed bij limoen, komkommer, basilicum en groene thee.",
    caution: "Wie gevoelig is voor sterke munt of reflux kan beter kleinere hoeveelheden proberen.",
  },
  rozemarijn: {
    tags: ["hartig", "aardappel", "mediterraan", "krachtig"],
    uses: "Rozemarijn is krachtig en werkt goed in geroosterde groente, aardappelgerechten en brood.",
    pairings: "Sterk met tijm, knoflook, citroen en olijfolie.",
    caution: "Door de sterke smaak is een kleine hoeveelheid vaak al genoeg.",
  },
  tijm: {
    tags: ["hartig", "soep", "mediterraan", "warm"],
    uses: "Tijm brengt diepte in soepen, sauzen en groentegerechten.",
    pairings: "Lekker met rozemarijn, salie, tomaat en ui.",
    caution: "Gebruik culinair gerust, maar bij gezondheidsvragen blijft professioneel advies belangrijk.",
  },
  lavendel: {
    tags: ["ontspanning", "bloemig", "avond", "geur"],
    uses: "Lavendel wordt vaak in kleine hoeveelheden gebruikt voor geurige, rustgevende blends.",
    pairings: "Mooi samen met kamille, roos en vanille.",
    caution: "Gebruik spaarzaam; lavendel kan snel te intens smaken.",
  },
  basilicum: {
    tags: ["tomaat", "pasta", "fris", "zacht"],
    uses: "Basilicum geeft een frisse, groene toon aan pasta, salades en zomerse sauzen.",
    pairings: "Klassiek met tomaat, mozzarella, citroen en munt.",
    caution: "Voeg basilicum vaak pas laat toe om de frisse smaak te behouden.",
  },
  salie: {
    tags: ["warm", "romig", "boter", "herfst"],
    uses: "Salie heeft een warm, aards profiel en werkt goed in boter, pompoen en paddestoelgerechten.",
    pairings: "Combineert met tijm, rozemarijn, boter en citroen.",
    caution: "Sterke smaak; doseer voorzichtig.",
  },
  citroenmelisse: {
    tags: ["rust", "fris", "thee", "licht"],
    uses: "Citroenmelisse is licht citrusachtig en populair in kalmerende of frisse theemengsels.",
    pairings: "Past bij kamille, munt en citroenschil.",
    caution: "Voor medisch gebruik is extra controle verstandig.",
  },
};

const fallbackTips = {
  ontspanning: ["kamille", "lavendel", "citroenmelisse"],
  slapen: ["kamille", "lavendel", "citroenmelisse"],
  avond: ["kamille", "lavendel", "citroenmelisse"],
  thee: ["kamille", "munt", "citroenmelisse"],
  pasta: ["basilicum", "tijm", "oregano"],
  tomaat: ["basilicum", "tijm", "oregano"],
  zomer: ["munt", "basilicum", "citroenmelisse"],
  fris: ["munt", "citroenmelisse", "basilicum"],
  aardappel: ["rozemarijn", "tijm", "salie"],
};

const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const messages = document.getElementById("chatMessages");
const promptButtons = document.querySelectorAll(".prompt-chip");

const createMessage = (role, text) => {
  const article = document.createElement("article");
  article.className = `message ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "assistant" ? "🌿" : "🙂";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  article.append(avatar, bubble);
  messages.append(article);
  messages.scrollTop = messages.scrollHeight;
};

const matchHerbs = (message) => {
  const lower = message.toLowerCase();
  const herbs = Object.entries(herbKnowledge)
    .filter(([name, data]) => lower.includes(name) || data.tags.some((tag) => lower.includes(tag)))
    .map(([name]) => name);

  if (herbs.length > 0) {
    return [...new Set(herbs)];
  }

  const hinted = Object.entries(fallbackTips)
    .filter(([keyword]) => lower.includes(keyword))
    .flatMap(([, values]) => values);

  return [...new Set(hinted)];
};

const buildResponse = (message) => {
  const herbs = matchHerbs(message);

  if (herbs.length === 0) {
    return [
      "Ik kan je helpen met kruiden voor thee, koken, geur en sfeer.",
      "Vertel me wat je doel is, zoals ontspanning, frisse smaak, pasta, soep of een avondblend.",
      "Let op: ik geef algemene informatie en geen medisch advies.",
    ].join("\n\n");
  }

  const lines = herbs.slice(0, 3).map((herb) => {
    const data = herbKnowledge[herb];

    if (!data) {
      return `• ${capitalize(herb)}: een populaire keuze. Vertel me meer over je gerecht of doel, dan maak ik het specifieker.`;
    }

    return `• ${capitalize(herb)} — ${data.uses} ${data.pairings} ${data.caution}`;
  });

  const lower = message.toLowerCase();
  let closing = "Als je wilt, maak ik hier ook een blend of recept van.";

  if (lower.includes("thee") || lower.includes("blend")) {
    closing = "Voor een eenvoudige blend kun je starten met 2 delen zachte basis, 1 deel fris accent en eventueel 1 klein bloemig accent.";
  } else if (lower.includes("pasta") || lower.includes("gerecht") || lower.includes("recept")) {
    closing = "Vertel welk gerecht je maakt, dan geef ik exacte kruidenverhoudingen en een serveertip.";
  }

  return `${lines.join("\n\n")}\n\n${closing}`;
};

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = input.value.trim();

  if (!message) {
    return;
  }

  createMessage("user", message);
  const response = buildResponse(message);

  window.setTimeout(() => createMessage("assistant", response), 250);
  form.reset();
  input.focus();
});

promptButtons.forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.textContent.trim();
    input.focus();
  });
});
