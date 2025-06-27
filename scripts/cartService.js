// Serviço de carrinho de compras
class CarrinhoService {
    constructor() {
        this.carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        this.atualizarContadorCarrinho();
    }

    // Adicionar produto ao carrinho
    adicionarProduto(produto) {
        const produtoExistente = this.carrinho.find(item => item.nome === produto.nome);
        
        if (produtoExistente) {
            produtoExistente.quantidade++;
        } else {
            this.carrinho.push({
                ...produto,
                quantidade: 1
            });
        }
        
        this.salvarCarrinho();
        this.atualizarContadorCarrinho();
        this.mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
    }

    // Remover produto do carrinho
    removerProduto(nomeProduto) {
        this.carrinho = this.carrinho.filter(item => item.nome !== nomeProduto);
        this.salvarCarrinho();
        this.atualizarContadorCarrinho();
    }

    // Atualizar quantidade
    atualizarQuantidade(nomeProduto, novaQuantidade) {
        const produto = this.carrinho.find(item => item.nome === nomeProduto);
        if (produto) {
            if (novaQuantidade <= 0) {
                this.removerProduto(nomeProduto);
            } else {
                produto.quantidade = novaQuantidade;
                this.salvarCarrinho();
                this.atualizarContadorCarrinho();
            }
        }
    }

    // Obter carrinho
    obterCarrinho() {
        return this.carrinho;
    }

    // Obter total de itens
    obterTotalItens() {
        return this.carrinho.reduce((total, item) => total + item.quantidade, 0);
    }

    // Obter total em dinheiro
    obterTotalDinheiro() {
        return this.carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    // Limpar carrinho
    limparCarrinho() {
        this.carrinho = [];
        this.salvarCarrinho();
        this.atualizarContadorCarrinho();
    }

    // Salvar no localStorage
    salvarCarrinho() {
        localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
    }

    // Atualizar contador visual do carrinho
    atualizarContadorCarrinho() {
        const contador = document.querySelector('.cart-counter');
        const totalItens = this.obterTotalItens();
        
        if (contador) {
            contador.textContent = totalItens;
            contador.style.display = totalItens > 0 ? 'block' : 'none';
        }
    }

    // Mostrar notificação
    mostrarNotificacao(mensagem) {
        // Criar elemento de notificação
        const notificacao = document.createElement('div');
        notificacao.className = 'notification';
        notificacao.textContent = mensagem;
        
        // Adicionar estilos
        notificacao.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--cor-destaque);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notificacao);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notificacao.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notificacao.parentNode) {
                    notificacao.parentNode.removeChild(notificacao);
                }
            }, 300);
        }, 3000);
    }
}

// Criar instância global do carrinho
export const carrinhoService = new CarrinhoService();
