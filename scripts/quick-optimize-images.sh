#!/bin/bash

# Quick Google FX Images Optimization - Simple and Fast
echo "⚡ Quick Google FX Images Optimization"
echo "====================================="

# Create directories
echo "📁 Creating directories..."
mkdir -p public/assets/digestive-anatomy/webp
mkdir -p public/assets/health-education/webp  
mkdir -p public/assets/testimonials/webp

# Function to optimize single image
optimize_image() {
    local input="$1"
    local output_name="$2"
    local category="$3"
    
    echo "🖼️  Processing: $(basename "$input") → $output_name"
    
    # Create JPEG version
    cp "$input" "public/assets/$category/$output_name.jpg"
    
    # Create WebP version if cwebp is available
    if command -v cwebp &> /dev/null; then
        cwebp -q 85 "$input" -o "public/assets/$category/webp/$output_name.webp" &>/dev/null
        echo "   ✅ Created: $output_name.jpg and $output_name.webp"
    else
        echo "   ✅ Created: $output_name.jpg (WebP skipped - cwebp not available)"
    fi
}

# Process key images
echo "🔄 Processing key images..."

if [ -f "downloads/google-fx-quick-max/quick-fx-002-base64-1408x768.jpg" ]; then
    optimize_image "downloads/google-fx-quick-max/quick-fx-002-base64-1408x768.jpg" "complete-digestive-system-anatomy-illustration" "digestive-anatomy"
fi

if [ -f "downloads/google-fx-quick-max/quick-fx-003-base64-1408x768.jpg" ]; then
    optimize_image "downloads/google-fx-quick-max/quick-fx-003-base64-1408x768.jpg" "gut-microbiome-beneficial-bacteria-illustration" "health-education"
fi

if [ -f "downloads/google-fx-quick-max/quick-fx-004-base64-1408x768.jpg" ]; then
    optimize_image "downloads/google-fx-quick-max/quick-fx-004-base64-1408x768.jpg" "professional-supplement-education-digestive-health" "testimonials"
fi

if [ -f "downloads/google-fx-quick-max/quick-fx-005-base64-1408x768.jpg" ]; then
    optimize_image "downloads/google-fx-quick-max/quick-fx-005-base64-1408x768.jpg" "fiber-supplement-benefits-digestive-wellness" "health-education"
fi

if [ -f "downloads/google-fx-quick-max/quick-fx-006-base64-1408x768.jpg" ]; then
    optimize_image "downloads/google-fx-quick-max/quick-fx-006-base64-1408x768.jpg" "digestive-health-microbiome-fiber-interaction" "health-education"
fi

# Test current build
echo "🧪 Testing current build..."
if pnpm build &>/dev/null; then
    echo "✅ Build test passed"
else
    echo "❌ Build test failed"
fi

echo ""
echo "🎉 QUICK OPTIMIZATION COMPLETE!"
echo "================================"
echo ""
echo "📊 Results:"
ls -la public/assets/digestive-anatomy/ 2>/dev/null | grep -v "^d" | wc -l | xargs echo "   Digestive anatomy images:"
ls -la public/assets/health-education/ 2>/dev/null | grep -v "^d" | wc -l | xargs echo "   Health education images:"  
ls -la public/assets/testimonials/ 2>/dev/null | grep -v "^d" | wc -l | xargs echo "   Testimonial images:"

echo ""
echo "📋 Integration Ready!"
echo "Next: Update React components with optimized images"