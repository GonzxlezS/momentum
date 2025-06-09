#!/bin/bash

PUBLIC_DIR="public"
ASSETS_LIST_FILE="$PUBLIC_DIR/assetList.js"

# Generar lista de archivos
ASSETS_LIST=()

ASSETS_LIST+=("\"/index.html\"")
ASSETS_LIST+=("\"/manifest.json\"")

# emoji-picker-element
EMOJI_PICKER="https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js"
ASSETS_LIST+=("\"$EMOJI_PICKER\"")

# Carpetas a recorrer
DIRS=("css" "js" "icons" "screenshots")

# Recorrer carpetas y subcarpetas para obtener todos los archivos
for dir in "${DIRS[@]}"; do
  full_path="$PUBLIC_DIR/$dir"

  if [[ -d "$full_path" ]]; then
    while IFS= read -r -d '' file; do
      relative_path="/${file#$PUBLIC_DIR/}"
      ASSETS_LIST+=("\"$relative_path\"")
    done < <(find "$full_path" -type f -print0)
  fi
done

# Construir el contenido de la constante ASSETS
ASSETS_JS=$'const ASSETS = [\n\t'

ASSETS_JS+="$(printf "%s,\n\t" "${ASSETS_LIST[@]}")"
ASSETS_JS="${ASSETS_JS%,*}"

ASSETS_JS+=$'\n];'

echo "$ASSETS_JS" > $ASSETS_LIST_FILE