import { iniciarCarrossel } from './carouselService.js';
import { carregarProdutos } from "./productService.js";
import { exibirProdutos } from "./showProducts.js"

iniciarCarrossel();

async function main() {

    let produtos = await carregarProdutos()

    exibirProdutos(produtos)

    ativarBusca(produtos)
}

main()