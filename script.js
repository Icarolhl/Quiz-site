const question = document.querySelector(".question");
const answers = document.querySelector(".answers");
const spnQtd = document.querySelector(".spnQtd");
const textFinish = document.querySelector(".finish span");
const content = document.querySelector(".content");
const contentFinish = document.querySelector(".finish");
const btnRestart = document.querySelector(".finish button");
const btnStart = document.querySelector(".start-button"); // Novo botão "Iniciar"
const welcomeMessage = document.querySelector(".welcome-message"); // Mensagem de boas-vindas
const countdownElement = document.getElementById("countdown"); // Elemento para exibir o contador de tempo
const timeUpMessage = document.querySelector(".time-up"); // Elemento para exibir a mensagem de tempo esgotado
const restartTimerButton = document.getElementById("restartTimer"); // Botão "Reiniciar" após o tempo esgotado
import questions from "./questions.js";

let currentIndex = 0;
let questionsCorrect = 0;
let timeRemaining = 180; // Tempo em segundos
let timerInterval;
let isAnsweredCorrectly = true;
let totalQuestions = questions.length; // Total de questões

function startTimer() {
    timerInterval = setInterval(function () {
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
    // Ocultar a mensagem de boas-vindas ao clicar no botão "Iniciar"
    if (welcomeMessage) {
        welcomeMessage.style.display = "none";
    }

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
    timeRemaining = 180; // Reiniciar o tempo
    countdownElement.innerText = timeRemaining;
    clearInterval(timerInterval); // Parar o timer atual
    startTimer(); // Iniciar o timer novamente
};

function showAnswerExplanation() {
    content.style.display = "none";
    contentFinish.style.display = "none";
    timeUpMessage.style.display = "none";

    if (!isAnsweredCorrectly) { // Verificar se a resposta está errada
        // Exibir explicação da resposta incorreta
        const explanationDiv = document.querySelector(".answer-explanation");
        explanationDiv.style.display = "block";

        // Acessar a explicação da pergunta atual
        const currentQuestion = questions[currentIndex];
        const explanationHTML = currentQuestion.explanation;

        // Exibir a explicação usando dangerouslySetInnerHTML
        const explanationElement = document.querySelector(".explanation-text");
        explanationElement.innerHTML = explanationHTML.__html;
    }

    // Pausar o timer
    clearInterval(timerInterval);

    // Exibir o botão "Continue"
    const continueButton = document.querySelector(".continue-button");
    continueButton.style.display = "block";

    // Não finalizar o quiz após uma resposta errada
}

function nextQuestion(e) {
    const selectedButton = e.target;
    const isCorrect = selectedButton.getAttribute("data-correct") === "true";

    // Desabilitar todos os botões de resposta após a seleção
    document.querySelectorAll(".answer").forEach((button) => {
        button.removeEventListener("click", nextQuestion); // Remover o evento de clique
    });

    if (isCorrect) {
        selectedButton.style.backgroundColor = "green"; // Resposta correta fica verde
        questionsCorrect++;
        isAnsweredCorrectly = false; // Define a flag como falsa quando a resposta está errada
    } else {
        selectedButton.style.backgroundColor = "red"; // Resposta incorreta fica vermelha
        isAnsweredCorrectly = false; // Define a flag como falsa quando a resposta está errada
    }

    setTimeout(() => {
        if (isAnsweredCorrectly) {
            if (currentIndex < questions.length - 1) {
                currentIndex++;
            } else {
                finish();
                clearInterval(timerInterval);
                return; // Adicione o return para evitar que o código continue após a chamada para "finish()"
            }
        } else {
            showAnswerExplanation(); // Mostrar explicação da resposta apenas se estiver errada
        }

        // Carregar a próxima pergunta após 1 segundo (incluindo a primeira pergunta)
        loadQuestion();
    }, 1000); // Aguardar 1 segundo antes de passar para a próxima pergunta ou mostrar a explicação
}

// Função para continuar com o quiz após resposta incorreta
function continueQuiz() {
    // Ocultar a explicação da resposta incorreta
    const explanationDiv = document.querySelector(".answer-explanation");
    explanationDiv.style.display = "none";

    // Ocultar o botão "Continue" novamente
    const continueButton = document.querySelector(".continue-button");
    continueButton.style.display = "none";

    // Reiniciar o timer
    timeRemaining = 180;
    countdownElement.innerText = timeRemaining;
    startTimer();

    // Avançar para a próxima pergunta
    currentIndex++;

    // Verificar se ainda há perguntas a serem exibidas
    if (currentIndex < questions.length) {
        content.style.display = "flex";
        loadQuestion();
    } else {
        finish();
        clearInterval(timerInterval);
    }
}

// Adicionar um evento de clique para o botão "Continuar"
const continueButton = document.querySelector(".continue-button");
continueButton.addEventListener("click", continueQuiz);

function generateRandomAverage() {
    return (Math.random() * (1 - 20)+ 20).toFixed(0);
}

function finish() {
    const randomAverage = generateRandomAverage(); // Gerar a média fictícia aleatória
    textFinish.innerHTML = `<strong>Você acertou ${questionsCorrect} Questões, a média de quem faz o teste é de ${randomAverage}</strong>`;
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

content.style.display = "none";
contentFinish.style.display = "none";
