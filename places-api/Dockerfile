FROM node:16-alpine3.12
LABEL maintainer="fernandocuevas@guadaltel.com"

# Instalación de paquetes
RUN apk --update add --no-cache tzdata \
    bash

# Timezone
ENV TZ=Europe/Madrid
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo "$TZ" > /etc/timezone

# Creación del usuario de la aplicación
RUN addgroup -g 9000 -S pelias && \
    adduser -u 9000 -S pelias -G pelias

# Directorio de trabajo
ENV WORK=/home/pelias
WORKDIR ${WORK}

# Copia de la aplicación y permisos de archivo
COPY . ${WORK}
RUN chown -R pelias:pelias ${WORK}/* && \
    chmod +x ${WORK}/bin/start

# Usuario de la aplicación
USER pelias

# Instalación de paquetes npm
RUN npm install

# start service
CMD [ "./bin/start" ]
