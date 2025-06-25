export class NoNAria {
    matriz;
    proximoJogador;
    possiveisJogadas;

    // Construtor para criar um novo nó com um estado de tabuleiro e o próximo jogador.
    constructor(matriz, proximoJogador) {
        this.matriz = matriz;
        this.proximoJogador = proximoJogador;
        this.possiveisJogadas = []; // Filhos do nó
    }

    // Gera todos os nós filhos possíveis a partir do estado atual do tabuleiro.
    // Retorna um array de nós filhos, cada um representando um movimento possível.
    gerarFilhos() {
        this.possiveisJogadas = [];
        const celulasDisponiveis = this.verificarCelulasDisponiveis();
        for (const celula of celulasDisponiveis) {
            const novaMatriz = this.clonarMatriz();
            novaMatriz[celula.linha][celula.coluna] = this.proximoJogador;

            // Cria um novo nó para o estado do tabuleiro após a jogada.
            // Alterna o próximo jogador.
            let novoNo;
            if (this.proximoJogador === 1) {
                novoNo = new NoNAria(novaMatriz, 2);
            } else {
                novoNo = new NoNAria(novaMatriz, 1);
            }
            this.possiveisJogadas.push(novoNo);
        }
        return this.possiveisJogadas;
    }

    // Encontra todas as células válidas para uma nova jogada.
    // Retorna um array de objetos com as coordenadas das células disponíveis.
    verificarCelulasDisponiveis() {
        const celulasDisponiveis = [];
        const linhas = this.matriz.length;
        const colunas = this.matriz[0].length;
        for (let j = 0; j < colunas; j++) {
            for (let i = linhas - 1; i >= 0; i--) {
                if (this.matriz[i][j] === 0) {
                    celulasDisponiveis.push({ linha: i, coluna: j });
                    break; // Para na primeira célula vazia encontrada na coluna.
                }
            }
        }
        return celulasDisponiveis;
    }

    // Cria uma cópia profunda da matriz do tabuleiro para evitar mutações indesejadas.
    // Retorna uma nova matriz idêntica à do nó.
    clonarMatriz() {
        return this.matriz.map(linha => linha.slice());
    }
}