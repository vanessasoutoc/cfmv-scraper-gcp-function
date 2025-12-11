# CRMV Scraper - Google Cloud Function

Google Cloud Function em JavaScript para consulta de registros CRMV.

## CURL

curl --location 'http://localhost:8080/searchCRMV?crmvNumber=02655&state=mg'

## Deploy

### Pré-requisitos
```bash
# Instalar Google Cloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Habilitar APIs necessárias
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com

# Verificar projeto ativo
gcloud config get-value project

# Verificar conta ativa
gcloud config get-value account

# Habilitar Compute Engine API (necessária para service accounts)
gcloud services enable compute.googleapis.com

# Definir região padrão (opcional)
gcloud config set functions/region us-central1
```

### Deploy da função
```bash
npm run deploy
```

### Deploy manual
```bash
# Opção 1: Usar service account padrão
gcloud functions deploy searchCRMV \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --gen2 \
  --region=us-central1 \
  --memory 512MB \
  --timeout 60s

# Opção 2: Especificar service account
gcloud functions deploy searchCRMV \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --gen2 \
  --region=us-central1 \
  --service-account=PROJECT_ID-compute@developer.gserviceaccount.com \
  --memory 512MB \
  --timeout 60s
```

## Uso

### Endpoint
```
GET https://REGION-PROJECT_ID.cloudfunctions.net/searchCRMV?crmvNumber=02655&state=MG
```

### Parâmetros
- `crmvNumber`: Número do registro CRMV
- `state`: Estado (sigla)

### Resposta
```json
{
    "type": "sucess",
    "data": [
        {
            "id_pf_inscricao": 259054,
            "pf_inscricao": "02655",
            "pf_classe": "VP",
            "pf_uf": "MG",
            "nome": "CLAUDIO BARRETO",
            "nome_social": null,
            "atuante": true,
            "dt_inscricao": "1984-12-08T00:00:00+00:00",
            "cpf": "00000000000"
        },
        {
            "id_pf_inscricao": 274174,
            "pf_inscricao": "02655",
            "pf_classe": "ZP",
            "pf_uf": "MG",
            "nome": "RAFAELA KELLY SOUZA DOS SANTOS",
            "nome_social": null,
            "atuante": true,
            "dt_inscricao": "2022-06-20T00:00:00+00:00",
            "cpf": "00000000000"
        }
    ],
    "haveMoreThanLimitConsultaRegisters": false
}
```

## Desenvolvimento Local

```bash
npm install
npm start
```

Acesse: `http://localhost:8080`