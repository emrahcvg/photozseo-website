// Google .txt'nin tek satırından parse edilen ham giriş.
export interface RawEntry {
  id: string;        // numeric kategori ID, string olarak (örn. "212")
  path: string[];    // ["Apparel & Accessories", "Clothing", "Shirts & Tops"]
}

// Kanonik ağaç düğümü (dil-bağımsız).
export interface TreeNode {
  id: string;
  parentId: string | null;  // kök düğümlerde null
  depth: number;            // kök = 0
}

// Bir build çalışmasının tam çıktısı.
export interface BuildResult {
  tree: TreeNode[];
  labels: Record<string, Record<string, string>>; // lang -> (id -> yaprak label)
  meta: { googleVersion: string; taxonomyVersion: number; generatedAt: string };
}
