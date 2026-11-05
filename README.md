# Portfolio

![Portfolio preview](public/og-image.png)

Personal portfolio built with React, TypeScript, and Vite.

## Development

Use Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

Vite prints the local development URL in the terminal.

## Checks and production build

```sh
npm run lint
npm run build
npm run preview
```

The production build is written to `dist/`. The preview command serves it locally.

## Project structure

- `src/`: React components, portfolio content, styles, fonts, images, and local animation code.
- `public/`: Static assets copied into the build.
- `src/content.ts`: Profile links, biography, and skills.
- `index.html`: Page metadata and application entry point.
- `vite.config.ts`, `tsconfig*.json`, `.oxlintrc.json`: Development tooling configuration.
- `package-lock.json`: Locked dependencies; keep this committed for reproducible installs.

Dependencies (`node_modules/`), generated output (`dist/`), caches, and local environment files are excluded from Git. Font licensing is retained alongside the font assets.
