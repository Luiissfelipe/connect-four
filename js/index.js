import { desativarNaTela, criarTabuleiro, ativarInformacoes, ativarJogo, ativarRanking, apagarTabuleiro, ativarMenuInicial, criarListaRanking } from "./script/Tela.js";
import { verificarFimDeJogo, escolherMelhorJogada } from "./script/Connect4.js";

let nomeJogador;
let dificuldade;
let pontos = 0;
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

function reiniciarRanking() {
    const botaoReiniciarRanking = document.querySelector('.ranking-botao-reiniciar');
    botaoReiniciarRanking.addEventListener('click', () => {
        lista = [];
        criarListaRanking(lista);
        const spanPontos = document.querySelector('.informacoes-pontos');
        spanPontos.textContent = 0; // Reinicia os pontos
        pontos = 0; // Reinicia os pontos
    });
}; 

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
            const mensagem = document.querySelector('.jogo-mensagem');
            if (linhaDisponivel !== null) {
                // Atualiza a matrizTabuleiro e a interface do usuário
                matrizTabuleiro[linhaDisponivel][colunaIndex] = 1; // 1 representa o jogador
                const celula = document.querySelector(`[data-coluna="${colunaIndex}"][data-linha="${linhaDisponivel}"]`);
                celula.classList.add('jogador'); // Adiciona uma classe para estilizar a célula
            }
            if (verificarFimDeJogo(matrizTabuleiro) === null) {
                // Computador faz a jogada
                mensagem.innerText = "Aguarde, a IA está jogando...";
                setTimeout(jogadaIA, 1000); // A IA faz a jogada após um pequeno atraso
            } else {
                verificarVitoria(); // Verifica se houve vitória ou empate
            }
        });
    });
}

function verificarVitoria() {
    let resultado = verificarFimDeJogo(matrizTabuleiro);
    let pontosGanhos = 0;

    if (resultado === 1) {
        switch (dificuldade) {
            case "facil": pontosGanhos = 10; break;
            case "medio": pontosGanhos = 15; break;
            case "dificil": pontosGanhos = 20; break;
            default: pontosGanhos = 10;
        }

        setTimeout(() => {
            alert("Parabéns, você venceu!");
        }, 100); // Exibe a mensagem de vitória após um pequeno atraso
        pontos += pontosGanhos; // Adiciona pontos ao jogador
        const spanPontos = document.querySelector('.informacoes-pontos');
        spanPontos.textContent = pontos;
    } else if (resultado === 2) {
        setTimeout(() => {
            alert("O computador venceu!");
        }, 100); // Exibe a mensagem de vitória após um pequeno atraso
    } else if (resultado === -1) {
        switch (dificuldade) {
            case "facil": pontosGanhos = 4; break;
            case "medio": pontosGanhos = 6; break;
            case "dificil": pontosGanhos = 8; break;
            default: pontosGanhos = 4;
        }

        setTimeout(() => {
            alert("Empate!");
        }, 100); // Exibe a mensagem de empate após um pequeno atraso
        pontos += pontosGanhos;
        const spanPontos = document.querySelector('.informacoes-pontos');
        spanPontos.textContent = pontos;
    }
}

function jogadaIA() {
    let profundidade;
    switch (dificuldade) {
        case "facil": profundidade = 2; break; // Dificuldade fácil
        case "medio": profundidade = 4; break; // Dificuldade média
        case "dificil": profundidade = 6; break; // Dificuldade difícil
        default: profundidade = 2; // Dificuldade padrão
    }

    const colunaEscolhida = escolherMelhorJogada(matrizTabuleiro, profundidade);

    if (colunaEscolhida !== null) {
        const linhaDisponivel = celulaDisponivel(colunaEscolhida);
        if (linhaDisponivel !== null) {
            matrizTabuleiro[linhaDisponivel][colunaEscolhida] = 2; // 2 representa o computador
            const celula = document.querySelector(`[data-coluna="${colunaEscolhida}"][data-linha="${linhaDisponivel}"]`);
            celula.classList.add('ia'); // Adiciona uma classe para estilizar a célula

            verificarVitoria(); // Verifica se houve vitória ou empate
        }
    }
    // Atualiza a mensagem para o jogador
    const mensagem = document.querySelector('.jogo-mensagem');
    mensagem.innerText = "Sua vez de jogar!";
}

iniciarPartida();
jogarNovamente();
voltarMenuInicial();
reiniciarRanking();