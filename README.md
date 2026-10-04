# MantenApp

App móvil híbrida (Ionic + Angular + Capacitor) para **registrar y controlar las mantenciones de un vehículo**: qué se le hizo, cuándo, a cuántos km y cuánto costó. Reemplaza la libreta o las fotos de boletas sueltas.

## Funciones
- Crear, listar, editar y eliminar mantenciones (con confirmación antes de eliminar).
- Buscar por vehículo, tipo o nota; total gastado según el filtro.
- Formulario reactivo con validaciones visibles (campos obligatorios, mínimo de caracteres, valores no negativos, fecha no futura).
- Datos guardados en el dispositivo (localStorage), sin backend.

## Estructura
```
src/app/
├── components/mantencion-item/   tarjeta de una mantención (presentación)
├── home/                         página de lista + búsqueda
├── form/                         página de crear/editar (Reactive Forms)
├── models/mantencion.model.ts    interface Mantencion y tipos
├── services/mantencion.service.ts  fuente de datos (BehaviorSubject / Observable)
├── app.routes.ts                 rutas con loadComponent
└── app.component.ts
```

## Comandos
```bash
npm install                     # instala dependencias
npm start                       # navegador en http://localhost:4200
npm run build                   # ng build -> genera www/
npx cap sync android            # copia www/ a android/ y actualiza plugins
npx cap open android            # abre Android Studio
npx cap run android             # compila y ejecuta en el emulador
```
Si la carpeta `android/` no existe: `npx cap add android` (una sola vez).

## Requisitos
Node.js 20+ / 22, Android Studio con SDK, JDK 21 y un emulador (AVD) creado.
