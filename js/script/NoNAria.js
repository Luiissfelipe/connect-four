export class NoNAria {
    matriz;
    proximoJogador;
    possiveisJogadas;

    constructor(matriz, proximoJogador) {
        this.matriz = matriz;
        this.proximoJogador = proximoJogador;
        this.possiveisJogadas = [];
    }

    gerarFilhos() {
        this.possiveisJogadas = [];
        const celulasDisponiveis = this.verificarCelulasDisponiveis();
        for (const celula of celulasDisponiveis) {
            const novaMatriz = this.clonarMatriz();
            novaMatriz[celula.linha][celula.coluna] = this.proximoJogador;

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

    verificarCelulasDisponiveis() {
        const celulasDisponiveis = [];
        const linhas = this.matriz.length;
        const colunas = this.matriz[0].length;
        for (let j = 0; j < colunas; j++) {
            for (let i = linhas - 1; i >= 0; i--) {
                if (this.matriz[i][j] === 0) {
                    celulasDisponiveis.push({ linha: i, coluna: j });
                    break; // Para na primeira célula disponível da coluna
                }
            }
        }
        return celulasDisponiveis;
    }

    clonarMatriz() {
        return this.matriz.map(linha => linha.slice());
    }
}
