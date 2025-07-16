#!/bin/bash

# Image optimization script - Convert PNG images to WebP format
# This script converts all PNG images in public/assets/ and public/lovable-uploads/ to WebP format

echo "🖼️  Starting image conversion to WebP format..."

# Create WebP directories if they don't exist
mkdir -p public/assets/webp
mkdir -p public/lovable-uploads/webp

# Function to convert PNG to WebP
convert_to_webp() {
    local input_file="$1"
    local output_dir="$2"
    local filename=$(basename "$input_file" .png)
    local output_file="$output_dir/${filename}.webp"
    
    # Get original file size
    local original_size=$(stat -f%z "$input_file")
    
    # Convert to WebP with high quality (90%)
    cwebp -q 90 "$input_file" -o "$output_file" >/dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        # Get new file size
        local new_size=$(stat -f%z "$output_file")
        local reduction=$(( (original_size - new_size) * 100 / original_size ))
        
        echo "✅ Converted: $(basename "$input_file") -> $(basename "$output_file")"
        echo "   Size: $(numfmt --to=iec $original_size) -> $(numfmt --to=iec $new_size) (${reduction}% reduction)"
    else
        echo "❌ Failed to convert: $(basename "$input_file")"
    fi
}

# Convert ingredient images
echo "📦 Converting ingredient images in public/assets/..."
total_original=0
total_converted=0

for png_file in public/assets/*.png; do
    if [ -f "$png_file" ]; then
        original_size=$(stat -f%z "$png_file")
        total_original=$((total_original + original_size))
        
        convert_to_webp "$png_file" "public/assets/webp"
        
        webp_file="public/assets/webp/$(basename "$png_file" .png).webp"
        if [ -f "$webp_file" ]; then
            converted_size=$(stat -f%z "$webp_file")
            total_converted=$((total_converted + converted_size))
        fi
    fi
done

# Convert product images
echo "🛍️  Converting product images in public/lovable-uploads/..."
for png_file in public/lovable-uploads/*.png; do
    if [ -f "$png_file" ]; then
        original_size=$(stat -f%z "$png_file")
        total_original=$((total_original + original_size))
        
        convert_to_webp "$png_file" "public/lovable-uploads/webp"
        
        webp_file="public/lovable-uploads/webp/$(basename "$png_file" .png).webp"
        if [ -f "$webp_file" ]; then
            converted_size=$(stat -f%z "$webp_file")
            total_converted=$((total_converted + converted_size))
        fi
    fi
done

# Calculate total savings
if [ $total_original -gt 0 ]; then
    total_reduction=$(( (total_original - total_converted) * 100 / total_original ))
    echo ""
    echo "📊 CONVERSION SUMMARY:"
    echo "   Original total: $(numfmt --to=iec $total_original)"
    echo "   Converted total: $(numfmt --to=iec $total_converted)"
    echo "   Total reduction: ${total_reduction}%"
    echo "   Bytes saved: $(numfmt --to=iec $((total_original - total_converted)))"
fi

echo ""
echo "🎉 Image conversion complete!"
echo "💡 Next steps:"
echo "   1. Update image references in components to use WebP versions"
echo "   2. Add fallback support for older browsers"
echo "   3. Consider removing original PNG files after verification"