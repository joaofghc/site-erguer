// Inicialização das animações AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa a biblioteca AOS para animações de scroll
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Ativa o link da navbar correspondente à página atual
    activateCurrentNavLink();
    
    // Adiciona comportamento ao formulário de contato
    setupContactForm();
});

// Função para ativar o link atual na navbar
function activateCurrentNavLink() {
    // Obtém o caminho da página atual
    const currentPath = window.location.pathname;
    
    // Obtém todos os links da navbar
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Itera sobre os links e ativa o correspondente
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // Se o caminho do link estiver contido no caminho atual, ativa-o
        if (currentPath.includes(linkPath) && linkPath !== 'index.html') {
            link.classList.add('active');
        } else if (currentPath.endsWith('/') && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });
}

// Função para configurar o formulário de contato
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validação básica do formulário
            let isValid = true;
            const name = document.getElementById('nameInput').value;
            const email = document.getElementById('emailInput').value;
            const subject = document.getElementById('subjectInput').value;
            const message = document.getElementById('messageInput').value;
            const privacyCheck = document.getElementById('privacyCheck').checked;
            
            // Validar campos (exemplo simplificado)
            if (!name || !email || !subject || !message) {
                isValid = false;
                alert('Por favor, preencha todos os campos obrigatórios.');
            } else if (!privacyCheck) {
                isValid = false;
                alert('Você precisa concordar com a política de privacidade.');
            }
            
            // Se for válido, simulamos o envio
            if (isValid) {
                // Aqui você adicionaria o código para enviar o formulário via AJAX
                // Por enquanto, apenas simularemos o sucesso
                
                // Desabilita o botão durante o "envio"
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
                
                // Simula um tempo de processamento
                setTimeout(() => {
                    // Reseta o formulário e mostra mensagem de sucesso
                    contactForm.reset();
                    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                    
                    // Restaura o botão
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                }, 1500);
            }
        });
    }
}

// Adiciona rolagem suave para links de âncora
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Adiciona classe na navbar quando a página é rolada
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});
