import { iniciarCarrossel } from './carouselService.js';
import { carregarProdutos } from "./productService.js";
import { exibirProdutos } from "./showProducts.js";
import { carrinhoService } from './cartService.js';

iniciarCarrossel();

// Função para implementar busca de produtos
function ativarBusca(produtos) {
    const campoBusca = document.getElementById('searchInput');
    
    if (campoBusca) {
        campoBusca.addEventListener('input', function() {
            const termoBusca = this.value.toLowerCase().trim();
            
            if (termoBusca === '') {
                exibirProdutos(produtos);
            } else {
                const produtosFiltrados = produtos.filter(produto => 
                    produto.nome.toLowerCase().includes(termoBusca) ||
                    produto.categoria.toLowerCase().includes(termoBusca)
                );
                exibirProdutos(produtosFiltrados);
            }
        });
    }
}

async function main() {
    let produtos = await carregarProdutos()
    exibirProdutos(produtos)
    ativarBusca(produtos)
}

main()