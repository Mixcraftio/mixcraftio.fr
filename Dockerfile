FROM nginx:alpine

COPY . /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
COPY mime.types /etc/nginx/

EXPOSE 80