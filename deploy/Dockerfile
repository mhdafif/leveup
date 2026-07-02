# Serves the prebuilt static site. Run `pnpm build` first, then build this image.
FROM nginx:alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ /var/www/levelup/

EXPOSE 80
