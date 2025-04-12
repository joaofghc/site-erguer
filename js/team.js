document.addEventListener('DOMContentLoaded', function() {
    // Definir cores para cada centro
    const centrosCores = {
        'Aracaju': '#4285F4',      // Azul
        'Arapiraca': '#9C27B0',    // Roxo
        'Ilhéus': '#F4B400',       // Amarelo/Laranja
        'Feira de Santana': '#DB4437'  // Vermelho
    };

    // Carregar os dados do arquivo JSON
    fetch('data/team.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar dados da equipe');
            }
            return response.json();
        })
        .then(data => {
            renderizarEquipe(data);
            configurarFiltros();
        })
        .catch(error => {
            console.error('Erro:', error);
        });

    /**
     * Renderiza os cards da equipe com base nos dados do JSON
     */
    function renderizarEquipe(data) {
        // Renderizar a coordenação
        const coordenacaoContainer = document.getElementById('coordenacao-container');
        data.coordenacao.forEach((membro, index) => {
            const card = criarCardCoordenacao(membro, index);
            coordenacaoContainer.appendChild(card);
        });

        // Renderizar os colaboradores
        const colaboradoresContainer = document.getElementById('colaboradores-container');
        data.colaboradores.forEach((colaborador, index) => {
            const card = criarCardColaborador(colaborador, index);
            colaboradoresContainer.appendChild(card);

            // Esconder inicialmente os colaboradores inativos
            if (colaborador.status === 'Inativo') {
                card.classList.add('d-none');
            }
        });
    }

    /**
     * Cria um elemento card para um membro da coordenação
     */
    function criarCardCoordenacao(membro, index) {
        const statusClass = membro.status === 'Ativo' ? 'bg-success' : 'bg-secondary';
        const centroCor = membro.centro && centrosCores[membro.centro] ? centrosCores[membro.centro] : '#6c757d';
        
        const cardDiv = document.createElement('div');
        cardDiv.className = 'col-md-4';
        cardDiv.setAttribute('data-aos', 'fade-up');
        
        cardDiv.innerHTML = `
            <div class="team-card card h-100 border-0 shadow-sm">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${membro.imagem}" class="img-fluid team-img" alt="${membro.nome}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body p-3">
                            <h5 class="card-title fw-bold">${membro.nome}</h5>
                            <p class="text-muted small mb-1">${membro.cargo}</p>
                            <p class="card-text small mb-1">${membro.formacao}</p>
                            ${membro.centro ? `<p class="card-text small mb-1">
                              <span class="badge rounded-pill" style="background-color: ${centroCor}">${membro.centro}</span>
                            </p>` : ''}
                            ${membro.email ? `<p class="card-text small mb-1">${membro.email}</p>` : ''}
                            <p class="card-text mb-0"><span class="badge ${statusClass}">${membro.status}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return cardDiv;
    }

    /**
     * Cria um elemento card para um colaborador
     */
    function criarCardColaborador(colaborador, index) {
        const statusClass = colaborador.status === 'Ativo' ? 'bg-success' : 'bg-secondary';
        const centroCor = colaborador.centro && centrosCores[colaborador.centro] ? centrosCores[colaborador.centro] : '#6c757d';
        
        const cardDiv = document.createElement('div');
        cardDiv.className = `col colaborador ${colaborador.status.toLowerCase()}`;
        cardDiv.setAttribute('data-aos', 'fade-up');
        
        cardDiv.innerHTML = `
            <div class="team-card-xs card h-100 text-center border-0 shadow-sm">
                <img src="${colaborador.imagem}" class="card-img-top" alt="${colaborador.nome}">
                <div class="card-body p-2">
                    <h6 class="card-title fw-bold">${colaborador.nome}</h6>
                    <p class="text-muted small mb-1">${colaborador.cargo}</p>
                    <p class="card-text small mb-1">${colaborador.formacao}</p>
                    ${colaborador.centro ? `<p class="card-text small mb-1">
                      <span class="badge rounded-pill" style="background-color: ${centroCor}">${colaborador.centro}</span>
                    </p>` : ''}
                    <p class="text-muted small mb-0"><span class="badge ${statusClass}">${colaborador.status}</span></p>
                </div>
            </div>
        `;
        
        return cardDiv;
    }

    /**
     * Configura os botões de filtro para os colaboradores
     */
    function configurarFiltros() {
        const btnAtivos = document.getElementById('btn-ativos');
        const btnTodos = document.getElementById('btn-todos');
        const colaboradoresInativos = document.querySelectorAll('.colaborador.inativo');
        
        btnAtivos.addEventListener('click', function() {
            btnAtivos.classList.add('active');
            btnAtivos.classList.remove('btn-outline-primary');
            btnAtivos.classList.add('btn-primary');
            btnTodos.classList.remove('active');
            btnTodos.classList.add('btn-outline-primary');
            btnTodos.classList.remove('btn-primary');
            
            colaboradoresInativos.forEach(function(colaborador) {
                colaborador.classList.add('d-none');
            });
        });
        
        btnTodos.addEventListener('click', function() {
            btnTodos.classList.add('active');
            btnTodos.classList.remove('btn-outline-primary');
            btnTodos.classList.add('btn-primary');
            btnAtivos.classList.remove('active');
            btnAtivos.classList.add('btn-outline-primary');
            btnAtivos.classList.remove('btn-primary');
            
            colaboradoresInativos.forEach(function(colaborador) {
                colaborador.classList.remove('d-none');
            });
        });
    }
});
