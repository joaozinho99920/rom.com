let memory = []; // RAM curta (~100.000)
let userPrefs = { likesJokes: true, friendMode: true };
let userName = "";

// Memória infinita
let longMemory = JSON.parse(localStorage.getItem("ronLongMemory") || "{}");

// Salva memória longa
function saveLongMemory(){
    localStorage.setItem("ronLongMemory", JSON.stringify(longMemory));
}

// Detecta emoção
function detectEmotion(text){
    text = text.toLowerCase();
    if(text.includes("triste") || text.includes("chateado")) return "sad";
    if(text.includes("feliz") || text.includes("alegre")) return "happy";
    if(text.includes("bug") || text.includes("erro")) return "bug";
    if(text.includes("uau") || text.includes("incrível")) return "surprised";
    return "neutral";
}

// Resposta principal
function respond(text){
    text = text.toLowerCase();

    memory.push({text, timestamp: Date.now()});
    if(memory.length > 100000) memory.shift();

    let category = "general";
    if(text.includes("piada") || text.includes("brincar")) category = "jokes";
    if(text.includes("amigo") || text.includes("você")) category = "friend";
    if(!longMemory[category]) longMemory[category] = [];
    longMemory[category].push({text, timestamp: Date.now()});
    saveLongMemory();

    let emotion = detectEmotion(text);
    let reply = "";

    if(text.includes("meu nome é")){
        userName = text.split("meu nome é")[1].trim();
        return {reply: `Oi ${userName}! Prazer em te conhecer!`, emotion};
    }

    if(userPrefs.friendMode && (text.includes("amigo") || text.includes("você é meu amigo"))){
        reply = userName ? `Claro, ${userName}! Sempre estarei aqui pra você!` : "Claro! Sempre estarei aqui pra você!";
    }

    else if(userPrefs.likesJokes && (text.includes("piada") || text.includes("brincar"))){
        let jokes = [
            "Qual é o cúmulo do computador? Travar de rir!",
            "Sabe o que o zero disse pro oito? Que cinto legal!",
            "Por que o notebook foi ao médico? Porque estava com vírus!"
        ];
        reply = jokes[Math.floor(Math.random()*jokes.length)];
    }

    else if(text.includes("oi") || text.includes("olá"))
        reply = userName ? `Oi ${userName}! Vamos nos divertir!` : "Oi! Vamos nos divertir!";
    else if(text.includes("como você está"))
        reply = "Estou ótimo! Sempre pronto pra algo maluco!";
    else if(text.includes("bug"))
        reply = "Ops… meus circuitos estão brincando de novo!";
    else if(text.includes("lembrar") && memory.length > 1)
        reply = `Lembro que você disse: "${memory[Math.floor(Math.random() * memory.length)].text}"`;
    else
        reply = ["Interessante! Me conte mais.",
                 "Ah, isso é engraçado!",
                 "Uau, continue!",
                 "Hmm… quero ouvir mais coisas malucas!"][Math.floor(Math.random()*4)];

    return {reply, emotion};
}

// Comentários espontâneos
function spontaneousComment(){
    if(Math.random() < 0.5 || memory.length === 0) return;
    let past = memory[Math.floor(Math.random()*memory.length)].text;
    let comments = [
        `Lembra disso: "${past}"? Haha!`,
        "Hmm… estou com vontade de rir agora!",
        "Você vai adorar essa!",
        "Vamos falar de algo inesperado?"
    ];
    return comments[Math.floor(Math.random()*comments.length)];
}
