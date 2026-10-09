// Manipulando para adição de tarefas no navbar
const lista = document.querySelector(".tarefas-adicionadas");
const botaoAddTarefa = document.getElementById("adicao");
const input = document.getElementById("text-tarefa");

// Reconhecer o Enter como evento
input.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        AddTarefasList();
    }
});

// Reconhecendo click como evento
botaoAddTarefa.addEventListener("click", AddTarefasList);

// função para adicionar tarefas e adicionar um valor vazio
function AddTarefasList () {
    // Reconhecendo texto do input
    const texto = input.value.trim();
    if (texto === "") return;

    // Adicionando constante e criação de conteúdo

    const li = document.createElement("li");
    li.classList.add("tarefas-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox");

    checkbox.addEventListener("change", () => {
        li.classList.toggle("concluida", checkbox.checked);
    });

    li.appendChild(checkbox);
    li.append(texto)
    lista.appendChild(li);

    input.value = "";
}

// Se checkbox for marcado, evento será traçar lista

const chekboxes = document.querySelectorAll("")