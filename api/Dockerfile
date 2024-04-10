# base image
FROM pelias/baseimage

# Where the app is built and run inside the docker fs
ENV WORK=/home/pelias
WORKDIR ${WORK}

COPY . ${WORK}
RUN chown pelias:pelias /home/pelias/* && \
    chmod +x /home/pelias/bin/units && \
    chmod +x /home/pelias/bin/start && \
    chmod +x /home/pelias/bin/generate-docs

USER pelias
# copy package.json first to prevent npm install being rerun when only code changes
COPY ./package.json ${WORK}
RUN npm install

# only allow containers to succeed if tests pass
# RUN npm test

# start service
CMD [ "./bin/start" ]
