import { NoNAria } from './NoNAria.js';

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

        // Para cada possível jogada (filho do nó atual)
        let filhos = no.gerarFilhos();
        for (let filho of filhos) {
            let valor = minimax(filho, profundidade - 1, false);
            melhorValor = Math.max(melhorValor, valor);
        }

        return melhorValor;

    } else {
        let melhorValor = Infinity;

        // Para cada possível jogada do adversário
        let filhos = no.gerarFilhos();
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

// Caso não seja terminal, retorna 0
function avaliar(no) {
    const matriz = no.matriz;
    const resultado = verificarFimDeJogo(matriz);
    if (resultado === 1) return -4990;
    if (resultado === 2) return 5000;
    if (resultado === -1) return 0;

    let score = 0;

    // Bônus para peças no centro
    for (let i = 0; i < matriz.length; i++) {
        if (matriz[i][3] === 2) score += 6;
        if (matriz[i][3] === 1) score -= 6;
    }

    // Função auxiliar para contar sequências
    function contarSequencias(jogador, tamanho) {
        let contagem = 0;
        const linhas = matriz.length;
        const colunas = matriz[0].length;
        for (let i = 0; i < linhas; i++) {
            for (let j = 0; j < colunas; j++) {
                // Horizontal
                if (j <= colunas - tamanho) {
                    let ok = true;
                    for (let k = 0; k < tamanho; k++) {
                        if (matriz[i][j + k] !== jogador) ok = false;
                    }
                    if (ok) contagem++;
                }
                // Vertical
                if (i <= linhas - tamanho) {
                    let ok = true;
                    for (let k = 0; k < tamanho; k++) {
                        if (matriz[i + k][j] !== jogador) ok = false;
                    }
                    if (ok) contagem++;
                }
                // Diagonal ↘
                if (i <= linhas - tamanho && j <= colunas - tamanho) {
                    let ok = true;
                    for (let k = 0; k < tamanho; k++) {
                        if (matriz[i + k][j + k] !== jogador) ok = false;
                    }
                    if (ok) contagem++;
                }
                // Diagonal ↙
                if (i <= linhas - tamanho && j >= tamanho - 1) {
                    let ok = true;
                    for (let k = 0; k < tamanho; k++) {
                        if (matriz[i + k][j - k] !== jogador) ok = false;
                    }
                    if (ok) contagem++;
                }
            }
        }
        return contagem;
    }

    // Sequências de 3 e 2 da IA (2) e do jogador (1)
    score += 25 * contarSequencias(2, 3);
    score += 15 * contarSequencias(2, 2);
    score -= 30 * contarSequencias(1, 3);
    score -= 10 * contarSequencias(1, 2);

    return score;
}
    
export function escolherMelhorJogada(matriz, profundidade) {
    let melhorValor = -Infinity;
    let melhorJogada = null;

    const no = new NoNAria(matriz, 2);
    const jogadasPossiveis = no.verificarCelulasDisponiveis();

    if (jogadasPossiveis.length === 0) {
        return null;
    }

    melhorJogada = jogadasPossiveis[0].coluna;

    for (const jogada of jogadasPossiveis) {
        const novaMatriz = no.clonarMatriz();
        novaMatriz[jogada.linha][jogada.coluna] = 2;
        const noFilho = new NoNAria(novaMatriz, 1);

        const valorDaJogada = minimax(noFilho, profundidade - 1, false);

        // Adicione este log para ver o peso de cada jogada:
        console.log(`Coluna: ${jogada.coluna}, Score: ${valorDaJogada}`);

        if (valorDaJogada > melhorValor) {
            melhorValor = valorDaJogada;
            melhorJogada = jogada.coluna;
        }
    }
    return melhorJogada;
}
