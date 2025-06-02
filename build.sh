#!/bin/bash

# Build script for personal website
# Converts markdown files to HTML using pandoc

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directories
CONTENT_DIR="content/pages"
RESOURCES_DIR="content/resources"
OUTPUT_DIR="output"
TEMPLATE="template.html"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo -e "${RED}Error: pandoc is not installed. Please install pandoc first.${NC}"
    echo "Visit: https://pandoc.org/installing.html"
    exit 1
fi

# Check if template exists
if [ ! -f "$TEMPLATE" ]; then
    echo -e "${RED}Error: template.html not found in current directory${NC}"
    exit 1
fi

echo -e "${GREEN}Starting build process...${NC}"

# Copy resources directory to output
if [ -d "$RESOURCES_DIR" ]; then
    echo -e "${YELLOW}Copying resources...${NC}"
    cp -r "$RESOURCES_DIR" "$OUTPUT_DIR/"
    echo -e "${GREEN}✓ Resources copied${NC}"
else
    echo -e "${YELLOW}Warning: No resources directory found${NC}"
fi

# Copy RSS feed if it exists
if [ -f "rss.xml" ]; then
    cp "rss.xml" "$OUTPUT_DIR/"
    echo -e "${GREEN}✓ RSS feed copied${NC}"
fi

# Process all markdown files
echo -e "${YELLOW}Converting markdown files...${NC}"

if [ ! -d "$CONTENT_DIR" ]; then
    echo -e "${RED}Error: content/pages directory not found${NC}"
    exit 1
fi

# Find all .md files and convert them
find "$CONTENT_DIR" -name "*.md" | while read -r md_file; do
    # Get the filename without path and extension
    filename=$(basename "$md_file" .md)

    # Set output filename
    if [ "$filename" = "index" ]; then
        output_file="$OUTPUT_DIR/index.html"
    else
        output_file="$OUTPUT_DIR/$filename.html"
    fi

    # Convert markdown to HTML using pandoc
    pandoc "$md_file" \
        --from markdown+footnotes+smart \
        --to html5 \
        --template="$TEMPLATE" \
        --standalone \
        --toc=false \
        --output="$output_file"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Generated: $(basename "$output_file")${NC}"
    else
        echo -e "${RED}✗ Failed to generate: $(basename "$output_file")${NC}"
    fi
done

echo -e "${GREEN}Build complete!${NC}"
echo -e "${YELLOW}Output files are in the '$OUTPUT_DIR' directory${NC}"

# Optional: Generate a list of all articles for debugging
echo -e "\n${YELLOW}Generated pages:${NC}"
find "$OUTPUT_DIR" -name "*.html" -type f | sort | while read -r file; do
    echo "  - $(basename "$file")"
done
