# Miss Star International - Next.js Website

Sitio web oficial de Miss Star International, construido con Next.js 14, TypeScript y Tailwind CSS.

## 🌟 Características

- ⚡️ Next.js 14 con App Router
- 🎨 Tailwind CSS para estilos modernos
- 🌍 Soporte multilingüe (EN, ES, PT, TH, VI)
- 📱 Diseño responsive
- 🔍 SEO optimizado
- 📊 Analytics integrado
- 🚀 Desplegado en Vercel

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm run start
```

## 📁 Estructura del Proyecto

```
missstar-next/
├── src/
│   ├── app/
│   │   ├── (languages)/
│   │   │   ├── en/     # Contenido en inglés
│   │   │   ├── es/     # Contenido en español
│   │   │   ├── pt/     # Contenido en portugués
│   │   │   ├── th/     # Contenido en tailandés
│   │   │   └── vi/     # Contenido en vietnamita
│   │   ├── layout.tsx  # Layout principal
│   │   └── globals.css # Estilos globales
│   └── middleware.ts   # Middleware para routing y idiomas
├── public/            # Archivos estáticos
└── package.json      # Dependencias y scripts
```

## 🌍 Soporte de Idiomas

El sitio detecta automáticamente el idioma preferido del usuario y redirige a la versión correspondiente:

- 🇺🇸 Inglés (default)
- 🇪🇸 Español
- 🇵🇹 Portugués
- 🇹🇭 Tailandés
- 🇻🇳 Vietnamita

## 🛠 Tecnologías Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Three.js
- GSAP
- Vercel Analytics
- Vercel Speed Insights

## 📦 Despliegue

El sitio está configurado para despliegue automático en Vercel:

1. Conectar con el repositorio de GitHub
2. Vercel detectará automáticamente la configuración de Next.js
3. El despliegue se realizará automáticamente en cada push a main

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Licencia

Copyright © 2024 Miss Star International. Todos los derechos reservados.
