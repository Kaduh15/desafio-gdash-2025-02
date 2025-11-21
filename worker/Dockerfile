# dockerfile de uma script em golang que só executa main.go
FROM golang:1.25-alpine

WORKDIR /app

# instala as dependências do projeto
COPY go.mod .
COPY go.sum .
RUN go mod download

# copia o código fonte
COPY main.go .

# compila o código fonte
RUN go build -o main .

# comando para executar o binário
CMD ["./main"]