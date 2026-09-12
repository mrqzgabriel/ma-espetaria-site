# Site M.A. Restaurante e Espetaria

Site institucional do **M.A. Restaurante e Espetaria** (Rua João Meimberg, 254, letra B,
Jardim São Luís, São Paulo/SP), pronto para deploy no EasyPanel pelo método
**Dockerfile**.

Site estático, sem banco de dados e sem build step. O container sobe com nginx
servindo a pasta `site/`.

Endereço no ar: **https://restauranteeespetaria.online**

---

## Estrutura

```
ma-espetaria/
├── Dockerfile            # imagem nginx, porta 80
├── nginx.conf            # cache, gzip, cabeçalhos de segurança, healthcheck
├── docker-compose.yml    # apenas para testar na sua máquina
├── trocar-dominio.sh     # troca o domínio em todos os arquivos de uma vez
└── site/
    ├── index.html        # página principal
    ├── privacidade.html  # política de privacidade (LGPD)
    ├── 404.html
    ├── styles.css
    ├── script.js         # menu, animações, formulário
    ├── config.js         # >>> contatos do site, único arquivo a editar <<<
    ├── favicon.svg
    ├── apple-touch-icon.png
    ├── og-image.png
    ├── manifest.webmanifest
    ├── robots.txt
    └── sitemap.xml
```

---

## O que falta preencher, e por quê

**Nenhum canal de contato do restaurante foi confirmado.** No cadastro da Receita
constam o e-mail `contato@contev.com.br` e os telefones (11) 6565-1781 e
(11) 4956-4480, que são do escritório de contabilidade, não do restaurante: o
primeiro número nem segue o padrão de telefone fixo de São Paulo e o segundo é da
região do ABC. Publicar isso no site mandaria cliente ligar para o contador, então
deixei de fora.

Por causa disso, o site nasceu com um comportamento próprio: enquanto não houver
canal configurado, **o formulário some e no lugar dele aparece o convite para pedir
no balcão, com o endereço em destaque**. Os itens vazios de WhatsApp, telefone e
e-mail também não aparecem na lista de contatos.

Assim que houver o número, basta preencher `site/config.js`:

```js
window.MA_CONFIG = {
  whatsapp: "",        // ex.: "5511998877665" (só dígitos, com o 55)
  telefone: "",        // ex.: "(11) 5555-1234"
  telefoneLink: "",    // ex.: "+551155551234"
  email: "",
  saudacaoWhatsapp: "..."
};
```

Preenchendo o WhatsApp, tudo liga sozinho: o item entra na lista de contatos com o
número formatado, os botões passam a abrir a conversa e o formulário volta,
montando a mensagem do pedido. Isso já foi testado.

---

## Conteúdo

Os textos cobrem o que a atividade registrada permite: restaurante, espetaria, bar
com bebidas, lanchonete e **fornecimento de refeições para empresas**, que é um CNAE
secundário e virou uma seção própria, já que é o serviço com maior valor por cliente.

**Não há cardápio com itens fixos, preço nem horário de funcionamento**, porque nada
disso foi confirmado com a cliente. O site orienta a perguntar o cardápio do dia. Se
a dona passar a tabela e os horários, dá para incluir.

Também não há fotos. Quando houver fotos dos espetinhos e do salão, elas entram na
seção "O que servimos" e no lugar da ilustração do topo.

---

## Testar na sua máquina

```bash
docker compose up --build     # abre em http://localhost:8080
```

Sem Docker:

```bash
cd site && python3 -m http.server 8896
```

---

## Deploy no EasyPanel

Painel `allwinmachine.tech`, projeto **sites**, serviço **ma-espetaria**:

- **Source**: Github, repositório `mrqzgabriel/ma-espetaria-site`, branch `main`
- **Build**: método **Dockerfile**, arquivo `Dockerfile`
- **Domains**: `restauranteeespetaria.online` e `www.restauranteeespetaria.online`, porta 80, HTTPS ligado

Para publicar uma alteração: commit, push na `main` e **Implantar** no EasyPanel.

O DNS está na Hostinger, com o registro A apontando para o servidor do EasyPanel.

---

## Detalhes técnicos

- **Imagem**: `nginx:1.27-alpine`, porta 80, healthcheck em `/healthz`.
- **Cache**: HTML sempre revalidado, CSS e JS por 7 dias, imagens por 30 dias. Ao
  editar CSS ou JS, suba o número em `styles.css?v=1` nas três páginas.
- **Segurança**: cabeçalhos de proteção e `Content-Security-Policy` restritiva.
- **Fontes**: Bitter e Karla, do Google Fonts.
- **Acessibilidade**: navegação por teclado, foco visível, contraste conferido e
  respeito a `prefers-reduced-motion`. Sem JavaScript, o conteúdo aparece igual.
