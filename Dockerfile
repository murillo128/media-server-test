FROM ubuntu:16.04

ENV DEBIAN_FRONTEND noninteractive
ENV HOME=/home/app
WORKDIR $HOME/scp
COPY . /home/app/scp

# Dockerfile based on https://github.com/nodejs/docker-node/blob/master/6.4/slim/Dockerfile

# gpg keys listed at https://github.com/nodejs/node
RUN set -ex \
  && for key in \
    9554F04D7259F04124DE6B476D5A82AC7E37093B \
    94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
    0034A06D9D9B0064CE8ADF6BF1747F4AD2306D93 \
    FD3A5288F042B6850C66B31F09FE44734EB7990E \
    71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
    DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
    B9AE9905FFD7803F25714661B63B535A4C206CA9 \
    C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
  ; do \
    gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key"; \
  done

ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 6.10.0

RUN buildDeps='xz-utils curl ca-certificates' \
    && set -x \
    && apt-get update && apt-get install -y $buildDeps --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
    && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
    && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
    && grep " node-v$NODE_VERSION-linux-x64.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
    && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
    && rm "node-v$NODE_VERSION-linux-x64.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \
    && apt-get purge -y --auto-remove $buildDeps

RUN echo $(node --version)
RUN echo $(npm --version)

RUN apt-get update
RUN apt-get -qq update

RUN apt-get install -y build-essential
RUN apt install -y git
RUN apt-get install -y curl
RUN apt-get install -y python python-dev python-setuptools

RUN npm install -g yarnpkg

RUN npm install -g concurrently
RUN npm install -g react-scripts

EXPOSE 3000
EXPOSE 8080
EXPOSE 8443

ENTRYPOINT npm install && npm run build && npm start

#
RUN apt-get install -y software-properties-common
RUN apt-get install -y python-software-properties

## Node.js app Docker file
#
#FROM ubuntu:16.04
#
#ENV DEBIAN_FRONTEND noninteractive
#

#
#RUN apt-get install build-essential --assume-yes
#RUN apt install git --assume-yes
#RUN apt-get install curl --assume-yes
#
#RUN apt-get install -y python python-dev python-setuptools
#
#RUN curl -sL https://deb.nodesource.com/setup_7.x | bash -
#RUN apt-get install -y nodejs
#
#
#RUN npm install -g yarnpkg
## TODO could uninstall some build dependencies
#
## fucking debian installs `node` as `nodejs`
#RUN update-alternatives --install /usr/bin/node node /usr/bin/nodejs 6
#RUN apt-get install -y npm
#RUN apt-get install -y software-properties-common
#RUN apt-get install -y python-software-properties
#
#RUN add-apt-repository ppa:ubuntu-toolchain-r/test
#RUN apt-get update
#RUN apt-get install gcc-6 g++-6 --assume-yes
#RUN update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-6 1 --slave /usr/bin/g++ g++ /usr/bin/g++-6
#
#RUN echo $(gcc --version)
#RUN echo $(g++ --version)
#
#VOLUME ["/data"]
#
#ADD . /data
#RUN cd /data && npm install
#
#EXPOSE 3000
#EXPOSE 8080
#EXPOSE 8443
#
#WORKDIR /data
#
#CMD ["yarn", "start"]