document.addEventListener('DOMContentLoaded', function() {
    let todasNoticias = []; // Armazenar todas as notícias
    let todosTopicos = new Set(); // Conjunto para armazenar todos os tópicos únicos
    
    carregarNoticias();

    // Registrar eventos para pesquisa e filtragem
    document.getElementById('pesquisa-noticias').addEventListener('input', filtrarNoticias);
    document.getElementById('btn-pesquisar').addEventListener('click', filtrarNoticias);
    document.getElementById('filtro-topicos').addEventListener('change', filtrarNoticias);

    // Função para carregar as notícias do arquivo JSON
    async function carregarNoticias() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/joaofghc/site-erguer/refs/heads/master/data/noticias.json');
            if (!response.ok) {
                throw new Error('Falha ao carregar notícias');
            }
            const data = await response.json();
            todasNoticias = data.noticias;
            
            // Extrair todos os tópicos únicos
            todasNoticias.forEach(noticia => {
                if (noticia.topicos && Array.isArray(noticia.topicos)) {
                    noticia.topicos.forEach(topico => todosTopicos.add(topico));
                }
            });
            
            // Preencher o dropdown de filtro de tópicos
            preencherFiltroTopicos();
            
            // Preencher container de tópicos populares
            preencherTopicosPopulares();
            
            exibirNoticias(todasNoticias);
        } catch (error) {
            console.error('Erro ao carregar notícias:', error);
            document.getElementById('noticias-container').innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-danger">Não foi possível carregar as notícias. Tente novamente mais tarde.</p>
                </div>
            `;
        }
    }

    // Função para preencher o dropdown de filtro de tópicos
    function preencherFiltroTopicos() {
        const selectTopicos = document.getElementById('filtro-topicos');
        
        // Ordenar tópicos alfabeticamente
        const topicosOrdenados = Array.from(todosTopicos).sort();
        
        topicosOrdenados.forEach(topico => {
            const option = document.createElement('option');
            option.value = topico;
            option.textContent = topico;
            selectTopicos.appendChild(option);
        });
    }
    
    // Função para preencher os tópicos populares como tags clicáveis
    function preencherTopicosPopulares() {
        const topicosContainer = document.getElementById('topicos-container');
        const topicosArray = Array.from(todosTopicos);
        
        topicosArray.forEach(topico => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-light text-dark p-2 me-2 mb-2';
            badge.style.cursor = 'pointer';
            badge.textContent = topico;
            badge.addEventListener('click', function() {
                document.getElementById('filtro-topicos').value = topico;
                filtrarNoticias();
            });
            topicosContainer.appendChild(badge);
        });
    }

    // Função para filtrar notícias com base na pesquisa e filtros
    function filtrarNoticias() {
        const termoPesquisa = document.getElementById('pesquisa-noticias').value.toLowerCase();
        const topicoSelecionado = document.getElementById('filtro-topicos').value;
        
        const noticiasFiltradas = todasNoticias.filter(noticia => {
            // Filtrar por termo de pesquisa
            const correspondeTermoPesquisa = 
                termoPesquisa === '' || 
                noticia.titulo.toLowerCase().includes(termoPesquisa) || 
                noticia.resumo.toLowerCase().includes(termoPesquisa);
            
            // Filtrar por tópico
            const correspondeTopico = 
                topicoSelecionado === '' || 
                (noticia.topicos && noticia.topicos.includes(topicoSelecionado));
            
            return correspondeTermoPesquisa && correspondeTopico;
        });
        
        exibirNoticias(noticiasFiltradas);
    }

    // Função para exibir as notícias na página
    function exibirNoticias(noticias) {
        const container = document.getElementById('noticias-container');
        const semResultados = document.getElementById('sem-resultados');
        
        // Remover indicador de carregamento
        container.innerHTML = '';
        
        // Se não houver notícias, mostrar mensagem
        if (!noticias || noticias.length === 0) {
            container.innerHTML = '';
            semResultados.style.display = 'block';
            return;
        }
        
        semResultados.style.display = 'none';
        
        // Criar um card para cada notícia
        noticias.forEach(noticia => {
            const dataFormatada = new Date(noticia.data).toLocaleDateString('pt-BR');
            
            // Criar os badges de tópicos
            let topicosHTML = '';
            if (noticia.topicos && noticia.topicos.length > 0) {
                topicosHTML = '<div class="mb-2">';
                noticia.topicos.forEach(topico => {
                    topicosHTML += `<span class="badge bg-secondary me-1">${topico}</span>`;
                });
                topicosHTML += '</div>';
            }
            
            const cardHTML = `
                <div class="col-md-4 mb-4" data-aos="fade-up">
                    <div class="card h-100">
                        <img src="${noticia.imagem}" class="card-img-top" alt="${noticia.titulo}">
                        <div class="card-body">
                            <h3 class="card-title">${noticia.titulo}</h3>
                            <p class="text-muted small">${dataFormatada}</p>
                            ${topicosHTML}
                            <p class="card-text">${noticia.resumo}</p>
                            <a href="${noticia.link}" class="btn btn-accent" target="_blank">Leia Mais</a>
                        </div>
                    </div>
                </div>
            `;
            
            container.innerHTML += cardHTML;
        });
        
        // Reinicializar animações AOS após adicionar conteúdo
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
});
