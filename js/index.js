// Importa as funções e classes necessárias de outros módulos.
import { desativarNaTela, criarTabuleiro, ativarInformacoes, ativarJogo, ativarRanking, apagarTabuleiro, ativarMenuInicial, criarListaRanking, desabilitarTabuleiroVisualmente } from "./script/Tela.js";
import { verificarFimDeJogo, escolherMelhorJogada } from "./script/Connect4.js";
import { Jogador } from "./script/Jogador.js";
import { Heap } from "./script/Heap.js";
import { salvarHeapNoLocalStorage, carregarHeapDoLocalStorage } from "./script/LocalStorage.js";

// Variáveis globais para armazenar o estado do jogo e do jogador.
let nomeJogador;
let dificuldade;
let pontos;
let lista;
let matrizTabuleiro;
let jogoFinalizado;

// Carrega os dados dos jogadores do localStorage ao iniciar a aplicação.
const heapJogadores = carregarHeapDoLocalStorage(Heap, Jogador);

// Configura o início de uma nova partida a partir do formulário do menu inicial.
function iniciarPartida() {
    const formulario = document.querySelector('.menu-inicial-formulario');
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault(); // Impede o envio padrão do formulário.
        const inputNome = document.querySelector('#username');
        nomeJogador = inputNome.value.trim();
        dificuldade = document.querySelector('#dificuldade').value;

        // Validação do nome do jogador.
        if (nomeJogador === ''|| nomeJogador.length < 3 || nomeJogador.length > 10) {
            alert("O nome deve ter entre 3 e 10 caracteres.");
            return;
        }

        inputNome.value = '';

        // Verifica se o jogador já existe no heap; se não, cria um novo.
        let jogadorExistente = heapJogadores.buscarJogadorPorNome(nomeJogador);
        if (jogadorExistente) {
            pontos = jogadorExistente.pontos;
        } else {
            pontos = 0;
            const novoJogador = new Jogador(nomeJogador, pontos);
            heapJogadores.inserir(novoJogador);
            salvarHeapNoLocalStorage(heapJogadores);
        }
        
        lista = heapJogadores.emOrdemDecrescente();

        // Atualiza as informações do jogador na tela.
        const spanNome = document.querySelector('.informacoes-nome');
        spanNome.textContent = nomeJogador;
        const spanPontos = document.querySelector('.informacoes-pontos');
        spanPontos.textContent = pontos;
        const spanDificuldade = document.querySelector('.informacoes-dificuldade');
        spanDificuldade.textContent = dificuldade;

        // Prepara a interface para o início do jogo.
        jogoFinalizado = false;
        desativarNaTela();
        criarTabuleiro();
        criarMatrizTabuleiro();
        criarListaRanking(lista);
        ativarInformacoes();
        ativarJogo();
        ativarRanking();
        cliqueNoTabuleiro();
    });
}

// Configura o botão para jogar novamente, reiniciando o tabuleiro.
function jogarNovamente() {
    const botaoReiniciar = document.querySelector('.jogo-botoes-reiniciar');
    botaoReiniciar.addEventListener('click', () => {
        jogoFinalizado = false; // Reinicia o estado do jogo.
        apagarTabuleiro();
        criarTabuleiro();
        criarMatrizTabuleiro();
        cliqueNoTabuleiro();
        const spanPontos = document.querySelector('.informacoes-pontos');
        spanPontos.textContent = pontos;
        criarListaRanking(lista); // Atualiza o ranking caso a pontuação tenha mudado.
    });
}

// Configura o botão para voltar ao menu inicial, resetando o estado do jogo.
function voltarMenuInicial() {
    const botaoVoltar = document.querySelector('.jogo-botoes-voltar');
    botaoVoltar.addEventListener('click', () => {
        apagarTabuleiro();
        desativarNaTela();
        ativarMenuInicial();
        // Limpa as variáveis de estado do jogador.
        nomeJogador = '';
        dificuldade = '';
        pontos = 0;
    });
}

// Configura o botão para reiniciar o ranking, limpando todos os dados.
function reiniciarRanking() {
    const botaoReiniciarRanking = document.querySelector('.ranking-botao-reiniciar');
    botaoReiniciarRanking.addEventListener('click', () => {
        heapJogadores.limpar();
        localStorage.removeItem('heapJogadores');
        lista = [];
        criarListaRanking(lista);
        // Reseta os pontos na tela e na variável.
        const spanPontos = document.querySelector('.informacoes-pontos');
        spanPontos.textContent = 0;
        pontos = 0;
    });
}; 

// Inicializa a matriz 6x7 do tabuleiro com zeros (células vazias).
function criarMatrizTabuleiro() {
    matrizTabuleiro = [];
    for (let i = 0; i < 6; i++) {
        matrizTabuleiro[i] = [];
        for (let j = 0; j < 7; j++) {
            matrizTabuleiro[i][j] = 0;
        }
    }
}

// Encontra a primeira linha disponível (de baixo para cima) em uma coluna.
// Retorna o índice da linha disponível ou null se a coluna estiver cheia.
function celulaDisponivel(coluna) {
    for (let linha = 5; linha >= 0; linha--) {
        if (matrizTabuleiro[linha][coluna] === 0) {
            return linha;
        }
    }
    return null;
}

// Adiciona os event listeners às colunas do tabuleiro para a jogada do usuário.
function cliqueNoTabuleiro() {
    const colunas = document.querySelectorAll(".coluna");
    const mensagem = document.querySelector('.jogo-mensagem');
    let podeJogar = true; // Controla o turno do jogador.

    colunas.forEach((coluna) => {
        coluna.addEventListener("click", () => {
            // Impede a jogada se o jogo já acabou ou não for o turno do jogador.
            if (!podeJogar || jogoFinalizado) return;

            const colunaIndex = parseInt(coluna.getAttribute("data-coluna"));
            const linhaDisponivel = celulaDisponivel(colunaIndex);

            if (linhaDisponivel !== null) {
                podeJogar = false; // Bloqueia o jogador até o turno da IA terminar.
                matrizTabuleiro[linhaDisponivel][colunaIndex] = 1; // 1 representa o jogador.
                const celula = document.querySelector(`[data-coluna="${colunaIndex}"][data-linha="${linhaDisponivel}"]`);
                celula.classList.add('jogador');

                // Verifica se o jogo terminou. Se não, é a vez da IA.
                if (verificarFimDeJogo(matrizTabuleiro) === null) {
                    mensagem.innerText = "Aguarde, a IA está jogando...";
                    setTimeout(() => {
                        jogadaIA();
                        if (!jogoFinalizado) {
                            podeJogar = true; // Libera o jogador para o próximo turno.
                        }
                    }, 500); // Delay para simular o pensamento da IA.
                } else {
                    verificarVitoria(); // Se o jogo terminou, processa o resultado.
                }
            }
        });
    });
}

// Verifica o resultado final do jogo e atualiza a pontuação e a interface.
function verificarVitoria() {
    let resultado = verificarFimDeJogo(matrizTabuleiro);
    if (resultado === null) return; // O jogo ainda não terminou.

    jogoFinalizado = true;
    desabilitarTabuleiroVisualmente();

    const mensagemTabuleiro = document.querySelector('.jogo-mensagem');
    let pontosGanhos = 0;
    let mensagemFinal = "";

    if (resultado === 1) { // Jogador venceu
        // Calcula os pontos ganhos com base na dificuldade.
        switch (dificuldade) {
            case "facil": pontosGanhos = 10; break;
            case "medio": pontosGanhos = 15; break;
            case "dificil": pontosGanhos = 20; break;
            default: pontosGanhos = 10;
        }
        mensagemFinal = "Parabéns, você venceu!";
        pontos += pontosGanhos;
    } else if (resultado === 2) { // IA venceu
        mensagemFinal = "A IA venceu!";
    } else if (resultado === -1) { // Empate
        // Atribui pontos por empate, com base na dificuldade.
        switch (dificuldade) {
            case "facil": pontosGanhos = 4; break;
            case "medio": pontosGanhos = 6; break;
            case "dificil": pontosGanhos = 8; break;
            default: pontosGanhos = 4;
        }
        mensagemFinal = "Empate!";
        pontos += pontosGanhos;
    }

    // Exibe a mensagem de fim de jogo.
    setTimeout(() => {
        alert(mensagemFinal);
    }, 100);

    // Se o jogador ganhou pontos, atualiza seus dados.
    if (pontosGanhos > 0) {
        const spanPontos = document.querySelector('.informacoes-pontos');
        spanPontos.textContent = pontos;

        let jogador = heapJogadores.buscarJogadorPorNome(nomeJogador);
        if (jogador) {
            jogador.pontos = pontos;
            heapJogadores.atualizarJogador(jogador); // Atualiza no heap.
            salvarHeapNoLocalStorage(heapJogadores); // Salva no localStorage.
        }
        lista = heapJogadores.emOrdemDecrescente();
        criarListaRanking(lista); // Atualiza a lista de ranking na tela.
    }
}

// Controla a jogada da IA, escolhendo a melhor coluna e atualizando o tabuleiro.
function jogadaIA() {
    let profundidade;
    // Define a profundidade da busca Minimax com base na dificuldade.
    switch (dificuldade) {
        case "facil": profundidade = 2; break;
        case "medio": profundidade = 4; break;
        case "dificil": profundidade = 6; break; 
        default: profundidade = 2;
    }

    // Pede à lógica do jogo para escolher a melhor jogada.
    const colunaEscolhida = escolherMelhorJogada(matrizTabuleiro, profundidade);

    if (colunaEscolhida !== null) {
        const linhaDisponivel = celulaDisponivel(colunaEscolhida);
        if (linhaDisponivel !== null) {
            matrizTabuleiro[linhaDisponivel][colunaEscolhida] = 2; // 2 representa a IA.
            const celula = document.querySelector(`[data-coluna="${colunaEscolhida}"][data-linha="${linhaDisponivel}"]`);
            celula.classList.add('ia');
            verificarVitoria(); // Verifica se a IA venceu após sua jogada.
        }
    }
    const mensagem = document.querySelector('.jogo-mensagem');
    mensagem.innerText = "Sua vez de jogar!";
}

// Inicializa os listeners e a aplicação.
iniciarPartida();
jogarNovamente();
voltarMenuInicial();
reiniciarRanking();