# Deploy com Docker

## Build e execução local

```bash
# Build da imagem
npm run docker:build

# Executar container
npm run docker:run
```

## Usando docker-compose

```bash
# Build e execução
docker-compose up --build

# Execução em background
docker-compose up -d

# Parar serviços
docker-compose down
```

## Deploy em servidor

### 1. Build da imagem
```bash
docker build -t crmv-function .
```

### 2. Executar no servidor
```bash
docker run -d -p 8080:8080 --name crmv-function --restart unless-stopped crmv-function
```

### 3. Com docker-compose no servidor
```bash
docker-compose up -d
```

## Endpoints

- **Local**: `http://localhost:8080`
- **Teste**: `http://localhost:8080?crmvNumber=02655&state=MG`

## Logs

```bash
# Ver logs do container
docker logs crmv-function

# Seguir logs em tempo real
docker logs -f crmv-function
```