import { desativarNaTela, criarTabuleiro, ativarInformacoes, ativarJogo, ativarRanking, apagarTabuleiro, ativarMenuInicial, criarListaRanking } from "./script/Tela.js";
import { verificarFimDeJogo, escolherMelhorJogada } from "./script/Connect4.js";
import { Jogador } from "./script/Jogador.js";
import { Heap } from "./script/Heap.js";
import { salvarHeapNoLocalStorage, carregarHeapDoLocalStorage } from "./script/LocalStorage.js";

let nomeJogador;
let dificuldade;
let pontos;
let lista;
let matrizTabuleiro;

const heapJogadores = carregarHeapDoLocalStorage(Heap, Jogador);

function iniciarPartida() {
    const formulario = document.querySelector('.menu-inicial-formulario');
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const inputNome = document.querySelector('#username');
        nomeJogador = inputNome.value.trim();
        dificuldade = document.querySelector('#dificuldade').value;

        if (nomeJogador === ''|| nomeJogador.length < 3 || nomeJogador.length > 10) {
            alert("O nome deve ter entre 3 e 10 caracteres.");
            return;
        }

        inputNome.value = '';

        // Verifica se o jogador já existe no heap
        let jogadorExistente = heapJogadores.buscarJogadorPorNome(nomeJogador);
        if (jogadorExistente) {
            pontos = jogadorExistente.pontos;
        } else {
            pontos = 0;
            const novoJogador = new Jogador(nomeJogador, pontos);
            heapJogadores.inserir(novoJogador);
            salvarHeapNoLocalStorage(heapJogadores);
        }
        
        // Atualiza a lista com o heap ordenado
        lista = heapJogadores.emOrdemDecrescente();

        const spanNome = document.querySelector('.informacoes-nome');
        spanNome.textContent = nomeJogador;
        const spanPontos = document.querySelector('.informacoes-pontos');
        spanPontos.textContent = pontos;
        const spanDificuldade = document.querySelector('.informacoes-dificuldade');
        spanDificuldade.textContent = dificuldade;

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

function jogarNovamente() {
    const botaoReiniciar = document.querySelector('.jogo-botoes-reiniciar');
    botaoReiniciar.addEventListener('click', () => {
        apagarTabuleiro();
        criarTabuleiro();
        criarMatrizTabuleiro();
        cliqueNoTabuleiro();
        const spanPontos = document.querySelector('.informacoes-pontos');
        spanPontos.textContent = pontos;
        criarListaRanking(lista);
    });
}

function voltarMenuInicial() {
    const botaoVoltar = document.querySelector('.jogo-botoes-voltar');
    botaoVoltar.addEventListener('click', () => {
        apagarTabuleiro();
        desativarNaTela();
        ativarMenuInicial();
        nomeJogador = '';
        dificuldade = '';
        pontos = 0;
    });
}

function reiniciarRanking() {
    const botaoReiniciarRanking = document.querySelector('.ranking-botao-reiniciar');
    botaoReiniciarRanking.addEventListener('click', () => {
        // Limpa o heap usando o novo método
        heapJogadores.limpar(); //

        // Limpa o Local Storage
        localStorage.removeItem('heapJogadores');

        // Limpa a lista e a interface
        lista = [];
        criarListaRanking(lista);
        const spanPontos = document.querySelector('.informacoes-pontos');
        spanPontos.textContent = 0;
        pontos = 0;
    });
}; 

function criarMatrizTabuleiro() {
    matrizTabuleiro = [];
    for (let i = 0; i < 6; i++) {
        matrizTabuleiro[i] = [];
        for (let j = 0; j < 7; j++) {
            matrizTabuleiro[i][j] = 0;
        }
    }
}

function celulaDisponivel(coluna) {
    for (let linha = 5; linha >= 0; linha--) {
        if (matrizTabuleiro[linha][coluna] === 0) {
            return linha;
        }
    }
    return null;
}

function cliqueNoTabuleiro() {
    const colunas = document.querySelectorAll(".coluna");
    const mensagem = document.querySelector('.jogo-mensagem');
    let podeJogar = true;

    colunas.forEach((coluna) => {
        coluna.addEventListener("click", () => {
            if (!podeJogar) return;

            const colunaIndex = parseInt(coluna.getAttribute("data-coluna"));
            const linhaDisponivel = celulaDisponivel(colunaIndex);

            if (linhaDisponivel !== null) {
                podeJogar = false; // Bloqueia cliques enquanto a IA joga
                matrizTabuleiro[linhaDisponivel][colunaIndex] = 1;
                const celula = document.querySelector(`[data-coluna="${colunaIndex}"][data-linha="${linhaDisponivel}"]`);
                celula.classList.add('jogador');

                if (verificarFimDeJogo(matrizTabuleiro) === null) {
                    mensagem.innerText = "Aguarde, a IA está jogando...";
                    setTimeout(() => {
                        jogadaIA();
                        podeJogar = true; // Libera o clique após a jogada da IA
                    }, 500); // Meio segundo de delay
                } else {
                    verificarVitoria();
                    podeJogar = true;
                }
            }
        });
    });
}


function verificarVitoria() {
    let resultado = verificarFimDeJogo(matrizTabuleiro);
    if (resultado === null) return;

    let pontosGanhos = 0;
    let mensagemFinal = "";

    if (resultado === 1) { // Jogador venceu
        switch (dificuldade) {
            case "facil": pontosGanhos = 10; break;
            case "medio": pontosGanhos = 15; break;
            case "dificil": pontosGanhos = 20; break;
            default: pontosGanhos = 10;
        }
        mensagemFinal = "Parabéns, você venceu!";
        pontos += pontosGanhos;

    } else if (resultado === 2) { // Computador venceu
        mensagemFinal = "O computador venceu!";

    } else if (resultado === -1) { // Empate
        switch (dificuldade) {
            case "facil": pontosGanhos = 4; break;
            case "medio": pontosGanhos = 6; break;
            case "dificil": pontosGanhos = 8; break;
            default: pontosGanhos = 4;
        }
        mensagemFinal = "Empate!";
        pontos += pontosGanhos;
    }

    setTimeout(() => {
        alert(mensagemFinal);
    }, 100);

    // Atualiza pontos se o jogador ganhou ou empatou
    if (pontosGanhos > 0) {
        const spanPontos = document.querySelector('.informacoes-pontos');
        spanPontos.textContent = pontos;

        let jogador = heapJogadores.buscarJogadorPorNome(nomeJogador);
        if (jogador) {
            jogador.pontos = pontos;
            heapJogadores.atualizarJogador(jogador); //
            salvarHeapNoLocalStorage(heapJogadores);
        }
        lista = heapJogadores.emOrdemDecrescente(); //
        criarListaRanking(lista);
    }
}


function jogadaIA() {
    let profundidade;
    switch (dificuldade) {
        case "facil": profundidade = 2; break;
        case "medio": profundidade = 4; break;
        case "dificil": profundidade = 6; break; 
        default: profundidade = 2;
    }

    const colunaEscolhida = escolherMelhorJogada(matrizTabuleiro, profundidade);

    if (colunaEscolhida !== null) {
        const linhaDisponivel = celulaDisponivel(colunaEscolhida);
        if (linhaDisponivel !== null) {
            matrizTabuleiro[linhaDisponivel][colunaEscolhida] = 2;
            const celula = document.querySelector(`[data-coluna="${colunaEscolhida}"][data-linha="${linhaDisponivel}"]`);
            celula.classList.add('ia');
            verificarVitoria();
        }
    }
    const mensagem = document.querySelector('.jogo-mensagem');
    mensagem.innerText = "Sua vez de jogar!";
}

iniciarPartida();
jogarNovamente();
voltarMenuInicial();
reiniciarRanking();