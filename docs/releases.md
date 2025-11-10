# 🏷️ Guía de Releases y Versionado — Arkeon Project

> **Objetivo:** mantener un flujo claro entre desarrollo (`develop`), producción (`main`) y versiones liberadas.

---

## 🧭 Flujo principal

```text
feature/* → develop → main → tag (vX.Y.Z) → deploy → main → develop
```

1. **feature/** → donde desarrollas nuevas funcionalidades.  
2. **develop** → integra features, ejecuta CI (lint, test, build).  
3. **main** → versión estable, ejecuta CD y crea release.  
4. **main → develop** → sincroniza después de cada release.

---

## 🔢 Versionado semántico

Formato:  
```
vMAJOR.MINOR.PATCH
```

| Cambio | Ejemplo | Descripción |
|--------|----------|-------------|
| MAJOR | 1.0.0 → 2.0.0 | Cambios incompatibles |
| MINOR | 1.0.0 → 1.1.0 | Nueva feature |
| PATCH | 1.0.0 → 1.0.1 | Bugfix o mejora menor |

---

## 🚀 Flujo manual

1️⃣ Merge `develop → main`  
2️⃣ Crear tag y subir:
```bash
git checkout main
git pull origin main
git tag -a v1.2.0 -m "Release v1.2.0 - Añadido modo oscuro"
git push origin v1.2.0
```
3️⃣ Crear release en GitHub (opcional).  
4️⃣ Sincronizar `main → develop`:
```bash
git checkout develop
git reset --hard origin/main
git push origin develop --force-with-lease
```

---

## ⚙️ Flujo automático (opcional)

`.github/workflows/release.yml`:

```yaml
name: 🏷️ Tag & Release
on:
  push:
    branches: [main]
jobs:
  tag:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 🧮 Get version
        id: pkg
        run: echo "version=$(jq -r .version package.json)" >> $GITHUB_OUTPUT
      - name: 🏷️ Create tag if not exists
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          VERSION="v${{ steps.pkg.outputs.version }}"
          if git rev-parse "$VERSION" >/dev/null 2>&1; then
            echo "⚠️ Tag $VERSION already exists, skipping..."
          else
            git tag -a "$VERSION" -m "Release $VERSION"
            git push origin "$VERSION"
          fi
```

---

## 💡 Recomendaciones rápidas

- 📦 Incrementa la versión **en la rama feature antes de integrarla a develop**.  
- 🏷️ Crea **un tag por cada release** (`v1.0.0`, `v1.1.0`, etc.).  
- 🚀 El CD se dispara automáticamente al mergear a `main`.  
- 🔄 Sincroniza `main → develop` tras cada release.  
- 🧾 Usa mensajes claros en los tags: `"Release v1.3.0 - Nueva sección de blog"`.

---

<div align="center">

✨ *“Tag early, tag often.”* — Cada tag es tu punto seguro de retorno.  

</div>
