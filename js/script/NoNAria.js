class NoNAria {
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
        const colunas = this.matriz[0].length;

        for (let j = 0; j < colunas; j++) {
            // Verifica se a coluna está cheia
            if (this.matriz[0][j] === 0) {
                // Cria uma cópia da matriz atual
                const novaMatriz = this.matriz.map(linha => linha.slice());
                // Encontra a primeira linha vazia na coluna
                for (let i = this.matriz.length - 1; i >= 0; i--) {
                    if (novaMatriz[i][j] === 0) {
                        novaMatriz[i][j] = this.proximoJogador;
                        break;
                    }
                }
                // Adiciona o novo nó filho à lista de possíveis jogadas
                this.possiveisJogadas.push(new NoNAria(novaMatriz, this.proximoJogador === 'jogador' ? 'Oponente' : 'jogador'));
            }
        }

        return this.possiveisJogadas;
    }
}
