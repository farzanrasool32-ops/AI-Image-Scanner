export type ScanMode = "comprehensive" | "text" | "product" | "scene";

export type Color = {
  name: string;
  hex: string;
  rgb: string;
};

export type Quality = {
  resolution: string;
  brightness: string;
  contrast: string;
  sharpness: string;
  notes: string;
};

export type Analysis = {
  description: string;
  category: string;
  objects: string[];
  extractedText: string;
  documentType: string;
  products: string[];
  scene: string;
  background: string;
  colors: Color[];
  quality: Quality;
};

export type ImageMetrics = {
  colors: Color[];
  brightness: string;
  contrast: string;
  sharpness: string;
  notes: string;
};

export type ImageDimensions = {
  width: number;
  height: number;
  format: string;
};

export type ChatTurn = {
  role: "user" | "assistant";
  text: string;
};
