"""Generate nzamuwe.com favicon suite from source artwork.

Outputs:
  - public/favicon.ico (multi-size: 16x16, 32x32, 48x48)
  - public/icon-16x16.png
  - public/icon-32x32.png
  - public/icon-48x48.png
  - public/apple-touch-icon.png (180x180, opaque RGB per Apple HIG)
  - public/favicon.png (48x48 for legacy backwards-compatibility)
"""

from pathlib import Path
import struct
import io
from PIL import Image, ImageDraw, ImageFilter

REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE_PATH = REPO_ROOT / "tools" / "source_favicon.jpg"
PUBLIC_DIR = REPO_ROOT / "public"

# Crop bounding box centered on head and expression
# Head is centered at ~x=260, y=260 with ~10-15px breathing margin
CROP_BOX = (30, 30, 490, 490)


def create_levels_lut(in_min: int = 20, in_max: int = 215, gamma: float = 0.82) -> list[int]:
    """Normalize paper background to clean white while boosting blue ink contrast."""
    lut = []
    for i in range(256):
        if i <= in_min:
            v = 0
        elif i >= in_max:
            v = 255
        else:
            v = int(255 * (((i - in_min) / (in_max - in_min)) ** gamma))
        lut.append(min(255, max(0, v)))
    return lut


def render_squircle_icon(
    base_img: Image.Image,
    size: int,
    radius: int,
    border_alpha: int = 35,
    unsharp: bool = False,
) -> Image.Image:
    """Render antialiased squircle badge with subtle edge contour for light/dark tab legibility."""
    scale = 4
    high_sz = size * scale
    high_r = radius * scale

    resized = base_img.resize((high_sz, high_sz), Image.Resampling.LANCZOS)

    mask = Image.new("L", (high_sz, high_sz), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, high_sz - 1, high_sz - 1], radius=high_r, fill=255)

    rgba = resized.convert("RGBA")
    rgba.putalpha(mask)

    if border_alpha > 0:
        border_layer = Image.new("RGBA", (high_sz, high_sz), (0, 0, 0, 0))
        bdraw = ImageDraw.Draw(border_layer)
        stroke_w = max(1, scale // 2)
        bdraw.rounded_rectangle(
            [0, 0, high_sz - 1, high_sz - 1],
            radius=high_r,
            outline=(15, 23, 42, border_alpha),
            width=stroke_w,
        )
        rgba = Image.alpha_composite(rgba, border_layer)

    out = rgba.resize((size, size), Image.Resampling.LANCZOS)
    if unsharp:
        out = out.filter(ImageFilter.UnsharpMask(radius=0.7, percent=140, threshold=2))
    return out


def render_apple_touch_icon(base_img: Image.Image, size: int = 180) -> Image.Image:
    """Apple iOS Home Screen touch icon: 180x180 opaque RGB canvas (Apple HIG)."""
    canvas = Image.new("RGB", (size, size), (255, 255, 255))
    scaled = base_img.resize((size, size), Image.Resampling.LANCZOS)
    canvas.paste(scaled, (0, 0))
    return canvas


def build_ico_payload(png_dict: dict[int, bytes]) -> bytes:
    """Pack multiple PNG images into a standard Windows/browser multi-size ICO binary."""
    sizes = sorted(png_dict.keys())
    count = len(sizes)
    header = struct.pack("<HHH", 0, 1, count)

    entries = []
    current_offset = 6 + count * 16
    payloads = []

    for s in sizes:
        png_data = png_dict[s]
        payloads.append(png_data)
        size_bytes = len(png_data)
        w = 0 if s == 256 else s
        h = 0 if s == 256 else s
        entry = struct.pack("<BBBBHHII", w, h, 0, 0, 1, 32, size_bytes, current_offset)
        entries.append(entry)
        current_offset += size_bytes

    return header + b"".join(entries) + b"".join(payloads)


def main():
    if not SOURCE_PATH.exists():
        raise FileNotFoundError(f"Source artwork not found at {SOURCE_PATH}")

    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Loading source: {SOURCE_PATH}")
    source = Image.open(SOURCE_PATH).convert("RGB")
    crop = source.crop(CROP_BOX)

    lut = create_levels_lut()
    clean = crop.point(lut * 3)

    # 1. Generate PNG sizes
    icon_16 = render_squircle_icon(clean, 16, radius=3, border_alpha=35, unsharp=True)
    icon_32 = render_squircle_icon(clean, 32, radius=6, border_alpha=35)
    icon_48 = render_squircle_icon(clean, 48, radius=9, border_alpha=35)
    apple_touch = render_apple_touch_icon(clean, 180)

    # Save PNG files
    out_16 = PUBLIC_DIR / "icon-16x16.png"
    out_32 = PUBLIC_DIR / "icon-32x32.png"
    out_48 = PUBLIC_DIR / "icon-48x48.png"
    out_apple = PUBLIC_DIR / "apple-touch-icon.png"
    out_legacy = PUBLIC_DIR / "favicon.png"

    icon_16.save(out_16, format="PNG", optimize=True)
    icon_32.save(out_32, format="PNG", optimize=True)
    icon_48.save(out_48, format="PNG", optimize=True)
    apple_touch.save(out_apple, format="PNG", optimize=True)
    icon_48.save(out_legacy, format="PNG", optimize=True)

    # 2. Generate multi-size ICO (16, 32, 48)
    png_bytes = {}
    for s, img in [(16, icon_16), (32, icon_32), (48, icon_48)]:
        buf = io.BytesIO()
        img.save(buf, format="PNG", optimize=True)
        png_bytes[s] = buf.getvalue()

    ico_data = build_ico_payload(png_bytes)
    out_ico = PUBLIC_DIR / "favicon.ico"
    out_ico.write_bytes(ico_data)

    print("Generated favicon suite in public/:")
    for p in [out_ico, out_16, out_32, out_48, out_apple, out_legacy]:
        print(f"  ✓ {p.name:<24} {p.stat().st_size:>6} bytes")


if __name__ == "__main__":
    main()
