import os
from pathlib import Path
from rembg import remove
from PIL import Image

products_dir = Path(__file__).parent.parent / "public" / "products"

for img_path in products_dir.rglob("*"):
    if img_path.suffix.lower() in (".jpg", ".jpeg", ".png"):
        print(f"Processing: {img_path.relative_to(products_dir)}")
        try:
            inp = Image.open(img_path)
            out = remove(inp)
            # Save as PNG (supports transparency)
            new_path = img_path.with_suffix(".png")
            out.save(new_path)
            # Remove original jpg if we converted to png
            if img_path.suffix.lower() in (".jpg", ".jpeg") and img_path != new_path:
                img_path.unlink()
            print(f"  Done: {new_path.name}")
        except Exception as e:
            print(f"  Error: {e}")

print("\nAll done!")
