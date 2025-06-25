export class Heap {
    constructor() {
        this.heap = [];
    }

    // Retorna o índice do nó pai
    indicePai(i) {
        return Math.floor((i - 1) / 2);
    }

    // Retorna o índice do filho da esquerda
    indiceFilhoEsquerda(i) {
        return 2 * i + 1;
    }

    // Retorna o índice do filho da direita
    indiceFilhoDireita(i) {
        return 2 * i + 2;
    }

    // Troca a posição de dois elementos no heap.
    trocar(indice1, indice2) {
        const temporario = this.heap[indice1];
        this.heap[indice1] = this.heap[indice2];
        this.heap[indice2] = temporario;
    }

    // Garante a propriedade do heap movendo um elemento para cima.
    heapifyUp(i) {
        let indiceAtual = i;
        let indiceDoPai = this.indicePai(indiceAtual);

        // Enquanto o filho for maior que o pai, eles trocam de lugar.
        while (indiceAtual > 0 && this.heap[indiceAtual].pontos > this.heap[indiceDoPai].pontos) {
            this.trocar(indiceAtual, indiceDoPai);
            indiceAtual = indiceDoPai;
            indiceDoPai = this.indicePai(indiceAtual);
        }
    }

    // Garante a propriedade do heap movendo um elemento para baixo.
    heapifyDown(i) {
        let indiceAtual = i;
        const tamanhoDoHeap = this.heap.length;

        // Loop para continuar a verificação até que o nó esteja na posição correta.
        while (true) {
            let indiceMaior = indiceAtual;
            const indiceEsquerdo = this.indiceFilhoEsquerda(indiceAtual);
            const indiceDireito = this.indiceFilhoDireita(indiceAtual);

            // Verifica se o filho da esquerda é maior que o nó atual.
            if (indiceEsquerdo < tamanhoDoHeap && this.heap[indiceEsquerdo].pontos > this.heap[indiceMaior].pontos) {
                indiceMaior = indiceEsquerdo;
            }

            // Verifica se o filho da direita é maior que o maior encontrado até agora.
            if (indiceDireito < tamanhoDoHeap && this.heap[indiceDireito].pontos > this.heap[indiceMaior].pontos) {
                indiceMaior = indiceDireito;
            }

            // Se o nó atual já é o maior, a propriedade do heap está correta.
            if (indiceAtual === indiceMaior) {
                break;
            }

            // Caso contrário, troca com o maior filho e continua a verificação.
            this.trocar(indiceAtual, indiceMaior);
            indiceAtual = indiceMaior;
        }
    }

    // Adiciona um novo jogador ao heap.
    inserir(jogador) {
        this.heap.push(jogador);
        this.heapifyUp(this.heap.length - 1); // Ajusta a posição do novo elemento.
    }

    // Remove e retorna o jogador com mais pontos (a raiz do heap).
    removerMaior() {
        if (this.heap.length === 0) {
            return null; // Heap está vazio.
        }
        if (this.heap.length === 1) {
            return this.heap.pop(); // Apenas um elemento no heap.
        }

        const maiorJogador = this.heap[0];
        // Move o último elemento para a raiz para depois reajustar o heap.
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);

        return maiorJogador;
    }
    
    // Retorna uma cópia do array de jogadores em ordem decrescente de pontos.
    emOrdemDecrescente() {
        const arrayOrdenado = [];
        // Cria um heap temporário para não modificar o original.
        const heapTemporario = new Heap();
        heapTemporario.heap = this.heap.slice(); 

        while (heapTemporario.heap.length > 0) {
            // Extrai o maior de cada vez para construir o array ordenado.
            arrayOrdenado.push(heapTemporario.removerMaior());
        }
        return arrayOrdenado;
    }

    // Busca um jogador pelo nome.
    buscarJogadorPorNome(nome) {
        return this.heap.find(jogador => jogador.nome === nome) || null;
    }
    
    // (Convenção para método privado) Remove um jogador específico do heap.
    #removerJogadorPorNome(nome) {
        const indiceDoJogador = this.heap.findIndex(j => j.nome === nome);
        
        if (indiceDoJogador === -1) {
            return; // Jogador não encontrado.
        }

        // Troca o jogador a ser removido com o último elemento do heap.
        this.trocar(indiceDoJogador, this.heap.length - 1);
        // Remove o jogador do final do array.
        this.heap.pop();
        
        // Reajusta a posição do elemento que foi trocado, se ele não for o último.
        if (indiceDoJogador < this.heap.length) {
            // Tenta mover para cima e para baixo para encontrar a posição correta.
            this.heapifyUp(indiceDoJogador);
            this.heapifyDown(indiceDoJogador);
        }
    }

    // Atualiza os dados de um jogador.
    atualizarJogador(jogadorAtualizado) {
        // Usa o método privado para remover a versão antiga.
        this.#removerJogadorPorNome(jogadorAtualizado.nome);
        // Insere a versão atualizada.
        this.inserir(jogadorAtualizado);
    }

    // Limpa todos os jogadores do heap.
    limpar() {
        this.heap = [];
    }
}