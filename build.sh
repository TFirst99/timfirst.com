GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

CONTENT_DIR="content/pages"
RESOURCES_DIR="content/resources"
OUTPUT_DIR="output"
TEMPLATE="template.html"

rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

echo "cleaned output"

cp -r "$RESOURCES_DIR" "$OUTPUT_DIR/"
cp "rss.xml" "$OUTPUT_DIR/"

echo "copied resources"

find "$CONTENT_DIR" -name "*.md" | while read -r md_file; do

filename=$(basename "$md_file" .md)
output_file="$OUTPUT_DIR/$filename.html"

pandoc "$md_file" \
    --from markdown+footnotes+smart \
    --to html5 \
    --template="$TEMPLATE" \
    --standalone \
    --toc=false \
    --output="$output_file"
done

echo "built pages"

echo "build successful"
