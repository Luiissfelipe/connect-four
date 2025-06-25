// Salva a lista de jogadores (a partir de uma instância do heap) no localStorage.
export function salvarHeapNoLocalStorage(heap) {
    // Converte o heap para uma lista ordenada e a salva como uma string JSON.
    const jogadores = heap.emOrdemDecrescente();
    localStorage.setItem('heapJogadores', JSON.stringify(jogadores));
}

// Carrega os jogadores do localStorage e os insere em uma nova instância de Heap.
export function carregarHeapDoLocalStorage(HeapClass, JogadorClass) {
    const dados = localStorage.getItem('heapJogadores');
    const heap = new HeapClass();
    if (dados) {
        // Se houver dados, converte a string JSON de volta para um array de objetos.
        const jogadores = JSON.parse(dados);
        // Itera sobre os dados dos jogadores e os insere no heap.
        for (const j of jogadores) {
            heap.inserir(new JogadorClass(j.nome, j.pontos));
        }
    }
    return heap; // Retorna uma nova instância de Heap com os jogadores que foram carregados.
}