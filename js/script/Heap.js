export class Heap {
    constructor() {
        this.heap = [];
    }

    // Retorna o índice do pai
    getParentIndex(i) {
        return Math.floor((i - 1) / 2);
    }

    // Retorna o índice do filho à esquerda
    getLeftChildIndex(i) {
        return 2 * i + 1;
    }

    // Retorna o índice do filho à direita
    getRightChildIndex(i) {
        return 2 * i + 2;
    }

    // Troca dois elementos de posição no heap
    swap(i1, i2) {
        [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
    }

    // "Peneirar para cima": move um nó para sua posição correta
    siftUp(i) {
        let parentIndex = this.getParentIndex(i);
        // Compara com o pai enquanto não for a raiz e tiver mais pontos que o pai
        while (i > 0 && this.heap[i].pontos > this.heap[parentIndex].pontos) {
            this.swap(i, parentIndex);
            i = parentIndex;
            parentIndex = this.getParentIndex(i);
        }
    }

    // "Peneirar para baixo": move um nó para sua posição correta
    siftDown(i) {
        let maxIndex = i;
        const leftIndex = this.getLeftChildIndex(i);
        const rightIndex = this.getRightChildIndex(i);
        const size = this.heap.length;

        if (leftIndex < size && this.heap[leftIndex].pontos > this.heap[maxIndex].pontos) {
            maxIndex = leftIndex;
        }
        if (rightIndex < size && this.heap[rightIndex].pontos > this.heap[maxIndex].pontos) {
            maxIndex = rightIndex;
        }

        if (i !== maxIndex) {
            this.swap(i, maxIndex);
            this.siftDown(maxIndex);
        }
    }

    // Insere um novo jogador no heap
    inserir(jogador) {
        this.heap.push(jogador);
        this.siftUp(this.heap.length - 1);
    }

    // Remove e retorna o jogador com a maior pontuação (a raiz)
    removerMax() {
        if (this.heap.length === 0) {
            return null;
        }
        if (this.heap.length === 1) {
            return this.heap.pop();
        }
        const max = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.siftDown(0);
        return max;
    }
    
    // Retorna uma CÓPIA do heap ordenada (maior para menor)
    // Usa o algoritmo HeapSort para ordenar sem destruir o heap original
    emOrdemDecrescente() {
        const sortedArray = [];
        const tempHeap = new Heap();
        tempHeap.heap = [...this.heap]; // Cria uma cópia para não modificar o original

        while (tempHeap.heap.length > 0) {
            sortedArray.push(tempHeap.removerMax());
        }
        return sortedArray;
    }

    buscarJogadorPorNome(nome) {
        return this.heap.find(jogador => jogador.nome === nome) || null;
    }
    
    // Método privado para remover um jogador específico
    #removerJogadorPorNome(nome) {
        const index = this.heap.findIndex(j => j.nome === nome);
        if (index === -1) return;

        // Troca o elemento a ser removido com o último
        this.swap(index, this.heap.length - 1);
        // Remove o último elemento (que agora é o que queremos remover)
        this.heap.pop();
        
        // Reposiciona o elemento que foi trocado, se necessário
        if (index < this.heap.length) {
            this.siftUp(index);
        this.siftDown(index);
        }
    }

    atualizarJogador(jogadorAtualizado) {
        this.#removerJogadorPorNome(jogadorAtualizado.nome);
        this.inserir(jogadorAtualizado);
    }

    // Limpa o heap
    limpar() {
        this.heap = [];
    }
}