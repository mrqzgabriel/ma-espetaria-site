# =============================================================================
# Site institucional do M.A. Restaurante e Espetaria
# Imagem única: nginx servindo arquivos estáticos.
# Método de construção no EasyPanel: Dockerfile. Porta do container: 80.
# =============================================================================
FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="Site M.A. Espetaria" \
      org.opencontainers.image.description="Site institucional do M.A. Restaurante e Espetaria" \
      org.opencontainers.image.vendor="Lucas Mendes Cabeleireiro LTDA"

ENV TZ=America/Sao_Paulo

# Configuração do servidor (cache, compressão, cabeçalhos de segurança, healthcheck)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Conteúdo do site
COPY site/ /usr/share/nginx/html/

# Remove o index padrão do nginx e valida a configuração ainda no build
RUN rm -f /usr/share/nginx/html/50x.html \
 && nginx -t

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=4s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
