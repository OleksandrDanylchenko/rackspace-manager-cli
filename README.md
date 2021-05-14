# rackspace-manager-cli

### Node.js CLI application, which adds "Access-Control-Allow-Origin: *" header for files, which located on Rackspace Cloud Storage

Use this command to access token: 

```console
curl -s -X POST https://identity.api.rackspacecloud.com/v2.0/tokens \
    -H "Content-Type: application/json" \
    -d '{
    "auth": {
    "RAX-KSKEY:apiKeyCredentials": {
    "username": "OlexanderD",
    "apiKey": "723d4e534193424f97fb33cebcc6d047"
} } }' | python3 -m json.tool
```
