FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/mixcraftio.fr
COPY mixcraftio.fr.conf /etc/nginx/conf.d/

EXPOSE 80