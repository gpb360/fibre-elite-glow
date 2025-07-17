#!/bin/bash

# Script to optimize images in ingredient pages
# Converts <img> tags to Next.js Image components and updates paths to WebP

echo "🔧 Optimizing ingredient page images..."

# Define the ingredient pages and their corresponding image files
declare -A ingredient_images=(
    ["FreshCabbageExtract.tsx"]="16x9_a_close_up_shot_of_cabbage"
    ["AcaiBerry.tsx"]="16x9_A_cluster_of_acai_berries"
    ["BetaGlucanOatBran.tsx"]="16x9_A_pile_of_oats_and_oat_straws_ar"
    ["SolubleCornFiber.tsx"]="16x9_A_close_up_of_a_corn_plant_with_"
    ["AppleFiber.tsx"]="16x9_apple_fibre"
    ["NutrientRichCarrot.tsx"]="16x9_a_plump_organic_carrot_with_inte"
    ["FreshSpinachPowder.tsx"]="16x9_a_bowl_filled_with_green_spinach"
    ["HydratingCelery.tsx"]="16x9_a_celery_plant_with_vibrant_gree"
    ["SoothingAloeVeraPowder.tsx"]="16x9_a_close_up_shot_of_aleo"
    ["SustainablePalmFiber.tsx"]="16x9_A_photorealistic_palme-oil"
    ["Raspberry.tsx"]="16x9_A_close_up_shot_of_a_cluster_of_"
    ["PrebioticPowerhouse.tsx"]="16x9_a_prebiotic-powerhouse"
    ["EnzymeRichPapaya.tsx"]="16x9_a_close_up_shot_of_a_papaya_frui"
    ["DigestiveAidGuarGum.tsx"]="16x9_A_close_up_shot_of_guar_gum"
    ["AntioxidantParsley.tsx"]="16x9_A_vibrant_cluster_of_fresh_parsl"
    ["Cranberry.tsx"]="16x9_a_close_up_shot_cranberry_"
)

# Function to update a single ingredient page
update_ingredient_page() {
    local file_name="$1"
    local image_name="$2"
    local file_path="src/components/pages/ingredients/$file_name"
    
    if [ ! -f "$file_path" ]; then
        echo "❌ File not found: $file_path"
        return 1
    fi
    
    echo "🔄 Processing: $file_name"
    
    # Create backup
    cp "$file_path" "${file_path}.backup"
    
    # Check if Image import already exists
    if ! grep -q "import Image from 'next/image'" "$file_path"; then
        # Add Image import after other Next.js imports
        sed -i '' '/import Head from/a\
import Image from '\''next/image'\'';
' "$file_path"
    fi
    
    # Update img tags to Image components with WebP sources
    # Handle both PNG and potential existing webp paths
    sed -i '' "s|<img[[:space:]]*|<Image |g" "$file_path"
    sed -i '' "s|</img>|/>|g" "$file_path"
    sed -i '' "s|src=\"/assets/${image_name}\.png\"|src=\"/assets/webp/${image_name}.webp\"|g" "$file_path"
    sed -i '' "s|src=\"/assets/${image_name}\.webp\"|src=\"/assets/webp/${image_name}.webp\"|g" "$file_path"
    
    # Add required Image props if they don't exist
    if grep -q "src=\"/assets/webp/${image_name}.webp\"" "$file_path"; then
        # Add width and height attributes
        sed -i '' "s|className=\"rounded-lg shadow-xl\"|width={1280}\n            height={720}\n            className=\"rounded-lg shadow-xl\"\n            priority\n            sizes=\"(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw\"|g" "$file_path"
        
        # Update background images in hero sections
        sed -i '' "s|backgroundImage: \`url('/assets/${image_name}\.png')\`|backgroundImage: \`url('/assets/webp/${image_name}.webp')\`|g" "$file_path"
    fi
    
    echo "✅ Completed: $file_name"
}

# Process all ingredient pages
for file_name in "${!ingredient_images[@]}"; do
    update_ingredient_page "$file_name" "${ingredient_images[$file_name]}"
done

echo ""
echo "🎉 Ingredient page optimization complete!"
echo "📋 Summary:"
echo "   - Added Next.js Image imports where needed"
echo "   - Converted <img> tags to <Image> components"
echo "   - Updated PNG paths to WebP paths"
echo "   - Added responsive sizing and priority loading"
echo ""
echo "💡 Next steps:"
echo "   1. Test the updated pages"
echo "   2. Remove backup files if everything works"
echo "   3. Update remaining component files"