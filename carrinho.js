document.addEventListener('DOMContentLoaded', () => {
    const carrinhoContainer = document.getElementById('carrinho-container');
    const totalQuantidade = document.getElementById('total-quantidade');
    const totalValor = document.getElementById('total-valor');

    const exibirCarrinho = (produtos) => {
        carrinhoContainer.innerHTML = '';
        let valorTotal = 0;

        if (produtos.length === 0) {
            carrinhoContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            totalQuantidade.textContent = '0';
            totalValor.textContent = '$0.00';
            return;
        }

        fetch('db.json')
            .then(response => response.json())
            .then(data => {
                const produtosData = data.produtos;
                produtos.forEach(id => {
                    const produto = produtosData.find(p => p.id == id);
                    if (produto) {
                        const col = document.createElement('div');
                        col.className = 'col-md-4 mb-4';
                        col.innerHTML = `
                            <div class="card">
                              <img src="${produto.imagem}" class="card-img-top" alt="${produto.titulo}">
                              <div class="card-body">
                                <h5 class="card-title">${produto.titulo}</h5>
                                <p class="card-text">Autor: ${produto.autor}</p>
                                <p class="card-text">Preço: ${produto.preco}</p>
                                <button class="btn btn-secondary" data-id="${produto.id}">Remover do Carrinho</button>
                              </div>
                            </div>
                        `;
                        carrinhoContainer.appendChild(col);

                        const preco = parseFloat(produto.preco.replace('$', '').replace(',', '.'));
                        valorTotal += preco;
                    }
                });

                totalQuantidade.textContent = produtos.length;
                totalValor.textContent = `$${valorTotal.toFixed(2)}`;

                document.querySelectorAll('.btn-secondary').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const produtoId = e.target.getAttribute('data-id');
                        removerDoCarrinho(produtoId);
                    });
                });
            })
            .catch(error => console.error('Erro ao carregar o carrinho:', error));
    };

    const carregarCarrinho = () => {
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        exibirCarrinho(carrinho);
    };

    const removerDoCarrinho = (produtoId) => {
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        carrinho = carrinho.filter(id => id != produtoId);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        carregarCarrinho(); 
        atualizarContadorCarrinho(); 
    };

    const atualizarContadorCarrinho = () => {
        const contador = document.getElementById('carrinho-count');
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        contador.textContent = carrinho.length;
    };

    const finalizarCompra = () => {
        alert('Compra finalizada!');
    };

    document.getElementById('finalizar-compra').addEventListener('click', finalizarCompra);

    carregarCarrinho();
    atualizarContadorCarrinho();
});
