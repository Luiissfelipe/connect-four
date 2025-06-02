export class UI {
    static criarMenuInicial() {
    //Cria a div principal do menu inicial
    const divMenuInicial = document.createElement('div');
    divMenuInicial.className = 'menu-inicial';
    document.querySelector("main").appendChild(divMenuInicial);

    // Cria o título do menu inicial
    const titulo = document.createElement('h1');
    titulo.className = 'menu-inicial-titulo';
    titulo.innerText = 'Menu Inicial';
    divMenuInicial.appendChild(titulo);

    // Cria o formulário
    const formulario = document.createElement('form');
    formulario.className = 'menu-inicial-formulario';
    formulario.setAttribute('method', 'post');
    formulario.setAttribute('autocomplete', 'off');
    divMenuInicial.appendChild(formulario);

    // Cria o campo de entrada para o nome do jogador
    const labelNome = document.createElement('label');
    labelNome.innerText = 'Nome: ';
    formulario.appendChild(labelNome);
    const inputNome = document.createElement('input');
    inputNome.type = 'text';
    inputNome.name = 'username';
    inputNome.id = 'username';
    inputNome.required = true;
    inputNome.minLength = 3;
    inputNome.maxLength = 10;
    inputNome.placeholder = 'Seunome';
    labelNome.appendChild(inputNome);
    
    // Cria o campo de entrada para a dificuldade
    const labelDificuldade = document.createElement('label');
    labelDificuldade.innerText = 'Dificuldade: ';
    formulario.appendChild(labelDificuldade);
    const selectDificuldade = document.createElement('select');
    selectDificuldade.name = 'dificuldade';
    selectDificuldade.id = 'dificuldade';
    labelDificuldade.appendChild(selectDificuldade);
    const opcaoFacil = document.createElement('option');
    opcaoFacil.value = '2';
    opcaoFacil.innerText = 'Fácil';
    selectDificuldade.appendChild(opcaoFacil);
    const opcaoMedio = document.createElement('option');
    opcaoMedio.value = '4';
    opcaoMedio.innerText = 'Médio';
    selectDificuldade.appendChild(opcaoMedio);
    const opcaoDificil = document.createElement('option');
    opcaoDificil.value = '6';
    opcaoDificil.innerText = 'Difícil';
    selectDificuldade.appendChild(opcaoDificil);

    // Cria o botão de iniciar jogo
    const botaoIniciar = document.createElement('button');
    botaoIniciar.className = "menu-inicial-formulario-botao-iniciar";
    botaoIniciar.innerText = 'Iniciar Partida';
    formulario.appendChild(botaoIniciar);

    }

    static apagarMenuInicial() {
        const menuInicial = document.querySelector('.menu-inicial');
        if (menuInicial) {
            menuInicial.remove();
        }
    }

    static criarMenuInformacoes(nomeJogador, dificuldade, pontos) {
    // Cria a div de informações do jogo
    const divInformacoes = document.createElement('div');
    divInformacoes.className = 'informacoes';
    document.querySelector("main").appendChild(divInformacoes);

    // Cria o título com o nome do jogador
    const nome = document.createElement('h2');
    nome.className = 'informacoes-nome';
    nome.innerText = nomeJogador;
    divInformacoes.appendChild(nome);

    // Cria a descrição com a dificuladade do jogo
    const descricaoDificuldade = document.createElement('p');
    descricaoDificuldade.innerText = 'Dificuldade: ';
    divInformacoes.appendChild(descricaoDificuldade);
    const dificuldadeSpan = document.createElement('span');
    dificuldadeSpan.className = 'informacoes-dificuldade';
    dificuldadeSpan.innerText = dificuldade;
    descricaoDificuldade.appendChild(dificuldadeSpan);

    // Cria a pontuação do jogador
    const descricaoPontos = document.createElement('p');
    descricaoPontos.innerText = 'Pontos: ';
    divInformacoes.appendChild(descricaoPontos);
    const pontosSpan = document.createElement('span');
    pontosSpan.className = 'informacoes-pontos';
    pontosSpan.innerText = pontos;
    descricaoPontos.appendChild(pontosSpan);

    }

    static apagarMenuInformacoes() {
        const menuInformacoes = document.querySelector('.informacoes');
        if (menuInformacoes) {
            menuInformacoes.remove();
        }
}

    static criarJogo() {
        // Cria a div do jogo
        const divJogo = document.createElement('div');
        divJogo.className = 'jogo';
        document.querySelector("main").appendChild(divJogo);

        // Cria o título do nome do jogo
        const divCabecalho = document.createElement('div');
        divCabecalho.className = 'jogo-cabecalho';
        divJogo.appendChild(divCabecalho);
        const nomeJogo = document.createElement('h1');
        nomeJogo.className = 'jogo-titulo';
        nomeJogo.innerText = 'Connect Four';
        divCabecalho.appendChild(nomeJogo);

        // Cria o titulo de mensagem do jogo
        const mensagemJogo = document.createElement('h2'); 
        mensagemJogo.className = 'jogo-mensagem';
        mensagemJogo.innerText = 'É a vez de jogador 1!';
        divCabecalho.appendChild(mensagemJogo);

        // Cria o tabuleiro do jogo
        const divTabuleiro = document.createElement('div');
        divTabuleiro.className = 'jogo-tabuleiro';
        divJogo.appendChild(divTabuleiro);

        // Cria as células do tabuleiro
        for (let coluna = 0; coluna < 7; coluna++) {
            const divColuna = document.createElement('div');
            divColuna.className = 'coluna';
            divTabuleiro.appendChild(divColuna);

            for (let linha = 0; linha < 6; linha++) {
                const divCelula = document.createElement('div');
                divCelula.className = 'celula';
                divColuna.appendChild(divCelula);
            }
        }

        // Cria o botão de reiniciar jogo
        const divBotoes = document.createElement('div');
        divBotoes.className = 'jogo-botoes';
        divJogo.appendChild(divBotoes);
        const botaoReiniciar = document.createElement('button');
        botaoReiniciar.className = 'jogo-botoes-reiniciar';
        botaoReiniciar.innerText = 'Jogar Novamente';
        divBotoes.appendChild(botaoReiniciar);

        // Cria o botão de voltar ao menu inicial
        const botaoVoltarMenu = document.createElement('button');
        botaoVoltarMenu.className = 'jogo-botoes-voltar';
        botaoVoltarMenu.innerText = 'Voltar ao Menu Inicial';   
        divBotoes.appendChild(botaoVoltarMenu);
    }

    static apagarJogo() {
        const jogo = document.querySelector('.jogo');
        if (jogo) {
            jogo.remove();
        }
    }

    // A listaJogadores deve ser um array de objetos com as propriedades 'nome' e 'pontos'
    static criarRanking(listaJogadores) { 
        // Cria a div do ranking
        const divRanking = document.createElement('div');
        divRanking.className = 'ranking';
        document.querySelector("main").appendChild(divRanking);

        // Cria o título do ranking
        const tituloRanking = document.createElement('h2');
        tituloRanking.className = 'ranking-titulo';
        tituloRanking.innerText = 'Top 10 Jogadores';
        divRanking.appendChild(tituloRanking);

        // Cria a lista do ranking
        const listaRanking = document.createElement('ol');
        listaRanking.className = 'ranking-lista';
        divRanking.appendChild(listaRanking);

        // Adiciona os 10 melhores jogadores à lista do ranking
        for (let i = 0; i < 10; i++) {
            const jogador = listaJogadores[i];
            const itemRanking = document.createElement('li');
            itemRanking.className = 'ranking-lista-item';
            itemRanking.innerText = `${jogador.nome} - ${jogador.pontos} pontos`;
            listaRanking.appendChild(itemRanking);
        }

        // Cria o botão de reiniciar o ranking
        const botaoReiniciarRanking = document.createElement('button'); 
        botaoReiniciarRanking.className = 'ranking-botao-reiniciar';
        botaoReiniciarRanking.innerText = 'Reiniciar Ranking';
        divRanking.appendChild(botaoReiniciarRanking);
    }

    static apagarRanking() {
        const ranking = document.querySelector('.ranking');
        if (ranking) {
            ranking.remove();
        }
    }
}

