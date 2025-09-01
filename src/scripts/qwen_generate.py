#!/usr/bin/env python3
"""
Qwen-Image generation script for ultra-realistic image generation
"""
import argparse
import torch
import sys
import os
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(description='Generate images with Qwen-Image')
    parser.add_argument('--prompt', required=True, help='Text prompt for image generation')
    parser.add_argument('--negative_prompt', default='', help='Negative prompt')
    parser.add_argument('--width', type=int, default=1024, help='Image width')
    parser.add_argument('--height', type=int, default=576, help='Image height')
    parser.add_argument('--steps', type=int, default=50, help='Number of inference steps')
    parser.add_argument('--cfg_scale', type=float, default=4.0, help='CFG scale')
    parser.add_argument('--seed', type=int, default=42, help='Random seed')
    parser.add_argument('--output', required=True, help='Output file path')
    
    args = parser.parse_args()
    
    print("🚀 Initializing Qwen-Image...")
    
    try:
        from diffusers import DiffusionPipeline
        import torch
        
        model_name = "Qwen/Qwen-Image"
        
        # Check device and dtype
        if torch.cuda.is_available():
            torch_dtype = torch.bfloat16
            device = "cuda"
            print("✅ CUDA detected - using GPU acceleration")
        elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
            torch_dtype = torch.float32
            device = "mps"  # Apple Silicon GPU
            print("✅ MPS detected - using Apple Silicon GPU acceleration") 
        else:
            torch_dtype = torch.float32
            device = "cpu"
            print("⚠️  Using CPU - this will be slower")
        
        print(f"📥 Loading {model_name}...")
        
        # Load the pipeline with error handling
        try:
            pipe = DiffusionPipeline.from_pretrained(
                model_name, 
                torch_dtype=torch_dtype,
                trust_remote_code=True  # Some models need this
            )
            pipe = pipe.to(device)
        except Exception as model_error:
            print(f"❌ Failed to load {model_name}: {model_error}")
            print("🔄 Trying alternative loading method...")
            
            # Try with specific revision or alternative approach
            pipe = DiffusionPipeline.from_pretrained(
                model_name,
                torch_dtype=torch_dtype,
                trust_remote_code=True,
                revision="main"
            )
            pipe = pipe.to(device)
        
        print("🎨 Generating image...")
        print(f"📝 Prompt: {args.prompt[:100]}...")
        print(f"📐 Size: {args.width}x{args.height}")
        print(f"🔧 Steps: {args.steps}, CFG: {args.cfg_scale}")
        
        # Add positive magic for better quality (from Qwen docs)
        positive_magic = {
            "en": ", 8k uhd, dslr, soft lighting, high quality, film grain, Fujifilm XT3"
        }
        
        # Set up generator for reproducible results
        generator = torch.Generator(device=device).manual_seed(args.seed)
        
        # Generate image
        result = pipe(
            prompt=args.prompt + positive_magic["en"],
            negative_prompt=args.negative_prompt,
            width=args.width,
            height=args.height,
            num_inference_steps=args.steps,
            guidance_scale=args.cfg_scale,  # Some models use guidance_scale instead of true_cfg_scale
            generator=generator
        )
        
        image = result.images[0]
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(args.output), exist_ok=True)
        
        # Save image
        image.save(args.output)
        print(f"✅ Image saved successfully: {args.output}")
        
    except ImportError as e:
        print(f"❌ Missing dependencies: {e}")
        print("📦 Please install: pip install diffusers torch transformers")
        sys.exit(1)
        
    except Exception as e:
        print(f"❌ Generation failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()