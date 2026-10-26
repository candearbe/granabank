
# GranaBank

Proyecto desarrollado para un challenge técnico. La aplicación simula un home banking donde el usuario puede iniciar sesión, consultar su saldo y visualizar sus movimientos.

## Demo

- Web: https://granabank-rho.vercel.app
- Repositorio: https://github.com/candearbe/granabank

## Tecnologías

- Next.js y React
- TypeScript
- Tailwind CSS
- PostgreSQL (Neon)
- Prisma ORM
- Vercel

## Funcionalidades

- Login y cierre de sesión.
- Home con saldo y últimos movimientos.
- Listado de movimientos con buscador y filtros.
- Detalle de cada movimiento.
- Rutas protegidas para usuarios autenticados.

## Cómo ejecutar el proyecto

1. Clonar el repositorio:

```bash
git clone https://github.com/candearbe/granabank.git
cd granabank
```

2. Instalar las dependencias:

```bash
pnpm install
```

3. Crear un archivo `.env` en la raíz del proyecto con estas variables:

```env
DATABASE_URL="conexion_postgresql"
DEMO_EMAIL="email_de_prueba"
DEMO_PASSWORD="password_de_prueba"
SESSION_SECRET="clave_secreta"
```

4. Generar el cliente de Prisma:

```bash
pnpm exec prisma generate
```

5. Iniciar el servidor:

```bash
pnpm dev
```

Abrir http://localhost:3000.

Para probar el login se utilizan las credenciales definidas en las variables de entorno.

## Decisiones técnicas

Utilicé Next.js para trabajar el frontend y las rutas de API dentro del mismo proyecto.

Los movimientos se almacenan en PostgreSQL y se consultan mediante Prisma. Para el login implementé una sesión con cookies HTTP-only y JWT, protegiendo las rutas privadas.

El despliegue está realizado en Vercel y la base de datos está alojada en Neon.

## Posibles mejoras

- Implementar un sistema de usuarios con contraseñas cifradas.
- Obtener el saldo directamente de la base de datos.
- Agregar paginación al listado de movimientos.
- Incorporar tests automatizados.
