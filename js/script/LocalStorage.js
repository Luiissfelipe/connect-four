export function salvarHeapNoLocalStorage(heap) {
    const jogadores = heap.emOrdemDecrescente();
    localStorage.setItem('heapJogadores', JSON.stringify(jogadores));
}

export function carregarHeapDoLocalStorage(HeapClass, JogadorClass) {
    const dados = localStorage.getItem('heapJogadores');
    const heap = new HeapClass();
    if (dados) {
        const jogadores = JSON.parse(dados);
        for (const j of jogadores) {
            heap.inserir(new JogadorClass(j.nome, j.pontos));
        }
    }
    return heap;
}