import { desativarNaTela, criarTabuleiro, ativarInformacoes, ativarJogo, ativarRanking, apagarTabuleiro, ativarMenuInicial, criarListaRanking } from "./script/Tela.js";
import { verificarFimDeJogo } from "./script/Connect4.js";

let nomeJogador;
let dificuldade;
let pontos;
let lista = [
    {nome: "Luis", pontos: 17},
    {nome: "Gabriel", pontos: 15},
    {nome: "Julia", pontos: 14},
    {nome: "Fernando", pontos: 12},
    {nome: "Abner", pontos: 11},
    {nome: "Jho Natan", pontos: 10},
    {nome: "Eliesio", pontos: 8},
    {nome: "Samuel", pontos: 7},
    {nome: "Carla", pontos: 5},
    {nome: "Maria", pontos: 3},
    {nome: "Gabi", pontos: 2}
];
let matrizTabuleiro;
let turno = 1; // 1 para jogador, 2 para computador

function iniciarPartida() {
    const formulario = document.querySelector('.menu-inicial-formulario');
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        nomeJogador = document.querySelector('#username').value;
        dificuldade = document.querySelector('#dificuldade').value;

        if (nomeJogador === ''|| nomeJogador.length < 3 || nomeJogador.length > 10) return;

        document.querySelector('#username').value = '';

        const spanNome = document.querySelector('.informacoes-nome');
        spanNome.textContent = nomeJogador;
        const spanPontos = document.querySelector('.informacoes-pontos');
        spanPontos.textContent = pontos; // Valor inicial de pontos
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
        spanPontos.textContent = pontos; // Reinicia os pontos
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
        pontos = 0; // Reinicia os pontos
    });
}

function criarMatrizTabuleiro() {
    matrizTabuleiro = [];
    for (let i = 0; i < 6; i++) {
        matrizTabuleiro[i] = [];
        for (let j = 0; j < 7; j++) {
            matrizTabuleiro[i][j] = 0; // Inicializa a matriz com zeros
        }
    }
}

function celulaDisponivel(coluna) {
    for (let linha = 5; linha >= 0; linha--) {
        if (matrizTabuleiro[linha][coluna] === 0) {
            return linha; // Retorna a primeira linha disponível na coluna
        }
    }
    return null; // Retorna null se a coluna estiver cheia
}

function cliqueNoTabuleiro() {
    const colunas = document.querySelectorAll(".coluna");
    colunas.forEach((coluna) => {
        coluna.addEventListener("click", () => {
            const colunaIndex = coluna.getAttribute("data-coluna");
            const linhaDisponivel = celulaDisponivel(colunaIndex);
            if (linhaDisponivel !== null) {
                // Atualiza a matrizTabuleiro e a interface do usuário
                matrizTabuleiro[linhaDisponivel][colunaIndex] = 1; // 1 representa o jogador
                const celula = document.querySelector(`[data-coluna="${colunaIndex}"][data-linha="${linhaDisponivel}"]`);
                celula.classList.add('jogador'); // Adiciona uma classe para estilizar a célula
                // Aqui você pode adicionar lógica para verificar se o jogador ganhou ou se é a vez do computador
            }
            if (verificarFimDeJogo(matrizTabuleiro) === null) {
                // Computador faz a jogada
                verificarVitoria();
            } else {
                verificarVitoria(); // Verifica se houve vitória ou empate
            }
        });
    });
}

function verificarVitoria() {
    let resultado = verificarFimDeJogo(matrizTabuleiro);
    if (resultado === 1) {
        setTimeout(() => {
            alert("Parabéns, você venceu!");
        }, 100); // Exibe a mensagem de vitória após um pequeno atraso
        pontos += 10; // Adiciona pontos ao jogador
        const spanPontos = document.querySelector('.informacoes-pontos');
        spanPontos.textContent = pontos;
    } else if (resultado === 2) {
        setTimeout(() => {
            alert("O computador venceu!");
        }, 100); // Exibe a mensagem de vitória após um pequeno atraso
    } else if (resultado === -1) {
        setTimeout(() => {
            alert("Empate!");
        }, 100); // Exibe a mensagem de empate após um pequeno atraso
    }
}

iniciarPartida();
jogarNovamente();
voltarMenuInicial();