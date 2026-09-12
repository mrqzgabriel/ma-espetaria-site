/* ==========================================================================
   M.A. Restaurante e Espetaria, configuração de contato do site.
   Este é o ÚNICO arquivo que precisa ser editado para ligar os contatos.
   ========================================================================== */

window.MA_CONFIG = {

  /* WhatsApp do restaurante, somente dígitos, com 55 na frente.
     Exemplo: "5511998877665". */
  whatsapp: "",

  /* Telefone, como o cliente lê na tela. Exemplo: "(11) 5555-1234". */
  telefone: "",

  /* O mesmo telefone no formato de discagem. Exemplo: "+551155551234". */
  telefoneLink: "",

  /* E-mail de contato do restaurante. */
  email: "",

  /* Mensagem que já vem escrita quando alguém abre o WhatsApp pelos botões. */
  saudacaoWhatsapp: "Olá! Vim pelo site e gostaria de fazer um pedido."
};

/* Enquanto os três primeiros campos estiverem vazios, o site mostra apenas o
   endereço e convida a pessoa a pedir no balcão. Assim que um canal for
   preenchido, os botões e o formulário passam a usá-lo automaticamente. */
