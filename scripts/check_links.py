"""Fail if any page, stylesheet or data file points at a local file that does not exist in site/."""
import pathlib, re, sys

SITE = pathlib.Path(__file__).resolve().parent.parent / "site"
REF = re.compile(r"""(?:src|href|poster)\s*=\s*["']([^"'#?]+)|url\(\s*["']?([^"')#?]+)|["'`]((?:\./)?assets/[^"'`?#\s]+)""")
missing = []
for f in SITE.rglob("*"):
    if f.suffix not in {".html", ".css", ".js"}:
        continue
    for m in REF.finditer(f.read_text(encoding="utf-8")):
        ref = next(g for g in m.groups() if g)
        if re.match(r"^(https?:|mailto:|tel:|data:|//|javascript:)", ref) or "${" in ref or not ref.strip():
            continue
        base = SITE if f.suffix == ".js" or ref.startswith("/") else f.parent
        target = (base / ref.lstrip("/")).resolve()
        if not target.exists():
            missing.append(f"{f.relative_to(SITE)} -> {ref}")
if missing:
    print("Missing files:\n  " + "\n  ".join(sorted(set(missing))))
    sys.exit(1)
print("All local references resolve.")
