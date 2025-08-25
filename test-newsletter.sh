#!/bin/bash

echo "🚀 Testando envio de newsletter..."

curl -X POST http://localhost:4321/api/send-newsletter \
  -H "Content-Type: application/json" \
  -d '{"slug": "001-primeira-edicao"}' \
  | jq .

echo ""
echo "✅ Teste concluído!"