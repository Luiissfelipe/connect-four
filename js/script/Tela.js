const divMenuInicial = document.querySelector('#menu-inicial');
const divInformacoes = document.querySelector('#informacoes');
const divJogo = document.querySelector('#jogo');
const divRanking = document.querySelector('#ranking');

export function ativarMenuInicial() {
    divMenuInicial.classList.add('ativo');
}

export function ativarInformacoes() {
    divInformacoes.classList.add('ativo');
}

export function ativarJogo() {
    divJogo.classList.add('ativo');
}

export function ativarRanking() {
    divRanking.classList.add('ativo');
}

export function desativarNaTela() {
    divMenuInicial.classList.remove('ativo');
    divInformacoes.classList.remove('ativo');
    divJogo.classList.remove('ativo');
    divRanking.classList.remove('ativo');
}

export function criarTabuleiro() {
    const divTabuleiro = document.querySelector('.jogo-tabuleiro');

    // Cria as células do tabuleiro
    for (let coluna = 0; coluna < 7; coluna++) {
        const divColuna = document.createElement('div');
        divColuna.className = 'coluna';
        divColuna.setAttribute("data-coluna", coluna);
        divTabuleiro.appendChild(divColuna);

        for (let linha = 0; linha < 6; linha++) {
            const divCelula = document.createElement('div');
            divCelula.className = 'celula';
            divCelula.setAttribute("data-coluna", coluna);
            divCelula.setAttribute("data-linha", linha);
            divColuna.appendChild(divCelula);
        }
    }
}

export function apagarTabuleiro() {
    const divTabuleiro = document.querySelector('.jogo-tabuleiro');
    divTabuleiro.innerHTML = '';
}

export function criarListaRanking(lista) {
    const listaRanking = document.querySelector('.ranking-lista');
    listaRanking.innerHTML = ''; // Limpa a lista antes de adicionar novos itens
    
    // Adiciona os 10 melhores jogadores à lista do ranking
        for (let i = 0; i < 10; i++) {
            const jogador = lista[i];
            if (!jogador) break; // Pare se não houver mais jogadores
            const itemRanking = document.createElement('li');
            itemRanking.className = 'ranking-lista-item';
            itemRanking.innerText = `${jogador.nome} - ${jogador.pontos} pontos`;
            listaRanking.appendChild(itemRanking);
        }
}