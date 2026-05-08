// ============================================================
//  PAINEL DE DEVOLUÇÕES — script.js
// ============================================================

// ── Estado global ──────────────────────────────────────────
let totalProcessados = 0;
let totalMulta       = 0;

// ── Referências ao DOM ─────────────────────────────────────
const inputNome          = document.getElementById('inputNome');
const inputDias          = document.getElementById('inputDias');
const btnRegistrar       = document.getElementById('btnRegistrar');
const lista              = document.getElementById('listaLivros');
const emptyState         = document.getElementById('emptyState');
const errorMsg           = document.getElementById('errorMsg');
const elTotalProcessados = document.getElementById('totalProcessados');
const elTotalMulta       = document.getElementById('totalMulta');

// ── Event listeners ────────────────────────────────────────
btnRegistrar.addEventListener('click', adicionarLivro);

inputNome.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') adicionarLivro();
});

inputDias.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') adicionarLivro();
});

// ── Funções principais ─────────────────────────────────────

/**
 * Lê os campos, valida e adiciona um novo livro à lista.
 */
function adicionarLivro() {
  const nome = inputNome.value.trim();
  const dias = Number(inputDias.value); // converte string → número

  // Validação: nome obrigatório
  if (!nome) {
    errorMsg.classList.add('visible');
    inputNome.focus();
    return;
  }
  errorMsg.classList.remove('visible');

  const atrasado = dias > 0;
  const id       = 'livro-' + Date.now(); // id único para cada item

  // Cria o elemento <li> com template string (backtick)
  const li = document.createElement('li');
  li.id        = id;
  li.className = `livro-item ${atrasado ? 'atrasado' : 'em-dia'}`;

  li.innerHTML = `
    <span class="livro-nome">${nome}</span>

    <div class="livro-status">
      <span class="dias-text">
        ${dias === 0 ? 'No prazo' : dias + (dias === 1 ? ' dia' : ' dias')}
      </span>
      ${atrasado
        ? '<span class="badge-atrasado"><strong>ATRASADO</strong></span>'
        : '<span class="badge-ok">Em dia</span>'}
    </div>

    <button class="btn-arquivar" data-id="${id}" data-atrasado="${atrasado ? '1' : '0'}">
      Confirmar Arquivamento
    </button>
  `;

  // Adiciona o evento de remoção ao botão recém-criado
  li.querySelector('.btn-arquivar').addEventListener('click', function () {
    removerLivro(this.dataset.id, Number(this.dataset.atrasado));
  });

  lista.appendChild(li);

  // Atualiza contadores e oculta o empty state
  totalProcessados++;
  if (atrasado) totalMulta++;
  atualizarContadores();
  emptyState.classList.remove('visible');

  // Limpa os campos e devolve o foco
  inputNome.value = '';
  inputDias.value = '0';
  inputNome.focus();
}

/**
 * Remove o livro da lista com animação de saída.
 * @param {string} id         - ID do elemento <li>
 * @param {number} foiAtrasado - 1 se tinha multa, 0 se não
 */
function removerLivro(id, foiAtrasado) {
  const el = document.getElementById(id);
  if (!el) return;

  // Animação de saída (definida no CSS via transition)
  el.style.opacity   = '0';
  el.style.transform = 'translateX(20px)';

  setTimeout(function () {
    el.remove();

    totalProcessados--;
    if (foiAtrasado) totalMulta--;
    atualizarContadores();

    // Mostra empty state se a lista ficar vazia
    if (lista.children.length === 0) {
      emptyState.classList.add('visible');
    }
  }, 200);
}

/**
 * Atualiza os valores exibidos nos cards de contador.
 */
function atualizarContadores() {
  elTotalProcessados.textContent = totalProcessados;
  elTotalMulta.textContent       = totalMulta;
}
