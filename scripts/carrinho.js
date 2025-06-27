import { carrinhoService } from './cartService.js';

// Elementos da página
const carrinhoItems = document.querySelector('.carrinho-items');
const carrinhoVazio = document.getElementById('carrinho-vazio');
const carrinhoContainer = document.querySelector('.carrinho-container');
const totalItens = document.getElementById('total-itens');
const totalValor = document.getElementById('total-valor');
const btnFinalizar = document.getElementById('btn-finalizar');
const btnLimpar = document.getElementById('btn-limpar');

// Função para renderizar carrinho
function renderizarCarrinho() {
    const carrinho = carrinhoService.obterCarrinho();
    
    if (carrinho.length === 0) {
        carrinhoContainer.style.display = 'none';
        carrinhoVazio.style.display = 'block';
        return;
    }
    
    carrinhoContainer.style.display = 'block';
    carrinhoVazio.style.display = 'none';
    
    carrinhoItems.innerHTML = '';
    
    carrinho.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'carrinho-item';
        itemElement.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}">
            <div class="item-info">
                <h3>${item.nome}</h3>
                <p class="categoria">${item.categoria}</p>
                <p class="preco-unitario">R$ ${item.preco.toFixed(2)}</p>
            </div>
            <div class="item-quantidade">
                <button class="btn-diminuir" data-produto="${item.nome}">-</button>
                <span class="quantidade">${item.quantidade}</span>
                <button class="btn-aumentar" data-produto="${item.nome}">+</button>
            </div>
            <div class="item-total">
                <p>R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
                <button class="btn-remover" data-produto="${item.nome}">🗑️</button>
            </div>
        `;
        carrinhoItems.appendChild(itemElement);
    });
    
    // Atualizar resumo
    totalItens.textContent = carrinhoService.obterTotalItens();
    totalValor.textContent = `R$ ${carrinhoService.obterTotalDinheiro().toFixed(2)}`;
    
    // Adicionar event listeners
    adicionarEventListeners();
}

// Função para adicionar event listeners
function adicionarEventListeners() {
    // Botões de aumentar quantidade
    document.querySelectorAll('.btn-aumentar').forEach(btn => {
        btn.addEventListener('click', function() {
            const nomeProduto = this.getAttribute('data-produto');
            const carrinho = carrinhoService.obterCarrinho();
            const produto = carrinho.find(item => item.nome === nomeProduto);
            carrinhoService.atualizarQuantidade(nomeProduto, produto.quantidade + 1);
            renderizarCarrinho();
        });
    });
    
    // Botões de diminuir quantidade
    document.querySelectorAll('.btn-diminuir').forEach(btn => {
        btn.addEventListener('click', function() {
            const nomeProduto = this.getAttribute('data-produto');
            const carrinho = carrinhoService.obterCarrinho();
            const produto = carrinho.find(item => item.nome === nomeProduto);
            carrinhoService.atualizarQuantidade(nomeProduto, produto.quantidade - 1);
            renderizarCarrinho();
        });
    });
    
    // Botões de remover item
    document.querySelectorAll('.btn-remover').forEach(btn => {
        btn.addEventListener('click', function() {
            const nomeProduto = this.getAttribute('data-produto');
            if (confirm('Deseja remover este item do carrinho?')) {
                carrinhoService.removerProduto(nomeProduto);
                renderizarCarrinho();
            }
        });
    });
}

// Event listeners dos botões principais
btnLimpar.addEventListener('click', function() {
    if (confirm('Deseja limpar todo o carrinho?')) {
        carrinhoService.limparCarrinho();
        renderizarCarrinho();
    }
});

btnFinalizar.addEventListener('click', function() {
    const carrinho = carrinhoService.obterCarrinho();
    if (carrinho.length === 0) return;
    
    // Gerar mensagem do WhatsApp
    let mensagem = '🍦 *Gil Sorvetes* - Novo Pedido\n\n';
    mensagem += '📋 *Itens do pedido:*\n';
    
    carrinho.forEach(item => {
        mensagem += `• ${item.nome} (${item.categoria})\n`;
        mensagem += `  Qtd: ${item.quantidade} | Valor: R$ ${(item.preco * item.quantidade).toFixed(2)}\n\n`;
    });
    
    mensagem += `💰 *Total: R$ ${carrinhoService.obterTotalDinheiro().toFixed(2)}*\n\n`;
    mensagem += '📍 Aguardo confirmação do pedido!';
    
    // Número do WhatsApp (substitua pelo número real)
    const numeroWhatsApp = '5511999999999';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    
    // Abrir WhatsApp
    window.open(urlWhatsApp, '_blank');
});

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        renderizarCarrinho();
    }, 100);
});
