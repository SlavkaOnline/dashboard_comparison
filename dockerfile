FROM mcr.microsoft.com/playwright:v1.17.2-focal as build

WORKDIR /app

COPY *.json ./
RUN npm install

COPY . ./

ARG HOST
ARG EMAIL
ARG PASSWORD

RUN HOST=${HOST}
RUN EMAIL=${EMAIL}
RUN PASSWORD=${PASSWORD}

RUN npm run pretest
RUN npm run update-snapshots

FROM build as tests
ENTRYPOINT ["npm", "run", "test"]
