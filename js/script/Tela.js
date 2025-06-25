// Seleciona os principais elementos de tela do DOM.
const divMenuInicial = document.querySelector('#menu-inicial');
const divInformacoes = document.querySelector('#informacoes');
const divJogo = document.querySelector('#jogo');
const divRanking = document.querySelector('#ranking');

// Torna o menu inicial visível.
export function ativarMenuInicial() {
    divMenuInicial.classList.add('ativo');
}

// Torna a seção de informações visível.
export function ativarInformacoes() {
    divInformacoes.classList.add('ativo');
}

// Torna a tela de jogo visível.
export function ativarJogo() {
    divJogo.classList.add('ativo');
}

// Torna a tela de ranking visível.
export function ativarRanking() {
    divRanking.classList.add('ativo');
}

// Esconde todos os elementos principais da tela.
export function desativarNaTela() {
    divMenuInicial.classList.remove('ativo');
    divInformacoes.classList.remove('ativo');
    divJogo.classList.remove('ativo');
    divRanking.classList.remove('ativo');
}

// Cria dinamicamente o tabuleiro do jogo no DOM.
export function criarTabuleiro() {
    const divTabuleiro = document.querySelector('.jogo-tabuleiro');
    divTabuleiro.classList.remove('finalizado'); // Garante que o tabuleiro não comece desabilitado

    // Cria as 7 colunas do tabuleiro.
    for (let coluna = 0; coluna < 7; coluna++) {
        const divColuna = document.createElement('div');
        divColuna.className = 'coluna';
        divColuna.setAttribute("data-coluna", coluna);
        divTabuleiro.appendChild(divColuna);

        // Cria as 6 células (linhas) para cada coluna.
        for (let linha = 0; linha < 6; linha++) {
            const divCelula = document.createElement('div');
            divCelula.className = 'celula';
            divCelula.setAttribute("data-coluna", coluna);
            divCelula.setAttribute("data-linha", linha);
            divColuna.appendChild(divCelula);
        }
    }
}

// Limpa o conteúdo do tabuleiro no DOM.
export function apagarTabuleiro() {
    const divTabuleiro = document.querySelector('.jogo-tabuleiro');
    divTabuleiro.innerHTML = '';
}

// Preenche a lista de ranking na tela com os dados dos jogadores.
// Recebe uma lista de objetos de jogadores, ordenada por pontos.
export function criarListaRanking(lista) {
    const listaRanking = document.querySelector('.ranking-lista');
    listaRanking.innerHTML = ''; // Limpa a lista antes de adicionar novos itens
    
    // Adiciona os 10 melhores jogadores à lista do ranking.
    for (let i = 0; i < 10; i++) {
        const jogador = lista[i];
        if (!jogador) break; // Para se não houver mais jogadores.
        const itemRanking = document.createElement('li');
        itemRanking.className = 'ranking-lista-item';
        itemRanking.innerText = `${jogador.nome} - ${jogador.pontos} pontos`;
        listaRanking.appendChild(itemRanking);
    }
}

// Adiciona um estilo visual para indicar que o tabuleiro está desabilitado.
export function desabilitarTabuleiroVisualmente() {
    const divTabuleiro = document.querySelector('.jogo-tabuleiro');
    divTabuleiro.classList.add('finalizado');
}