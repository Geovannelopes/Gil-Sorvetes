import { carrinhoService } from './cartService.js';

// Função para exibir os produtos na tela
export function exibirProdutos(listaDeProdutos) {

    // Seleciona o container onde os produtos serão exibidos
    let container = document.querySelector('.produtos') || document.querySelector('.produtos-grid')
    
    if (!container) return;
    
    // Limpa o conteúdo anterior do container
    container.innerHTML = ''

    // Se a lista de produtos estiver vazia, exibe uma mensagem e retorna
    if (listaDeProdutos.length == 0) {
        container.innerHTML = "<p class='no-products'>Nenhum produto encontrado...</p>"
        return
    }

    // Limitar a 6 produtos na página inicial
    const isHomePage = document.querySelector('.hero-section');
    const produtosParaExibir = isHomePage ? listaDeProdutos.slice(0, 6) : listaDeProdutos;

    // Para cada produto na lista, cria um card e adiciona ao container
    for (let produto of produtosParaExibir) {
        let card = document.createElement('div') // Cria um div para o card
        card.classList.add('product-card') // Adiciona a classe 'product-card' ao div

        // Define o conteúdo HTML do card com imagem, nome, preço e botão
        card.innerHTML =
            `
        <div class="product-image">
            <img src="${produto.imagem}" alt="${produto.nome}" />
            <div class="product-badge">${produto.categoria}</div>
        </div>
        <div class="product-info">
            <h3 class="product-name">${produto.nome}</h3>
            <p class="product-price">R$ ${produto.preco.toFixed(2)}</p>
            <button class="btn-add-cart" data-produto='${JSON.stringify(produto)}'>
                <span class="cart-icon">🛒</span>
                Adicionar
            </button>
        </div>
        `;
        
        // Adiciona o card ao container de produtos
        container.appendChild(card)
    }

    // Adicionar event listeners aos botões de comprar
    const botoesComprar = container.querySelectorAll('.btn-add-cart');
    botoesComprar.forEach(botao => {
        botao.addEventListener('click', function() {
            const produto = JSON.parse(this.getAttribute('data-produto'));
            carrinhoService.adicionarProduto(produto);
        });
    });
}