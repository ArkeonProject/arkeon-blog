# 🧭 Git Strategy — Arkeonix Labs

> **Objetivo:** Mantener una historia limpia, lineal y auditable entre `main` y `develop`, evitando merges innecesarios y eliminando el riesgo de divergencias cíclicas.

---

## 🧩 Estructura de Ramas

| Rama | Propósito | Permisos |
|------|------------|-----------|
| `main` | Código estable en producción o release | 🔒 Protegida (sin force push, solo PR) |
| `develop` | Integración de nuevas features y testing | 🔒 Protegida (solo maintainer puede hacer `--force-with-lease`) |
| `feature/*` | Desarrollo de nuevas funcionalidades | 🔓 Libre |
| `hotfix/*` | Correcciones urgentes que deben ir directo a `main` | 🔓 Libre, luego merge a `develop` |
| `release/*` | Versión candidata antes de pasar a `main` | 🔓 Temporal |

---

## ⚙️ Configuración en GitHub

### 🔐 Reglas de Protección de Ramas

#### `main`
- ✅ Require pull request before merging  
- ✅ Require status checks before merging  
- ✅ Require linear history  
- ✅ Require branches to be up to date before merging  
- ❌ Allow force pushes  
- ❌ Allow deletions  

#### `develop`
- ✅ Require pull request before merging  
- ✅ Require linear history  
- ✅ Restrict who can push → *(solo maintainer o CI bot)*  
- ✅ Allow force pushes  
- ❌ Require branches to be up to date before merging  
- ❌ Require deployments to succeed before merging  

🔹 Esto permite mantener historia lineal (`rebase`), pero permite sincronizar `develop` con `main` mediante un `--force-with-lease` controlado.

---

## 🧠 Flujo de Trabajo (GitFlow Moderno)

### 🔹 1. Creación de Feature Branch
```bash
git checkout develop
git pull
git checkout -b feature/nueva-funcionalidad
# ... desarrollar ...
git add .
git commit -m "feat: nueva funcionalidad X"
git push origin feature/nueva-funcionalidad
```

Luego, crear un **Pull Request**:
- **base:** `develop`
- **compare:** `feature/nueva-funcionalidad`
- Merge method: ✅ **Rebase and merge**

> Esto asegura historia lineal sin commits de merge.

---

### 🔹 2. Preparar un Release
Cuando `develop` alcanza un estado estable:
```bash
git checkout main
git pull origin main
git merge --ff-only develop
git push origin main
```

> Se crea una release limpia en `main`, sin commits de merge adicionales.

---

### 🔹 3. Sincronizar `develop` con `main` (evitar divergencias)
Después de un release o hotfix aplicado en `main`, actualiza `develop`:

```bash
git checkout develop
git fetch origin
git rebase origin/main
git push origin develop --force-with-lease
```

✅ Esto mantiene `develop` perfectamente alineada con `main`.  
✅ No genera commits de merge.  
✅ No rompe la protección gracias a “Allow force pushes”.

---

### 🔹 4. Crear un Hotfix
Si hay un bug urgente en producción:

```bash
git checkout main
git checkout -b hotfix/fix-login
# ... corregir bug ...
git add .
git commit -m "fix: login error"
git push origin hotfix/fix-login
```

PR:
- base: `main`
- compare: `hotfix/fix-login`
- Merge method: ✅ Rebase and merge

Luego sincroniza `develop` con `main` usando el paso anterior.

---

### 🔹 5. Borrado de ramas
Después de mergear un PR:
```bash
git branch -d feature/nueva-funcionalidad
git push origin --delete feature/nueva-funcionalidad
```

---

## 🧩 Alias recomendados

Añadir estos alias al entorno global para automatizar tareas:

```bash
# Sincronizar develop con main
git config --global alias.sync-main "!git fetch origin main && git rebase origin/main && git push origin develop --force-with-lease"

# Crear rama de feature desde develop
git config --global alias.feature '!f() { git checkout develop && git pull && git checkout -b feature/$1; }; f'

# Crear release (fast-forward merge)
git config --global alias.release '!git checkout main && git pull && git merge --ff-only develop && git push origin main'
```

Uso rápido:
```bash
git feature login-form
git sync-main
git release
```

---

## 🧰 Buenas Prácticas

- 🚫 **Nunca uses `git push --force`** sin `--with-lease`.
- 🔒 Los force push solo están permitidos en `develop`, y únicamente por el maintainer.
- 🧹 Limpia ramas locales y remotas obsoletas cada cierto tiempo (`git fetch --prune`).
- 🧾 Usa commits semánticos (`feat:`, `fix:`, `chore:`, `refactor:`, etc.).
- 🧪 Todo cambio debe pasar por PR (aunque trabajes solo): mantiene trazabilidad y CI.
- ⚡ No mantengas ramas `feature` activas más de 2-3 días — rebasea frecuentemente.
- 🧱 Si hay conflictos recurrentes, prioriza resolver en `develop` y luego propagar a `main`.

---

## 🔄 Ejemplo de Flujo Completo

```bash
# Crear nueva feature
git checkout develop
git checkout -b feature/add-dashboard
# -> desarrollo
git push origin feature/add-dashboard

# PR feature → develop
# Merge con "Rebase and merge"

# Crear release
git release

# Sincronizar develop con main
git sync-main
```

---

## 🏁 Resultado esperado

✅ Historia perfectamente lineal  
✅ `main` y `develop` siempre alineadas  
✅ CI/CD estable sin conflictos  
✅ Sin commits de merge automáticos  
✅ Auditoría limpia en GitHub (commits claros, trazables, firmados)

---

<div align="center">

**🚀 "Mantén la historia limpia. La calidad no solo está en el código, sino también en el control de su evolución."**

</div>
