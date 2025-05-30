// Função para exibir os produtos na tela
export function exibirProdutos(listaDeProdutos) {

    // Seleciona o container onde os produtos serão exibidos
    let container = document.querySelector('.produtos')
    // Limpa o conteúdo anterior do container
    container.innerHTML = ''

    // Se a lista de produtos estiver vazia, exibe uma mensagem e retorna
    if (listaDeProdutos.length == 0) {
        container.innerHTML = "<p>Nenhum produto encontrado...</p>"
        return
    }

    // Para cada produto na lista, cria um card e adiciona ao container
    for (let produto of listaDeProdutos) {
        let card = document.createElement('div') // Cria um div para o card
        card.classList.add('card') // Adiciona a classe 'card' ao div

        // Define o conteúdo HTML do card com imagem, nome, preço e botão
        card.innerHTML =
            `
        <img src="${produto.imagem}" alt="Produto 1" />
        <h2>${produto.nome}</h2>
        <p>R$ ${produto.preco}</p>
        <button>Comprar</button>
        `;
        // Adiciona o card ao container de produtos
        container.appendChild(card)
    }
}