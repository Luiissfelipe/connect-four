import { NoNAria } from './NoNAria.js';

/*
 * Verifica o estado do jogo para determinar se houve um vencedor ou empate.
 * A função recebe a matriz 6x7 que representa o tabuleiro.
 * Retorna o número do jogador vencedor (1 ou 2), -1 para empate, ou null se o jogo continua.
 */
export function verificarFimDeJogo(matriz) {
    const linhas = matriz.length;
    const colunas = matriz[0].length;
    
    // Itera sobre cada célula do tabuleiro.
    for (let i = 0; i < linhas; i++) {
        for (let j = 0; j < colunas; j++) {
            const jogador = matriz[i][j];
            if (jogador === 0) continue; // Pula células vazias.

            // Verifica vitória na horizontal.
            if (j < colunas - 3 &&
                jogador === matriz[i][j + 1] &&
                jogador === matriz[i][j + 2] &&
                jogador === matriz[i][j + 3]) {
                return jogador;
            }

            // Verifica vitória na vertical.
            if (i < linhas - 3 &&
                jogador === matriz[i + 1][j] &&
                jogador === matriz[i + 2][j] &&
                jogador === matriz[i + 3][j]) {
                return jogador;
            }

            // Verifica vitória na diagonal principal (descendente).
            if (i <= linhas - 4 && j <= colunas - 4 &&
                jogador === matriz[i + 1][j + 1] &&
                jogador === matriz[i + 2][j + 2] &&
                jogador === matriz[i + 3][j + 3]) {
                return jogador;
            }

            // Verifica vitória na diagonal secundária (ascendente).
            if (i <= linhas - 4 && j >= 3 &&
                jogador === matriz[i + 1][j - 1] &&
                jogador === matriz[i + 2][j - 2] &&
                jogador === matriz[i + 3][j - 3]) {
                return jogador;
            }
        }
    }
    
    // Verifica se há um empate (tabuleiro cheio sem vencedor).
    let empate = true;
    for (let k = 0; k < colunas; k++) {
        if (matriz[0][k] === 0) {
            empate = false;
            break;
        }
    }
    if (empate) return -1;

    // Se nenhuma condição de fim de jogo for atendida, retorna null.
    return null;
}

/*
 * Implementação do algoritmo Minimax para determinar o valor de uma jogada.
 * Avalia um nó da árvore de jogo, considerando a profundidade da busca e
 * se o turno atual é do maximizador (IA) ou minimizador (jogador).
 * Retorna o valor (score) do nó.
 */
function minimax(no, profundidade, éMaximizador) {
    // Condição de parada: nó terminal ou profundidade máxima atingida.
    if (éTerminal(no) || profundidade === 0) {
        return avaliar(no);
    }

    if (éMaximizador) {
        let melhorValor = -Infinity;
        // Gera todos os movimentos possíveis (filhos) e escolhe o de maior valor.
        let filhos = no.gerarFilhos();
        for (let filho of filhos) {
            let valor = minimax(filho, profundidade - 1, false);
            melhorValor = Math.max(melhorValor, valor);
        }
        return melhorValor;
    } else { // Minimizador
        let melhorValor = Infinity;
        // Gera todos os movimentos possíveis (filhos) e escolhe o de menor valor.
        let filhos = no.gerarFilhos();
        for (let filho of filhos) {
            let valor = minimax(filho, profundidade - 1, true);
            melhorValor = Math.min(melhorValor, valor);
        }
        return melhorValor;
    }
}

// Verifica se um nó representa um estado final do jogo (vitória, derrota ou empate).
// Retorna true se o jogo terminou nesse estado.
function éTerminal(jogada) {
    return verificarFimDeJogo(jogada.matriz) !== null;
}

// Função de avaliação heurística que atribui um score a um estado do tabuleiro.
// Recebe um nó contendo o estado do tabuleiro e retorna o seu score.
function avaliar(no) {
    const matriz = no.matriz;
    const resultado = verificarFimDeJogo(matriz);
    // Scores altos para vitória da IA e baixos para vitória do jogador.
    if (resultado === 1) return -4990; // Jogador venceu
    if (resultado === 2) return 5000;  // IA venceu
    if (resultado === -1) return 0;   // Empate

    let score = 0;

    // Bônus para peças no centro, que é uma posição estratégica.
    for (let i = 0; i < matriz.length; i++) {
        if (matriz[i][3] === 2) score += 6;
        if (matriz[i][3] === 1) score -= 6;
    }

    // Função auxiliar para contar sequências de um determinado tamanho para um jogador.
    function contarSequencias(jogador, tamanho) {
        let contagem = 0;
        const linhas = matriz.length;
        const colunas = matriz[0].length;
        // Itera sobre o tabuleiro para encontrar sequências.
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

    // Atribui scores com base no número de sequências de 2 e 3 peças.
    // Incentiva a IA a criar suas próprias sequências e a bloquear as do jogador.
    score += 25 * contarSequencias(2, 3);
    score += 15 * contarSequencias(2, 2);
    score -= 30 * contarSequencias(1, 3);
    score -= 10 * contarSequencias(1, 2);

    return score;
}

/*
 * Determina a melhor coluna para a IA jogar, usando o algoritmo Minimax.
 * Recebe o estado atual do tabuleiro (matriz) e a profundidade da busca (dificuldade).
 * Retorna a coluna escolhida para a jogada, ou null se não houver jogadas.
 */
export function escolherMelhorJogada(matriz, profundidade) {
    let melhorValor = -Infinity;
    let melhorJogada = null;

    const no = new NoNAria(matriz, 2); // O jogador atual é a IA (2).
    const jogadasPossiveis = no.verificarCelulasDisponiveis();

    if (jogadasPossiveis.length === 0) {
        return null;
    }

    // Assume a primeira jogada como a melhor inicialmente.
    melhorJogada = jogadasPossiveis[0].coluna;

    // Itera sobre cada jogada possível.
    for (const jogada of jogadasPossiveis) {
        const novaMatriz = no.clonarMatriz();
        novaMatriz[jogada.linha][jogada.coluna] = 2; // Simula a jogada da IA.
        const noFilho = new NoNAria(novaMatriz, 1); // O próximo a jogar é o jogador (1).

        // Chama o Minimax para o estado resultante, como minimizador.
        const valorDaJogada = minimax(noFilho, profundidade - 1, false);
        
        // Atualiza a melhor jogada se um movimento com score maior for encontrado.
        if (valorDaJogada > melhorValor) {
            melhorValor = valorDaJogada;
            melhorJogada = jogada.coluna;
        }
    }
    return melhorJogada;
}