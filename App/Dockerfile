FROM node:alpine3.24 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:stable-alpine3.24-slim

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

RUN printf '#!/bin/sh\necho "Frontend running at http://localhost:8080"\nnginx -g "daemon off;"\n' > /entrypoint.sh && chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]


