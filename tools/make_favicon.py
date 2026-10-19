"""Generate nzamuwe.com rebuild assets: PN favicon + draft resume.pdf."""
from PIL import Image, ImageDraw, ImageFont

SIZE = 256
img = Image.new("RGB", (SIZE, SIZE), (29, 78, 216))  # royal blue #1d4ed8
d = ImageDraw.Draw(img)

# subtle diagonal gradient overlay for depth
for i in range(SIZE):
    alpha = int(28 * (i / SIZE))
    d.line([(0, i), (SIZE, i)], fill=(29 - alpha // 3, 78 - alpha // 3, 216 - alpha // 2))

# rounded-corner mask
mask = Image.new("L", (SIZE, SIZE), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, SIZE, SIZE], radius=56, fill=255)
out = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
out.paste(img, (0, 0), mask)

font = ImageFont.truetype(
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 118
)
text = "PN"
bbox = d.textbbox((0, 0), text, font=font)
tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
d.text(((SIZE - tw) / 2 - bbox[0], (SIZE - th) / 2 - bbox[1]), text,
       font=font, fill=(255, 255, 255))

out.save("/home/z/my-project/public/favicon.png")
print("favicon.png written:", out.size)
