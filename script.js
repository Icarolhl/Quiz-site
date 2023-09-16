const question = document.querySelector(".question");
const answers = document.querySelector(".answers");
const spnQtd = document.querySelector(".spnQtd");
const textFinish = document.querySelector(".finish span");
const content = document.querySelector(".content");
const contentFinish = document.querySelector(".finish");
const btnRestart = document.querySelector(".finish button");
const btnStart = document.querySelector(".start-button"); // Novo botão "Iniciar"
const countdownElement = document.getElementById("countdown"); // Elemento para exibir o contador de tempo
const timeUpMessage = document.querySelector(".time-up"); // Elemento para exibir a mensagem de tempo esgotado
const restartTimerButton = document.getElementById("restartTimer"); // Botão "Reiniciar" após o tempo esgotado

import questions from "./questions.js";

let currentIndex = 0;
let questionsCorrect = 0;
let timeRemaining = 20; // Tempo em segundos

let timerInterval;

function startTimer() {
    timerInterval = setInterval(function() {
        timeRemaining--;
        countdownElement.innerText = timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            showTimeUpMessage();
        }
    }, 1000); // Atualiza a cada segundo (1000ms)
}

function showTimeUpMessage() {
    content.style.display = "none";
    contentFinish.style.display = "none";
    timeUpMessage.style.display = "block"; // Altera o estilo de display
}

function hideTimeUpMessage() {
    timeUpMessage.classList.add("hidden");
}

btnStart.onclick = () => {
    btnStart.style.display = "none"; // Oculta o botão "Iniciar" ao clicar
    content.style.display = "flex";
    currentIndex = 0;
    questionsCorrect = 0;
    loadQuestion();
    countdownElement.classList.remove("hidden"); // Exibe a div com a classe "timer"
    startTimer(); // Iniciar o timer quando clicar em "Iniciar"
    // Mostrar a classe .timer
    document.querySelector(".timer").style.display = "block";
};

btnRestart.onclick = () => {
    location.reload(); // Recarrega a página ao clicar em "Reiniciar"
};

restartTimerButton.onclick = () => {
    hideTimeUpMessage();
    btnStart.style.display = "block"; // Exibir o botão "Iniciar" novamente
    timeRemaining = 60; // Reiniciar o tempo
    countdownElement.innerText = timeRemaining;
    clearInterval(timerInterval); // Parar o timer atual
    startTimer(); // Iniciar o timer novamente

    // Recarregar a página
    window.location.reload();
};

function nextQuestion(e) {
    if (e.target.getAttribute("data-correct") === "true") {
        questionsCorrect++;
    }

    if (currentIndex < questions.length - 1) {
        currentIndex++;
        loadQuestion();
    } else {
        finish();
        clearInterval(timerInterval); // Pausa o contador quando todas as perguntas foram respondidas
    }
}

function finish() {
    textFinish.innerHTML = `Você acertou ${questionsCorrect} de ${questions.length}`;
    content.style.display = "none";
    contentFinish.style.display = "flex";
}

function loadQuestion() {
    spnQtd.innerHTML = `${currentIndex + 1}/${questions.length}`;
    const item = questions[currentIndex];
    answers.innerHTML = "";
    question.innerHTML = item.question;

    item.answers.forEach((answer) => {
        const div = document.createElement("div");

        div.innerHTML = `
    <button class="answer" data-correct="${answer.correct}">
      ${answer.option}
    </button>
    `;

        answers.appendChild(div);
    });

    document.querySelectorAll(".answer").forEach((item) => {
        item.addEventListener("click", nextQuestion);
    });
}

// Inicialmente, mostrar apenas o botão "Iniciar" e ocultar o conteúdo do quiz
content.style.display = "none";
contentFinish.style.display = "none";
