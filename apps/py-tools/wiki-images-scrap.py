"""Entry point for the wiki image downloader."""

# TODO: Préparer ici les options, la configuration et la connexion à la base,
# puis les passer explicitement aux tools. Les tools ne doivent pas remonter
# récupérer eux-mêmes la configuration ou la connexion.
# le main principal doit etre dans ce fichier

import sys
from pathlib import Path

TOOL_DIR = Path(__file__).resolve().parent / "wiki-images-scrap"
sys.path.insert(0, str(TOOL_DIR))

from download_entropia_images import main


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("[fatal]", error, file=sys.stderr)
        raise SystemExit(1) from error
