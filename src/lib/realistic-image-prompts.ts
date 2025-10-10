export interface RealisticImagePrompt {
  filename: string;
  prompt: string;
  negative_prompt: string;
  category: 'ingredient' | 'medical' | 'educational' | 'background';
  priority: 1 | 2 | 3;
}

export const REALISTIC_PROMPTS: RealisticImagePrompt[] = [
  // HIGH PRIORITY - MEDICAL/EDUCATIONAL DIAGRAMS
  {
    filename: 'digestive-system-diagram.jpg',
    prompt: 'Professional medical textbook photograph of human digestive system anatomical model, shot in modern medical university laboratory with clinical lighting, Canon 5D Mark IV, 24-70mm lens, f/8, showing detailed stomach, small intestine, large intestine with educational labels, ultra-sharp medical photography, clean white background, 8K resolution',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized, abstract, colorful, bright colors',
    category: 'medical',
    priority: 1
  },
  {
    filename: 'gut-health-illustration.jpg',
    prompt: 'High-resolution macro photograph of healthy human intestinal tissue sample under professional microscope, shot in medical research laboratory, Nikon D850, 105mm macro lens, specialized medical lighting, showing detailed intestinal villi and healthy tissue structure, clinical photography style, ultra-sharp detail',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized, bright colors',
    category: 'medical',
    priority: 1
  },
  {
    filename: 'fiber-diagram.jpg',
    prompt: 'Professional scientific photography of fiber samples under electron microscope, shot in food science laboratory, showing detailed cellular structure of soluble and insoluble fiber, ultra-high magnification, clinical white background, Canon macro lens, professional scientific documentation style, 8K quality',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, colorful, stylized',
    category: 'educational',
    priority: 1
  },

  // HIGH PRIORITY - INGREDIENT CLOSE-UPS
  {
    filename: 'apple-fiber-hero.jpg',
    prompt: 'Professional macro photograph of fresh red apple slices on white marble countertop, shot with Canon 5D Mark IV, 100mm macro lens, f/8, natural window lighting, showing detailed cellular fiber structure and juice droplets, ultra-sharp focus, commercial food photography style, 8K resolution',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, artificial, stylized',
    category: 'ingredient',
    priority: 1
  },
  {
    filename: 'broccoli-closeup.jpg',
    prompt: 'Extreme macro photograph of fresh organic broccoli florets with morning dew droplets, shot with Nikon D850, 105mm macro lens, natural diffused lighting, showing intricate vegetable texture and vibrant green color, professional food photography, ultra-sharp detail, 8K quality',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized, artificial',
    category: 'ingredient',
    priority: 1
  },
  {
    filename: 'cabbage-closeup.jpg',
    prompt: 'Professional close-up photograph of fresh green cabbage head with water droplets, shot with Canon 85mm lens, f/5.6, studio lighting, showing detailed leaf texture and natural veining, commercial food photography style, clean white background, ultra-realistic, 8K resolution',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized',
    category: 'ingredient',
    priority: 1
  },
  {
    filename: 'carrot-closeup.jpg',
    prompt: 'High-resolution macro photograph of fresh organic carrots with soil and green tops, shot with professional studio lighting, Canon 5D Mark IV, 100mm macro lens, showing detailed root texture and vibrant orange color, commercial agriculture photography, ultra-sharp focus',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized, artificial',
    category: 'ingredient',
    priority: 1
  },

  // MEDIUM PRIORITY - MORE INGREDIENTS
  {
    filename: 'celery-closeup.jpg',
    prompt: 'Professional macro photograph of fresh celery stalks with water droplets, shot with Nikon D850, 105mm macro lens, natural lighting, showing detailed fiber structure and crisp green color, food photography style, clean background, ultra-sharp detail',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized',
    category: 'ingredient',
    priority: 2
  },
  {
    filename: 'cranberry-closeup.jpg',
    prompt: 'High-resolution photograph of fresh ripe cranberries with natural shine, shot with Canon macro lens, professional food photography lighting, showing detailed berry texture and deep red color, commercial style, clean white background, 8K quality',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized, artificial',
    category: 'ingredient',
    priority: 2
  },
  {
    filename: 'papaya-closeup.jpg',
    prompt: 'Professional close-up photograph of ripe papaya fruit cut in half showing seeds, shot with Canon 5D Mark IV, 85mm lens, studio lighting, ultra-sharp detail showing fruit texture and vibrant orange color, food photography style, 8K resolution',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized',
    category: 'ingredient',
    priority: 2
  },
  {
    filename: 'raspberry-closeup.jpg',
    prompt: 'Extreme macro photograph of fresh raspberries with morning dew, shot with Nikon D850, 105mm macro lens, natural lighting, showing detailed berry texture and individual drupelets, professional food photography, ultra-realistic, 8K quality',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized, artificial',
    category: 'ingredient',
    priority: 2
  },
  {
    filename: 'strawberry-closeup.jpg',
    prompt: 'Professional macro photograph of ripe strawberries with natural shine and green leaves, shot with Canon macro lens, studio lighting, showing detailed fruit texture and seeds, commercial food photography style, clean background, ultra-sharp focus',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized',
    category: 'ingredient',
    priority: 2
  },

  // MEDICAL DIAGRAMS
  {
    filename: 'vitamin-c-diagram.jpg',
    prompt: 'Professional medical photograph of vitamin C molecular structure model in research laboratory, shot with clinical lighting, Canon 5D Mark IV, macro lens, showing detailed chemical structure, medical education photography style, clean white background',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, colorful, stylized',
    category: 'medical',
    priority: 2
  },
  {
    filename: 'urinary-tract-diagram.jpg',
    prompt: 'Clinical medical photograph of urinary system anatomical model, shot in medical education facility, professional medical photography lighting, Canon medical lens, showing detailed kidney, bladder, and tract structure, educational documentation style, 8K quality',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, colorful, stylized',
    category: 'medical',
    priority: 2
  },
  {
    filename: 'skin-health-illustration.jpg',
    prompt: 'Professional dermatology photograph of healthy human skin cross-section under microscope, shot in medical laboratory, specialized medical lighting, showing detailed skin layers and cellular structure, clinical photography style, ultra-high resolution',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, colorful, stylized',
    category: 'medical',
    priority: 2
  },

  // SUPPORTING INGREDIENTS
  {
    filename: 'aloe-vera-closeup.jpg',
    prompt: 'Professional macro photograph of fresh aloe vera plant with gel visible, shot with Canon 100mm macro lens, natural lighting, showing detailed plant texture and natural gel, botanical photography style, clean background, ultra-sharp detail',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized',
    category: 'ingredient',
    priority: 2
  },
  {
    filename: 'spinach-leaves.jpg',
    prompt: 'High-resolution photograph of fresh organic spinach leaves with morning dew, shot with professional food photography lighting, Canon 85mm lens, showing detailed leaf texture and vibrant green color, commercial style, ultra-realistic',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized, artificial',
    category: 'ingredient',
    priority: 2
  },

  // BACKGROUND/AGRICULTURAL
  {
    filename: 'corn-field.jpg',
    prompt: 'Professional agricultural photograph of corn field at golden hour, shot with Canon 24-70mm lens, showing tall corn plants with detailed husks and silk, commercial agriculture photography, natural lighting, ultra-realistic landscape, 8K quality',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized, oversaturated',
    category: 'background',
    priority: 3
  },
  {
    filename: 'guar-beans.jpg',
    prompt: 'Professional close-up photograph of guar beans (cluster beans) on white background, shot with macro lens, studio lighting, showing detailed bean pods and texture, commercial food photography style, ultra-sharp focus, 8K resolution',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized',
    category: 'ingredient',
    priority: 3
  },
  {
    filename: 'oil-palm-trunk.jpg',
    prompt: 'Professional photograph of oil palm tree trunk in plantation, shot with Canon 24-70mm lens, natural lighting, showing detailed bark texture and palm fronds above, commercial agricultural photography style, ultra-realistic, 8K quality',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized, oversaturated',
    category: 'background',
    priority: 3
  },
  {
    filename: 'prebiotic-foods.jpg',
    prompt: 'Professional food photography of variety of prebiotic foods including garlic, onions, bananas, asparagus on rustic wooden table, shot with Canon 50mm lens, natural window lighting, showing detailed food textures, commercial style, ultra-realistic',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized, artificial',
    category: 'ingredient',
    priority: 3
  },

  // REMAINING ITEMS
  {
    filename: 'acai-closeup.jpg',
    prompt: 'Professional macro photograph of fresh acai berries in bowl, shot with Canon 100mm macro lens, studio lighting, showing detailed berry texture and deep purple color, food photography style, clean background, ultra-sharp detail, 8K quality',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized',
    category: 'ingredient',
    priority: 2
  },
  {
    filename: 'apple-bg.jpg',
    prompt: 'Professional photograph of red apples in orchard setting, shot with Canon 85mm lens, natural lighting, showing apples on tree branches with leaves, commercial agriculture photography, ultra-realistic, clean composition',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized, oversaturated',
    category: 'background',
    priority: 3
  },
  {
    filename: 'apple-pomace.jpg',
    prompt: 'Professional macro photograph of apple pomace (pulp) showing fiber content, shot in food processing facility, Canon macro lens, clinical lighting, showing detailed pulp texture and fiber structure, commercial documentation style',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized',
    category: 'ingredient',
    priority: 3
  },
  {
    filename: 'antioxidant-diagram.jpg',
    prompt: 'Professional scientific photography of antioxidant molecules under microscope, shot in research laboratory, specialized scientific lighting, showing molecular structure detail, clinical documentation style, clean white background, 8K resolution',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, colorful, stylized',
    category: 'educational',
    priority: 2
  },
  {
    filename: 'hydration-illustration.jpg',
    prompt: 'Professional medical photograph of human body hydration process, shot in medical education facility, clinical lighting, showing detailed anatomical model, medical documentation photography style, clean background, ultra-realistic',
    negative_prompt: 'illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, colorful, stylized',
    category: 'medical',
    priority: 2
  }
];

export default REALISTIC_PROMPTS;