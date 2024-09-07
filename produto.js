document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');
  
    fetch('db.json')
      .then(response => response.json())
      .then(data => {
        const produto = data.produtos.find(p => p.id == produtoId);
        
        if (produto) {
          const produtoContainer = document.getElementById('produto');
          produtoContainer.innerHTML = `
            <img src="${produto.imagem}" class="card-img-top" alt="${produto.titulo}">
            <div class="card-body">
              <h5 class="card-title">${produto.titulo}</h5>
              <p class="card-text">Autor: ${produto.autor}</p>
              <p class="card-text">Preço: ${produto.preco}</p>
              <a href="index.html" class="btn btn-primary">Voltar</a>
            </div>
          `;
        } else {
          document.body.innerHTML = '<h1>Produto não encontrado</h1>';
        }
      })
      .catch(error => console.error('Erro ao carregar detalhes do produto:', error));
  });
  