# Barber App

Aplicacion web para administrar una barberia: catalogo publico de servicios, reservas online, clientes, barberos, agenda y panel administrativo.

## Stack

- Next.js 16 con App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 7 con PostgreSQL
- Better Auth con Google OAuth
- React Hook Form + Zod
- Vitest y Node test runner

## Funcionalidades

- Landing publica con identidad visual premium para barberia.
- Catalogo de servicios por categoria.
- Reservas publicas con URL legible: `/reservar?servicio=corte-cabello`.
- Seleccion de servicio, barbero opcional, fecha y horario disponible.
- Calculo de disponibilidad por barbero y duracion real del servicio.
- Duracion variable por barbero mediante la relacion `BarberService`.
- Creacion de reservas transaccional con bloqueo por fecha para reducir doble booking concurrente.
- Clientes con telefono unico y email unico opcional.
- Busqueda de cliente por telefono chileno completo.
- Panel admin protegido por login Google y lista de emails admin.
- Dashboard con metricas reales.
- Agenda diaria con grilla por hora y barbero.
- Administracion de reservas, historial, clientes, servicios y barberos.

## Requisitos

- Node.js compatible con Next.js 16
- PostgreSQL
- Credenciales de Google OAuth para login admin

## Variables De Entorno

Crea un archivo `.env` con las variables necesarias:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="cambia-este-secreto"

GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"

ADMIN_EMAILS="admin@correo.com"
```

`ADMIN_EMAILS` acepta varios correos separados por coma.

## Instalacion

```bash
npm install
npx prisma generate
npx prisma migrate dev
```

Para cargar datos iniciales si corresponde:

```bash
npx prisma db seed
```

## Desarrollo

```bash
npm run dev
```

Abre `http://localhost:3000`.

## Scripts

```bash
npm run dev              # servidor de desarrollo
npm run build            # build de produccion
npm run start            # ejecutar build
npm run lint             # ESLint
npm run test             # tests con node:test
npm run test:components  # tests con Vitest
npm run test:all         # todos los tests
```

## Modelo De Reserva

El servicio tiene una duracion base (`Service.durationMin`). Cada barbero puede sobrescribir esa duracion por servicio desde el admin usando `BarberService.durationMin`.

Cuando el usuario elige un barbero, la disponibilidad se calcula solo contra ese barbero. Si elige cualquier barbero, el sistema busca un barbero activo disponible para ese horario.

La reserva guarda una copia del nombre, precio y duracion del servicio al momento de reservar. Esto evita que cambios futuros en el catalogo alteren reservas antiguas.

## Clientes

Los clientes usan telefono chileno unico con formato `+569XXXXXXXX`. El email es opcional, pero cuando se ingresa tambien es unico.

Si ya existe un cliente con el mismo telefono, la reserva reutiliza ese cliente. Si el email ingresado pertenece a otro cliente, la reserva se rechaza con un mensaje de validacion.

## Admin

El panel admin vive en `/admin`. El acceso requiere sesion Google y que el correo este incluido en `ADMIN_EMAILS`.

Secciones principales:

- `/admin`: metricas generales.
- `/admin/agenda`: agenda diaria, proximas citas y grilla por barbero.
- `/admin/reservas`: reservas activas.
- `/admin/historial`: reservas completadas, canceladas o no presentadas.
- `/admin/clientes`: clientes registrados.
- `/admin/servicios`: servicios y categorias.
- `/admin/barberos`: equipo, servicios atendidos y duraciones por servicio.

## Prisma

Comandos utiles:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

En produccion usa migraciones con:

```bash
npx prisma migrate deploy
```

## Validacion Antes De Deploy

```bash
npm run lint
npx tsc --noEmit
npm run test:all
npm run build
```
