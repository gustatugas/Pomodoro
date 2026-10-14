// Manipulando variaveis para adição de tarefas no navbar
const lista = document.querySelector(".tarefas-adicionadas");
const botaoAddTarefa = document.getElementById("adicao");
const input = document.getElementById("text-tarefa");

// Array lido do localstorage
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

// Salva as tarefas no localstorage para o cliente não perder dados quando der f5
function salvar() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// função para criar item
function criarItem(tarefa) {
    const li = document.createElement("li");
    li.classList.add("tarefas-item");
    li.classList.toggle("concluida", tarefa.concluida);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox");
    checkbox.checked = tarefa.concluida;

    checkbox.addEventListener("change", () => {
        tarefa.concluida = checkbox.checked;
        li.classList.toggle("concluida", checkbox.checked);
        salvar();
    });

    // botão para remover tarefa

    const botaoRemover = document.createElement("button");
    botaoRemover.classList.add("remover");
    botaoRemover.textContent = "🗑️";
    botaoRemover.title = "Remover tarefa";

    botaoRemover.addEventListener("click", () => {
        tarefas = tarefas.filter(t => t.id !== tarefa.id);
        salvar();
        li.remove();
    });

    li.appendChild(checkbox);
    li.append(tarefa.texto);
    li.appendChild(botaoRemover);
    lista.appendChild(li);
}

// função para adicionar tarefa nova
function addTarefasLista() {
    const texto = input.value.trim();
    if (texto === "") return;

    // gera um id único (UUID) para a tarefa e evita duplicidade
    const tarefa = { id: crypto.randomUUID(), texto: texto, concluida: false };
    tarefas.push(tarefa);
    salvar();
    criarItem(tarefa);

    input.value = "";
}

// Eventos
input.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        addTarefasLista();
    }
});

botaoAddTarefa.addEventListener("click", addTarefasLista);

// Ao abrir a página, desenha as tarefas que estavam salvas
tarefas.forEach(criarItem);