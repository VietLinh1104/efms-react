npx @openapitools/openapi-generator-cli generate \
  -i doc/identity-api.json \
  -g typescript-axios \
  -o src/api/generated/identity \
  --additional-properties=useSingleRequestParameter=true

npx @openapitools/openapi-generator-cli generate \
  -i doc/core-api.json \
  -g typescript-axios \
  -o src/api/generated/core \
  --additional-properties=useSingleRequestParameter=true
