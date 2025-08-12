# Scripts de Importação e Atualização de Ordens de Serviço

## Descrição

Este diretório contém scripts para importação e atualização de ordens de serviço no sistema Alsten.

## Scripts Disponíveis

### 1. importar_ordens.js

Script para importar ordens de serviço a partir de uma planilha Excel.

### 2. atualizar_campos_faltantes.js

Script para atualizar campos faltantes em ordens de serviço importadas da planilha. Este script corrige os seguintes campos:

- vendedor_id
- pagamento_id
- urgencia_id
- tipo_lacre_id
- tipo_limpeza_id
- tipo_transporte_id
- dias_pagamento_id
- tipo_analise_id

## Como Executar

1. Certifique-se de que o arquivo `.env` está configurado corretamente com as credenciais do banco de dados.

2. Para executar o script de atualização de campos faltantes:

```bash
node atualizar_campos_faltantes.js
```

3. Para executar o script de importação de ordens:

```bash
node importar_ordens.js
```

## Observações

- O script de atualização tenta mapear valores textuais para IDs nas tabelas de referência.
- Campos não encontrados serão preenchidos com valores padrão quando possível.
- O script gera um log detalhado das operações realizadas.
