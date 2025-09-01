#!/bin/bash

# Google FX Images Optimization Script
# Optimizes all downloaded images for web use with SEO-friendly names and WebP conversion

echo "🚀 Optimizing Google FX Images for Website Integration"
echo "====================================================="

# Check if required tools are available
check_dependencies() {
    echo "🔍 Checking dependencies..."
    
    if ! command -v cwebp &> /dev/null; then
        echo "❌ cwebp not found. Installing via brew..."
        brew install webp || {
            echo "❌ Failed to install webp. Please install it manually:"
            echo "   brew install webp"
            exit 1
        }
    fi
    
    if ! command -v jpegoptim &> /dev/null; then
        echo "📦 Installing jpegoptim for JPEG optimization..."
        brew install jpegoptim || echo "⚠️  jpegoptim not available, continuing without JPEG optimization"
    fi
    
    if ! command -v pngquant &> /dev/null; then
        echo "📦 Installing pngquant for PNG optimization..."
        brew install pngquant || echo "⚠️  pngquant not available, continuing without PNG optimization"
    fi
    
    echo "✅ Dependencies checked"
}

# Create optimized directory structure
setup_directories() {
    echo "📁 Setting up directory structure..."
    
    # Create optimized images directory
    mkdir -p public/assets/optimized-fx
    mkdir -p public/assets/optimized-fx/webp
    mkdir -p public/assets/digestive-anatomy/webp
    mkdir -p public/assets/health-education/webp
    mkdir -p public/assets/testimonials/webp
    mkdir -p public/assets/products/webp
    
    echo "✅ Directories created"
}

# Optimize a single image with multiple format outputs
optimize_image() {
    local input_file="$1"
    local output_name="$2"
    local category="$3"
    local description="$4"
    
    echo "🖼️  Optimizing: $(basename "$input_file")"
    
    local base_output_dir="public/assets/${category}"
    local webp_output_dir="${base_output_dir}/webp"
    
    # Ensure directories exist
    mkdir -p "$base_output_dir" "$webp_output_dir"
    
    # Define output paths
    local jpg_output="${base_output_dir}/${output_name}.jpg"
    local webp_output="${webp_output_dir}/${output_name}.webp"
    
    # Copy and optimize original JPEG
    if [[ "$input_file" == *.jpg ]] || [[ "$input_file" == *.jpeg ]]; then
        cp "$input_file" "$jpg_output"
        
        # Optimize JPEG if jpegoptim is available
        if command -v jpegoptim &> /dev/null; then
            jpegoptim --size=500k --strip-all "$jpg_output" 2>/dev/null || echo "   ⚠️  JPEG optimization skipped"
        fi
        
    else
        # Convert to JPEG first
        convert "$input_file" -quality 85 -strip "$jpg_output" 2>/dev/null || {
            echo "   ❌ Failed to convert to JPEG, copying original"
            cp "$input_file" "$jpg_output"
        }
    fi
    
    # Create WebP version
    if command -v cwebp &> /dev/null; then
        cwebp -q 85 -m 6 "$input_file" -o "$webp_output" &>/dev/null || {
            echo "   ❌ WebP conversion failed"
            return 1
        }
    else
        echo "   ❌ cwebp not available, skipping WebP conversion"
        return 1
    fi
    
    # Get file sizes
    local original_size=$(du -h "$input_file" | cut -f1)
    local jpg_size=$(du -h "$jpg_output" | cut -f1)
    local webp_size=$(du -h "$webp_output" | cut -f1)
    
    echo "   📊 Sizes: Original($original_size) → JPEG($jpg_size) → WebP($webp_size)"
    echo "   📝 Description: $description"
    echo "   ✅ Saved: $output_name.jpg and $output_name.webp"
    
    return 0
}

# Main optimization function
optimize_all_images() {
    echo "🔄 Processing all Google FX images..."
    
    local downloads_base="downloads"
    local optimized_count=0
    local failed_count=0
    
    # Process images from google-fx-quick-max (our best collection)
    if [ -d "${downloads_base}/google-fx-quick-max" ]; then
        echo "📂 Processing quick-max collection..."
        
        # Define specific mappings for high-value images
        declare -A image_mappings
        image_mappings["quick-fx-002-base64-1408x768.jpg"]="complete-digestive-system-anatomy-illustration|digestive-anatomy|Complete human digestive system anatomy illustration with labeled organs for fiber supplement education"
        image_mappings["quick-fx-003-base64-1408x768.jpg"]="gut-microbiome-beneficial-bacteria-illustration|health-education|Professional medical illustration showing gut microbiome and beneficial bacteria for digestive health"
        image_mappings["quick-fx-004-base64-1408x768.jpg"]="professional-supplement-education-digestive-health|testimonials|Professional healthcare supplement education illustration for medical testimonials"
        image_mappings["quick-fx-005-base64-1408x768.jpg"]="fiber-supplement-benefits-digestive-wellness|products|Fiber supplement benefits and digestive wellness educational illustration"
        image_mappings["quick-fx-006-base64-1408x768.jpg"]="digestive-health-microbiome-fiber-interaction|health-education|Digestive health illustration showing microbiome and fiber interaction for supplement benefits"
        image_mappings["quick-fx-007-base64-1408x768.jpg"]="gut-health-bacteria-probiotic-illustration|health-education|Gut health and beneficial bacteria illustration for probiotic and fiber supplement education"
        image_mappings["quick-fx-008-base64-1408x768.jpg"]="digestive-system-fiber-absorption-process|digestive-anatomy|Digestive system illustration showing fiber absorption and processing for supplement education"
        image_mappings["quick-fx-009-base64-1408x768.jpg"]="intestinal-health-fiber-benefits-illustration|products|Intestinal health and fiber benefits illustration for supplement product pages"
        image_mappings["quick-fx-010-base64-1408x768.jpg"]="digestive-wellness-supplement-science|health-education|Digestive wellness and supplement science illustration for educational content"
        
        for file in "${downloads_base}/google-fx-quick-max"/*.jpg; do
            if [ -f "$file" ]; then
                local filename=$(basename "$file")
                
                if [[ -n "${image_mappings[$filename]}" ]]; then
                    IFS='|' read -r output_name category description <<< "${image_mappings[$filename]}"
                    
                    if optimize_image "$file" "$output_name" "$category" "$description"; then
                        ((optimized_count++))
                    else
                        ((failed_count++))
                    fi
                else
                    # Generic optimization for unmapped images
                    local generic_name="fx-health-illustration-$(printf "%03d" $optimized_count)"
                    if optimize_image "$file" "$generic_name" "optimized-fx" "Health and wellness illustration for fiber supplement content"; then
                        ((optimized_count++))
                    else
                        ((failed_count++))
                    fi
                fi
            fi
        done
    fi
    
    # Process images from other collections as backup/additional content
    for collection in "google-fx-base64" "google-fx-all-images"; do
        if [ -d "${downloads_base}/${collection}" ] && [ $optimized_count -lt 20 ]; then
            echo "📂 Processing additional images from ${collection}..."
            
            local count=0
            for file in "${downloads_base}/${collection}"/*.jpg; do
                if [ -f "$file" ] && [ $count -lt 5 ]; then
                    local generic_name="fx-additional-$(basename "$collection")-$(printf "%03d" $count)"
                    if optimize_image "$file" "$generic_name" "optimized-fx" "Additional health illustration from Google FX library"; then
                        ((optimized_count++))
                        ((count++))
                    else
                        ((failed_count++))
                    fi
                fi
            done
        fi
    done
    
    echo ""
    echo "📊 Optimization Summary:"
    echo "   ✅ Successfully optimized: $optimized_count images"
    echo "   ❌ Failed to optimize: $failed_count images"
    echo "   📁 Output directories:"
    echo "      - public/assets/digestive-anatomy/"
    echo "      - public/assets/health-education/"
    echo "      - public/assets/testimonials/"
    echo "      - public/assets/products/"
    echo "      - public/assets/optimized-fx/"
}

# Generate integration manifest
generate_manifest() {
    echo "📋 Generating integration manifest..."
    
    local manifest_file="google-fx-images-manifest.json"
    
    cat > "$manifest_file" << 'EOF'
{
  "generated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "description": "Google FX Images Integration Manifest",
  "images": {
    "digestive-anatomy": {
      "complete-digestive-system-anatomy-illustration": {
        "jpg": "/assets/digestive-anatomy/complete-digestive-system-anatomy-illustration.jpg",
        "webp": "/assets/digestive-anatomy/webp/complete-digestive-system-anatomy-illustration.webp",
        "alt": "Complete human digestive system anatomy illustration showing stomach, intestines, liver and digestive organs for fiber supplement education",
        "usage": ["Benefits page hero", "Product education sections"],
        "dimensions": "1408x768",
        "seo_keywords": ["digestive system", "anatomy", "fiber supplement", "gut health", "digestive organs"]
      }
    },
    "health-education": {
      "gut-microbiome-beneficial-bacteria-illustration": {
        "jpg": "/assets/health-education/gut-microbiome-beneficial-bacteria-illustration.jpg",
        "webp": "/assets/health-education/webp/gut-microbiome-beneficial-bacteria-illustration.webp",
        "alt": "Professional medical illustration showing gut microbiome and beneficial bacteria for digestive health education",
        "usage": ["Ingredient science pages", "Educational content"],
        "dimensions": "1408x768",
        "seo_keywords": ["gut microbiome", "beneficial bacteria", "digestive health", "probiotic", "fiber benefits"]
      }
    },
    "testimonials": {
      "professional-supplement-education-digestive-health": {
        "jpg": "/assets/testimonials/professional-supplement-education-digestive-health.jpg",
        "webp": "/assets/testimonials/webp/professional-supplement-education-digestive-health.webp",
        "alt": "Professional healthcare supplement education illustration for medical testimonials and expert recommendations",
        "usage": ["Professional testimonials", "Expert recommendations"],
        "dimensions": "1408x768",
        "seo_keywords": ["professional healthcare", "supplement education", "medical testimonial", "expert recommendation"]
      }
    }
  },
  "integration_plan": {
    "priority_1": {
      "file": "src/components/pages/ProductEssentialPlus.tsx",
      "line": 563,
      "action": "Replace placeholder testimonial avatar",
      "current": "src=\"/placeholder.svg\"",
      "new": "src=\"/assets/testimonials/webp/professional-supplement-education-digestive-health.webp\""
    },
    "priority_2": {
      "file": "src/components/pages/Benefits.tsx",
      "action": "Add digestive anatomy hero image",
      "new_component": "OptimizedImage with digestive anatomy illustration"
    }
  },
  "seo_optimization": {
    "file_naming": "kebab-case with descriptive keywords",
    "alt_tags": "Descriptive, keyword-rich, under 150 characters",
    "webp_fallback": "JPEG fallback for all WebP images",
    "responsive": "Multiple sizes and responsive loading",
    "lazy_loading": "Implemented via Next.js Image component"
  }
}
EOF
    
    # Replace the date placeholder
    sed -i '' "s/\$(date -u +\"%Y-%m-%dT%H:%M:%SZ\")/$(date -u +"%Y-%m-%dT%H:%M:%SZ")/g" "$manifest_file"
    
    echo "✅ Manifest saved: $manifest_file"
}

# Run pre-integration tests
run_tests() {
    echo "🧪 Running pre-integration tests..."
    
    # Test current build
    echo "   🔨 Testing current build..."
    if npm run build &>/dev/null; then
        echo "   ✅ Build test passed"
    else
        echo "   ❌ Build test failed - fix issues before integration"
        return 1
    fi
    
    # Test linting
    echo "   📝 Testing linting..."
    if npm run lint &>/dev/null; then
        echo "   ✅ Lint test passed"
    else
        echo "   ⚠️  Lint warnings found - review before integration"
    fi
    
    echo "✅ Pre-integration tests complete"
}

# Main execution
main() {
    echo "Starting Google FX Images optimization process..."
    echo "Current directory: $(pwd)"
    
    check_dependencies
    setup_directories
    optimize_all_images
    generate_manifest
    run_tests
    
    echo ""
    echo "🎉 OPTIMIZATION COMPLETE!"
    echo "================================"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Review optimized images in public/assets/ directories"
    echo "2. Check google-fx-images-manifest.json for integration details"
    echo "3. Test individual image loading"
    echo "4. Integrate images into React components"
    echo "5. Run full site tests"
    echo ""
    echo "💡 Integration Commands:"
    echo "   # Test optimized images"
    echo "   open public/assets/digestive-anatomy/"
    echo "   "
    echo "   # Run site tests"
    echo "   npm run test"
    echo "   npm run build"
    echo ""
}

# Execute main function
main "$@"