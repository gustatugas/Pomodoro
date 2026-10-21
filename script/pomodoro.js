// Reconhecendo elementos importantes
const comecar = document.getElementById("start");
const display = document.getElementById("display-pomodoro");
const seletor = document.getElementById("lista-minutos");
const seletorDescanso = document.getElementById("tempoDescanso");
const labelFase = document.getElementById("fase-pomodoro");
const displayFocoTotal = document.getElementById("displayFocoTotal");
const botaoPausa = document.getElementById("pausa");
const botaoReproduzir = document.getElementById("reproduzir");
const botaoReiniciar = document.getElementById("reiniciar");

let intervalo;

// Estado salvo no localStorage 


function timerRodando() {
    return localStorage.getItem("fimEm") !== null;
}

function timerPausado() {
    return localStorage.getItem("restantePausaMs") !== null;
}

function faseAtual() {
    return localStorage.getItem("fase") || "foco";
}

// Display 

function mostrar(totalSegundos) {
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;

    display.textContent =
        String(minutos).padStart(2, "0") + ":" +
        String(segundos).padStart(2, "0");

    if (labelFase) {
        labelFase.textContent = faseAtual() === "descanso" ? "Descanso" : "Foco";
    }
}

// Seletor de minutos 

seletor.addEventListener("change", () => {
    if (timerRodando() || timerPausado()) return;

    mostrar(Number(seletor.value) * 60);
});


// Data de hoje no horário local, formato AAAA-MM-DD
function hoje() {
    const d = new Date();
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

function lerHistorico() {
    try {
        return JSON.parse(localStorage.getItem("historicoEstudo")) || {};
    } catch {
        return {};
    }
}

function formatarTempo(minutos) {
    if (minutos < 60) {
        return `${minutos}min`;
    }

    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;

    return resto === 0 ? `${horas}h` : `${horas}h ${resto}min`;
}

function mostrarTotal() {
    if (!displayFocoTotal) return; 

    const historico = lerHistorico();
    displayFocoTotal.textContent = formatarTempo(historico[hoje()] || 0);
}

function adicionarMinutos(minutos) {
    const historico = lerHistorico();
    const dia = hoje();

    historico[dia] = (historico[dia] || 0) + minutos;
    localStorage.setItem("historicoEstudo", JSON.stringify(historico));

    mostrarTotal();
}

// Contagem 

function limparSessao() {
    localStorage.removeItem("fimEm");
    localStorage.removeItem("restantePausaMs");
    localStorage.removeItem("minutosSessao");
    localStorage.removeItem("fase");
}

function finalizar() {
    clearInterval(intervalo);

    const minutos = Number(localStorage.getItem("minutosSessao"));
    const fase = faseAtual();

    limparSessao();
    mostrar(0);

    if (fase === "foco") {
        adicionarMinutos(minutos);

        alert("tempo de foco concluído, hora de descansar");

        comecarFase("descanso", Number(seletorDescanso.value));
    } else {
        alert("descanso concluído");

        mostrar(Number(seletor.value) * 60);
    }
}

// Calcula quanto falta comparando o horário final com o horário de agora
function atualizar() {
    const restanteMs = Number(localStorage.getItem("fimEm")) - Date.now();
    const restante = Math.max(0, Math.ceil(restanteMs / 1000));

    mostrar(restante);

    if (restanteMs <= 0) {
        finalizar();
    }
}

function rodar() {
    clearInterval(intervalo);

    atualizar(); 

    if (timerRodando()) {
        intervalo = setInterval(atualizar, 1000);
    }
}

// Controles de mídia 

function comecarFase(fase, minutos) {
    localStorage.setItem("fimEm", Date.now() + minutos * 60 * 1000);
    localStorage.setItem("minutosSessao", minutos);
    localStorage.setItem("fase", fase);

    localStorage.removeItem("restantePausaMs");

    rodar();
}

// Começa uma sessão de foco nova com o tempo do seletor
function iniciar() {
    comecarFase("foco", Number(seletor.value));
}

function pausar() {
    if (!timerRodando()) return;

    clearInterval(intervalo);

    const restanteMs = Number(localStorage.getItem("fimEm")) - Date.now();
    localStorage.setItem("restantePausaMs", Math.max(0, restanteMs));
    localStorage.removeItem("fimEm");
}

function reproduzir() {
    if (timerRodando()) return;

    if (timerPausado()) {
        const restanteMs = Number(localStorage.getItem("restantePausaMs"));
        localStorage.setItem("fimEm", Date.now() + restanteMs);
        localStorage.removeItem("restantePausaMs");

        rodar();
    } else {
        iniciar();
    }
}

function reiniciar() {
    clearInterval(intervalo);

    limparSessao();

    mostrar(Number(seletor.value) * 60);
}

// Botão "Começar" 

comecar.addEventListener("click", iniciar);

botaoPausa.addEventListener("click", pausar);
botaoReproduzir.addEventListener("click", reproduzir);
botaoReiniciar.addEventListener("click", reiniciar);

// Ao abrir/recarregar a página 

mostrarTotal();

if (timerRodando() || timerPausado()) {
    const minutos = localStorage.getItem("minutosSessao");

    if (faseAtual() === "descanso") {
        seletorDescanso.value = minutos;
    } else {
        seletor.value = minutos;
    }
}

if (timerRodando()) {
    rodar();
} else if (timerPausado()) {
    mostrar(Math.ceil(Number(localStorage.getItem("restantePausaMs")) / 1000));
} else {
    mostrar(Number(seletor.value) * 60);
}