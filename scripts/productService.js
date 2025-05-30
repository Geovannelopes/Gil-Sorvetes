export async function carregarProdutos() {
    let response = await fetch('data/data.json');
    let produtos = await response.json();
    return produtos
}