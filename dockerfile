FROM mcr.microsoft.com/playwright:v1.17.2-focal as build

# Install OpenJDK-8
RUN apt-get update && \
    apt-get install -y openjdk-8-jdk && \
    apt-get install -y ant && \
    apt-get clean;

# Fix certificate issues
RUN apt-get update && \
    apt-get install ca-certificates-java && \
    apt-get clean && \
    update-ca-certificates -f;

# Setup JAVA_HOME -- useful for docker commandline
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/
RUN export JAVA_HOME

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
RUN rm -rf test-results

FROM build as tests
ENTRYPOINT ["ci.sh"]
