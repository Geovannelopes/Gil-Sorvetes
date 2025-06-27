// Script para página de contato
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contatoForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obter dados do formulário
            const formData = new FormData(form);
            const dados = {
                nome: formData.get('nome'),
                email: formData.get('email'),
                telefone: formData.get('telefone') || 'Não informado',
                assunto: formData.get('assunto'),
                mensagem: formData.get('mensagem')
            };
            
            // Validar campos obrigatórios
            if (!dados.nome || !dados.email || !dados.assunto || !dados.mensagem) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Gerar mensagem para WhatsApp
            let mensagemWhatsApp = '🍦 *Gil Sorvetes* - Nova Mensagem de Contato\n\n';
            mensagemWhatsApp += `👤 *Nome:* ${dados.nome}\n`;
            mensagemWhatsApp += `📧 *E-mail:* ${dados.email}\n`;
            mensagemWhatsApp += `📞 *Telefone:* ${dados.telefone}\n`;
            mensagemWhatsApp += `📋 *Assunto:* ${dados.assunto}\n\n`;
            mensagemWhatsApp += `💬 *Mensagem:*\n${dados.mensagem}`;
            
            // Número do WhatsApp (substitua pelo número real)
            const numeroWhatsApp = '5511999999999';
            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`;
            
            // Abrir WhatsApp
            window.open(urlWhatsApp, '_blank');
            
            // Limpar formulário
            form.reset();
            
            // Mostrar mensagem de sucesso
            mostrarNotificacao('Mensagem enviada! Você será redirecionado para o WhatsApp.');
        });
    }
});

// Função para mostrar notificação
function mostrarNotificacao(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.className = 'notification success';
    notificacao.textContent = mensagem;
    
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
    
    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notificacao.parentNode) {
                notificacao.parentNode.removeChild(notificacao);
            }
        }, 300);
    }, 3000);
}
