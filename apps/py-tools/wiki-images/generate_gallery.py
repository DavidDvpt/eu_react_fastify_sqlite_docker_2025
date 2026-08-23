from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent
OUTPUT = ROOT_DIR / "index.html"
IMAGE_DIRS = ("micro", "normal", "original")
EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}


images: list[tuple[str, Path]] = []
for directory_name in IMAGE_DIRS:
    image_dir = ROOT_DIR / directory_name
    if not image_dir.is_dir():
        continue

    images.extend(
        (directory_name, file)
        for file in sorted(image_dir.iterdir(), key=lambda item: item.name.casefold())
        if file.is_file() and file.suffix.lower() in EXTENSIONS
    )

cards = "\n".join(
    f"""
    <div class="card" data-variant="{directory_name}">
        <div class="image-wrap">
            <img src="{directory_name}/{image.name}" loading="lazy" alt="{image.name}">
        </div>
        <div>{directory_name} / {image.name}</div>
    </div>
    """
    for directory_name, image in images
)

empty_state = ""
if not images:
    empty_state = """
    <div class="empty-state">
        No images found in micro/, normal/, or original/.
    </div>
    """

html = f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Images</title>

<style>
body {{
    font-family: sans-serif;
    background: #111;
    color: #eee;
    margin: 0;
    padding: 24px;
}}

.topbar {{
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
}}

.filter-link {{
    color: #111;
    background: #eee;
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 14px;
}}

.filter-link.active {{
    background: #4ade80;
}}

.grid {{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
}}

.card {{
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    background: #222;
    border-radius: 6px;
}}

.image-wrap {{
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 140px;
    padding: 8px;
    background: #181818;
    border-radius: 4px;
}}

.card img {{
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 220px;
    object-fit: contain;
}}

.card div {{
    font-size: 12px;
    line-height: 1.4;
    word-break: break-all;
}}

.empty-state {{
    padding: 24px;
    text-align: center;
    background: #222;
    border-radius: 6px;
    color: #bbb;
}}
</style>
</head>

<body>

<div class="topbar">
    <a class="filter-link active" href="#" data-filter="all">all</a>
    <a class="filter-link" href="#" data-filter="micro">micro</a>
    <a class="filter-link" href="#" data-filter="normal">normal</a>
    <a class="filter-link" href="#" data-filter="original">original</a>
</div>

{empty_state}
<div class="grid">
{cards}
</div>

<script>
const links = document.querySelectorAll('.filter-link');
const cards = document.querySelectorAll('.card');

for (const link of links) {{
  link.addEventListener('click', (event) => {{
    event.preventDefault();
    const filter = link.dataset.filter;

    for (const currentLink of links) {{
      currentLink.classList.toggle('active', currentLink === link);
    }}

    for (const card of cards) {{
      const show = filter === 'all' || card.dataset.variant === filter;
      card.style.display = show ? '' : 'none';
    }}
  }});
}}
</script>

</body>
</html>
"""

OUTPUT.write_text(html, encoding="utf-8")

print(f"{len(images)} images")
print(f"Generated: {OUTPUT}")
