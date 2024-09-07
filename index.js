document.addEventListener('DOMContentLoaded', () => {
  const produtosContainer = document.getElementById('produtos-container');

  const exibirProdutos = (produtos) => {
    produtosContainer.innerHTML = '';
    produtos.forEach(produto => {
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-4';
      col.innerHTML = `
        <div class="card">
          <img src="${produto.imagem}" class="card-img-top" alt="${produto.titulo}">
          <div class="card-body">
            <h5 class="card-title">${produto.titulo}</h5>
            <p class="card-text">Autor: ${produto.autor}</p>
            <p class="card-text">Preço: ${produto.preco}</p>
            <a href="produto.html?id=${produto.id}" class="btn btn-primary">Ver detalhes</a>
            <button class="btn btn-secondary mt-2" data-id="${produto.id}">Adicionar ao Carrinho</button>
          </div>
        </div>
      `;
      produtosContainer.appendChild(col);
    });

    document.querySelectorAll('.btn-secondary').forEach(button => {
      button.addEventListener('click', (e) => {
        const produtoId = e.target.getAttribute('data-id');
        adicionarAoCarrinho(produtoId);
      });
    });
  };

  const carregarProdutos = () => {
    fetch('db.json')
      .then(response => response.json())
      .then(data => {
        const produtos = data.produtos;
        exibirProdutos(produtos);

        const ordenacaoSelect = document.createElement('select');
        ordenacaoSelect.className = 'form-select';
        ordenacaoSelect.innerHTML = `
          <option value="default">Ordenar livros por</option>
          <option value="preco-asc">Preço: Menor para Maior</option>
          <option value="preco-desc">Preço: Maior para Menor</option>
          <option value="titulo-asc">Título: A-Z</option>
          <option value="titulo-desc">Título: Z-A</option>
        `;

        ordenacaoSelect.addEventListener('change', (e) => {
          const valor = e.target.value;
          let produtosOrdenados;

          switch (valor) {
            case 'preco-asc':
              produtosOrdenados = [...produtos].sort((a, b) => parseFloat(a.preco.replace('$ ', '').replace(',', '.')) - parseFloat(b.preco.replace('$ ', '').replace(',', '.')));
              break;
            case 'preco-desc':
              produtosOrdenados = [...produtos].sort((a, b) => parseFloat(b.preco.replace('$ ', '').replace(',', '.')) - parseFloat(a.preco.replace('$ ', '').replace(',', '.')));
              break;
            case 'titulo-asc':
              produtosOrdenados = [...produtos].sort((a, b) => a.titulo.localeCompare(b.titulo));
              break;
            case 'titulo-desc':
              produtosOrdenados = [...produtos].sort((a, b) => b.titulo.localeCompare(a.titulo));
              break;
            default:
              produtosOrdenados = produtos;
          }

          exibirProdutos(produtosOrdenados);
        });

        document.querySelector('.container').insertBefore(ordenacaoSelect, produtosContainer);
      })
      .catch(error => console.error('Erro ao carregar produtos:', error));
  };

  const adicionarAoCarrinho = (produtoId) => {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (!carrinho.includes(produtoId)) {
      carrinho.push(produtoId);
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      atualizarContadorCarrinho();
    }
  };

  const atualizarContadorCarrinho = () => {
    const contador = document.getElementById('carrinho-count');
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    contador.textContent = carrinho.length;
  };

  atualizarContadorCarrinho(); 
  carregarProdutos();
});
