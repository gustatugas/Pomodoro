// Reconhecendo valores dos minutos e o botão start
const comecar = document.getElementById("start");
const display = document.getElementById("display-pomodoro");
const seletor = document.getElementById("lista-minutos");
const displayFocoTotal = document.getElementById("displayFocoTotal");

let intervalo;

// Display 

// Recebe segundos e mostra no formato MM:SS
function mostrar(totalSegundos) {
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;

    display.textContent =
        String(minutos).padStart(2, "0") + ":" +
        String(segundos).padStart(2, "0");
}

// Estado salvo no localStorage 


function timerRodando() {
    return localStorage.getItem("fimEm") !== null;
}

// Seletor de minutos 

seletor.addEventListener("change", () => {
    // Se o timer já está rodando, não mexe no display
    if (timerRodando()) return;

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

function finalizar() {
    clearInterval(intervalo);

    const minutos = Number(localStorage.getItem("minutosSessao"));
    localStorage.removeItem("fimEm");
    localStorage.removeItem("minutosSessao");

    mostrar(0);

    adicionarMinutos(minutos); 

    alert("tempo de foco concluído");
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

    atualizar(); // já mostra o valor certo, sem esperar 1 segundo

    // só cria o intervalo se o timer não terminou no atualizar()
    if (timerRodando()) {
        intervalo = setInterval(atualizar, 1000);
    }
}

function controlarMidia() {
    const pause = document.getElementById("#pausa");
    const reproduzir = document.getElementById("#reproduzir");
    const reiniciar = document.getElementById("#reiniciar");
}
// Botão "Começar" 

comecar.addEventListener("click", function () {
    const minutos = Number(seletor.value);

    localStorage.setItem("fimEm", Date.now() + minutos * 60 * 1000);
    localStorage.setItem("minutosSessao", minutos);

    rodar();
});

// Ao abrir/recarregar a página 

mostrarTotal();

if (timerRodando()) {
    // tinha um timer em andamento: retoma de onde estava
    seletor.value = localStorage.getItem("minutosSessao");
    rodar();
} else {
    // nenhum timer rodando: mostra o tempo selecionado
    mostrar(Number(seletor.value) * 60);
}