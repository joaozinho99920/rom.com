const canvas = document.getElementById("faceCanvas");
const ctx = canvas.getContext("2d");

const activateBtn = document.getElementById("activate");
const deactivateBtn = document.getElementById("deactivate");

let active = false;
let mode = "idle";
let emotion = "neutral";

let mouseX = 200, mouseY = 200;
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

function drawFace(){
    ctx.clearRect(0,0,400,400);
    ctx.fillStyle = "#333";
    ctx.fillRect(50,50,300,300);

    ctx.fillStyle = "#fff";
    const leftEyeX = 130 + (mouseX - 200)/30;
    const rightEyeX = 270 + (mouseX - 200)/30;
    const eyeY = 150 + (mouseY - 200)/30;
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, 25,0,Math.PI*2);
    ctx.arc(rightEyeX, eyeY, 25,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle = emotion==="happy"?"#ffff00":emotion==="sad"?"#00f":emotion==="surprised"?"#f0f":emotion==="bug"?"#ff4040":"#ff4040";
    const mouthHeight = mode==="talk"?30:20;
    ctx.fillRect(160,250,80,mouthHeight);

    if(Math.random() < 0.05){
        for(let i=0;i<20;i++){
            ctx.fillStyle = `rgb(${Math.random()*255},${Math.random()*255},255)`;
            ctx.fillRect(Math.random()*300+50, Math.random()*300+50, 10,5);
        }
    }
}
setInterval(drawFace, 80);

function speak(text){
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "pt-BR";
    mode = "talk";
    speechSynthesis.speak(utter);
    utter.onend = () => { mode="idle"; };
}

const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new Rec();
recognition.lang = "pt-BR";
recognition.interimResults = false;
recognition.continuous = false;

recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    console.log("Você:", text);

    const res = respond(text);
    emotion = res.emotion;

    if(Math.random() < 0.3) mode="bug";

    speak(res.reply);
};

recognition.onend = () => { if(active) recognition.start(); };

activateBtn.onclick = () => {
    if(!active){
        active = true;
        recognition.start();
        speak("Pronto! Sou seu Ron Ultra Max Final! Vamos rir, bugar e ser amigos!");

        setInterval(() => {
            if(active){
                let comment = spontaneousComment();
                if(comment) speak(comment);
            }
        }, Math.floor(Math.random()*15000 + 45000));
    }
};

deactivateBtn.onclick = () => {
    if(active){
        active = false;
        recognition.stop();
        speak("Ok! Pausando Ron. Me chame quando quiser!");
    }
};
