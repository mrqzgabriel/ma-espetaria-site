/* ==========================================================================
   M.A. Restaurante e Espetaria, comportamentos do site.
   Sem dependências externas.
   ========================================================================== */
(function () {
  'use strict';

  var cfg = window.MA_CONFIG || {};
  var zap = String(cfg.whatsapp || '').replace(/\D/g, '');
  var temZap = zap.length >= 12;
  var email = String(cfg.email || '').trim();
  var temEmail = email.indexOf('@') > 0;
  var tel = String(cfg.telefone || '').trim();
  var telLink = String(cfg.telefoneLink || '').trim();
  var temTel = tel.length > 0 && telLink.length > 0;
  var saudacao = cfg.saudacaoWhatsapp || 'Olá! Vim pelo site e gostaria de fazer um pedido.';

  function $(sel, escopo) { return (escopo || document).querySelector(sel); }
  function $$(sel, escopo) { return Array.prototype.slice.call((escopo || document).querySelectorAll(sel)); }
  function urlZap(texto) { return 'https://wa.me/' + zap + '?text=' + encodeURIComponent(texto); }
  function mostra(el) { if (el) { el.hidden = false; } }

  function formataZap(n) {
    var m = n.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
    return m ? '(' + m[1] + ') ' + m[2] + '-' + m[3] : '+' + n;
  }

  /* ------------------------------------------------------------- ano atual */
  $$('[data-ano]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ------------------------------------------- canais que estão ligados -- */
  if (temZap) {
    $$('[data-zap-link]').forEach(function (el) {
      el.setAttribute('href', urlZap(saudacao));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
      el.textContent = el.closest('.footer-contact') ? 'WhatsApp ' + formataZap(zap) : formataZap(zap);
      el.hidden = false;
    });
    mostra($('[data-item-zap]'));
  }

  if (temTel) {
    $$('[data-tel-link]').forEach(function (el) {
      el.setAttribute('href', 'tel:' + telLink);
      el.textContent = el.closest('.footer-contact') ? 'Telefone ' + tel : tel;
      el.hidden = false;
    });
    mostra($('[data-item-tel]'));
  }

  if (temEmail) {
    $$('[data-email-link]').forEach(function (el) {
      el.setAttribute('href', 'mailto:' + email);
      el.textContent = email;
      el.hidden = false;
    });
    mostra($('[data-item-email]'));
  }

  var rotulo = $('[data-submit-label]');
  var intro = $('.form-intro');
  var form = $('#form-contato');
  var blocoSemCanal = $('[data-sem-canal]');

  if (temZap) {
    $$('[data-contato-cta], [data-float-cta]').forEach(function (el) {
      el.setAttribute('href', urlZap(saudacao));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
    if (rotulo) { rotulo.textContent = 'Enviar pelo WhatsApp'; }
    if (intro) { intro.textContent = 'Preencha e a mensagem abre pronta no WhatsApp.'; }
  } else if (temEmail) {
    if (rotulo) { rotulo.textContent = 'Enviar pedido por e-mail'; }
    if (intro) { intro.textContent = 'Preencha e a mensagem abre pronta no seu aplicativo de e-mail.'; }
  } else {
    /* nenhum canal a distância: o formulário sai e entra o convite para
       pedir no balcão, com o endereço em destaque */
    if (form) { form.hidden = true; }
    mostra(blocoSemCanal);
    if (temTel) {
      $$('[data-contato-cta], [data-float-cta]').forEach(function (el) {
        el.setAttribute('href', 'tel:' + telLink);
      });
      var textoFlutuante = $('[data-float-cta] span');
      if (textoFlutuante) { textoFlutuante.textContent = 'Ligar agora'; }
    }
  }

  /* ----------------------------------------------------- cabeçalho e menu */
  var header = $('.site-header');
  var nav = $('#nav-principal');
  var toggle = $('.nav-toggle');
  var floatCta = $('[data-float-cta]');

  function fechaMenu() {
    if (!nav || !toggle) { return; }
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var aberto = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', fechaMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { fechaMenu(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 880) { fechaMenu(); } });
  }

  var ultimoScroll = -1;
  function aoRolar() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (y === ultimoScroll) { return; }
    ultimoScroll = y;
    if (header) { header.classList.toggle('is-scrolled', y > 12); }
    if (floatCta) { floatCta.classList.toggle('is-visible', y > 560); }
  }
  window.addEventListener('scroll', function () { window.requestAnimationFrame(aoRolar); }, { passive: true });
  aoRolar();

  /* ------------------------------------------------- animação de entrada */
  var alvos = $$('.reveal');
  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revelaTudo() {
    document.documentElement.classList.add('sem-animacao');
    alvos.forEach(function (el) { el.classList.add('is-in'); });
  }

  function revelaVisiveis() {
    var altura = window.innerHeight || 0;
    alvos.forEach(function (el) {
      if (el.classList.contains('is-in')) { return; }
      var r = el.getBoundingClientRect();
      if (r.top < altura && r.bottom > 0) { el.classList.add('is-in'); }
    });
  }

  /* Aba em segundo plano congela o IntersectionObserver e as transições do
     navegador. Nesse caso, e sem IntersectionObserver ou com movimento
     reduzido, o conteúdo aparece de uma vez, sem animação. */
  if (semMovimento || !('IntersectionObserver' in window) || document.visibilityState === 'hidden') {
    revelaTudo();
  } else {
    revelaVisiveis();

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) { return; }
        var el = entrada.target;
        var irmaos = el.parentElement ? $$('.reveal', el.parentElement) : [el];
        var atraso = Math.min(irmaos.indexOf(el), 5) * 70;
        setTimeout(function () { el.classList.add('is-in'); }, atraso);
        obs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    alvos.forEach(function (el) { obs.observe(el); });

    window.addEventListener('load', revelaVisiveis);
    window.addEventListener('hashchange', function () { setTimeout(revelaVisiveis, 500); });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') { revelaTudo(); }
    });
  }

  /* Link aberto direto numa seção: com a aba em segundo plano o navegador não
     executa o rolar suave, então a posição é ajustada na mão. */
  if (location.hash && location.hash.length > 1) {
    window.addEventListener('load', function () {
      var destino = null;
      try { destino = document.querySelector(location.hash); } catch (e) { destino = null; }
      if (destino && window.pageYOffset < 10) {
        destino.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    });
  }

  /* ------------------------------------------- seção ativa na navegação */
  var secoes = $$('main section[id]');
  var links = {};
  $$('.nav > a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });

  if (secoes.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        var link = links[entrada.target.id];
        if (!link) { return; }
        if (entrada.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secoes.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------------------ formulário */
  if (!form || form.hidden) { return; }

  var elStatus = $('[data-form-status]', form);

  function avisa(texto, tipo) {
    if (!elStatus) { return; }
    elStatus.textContent = texto;
    elStatus.className = 'form-status' + (tipo ? ' is-' + tipo : '');
  }

  function valido(campo) {
    var v = (campo.value || '').trim();
    if (campo.type === 'checkbox') { return campo.checked; }
    if (!v) { return !campo.required; }
    if (campo.type === 'email') { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
    if (campo.type === 'tel') { return v.replace(/\D/g, '').length >= 10; }
    return true;
  }

  $$('input, textarea', form).forEach(function (campo) {
    campo.addEventListener('input', function () { campo.removeAttribute('aria-invalid'); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var primeiroErro = null;
    $$('[required]', form).forEach(function (campo) {
      if (valido(campo)) {
        campo.removeAttribute('aria-invalid');
      } else {
        campo.setAttribute('aria-invalid', 'true');
        if (!primeiroErro) { primeiroErro = campo; }
      }
    });

    if (primeiroErro) {
      avisa(primeiroErro.id === 'aceite'
        ? 'Marque a autorização para podermos responder.'
        : 'Confira os campos destacados e tente de novo.', 'error');
      primeiroErro.focus();
      return;
    }

    var d = {
      nome: $('#nome', form).value.trim(),
      telefone: $('#telefone', form).value.trim(),
      tipo: $('#tipo', form).value,
      quando: $('#quando', form).value.trim(),
      mensagem: $('#mensagem', form).value.trim()
    };

    var linhas = [
      'Pedido pelo site',
      '',
      'Nome: ' + d.nome,
      'Telefone: ' + d.telefone,
      'Assunto: ' + d.tipo,
      'Para quando: ' + (d.quando || 'a combinar')
    ];
    if (d.mensagem) { linhas.push('', d.mensagem); }
    var corpo = linhas.join('\n');

    if (temZap) {
      window.open(urlZap(corpo), '_blank', 'noopener');
      avisa('Abrimos o WhatsApp com sua mensagem pronta. É só enviar.', 'ok');
    } else if (temEmail) {
      window.location.href = 'mailto:' + email +
        '?subject=' + encodeURIComponent('Pedido pelo site, ' + d.tipo + ', ' + d.nome) +
        '&body=' + encodeURIComponent(corpo);
      avisa('Abrimos seu aplicativo de e-mail com a mensagem pronta.', 'ok');
    }

    form.reset();
  });
})();
