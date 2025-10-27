# Arkeon Blog

Arkeon Blog es una plataforma moderna y eficiente para la publicación de contenido, construida con tecnologías de última generación para ofrecer un rendimiento óptimo y una experiencia de usuario excepcional.

## Tecnologías principales

- **React**: Biblioteca para construir interfaces de usuario.
- **TypeScript**: Superset de JavaScript que añade tipado estático.
- **Vite**: Herramienta de construcción rápida y ligera para proyectos frontend.
- **TailwindCSS v4.1**: Framework CSS utilitario para un diseño rápido y responsivo.
- **Supabase**: Backend como servicio para autenticación, base de datos y almacenamiento.
- **PNPM**: Gestor de paquetes rápido y eficiente.

## Instalación

Sigue estos pasos para configurar y ejecutar el proyecto localmente:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/ArkeonProject/arkeon-blog.git
   cd arkeon-blog
   ```

2. Instala las dependencias utilizando PNPM:
   ```bash
   pnpm install
   ```

3. Configura las variables de entorno:

   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables (ajusta los valores según tu entorno):

   ```
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

4. Ejecuta el proyecto en modo desarrollo:
   ```bash
   pnpm dev
   ```

5. Para generar una versión de producción:
   ```bash
   pnpm build
   ```

## Estructura del proyecto

```
arkeon-blog/
├── public/                 # Archivos estáticos públicos
├── src/
│   ├── assets/             # Imágenes y recursos estáticos
│   ├── components/         # Componentes React reutilizables
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Páginas del sitio
│   ├── styles/             # Estilos globales y configuración de TailwindCSS
│   ├── utils/              # Funciones utilitarias
│   └── main.tsx            # Punto de entrada de la aplicación
├── .env                    # Variables de entorno
├── pnpm-lock.yaml          # Lockfile de PNPM
├── tailwind.config.ts      # Configuración de TailwindCSS
├── vite.config.ts          # Configuración de Vite
└── README.md               # Documentación del proyecto
```

## Flujo CI/CD

El proyecto utiliza GitHub Actions para automatizar pruebas y despliegues:

- **Integración Continua (CI):** Cada push o pull request dispara un workflow que ejecuta linter, tests y build para garantizar la calidad del código.
- **Despliegue Continuo (CD):** Las versiones aprobadas se despliegan automáticamente en Vercel, asegurando que la última versión esté disponible en producción sin intervención manual.

## Contribuir y tests

Para contribuir al proyecto:

1. Haz un fork y crea una rama con tu feature o fix.
2. Asegúrate de que el código pase las reglas de lint y los tests.
3. Envía un pull request para revisión.

Para ejecutar los tests locales:

```bash
pnpm test
```

## Créditos

Desarrollado y mantenido por **David López**.  
¡Gracias por contribuir y hacer que Arkeon Blog sea mejor!
