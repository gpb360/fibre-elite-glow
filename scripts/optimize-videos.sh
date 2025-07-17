#!/bin/bash

# Video Optimization Script for Fibre Elite Glow
# Compresses marketing videos for web delivery with multiple quality variants

set -e

# Configuration
INPUT_DIR="public/videos/marketing"
OUTPUT_DIR="public/videos/optimized"
ORIGINAL_DIR="public/videos/original"

# Video quality settings
declare -A QUALITY_SETTINGS=(
    ["1080p"]="1920x1080 4000k 192k"
    ["720p"]="1280x720 2000k 128k"
    ["480p"]="854x480 1000k 96k"
    ["360p"]="640x360 600k 64k"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎬 Video Optimization Script for Fibre Elite Glow${NC}"
echo -e "${BLUE}===============================================${NC}"

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}❌ FFmpeg is not installed. Please install it first:${NC}"
    echo -e "${YELLOW}   brew install ffmpeg${NC}"
    exit 1
fi

# Create directories
mkdir -p "$OUTPUT_DIR"
mkdir -p "$ORIGINAL_DIR"

# Function to get video info
get_video_info() {
    local file="$1"
    echo -e "${BLUE}📊 Analyzing: $(basename "$file")${NC}"
    
    # Get video properties
    local duration=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=duration -of default=noprint_wrappers=1:nokey=1 "$file" 2>/dev/null || echo "unknown")
    local resolution=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$file" 2>/dev/null || echo "unknown")
    local bitrate=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=bit_rate -of default=noprint_wrappers=1:nokey=1 "$file" 2>/dev/null || echo "unknown")
    local codec=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 "$file" 2>/dev/null || echo "unknown")
    
    echo -e "   Duration: ${duration}s"
    echo -e "   Resolution: ${resolution}"
    echo -e "   Bitrate: ${bitrate} bps"
    echo -e "   Codec: ${codec}"
}

# Function to compress video
compress_video() {
    local input_file="$1"
    local output_file="$2"
    local quality_name="$3"
    local settings="$4"
    
    # Parse settings
    local resolution=$(echo "$settings" | cut -d' ' -f1)
    local video_bitrate=$(echo "$settings" | cut -d' ' -f2)
    local audio_bitrate=$(echo "$settings" | cut -d' ' -f3)
    
    echo -e "${YELLOW}🔄 Compressing to ${quality_name}...${NC}"
    
    # Use H.264 with optimized settings for web
    ffmpeg -i "$input_file" \
        -c:v libx264 \
        -preset medium \
        -crf 23 \
        -maxrate "$video_bitrate" \
        -bufsize $((${video_bitrate%k} * 2))k \
        -vf "scale=$resolution:force_original_aspect_ratio=decrease,pad=$resolution:(ow-iw)/2:(oh-ih)/2" \
        -c:a aac \
        -b:a "$audio_bitrate" \
        -movflags +faststart \
        -y "$output_file" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ ${quality_name} compression completed${NC}"
        
        # Get file sizes
        local original_size=$(stat -f%z "$input_file")
        local compressed_size=$(stat -f%z "$output_file")
        local reduction=$((($original_size - $compressed_size) * 100 / $original_size))
        
        echo -e "   Original: $(numfmt --to=iec $original_size 2>/dev/null || echo "${original_size} bytes")"
        echo -e "   Compressed: $(numfmt --to=iec $compressed_size 2>/dev/null || echo "${compressed_size} bytes")"
        echo -e "   Reduction: ${reduction}%"
    else
        echo -e "${RED}❌ ${quality_name} compression failed${NC}"
    fi
}

# Function to create WebM version
create_webm() {
    local input_file="$1"
    local output_file="$2"
    local quality_name="$3"
    local settings="$4"
    
    # Parse settings
    local resolution=$(echo "$settings" | cut -d' ' -f1)
    local video_bitrate=$(echo "$settings" | cut -d' ' -f2)
    local audio_bitrate=$(echo "$settings" | cut -d' ' -f3)
    
    echo -e "${YELLOW}🔄 Creating WebM version for ${quality_name}...${NC}"
    
    # Use VP9 for WebM with good compression
    ffmpeg -i "$input_file" \
        -c:v libvpx-vp9 \
        -crf 30 \
        -b:v "$video_bitrate" \
        -vf "scale=$resolution:force_original_aspect_ratio=decrease,pad=$resolution:(ow-iw)/2:(oh-ih)/2" \
        -c:a libopus \
        -b:a "$audio_bitrate" \
        -y "$output_file" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ WebM version created${NC}"
        
        # Get file size
        local webm_size=$(stat -f%z "$output_file")
        echo -e "   WebM size: $(numfmt --to=iec $webm_size 2>/dev/null || echo "${webm_size} bytes")"
    else
        echo -e "${RED}❌ WebM creation failed${NC}"
    fi
}

# Function to create video thumbnail
create_thumbnail() {
    local input_file="$1"
    local output_file="$2"
    
    echo -e "${YELLOW}🖼️  Creating thumbnail...${NC}"
    
    # Extract frame at 25% of video duration
    ffmpeg -i "$input_file" -vf "thumbnail,scale=480:270" -frames:v 1 -q:v 2 "$output_file" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Thumbnail created${NC}"
    else
        echo -e "${RED}❌ Thumbnail creation failed${NC}"
    fi
}

# Main processing function
process_video() {
    local input_file="$1"
    local base_name=$(basename "$input_file" .mp4)
    
    echo -e "\n${BLUE}🎥 Processing: ${base_name}${NC}"
    echo -e "${BLUE}======================================${NC}"
    
    # Get video info
    get_video_info "$input_file"
    
    # Backup original if not already backed up
    if [ ! -f "$ORIGINAL_DIR/${base_name}.mp4" ]; then
        echo -e "${YELLOW}💾 Backing up original...${NC}"
        cp "$input_file" "$ORIGINAL_DIR/${base_name}.mp4"
    fi
    
    # Create directory for this video
    mkdir -p "$OUTPUT_DIR/$base_name"
    
    # Process each quality level
    for quality in "720p" "480p" "360p"; do
        local settings="${QUALITY_SETTINGS[$quality]}"
        local output_mp4="$OUTPUT_DIR/$base_name/${base_name}-${quality}.mp4"
        local output_webm="$OUTPUT_DIR/$base_name/${base_name}-${quality}.webm"
        
        # Compress to MP4
        compress_video "$input_file" "$output_mp4" "$quality" "$settings"
        
        # Create WebM version
        create_webm "$input_file" "$output_webm" "$quality" "$settings"
    done
    
    # Create thumbnail
    create_thumbnail "$input_file" "$OUTPUT_DIR/$base_name/${base_name}-thumb.jpg"
    
    echo -e "${GREEN}✅ ${base_name} processing completed!${NC}"
}

# Process all videos
echo -e "\n${BLUE}📂 Processing videos in ${INPUT_DIR}${NC}"

total_original_size=0
total_compressed_size=0

for video_file in "$INPUT_DIR"/*.mp4; do
    if [ -f "$video_file" ]; then
        process_video "$video_file"
        
        # Add to totals
        original_size=$(stat -f%z "$video_file")
        total_original_size=$((total_original_size + original_size))
        
        # Calculate compressed size (using 720p as reference)
        base_name=$(basename "$video_file" .mp4)
        compressed_file="$OUTPUT_DIR/$base_name/${base_name}-720p.mp4"
        if [ -f "$compressed_file" ]; then
            compressed_size=$(stat -f%z "$compressed_file")
            total_compressed_size=$((total_compressed_size + compressed_size))
        fi
    fi
done

# Summary
echo -e "\n${GREEN}🎉 Video optimization complete!${NC}"
echo -e "${GREEN}=================================${NC}"
echo -e "Original total: $(numfmt --to=iec $total_original_size 2>/dev/null || echo "${total_original_size} bytes")"
echo -e "Compressed total: $(numfmt --to=iec $total_compressed_size 2>/dev/null || echo "${total_compressed_size} bytes")"
if [ $total_original_size -gt 0 ]; then
    local total_reduction=$((($total_original_size - $total_compressed_size) * 100 / $total_original_size))
    echo -e "Total reduction: ${total_reduction}%"
fi

echo -e "\n${BLUE}📝 Next steps:${NC}"
echo -e "1. Update video-config.json with new optimized paths"
echo -e "2. Test video components with new compressed files"
echo -e "3. Implement adaptive quality selection based on connection"
echo -e "4. Consider replacing original files with optimized versions"
echo -e "5. Update video components to use WebM where supported"

echo -e "\n${YELLOW}⚠️  Note: Original files are backed up in ${ORIGINAL_DIR}${NC}"