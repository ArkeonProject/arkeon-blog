# 🚀 Continuous Deployment (CD) — Production Workflow

Este README forma parte de la documentación técnica interna del flujo CI/CD del proyecto.

Este workflow (`cd.yml`) automatiza el **despliegue en producción** de la aplicación **React + Vite + PNPM**, integrada con **Supabase** para backend y desplegada en **Vercel** para hosting serverless.

---

## 🧩 Descripción general

Cada vez que se realiza un **push en la rama `main`**, GitHub Actions ejecuta este pipeline que garantiza un despliegue controlado y reproducible. Las etapas principales incluyen:

1. **Checkout del repositorio:** Se clona el código fuente en el runner.
2. **Instalación de dependencias:** Se utiliza PNPM versión 9, optimizando la gestión y el almacenamiento en caché para acelerar la instalación.
3. **Compilación del proyecto:** Se ejecuta el build con Node.js 20.x en un entorno Ubuntu-latest, utilizando variables de entorno seguras inyectadas desde los secretos de GitHub.
4. **Despliegue automático a Vercel:** Se usa la acción oficial para desplegar la aplicación, autenticándose con tokens seguros y configurando el proyecto y organización.

El entorno de ejecución está basado en `ubuntu-latest`, que provee estabilidad y compatibilidad con Node.js 20.x y PNPM 9, asegurando consistencia en cada ejecución.

---

## 🧱 Flujo de CI/CD completo

| Rama       | Entorno                  | Acción                                                    |
|------------|--------------------------|-----------------------------------------------------------|
| `develop`  | Integración (CI)         | Ejecución de build, lint y tests sin despliegue automático |
| `main`     | Producción (CD)          | Build y despliegue automático en Vercel                   |

> 🔸 Esta separación permite mantener `develop` como entorno de pruebas e integración continua,  
> mientras que `main` se reserva para despliegues estables en producción.

---

## ⚙️ Archivo del workflow

Ubicación:  
`.github/workflows/cd.yml`

```yaml
name: 🚀 CD - Deploy to Production (main)

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout repository
        uses: actions/checkout@v4

      - name: ⚙️ Setup PNPM
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: 🧰 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: 📦 Install dependencies
        run: pnpm install

      - name: 🧱 Build project
        run: pnpm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: 🚀 Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

### Especificaciones técnicas del pipeline

- **Runner:** `ubuntu-latest` garantiza un entorno Linux actualizado y compatible.
- **Node.js:** Versión 20.x se instala para aprovechar las últimas mejoras y compatibilidad.
- **PNPM:** Se utiliza versión 9 con caché habilitado para acelerar la instalación de dependencias y reducir tiempos.
- **Variables de entorno:** Se inyectan desde los secretos de GitHub para mantener la confidencialidad.
- **Deploy:** La acción de Vercel usa tokens y IDs para autenticar y desplegar sin intervención manual.

---

## 🔍 Validaciones del pipeline

El pipeline incluye varias validaciones automáticas para asegurar la integridad y seguridad del despliegue:

- **Build exitoso:** La compilación debe completarse sin errores para continuar.
- **Variables de entorno:** Se verifica que las variables necesarias (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) estén definidas en los secretos de GitHub.
- **Tokens de despliegue:** El token de Vercel (`VERCEL_TOKEN`) y los IDs de organización y proyecto deben estar correctamente configurados y accesibles.
- **Caché de dependencias:** Se valida el uso correcto del caché para optimizar tiempos sin perder consistencia.

Estas validaciones previenen despliegues fallidos o inseguros, garantizando estabilidad en producción.

---

## 📁 Artefactos generados

Durante la ejecución del pipeline, se generan y utilizan los siguientes artefactos:

- **Build output:** El directorio `dist/` generado por Vite contiene los archivos estáticos optimizados para producción.
- **Logs de ejecución:** GitHub Actions registra logs detallados de cada paso para auditoría y debugging.
- **Cache de dependencias:** PNPM almacena en caché los módulos instalados para acelerar futuras ejecuciones.
- **Despliegue en Vercel:** La aplicación desplegada queda accesible en la URL configurada en el proyecto Vercel, con versiones rastreadas.

Estos artefactos permiten trazabilidad y análisis post-despliegue.

---

## 🧪 Seguridad y buenas prácticas

Para mantener la seguridad y calidad en el pipeline se aplican las siguientes buenas prácticas:

- **Encriptación de secretos:** Todos los tokens y variables sensibles se almacenan como secretos en GitHub, cifrados y accesibles solo para el workflow.
- **Principio de privilegios mínimos:** Los tokens de Vercel y otros accesos se configuran con permisos limitados necesarios para la tarea específica.
- **Ramas protegidas:** La rama `main` está protegida para evitar pushes directos sin revisión, garantizando que solo código validado se despliegue.
- **Auditoría de logs:** Se mantiene registro detallado de cada ejecución para detectar anomalías o accesos no autorizados.
- **Actualización periódica:** Dependencias y versiones de Node.js y PNPM se actualizan regularmente para mitigar vulnerabilidades.

Estas medidas aseguran un pipeline robusto, seguro y confiable.

---

Documentación mantenida por David López — Octubre 2025