# Registro de notas

Aplicación web sencilla para llevar el control de **trabajos**, **exámenes** y **nota final** por asignatura.

## Stack

- **Next.js** (App Router) — render en el mismo proyecto, sin servidor aparte para la UI
- **React Native Web** + **Gluestack UI** — componentes con estilo nativo en web
- **TypeScript**
- **MongoDB** + **Mongoose**

## Requisitos

- Node.js 18+
- MongoDB (local o [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

## Configuración

1. Instalar dependencias (si aún no lo hiciste):

```bash
npm install
```

2. Copiar variables de entorno:

```bash
copy .env.local.example .env.local
```

3. Editar `.env.local` y definir `MONGODB_URI`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/notas
```

4. Arrancar en desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Uso

- Crea una **asignatura** (ej. Historia).
- Añade **trabajos** y **exámenes** con nombre y nota (0–10).
- La **nota final** se calcula como media de todos los apuntes; puedes fijar una nota manual dejando el campo y pulsando Guardar (vacío = volver a la media).

## Scripts

| Comando        | Descripción        |
|----------------|--------------------|
| `npm run dev`  | Servidor desarrollo |
| `npm run build`| Build producción   |
| `npm run start`| Servidor producción |
