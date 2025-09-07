#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/create-agent.sh [name] [email] [description] [host]
# Example: ./scripts/create-agent.sh agent16 agent16@skinior.ai "Agent16 Skin Analysis" http://localhost:4008

NAME=${1:-agent}
EMAIL=${2:-agent@skinior.ai}
DESCRIPTION=${3:-Agent Skin Analysis System}
HOST=${4:-http://localhost:4008}

# Normalize host and ensure we call the API-prefixed route (/api)
# If the provided HOST already contains /api, use it as-is (trim trailing slash)
# Otherwise, append /api before the auth path.
if [[ "$HOST" == *"/api"* ]]; then
  HOST="${HOST%/}"
  API_URL="${HOST}/auth/agents"
else
  HOST="${HOST%/}"
  API_URL="${HOST}/api/auth/agents"
fi

RESP=$(curl -s -X POST "${API_URL}" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${NAME}\",\"email\":\"${EMAIL}\",\"description\":\"${DESCRIPTION}\"}")

# Print full response to stderr for debugging, but only apiKey to stdout
echo "$RESP" >&2

# Extract apiKey using node (no jq dependency required)
API_KEY=$(echo "$RESP" | node -e "const s=require('fs').readFileSync(0,'utf8'); try{const j=JSON.parse(s); if(j && j.data && j.data.apiKey) { console.log(j.data.apiKey); } else { process.exit(2); }} catch(e){ process.exit(3); }")

if [ $? -ne 0 ]; then
  echo "Failed to create agent or parse apiKey (see full response above)" >&2
  exit 1
fi

# Print only the API key
echo "$API_KEY"
