export function verificarFimDeJogo(matriz) {
    const linhas = matriz.length;
    const colunas = matriz[0].length;
    
    for (let i = 0; i < linhas; i++) {
        for (let j = 0; j < colunas; j++) {
            const jogador = matriz[i][j];
            if (jogador === 0) continue;

            // Horizontal →
            if (j < colunas - 3 &&
                jogador === matriz[i][j + 1] &&
                jogador === matriz[i][j + 2] &&
                jogador === matriz[i][j + 3]) {
                return jogador;
            }

            // Vertical ↓
            if (i < linhas - 3 &&
                jogador === matriz[i + 1][j] &&
                jogador === matriz[i + 2][j] &&
                jogador === matriz[i + 3][j]) {
                return jogador;
            }

            // Diagonal principal ↘
            if (i <= linhas - 4 && j <= colunas - 4 &&
                jogador === matriz[i + 1][j + 1] &&
                jogador === matriz[i + 2][j + 2] &&
                jogador === matriz[i + 3][j + 3]) {
                return jogador;
            }

            // Diagonal secundária ↙
            if (i <= linhas - 4 && j >= 3 &&
                jogador === matriz[i + 1][j - 1] &&
                jogador === matriz[i + 2][j - 2] &&
                jogador === matriz[i + 3][j - 3]) {
                return jogador;
            }

            if (jogador !== 0) {
                // Verifica se há um empate
                let empate = true;
                for (let k = 0; k < colunas; k++) {
                    if (matriz[0][k] === 0) {
                        empate = false;
                        break;
                    }
                }
                if (empate) return -1; // Retorna -1 para indicar empate
            }
        }
    }

    return null;
}

//no = new NoNAria(matrizDaTela, 'jogador'); // Exemplo de criação de um nó com a matriz do jogo e o próximo jogador

function minimax(no, profundidade, éMaximizador) {
    // Verifica se é nó terminal (fim do jogo) ou profundidade máxima
    if (éTerminal(no) || profundidade === 0) {
        return avaliar(no); // Retorna o valor daquele estado do jogo
    }

    if (éMaximizador) {
        let melhorValor = -Infinity;
        let novoNo = new NoNAria(no.matriz, 'jogador'); // Cria um novo nó 

        // Para cada possível jogada (filho do nó atual)
        let filhos = novoNo.gerarFilhos();
        for (let filho of filhos) {
            let valor = minimax(filho, profundidade - 1, false);
            melhorValor = Math.max(melhorValor, valor);
        }

        return melhorValor;

    } else {
        let melhorValor = Infinity;

        // Para cada possível jogada do adversário
        let filhos = gerarFilhos(no, 'Oponente');
        for (let filho of filhos) {
            let valor = minimax(filho, profundidade - 1, true);
            melhorValor = Math.min(melhorValor, valor);
        }

        return melhorValor;
    }
}

function éTerminal(jogada) {
    return verificarFimDeJogo(jogada.matriz) !== null;
}

function avaliar(no) {
    const resultado = verificarFimDeJogo(no.matriz);
    if (resultado === 1) {
        return -10; // Pontuação baixa para vitória do oponente 
    } else if (resultado === 2) {
        return 10; // Pontuação alta para vitória da IA
    } else if (resultado === -1) {
        return 0; // Empate
    }
    return 0; // Caso não seja terminal, retorna 0
}


// no -- representa cada estado do jogo
// ramo -- representa uma jogada possível
// profundidade -- é a dificuldade do jogo
// éMaximizador -- true se for a vez da IA, false se for a vez do oponente