const PlanoDeFundo = document.querySelector('main');

if (localStorage.hasOwnProperty('corSelecionada')) {
  const corSelecionada = localStorage.getItem('corSelecionada');
  seletor.value = corSelecionada;
  PlanoDeFundo.style.backgroundColor = corSelecionada;
}

seletor.addEventListener('input', () => {
  const corEscolhida = seletor.value;
  PlanoDeFundo.style.backgroundColor = corEscolhida;
  localStorage.setItem('corSelecionada', corEscolhida);
});
