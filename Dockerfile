FROM golang:latest

WORKDIR /app
COPY . .

RUN curl https://glide.sh/get | sh
RUN glide install

CMD ["bash"]
