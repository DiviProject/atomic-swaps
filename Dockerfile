FROM diviproject/divi:prerelease

# Configure and Compile Bitcoin
RUN git clone https://github.com/bitcoin/bitcoin --depth 1

WORKDIR /app/bitcoin

RUN ./autogen.sh
RUN ./configure
RUN make

WORKDIR /app
