# 🍅 Pomodoro — Foco e Produtividade

Aplicação web de Pomodoro com lista de tarefas e registro do tempo de estudo do dia, sobre um plano de fundo em pixel art animado. Feita com HTML, CSS e JavaScript puro, sem frameworks nem bibliotecas.

🔗 **Demo online:** [pomodoro.gustavo-b-souza002.workers.dev](https://pomodoro.gustavo-b-souza002.workers.dev/)

<!-- Dica: adicione aqui um print ou GIF do projeto funcionando
![Pré-visualização](docs/preview.gif)
-->

## Funcionalidades

**Temporizador**
- Tempo de foco configurável de 5 a 60 minutos (de 5 em 5).
- Tempo de descanso de 5, 10 ou 15 minutos.
- Controles de iniciar, pausar, continuar e reiniciar.
- Ao terminar o foco, o descanso começa automaticamente.
- O timer continua correto ao recarregar a página ou trocar de aba, porque a contagem é baseada no horário de término e não em "ticks" de 1 segundo.

**Histórico de estudo**
- Soma os minutos de foco concluídos no dia.
- O total é exibido em minutos ou em horas (`45min`, `1h 30min`) e zera automaticamente a cada novo dia.
- Os dados ficam guardados por data (`AAAA-MM-DD`), o que permite evoluir para relatórios semanais e mensais.

**Lista de tarefas**
- Adicionar (botão `+` ou tecla Enter), marcar como concluída e remover.
- Cada tarefa tem um id único (`crypto.randomUUID()`).
- As tarefas persistem após recarregar a página.

**Interface**
- Vídeo em pixel art como plano de fundo.
- Layout responsivo para desktop, tablet (≤ 900px) e celular (≤ 600px).
- Botão de remover tarefa sempre visível em telas de toque, onde não existe hover.

## Tecnologias

- HTML5
- CSS3 (Flexbox, Grid, variáveis CSS, media queries)
- JavaScript (DOM, eventos, `Date`, `setInterval`)
- Web Storage API (`localStorage`)

## Estrutura do projeto

```
Pomodoro/
├── index.html
├── style/
│   └── style.css
├── script/
│   ├── script.js        # lista de tarefas
│   └── pomodoro.js      # timer, fases e histórico de estudo
├── video/
│   └── campo_florido_pixel_art_animado_1min.mp4
└── README.md
```

## Como executar

```bash
git clone https://github.com/gustatugas/Pomodoro.git
cd Pomodoro
```

Depois, abra o `index.html` no navegador. Não há dependências nem etapa de build.

> **Nota:** use `http://localhost` ou `https://` se for testar em outro dispositivo. O `crypto.randomUUID()` só funciona em contextos seguros.

## Como funciona

O estado do timer fica no `localStorage`:

| Chave | O que guarda |
|---|---|
| `fimEm` | Horário (timestamp) em que a fase atual termina |
| `restantePausaMs` | Tempo restante, quando o timer está pausado |
| `minutosSessao` | Duração, em minutos, da fase atual |
| `fase` | `foco` ou `descanso` |
| `historicoEstudo` | Objeto com os minutos estudados por dia |
| `tarefas` | Lista de tarefas (`id`, `texto`, `concluida`) |

A cada segundo, `atualizar()` calcula `fimEm - Date.now()` e mostra o resultado. Pausar guarda o tempo restante e remove `fimEm`. Continuar faz o caminho inverso.

## Próximos passos

- [ ] Dashboard de estudo por semana e mês
- [ ] Aviso sonoro ao fim de cada fase
- [ ] Contar o tempo parcial quando o foco é pausado ou reiniciado
- [ ] Back-end em Node.js para salvar o histórico fora do navegador

## Aprendizados

Projeto feito para praticar JavaScript: manipulação do DOM, eventos, persistência com `localStorage`, controle de tempo com `Date` e design responsivo.

---

Feito por [Gustavo](https://github.com/gustatugas) durante os estudos de desenvolvimento web.
