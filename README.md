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

### Error `querySrv ECONNREFUSED` (Atlas)

1. En `.env` o `.env.local`, la URI debe usar el host del **cluster** (ej. `cluster0.ky0dxiv.mongodb.net`), no el nombre del proyecto.
2. La base de datos va **después** del host: `...mongodb.net/notas?...`
3. Si sigue fallando: en Atlas → **Connect** → copia la cadena que Atlas te da tal cual, o usa la conexión **estándar** (`mongodb://`, sin `srv`).

## Uso

Las **8 asignaturas** del ciclo son fijas (no se pueden crear ni borrar en la web).

Por cada asignatura rellena:

- **T1–T9**: nota (0–10) o **NE** (no entregado; cuenta en la media como 0)
- **Examen**: una nota
- **Final**: nota final (la escribes tú)

Al salir de cada celda (o pulsar Enter) se guarda en MongoDB. La columna *Media* usa solo tareas con registro (nota o NE); las vacías no entran.

## Scripts

| Comando        | Descripción        |
|----------------|--------------------|
| `npm run dev`  | Servidor desarrollo |
| `npm run build`| Build producción   |
| `npm run start`| Servidor producción |
