FROM debian:latest

RUN apt-get update && apt-get install -y \
  git \
  ninja-build \
  gettext \
  cmake \
  unzip \
  curl \
  build-essential \
  && apt-get clean

RUN git clone https://github.com/neovim/neovim.git /tmp/neovim && \
  cd /tmp/neovim && \
  git checkout stable && \
  make CMAKE_BUILD_TYPE=RelWithDebInfo && \
  make install

RUN ln -s /usr/local/bin/nvim /usr/local/bin/vim
