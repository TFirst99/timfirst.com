#!/bin/bash

# Configuration
CONTENT_DIR="content"
ASSETS_DIR="assets"
OUTPUT_DIR="output"
TEMPLATE="template.html"

# Download and setup pandoc if not available
if ! command -v pandoc &> /dev/null; then
    echo "Downloading pandoc..."
    mkdir -p bin
    wget -q https://github.com/jgm/pandoc/releases/download/3.7.0.2/pandoc-3.7.0.2-linux-amd64.tar.gz
    tar -xzf pandoc-3.7.0.2-linux-amd64.tar.gz
    cp pandoc-3.7.0.2/bin/pandoc ./bin/
    chmod +x ./bin/pandoc
    rm -rf pandoc-3.7.0.2*
    export PATH="./bin:$PATH"
    echo "Pandoc installed"
fi

# Clean and prepare output directory
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Copy static assets
cp -r "$ASSETS_DIR" "$OUTPUT_DIR/"

echo "Copied static assets"

# Build pages from markdown
find "$CONTENT_DIR" -name "*.md" | while read -r md_file; do
    filename=$(basename "$md_file" .md)

    if [ "$filename" = "index" ]; then
        # Homepage stays at root
        output_file="$OUTPUT_DIR/index.html"
    else
        # Create directory structure for clean URLs
        mkdir -p "$OUTPUT_DIR/$filename"
        output_file="$OUTPUT_DIR/$filename/index.html"
    fi

    pandoc "$md_file" \
        --template="$TEMPLATE" \
        --from markdown+smart \
        --to html5 \
        --standalone \
        --toc=false \
        --lua-filter=scripts/images.lua \
        --output="$output_file"
done

echo "Built pages"

# Generate RSS feed
python3 scripts/generate_rss.py
echo "Generated RSS"

echo "Build completed successfully"