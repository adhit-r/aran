#!/bin/bash

# Start PocketBase with Aran configuration
echo "Starting PocketBase for Aran API Sentinel..."

# Create pb_data directory if it doesn't exist
mkdir -p pb_data

# Start PocketBase
./pb_data/pocketbase serve \
  --http="127.0.0.1:8090" \
  --dir="./pb_data" \
  --origins="http://localhost:9002,http://127.0.0.1:9002"

echo "PocketBase started at http://127.0.0.1:8090"
echo "Admin panel: http://127.0.0.1:8090/_/"
echo "API: http://127.0.0.1:8090/api/" 