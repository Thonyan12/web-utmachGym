# Gym Frontend - Sistema de Gestión para Gimnasios

Frontend completo para la gestión de un gimnasio desarrollado con Angular 20. Incluye sistema de doble factor (2FA), gestión de miembros, entrenadores, productos, facturación y notificaciones en tiempo real con diseño moderno y responsivo.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Módulos Principales](#módulos-principales)
- [Uso](#uso)
- [Scripts Disponibles](#scripts-disponibles)
- [Autenticación y Seguridad](#autenticación-y-seguridad)
- [Sistema 2FA](#sistema-2fa)
- [WebSockets](#websockets)
- [Roles y Permisos](#roles-y-permisos)
- [Componentes Clave](#componentes-clave)
- [Servicios](#servicios)
- [Guards](#guards)
- [Solución de Problemas](#solución-de-problemas)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Características

### Autenticación Avanzada
- Sistema de login con JWT
- Autenticación de doble factor (2FA) obligatoria por correo electrónico
- Registro de usuarios con verificación por email
- Guards de protección de rutas por roles
- Interceptor HTTP para inyección automática de tokens

### Panel de Administración
- Dashboard con estadísticas en tiempo real
- CRUD completo de miembros
- CRUD completo de entrenadores
- Gestión de productos e inventario
- Sistema de facturación completo
- Gestión de mensualidades
- Control de asistencias
- Notificaciones en tiempo real

### Panel de Entrenadores
- Dashboard personalizado
- Gestión de miembros asignados
- Creación y asignación de rutinas
- Creación y asignación de dietas
- Control de asistencias
- Perfil físico y seguimiento de progreso
- Sistema de notificaciones

### Panel de Miembros
- Dashboard con información personalizada
- Visualización de rutinas asignadas
- Visualización de dietas
- Perfil físico y progreso
- Historial de pagos
- Tienda de productos
- Sistema de notificaciones

### Diseño y UX
- Interfaz moderna con Bootstrap 5
- Diseño responsivo (móvil, tablet, desktop)
- Animaciones fluidas
- Iconos Bootstrap Icons
- Temas personalizados por módulo
- Sidebars colapsables

## Tecnologías

### Frontend Core
- **Angular 20** - Framework principal
- **TypeScript 5.8** - Lenguaje de programación
- **RxJS 7.8** - Programación reactiva

### UI/UX
- **Bootstrap 5** - Framework CSS
- **Bootstrap Icons** - Iconografía
- **CSS3** - Estilos personalizados

### Comunicación
- **Socket.IO Client 4.8** - WebSockets para tiempo real
- **HTTP Client** - Comunicación con API REST

### Seguridad
- **BCrypt 6.0** - Encriptación (lado cliente)
- **JWT** - Tokens de autenticación

### Herramientas de Desarrollo
- **Angular CLI 20** - Herramientas de desarrollo
- **Karma + Jasmine** - Testing unitario

## Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Angular CLI** >= 20.0.0
- **Git** (opcional)
- **Backend del proyecto** corriendo en `http://localhost:3000`

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Thonyan12/web-utmachGym.git
cd web-utmachGym
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Instalar Angular CLI globalmente (si no lo tienes)

```bash
npm install -g @angular/cli@20
```

### 4. Configurar el backend

Asegúrate de tener el backend corriendo en `http://localhost:3000`. Ver configuración en [proxy.conf.json](./proxy.conf.json).

## Configuración

### Configuración del Proyecto

El proyecto se conecta automáticamente al backend a través de un sistema de proxy que redirige las peticiones del navegador al servidor.

**Configuraciones importantes:**
- Puerto de desarrollo: `4200` (donde se abre la aplicación en el navegador)
- Puerto del backend: `3000` (donde corre el servidor)
- Archivos SQL disponibles en carpeta `public/`
- Estilos personalizados con Bootstrap 5

## Estructura del Proyecto

```
web-utmachGym/
├── public/                         # Archivos públicos
│   ├── datosinsertados.sql        # Datos de prueba
│   ├── funciones.sql              # Funciones de BD
│   └── script.sql                 # Script inicial de BD
├── src/
│   ├── app/
│   │   ├── admin/                 # Módulo de administración
│   │   │   ├── admin-layout/      # Layout principal admin
│   │   │   ├── dashboard/         # Dashboard admin
│   │   │   ├── miembros/          # Gestión de miembros
│   │   │   │   ├── miembros-crear/
│   │   │   │   ├── miembros-detalle/
│   │   │   │   ├── miembros-editar/
│   │   │   │   ├── miembros-eliminar/
│   │   │   │   ├── miembros-listar/
│   │   │   │   ├── miembros-sidebar/
│   │   │   │   └── services/
│   │   │   ├── entrenadores/      # Gestión de entrenadores
│   │   │   ├── productos/         # Gestión de productos
│   │   │   ├── facturas/          # Gestión de facturas
│   │   │   ├── mensualidades/     # Gestión de mensualidades
│   │   │   ├── detallefactura/    # Detalles de facturas
│   │   │   └── notificaciones/    # Notificaciones admin
│   │   ├── entrenadores/          # Módulo de entrenadores
│   │   │   ├── entrenadores-layout/
│   │   │   ├── dashboard/
│   │   │   ├── mis-miembros/
│   │   │   ├── rutinas/
│   │   │   ├── asistencia/
│   │   │   ├── perfil/
│   │   │   ├── notificaciones/
│   │   │   └── services/
│   │   ├── miembros/              # Módulo de miembros
│   │   │   ├── miembros-layout/
│   │   │   ├── dashboard/
│   │   │   ├── mi-perfil/
│   │   │   ├── entrenamiento/
│   │   │   ├── nutricion/
│   │   │   ├── pagos/
│   │   │   ├── tienda/
│   │   │   ├── notificacion/
│   │   │   └── services/
│   │   ├── pages/                 # Páginas públicas
│   │   │   ├── landing/           # Página principal
│   │   │   ├── login/             # Login con 2FA
│   │   │   ├── registro/          # Registro con verificación
│   │   │   ├── staff-login/       # Login para staff
│   │   │   ├── contacto/
│   │   │   ├── politicas/
│   │   │   └── terminos/
│   │   ├── guards/                # Guards de protección
│   │   │   ├── auth-guard.ts
│   │   │   ├── admin-guard.ts
│   │   │   ├── entrenador-guard.ts
│   │   │   └── miembro-guard.ts
│   │   ├── interceptors/          # Interceptores HTTP
│   │   │   └── auth-interceptor.ts
│   │   ├── services/              # Servicios globales
│   │   │   ├── auth.ts
│   │   │   ├── miembros.ts
│   │   │   └── socket.service.ts
│   │   ├── app.config.ts          # Configuración de la app
│   │   ├── app.routes.ts          # Rutas principales
│   │   └── app.ts                 # Componente raíz
│   ├── environments/              # Variables de entorno
│   ├── typings/                   # Definiciones TypeScript
│   ├── index.html                 # HTML principal
│   ├── main.ts                    # Punto de entrada
│   └── styles.css                 # Estilos globales
├── angular.json                   # Configuración Angular
├── package.json                   # Dependencias
├── proxy.conf.json                # Configuración de proxy
├── tsconfig.json                  # Configuración TypeScript
└── README.md                      # Este archivo
```

## Módulos Principales

### 1. Módulo de Autenticación (pages/)

**Login (`login/`)**
- Login con 2FA obligatorio
- Validación de credenciales
- Ingreso de código de 6 dígitos enviado por email
- Temporizador de expiración (10 minutos)
- Redirección según rol (admin/entrenador/miembro)

**Registro (`registro/`)**
- Registro en 3 pasos:
  1. Verificación de email (código 6 dígitos)
  2. Formulario de datos personales
  3. Confirmación y credenciales generadas
- Validaciones en tiempo real
- Integración con API de verificación

**Staff Login (`staff-login/`)**
- Login específico para administradores y entrenadores
- Sin restricciones de rol

### 2. Módulo de Administración (admin/)

**Dashboard**
- Estadísticas generales del gimnasio
- Gráficos de rendimiento
- Alertas y notificaciones

**Gestión de Miembros**
- Listado con búsqueda y filtros
- Crear nuevo miembro
- Ver detalle completo
- Editar información
- Eliminar/Desactivar
- Sidebar con acciones rápidas

**Gestión de Entrenadores**
- CRUD completo de entrenadores
- Asignación de miembros
- Historial de actividades

**Gestión de Productos**
- Inventario de productos
- Control de stock
- Precios y categorías

**Facturación**
- Creación de facturas
- Detalle de facturas
- Historial de pagos
- Reportes

**Mensualidades**
- Control de mensualidades de miembros
- Pagos pendientes
- Recordatorios automáticos

### 3. Módulo de Entrenadores (entrenadores/)

**Dashboard Entrenador**
- Vista general de miembros asignados
- Tareas pendientes
- Notificaciones

**Mis Miembros**
- Listado de miembros asignados
- Progreso individual
- Perfil físico y medidas

**Rutinas**
- Crear rutinas personalizadas
- Asignar rutinas a miembros
- Biblioteca de ejercicios

**Dietas**
- Crear planes alimenticios
- Asignar dietas a miembros
- Control de macros

**Asistencia**
- Registro de asistencias
- Historial de asistencias

**Perfil**
- Perfil del entrenador
- Configuración de cuenta

### 4. Módulo de Miembros (miembros/)

**Dashboard Miembro**
- Resumen de actividad
- Próximas rutinas
- Estado de mensualidad

**Mi Perfil**
- Información personal
- Perfil físico y medidas
- Progreso fotográfico

**Entrenamiento**
- Rutinas asignadas
- Historial de entrenamientos
- Ejercicios pendientes

**Nutrición**
- Dietas asignadas
- Plan alimenticio
- Seguimiento de comidas

**Pagos**
- Historial de facturas
- Pagos pendientes
- Descargar comprobantes

**Tienda**
- Productos disponibles
- Carrito de compras
- Realizar pedidos

## Uso

### Iniciar el servidor de desarrollo

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`. Se recargará automáticamente al modificar archivos.

### Iniciar con proxy (recomendado)

```bash
ng serve --proxy-config proxy.conf.json
```

### Construir para producción

```bash
ng build
```

Los archivos de producción se generarán en `dist/web-utmach-gym/`.

### Construir con optimizaciones

```bash
ng build --configuration production
```

### Ejecutar tests

```bash
ng test
```

### Generar componentes

```bash
# Generar componente
ng generate component admin/nuevo-componente

# Generar servicio
ng generate service services/nuevo-servicio

# Generar guard
ng generate guard guards/nuevo-guard
```

## Scripts Disponibles

```bash
npm start              # Iniciar servidor de desarrollo (ng serve)
npm run build          # Construir para producción
npm run watch          # Construir en modo watch
npm test              # Ejecutar tests unitarios
ng generate --help    # Ver opciones de generación de código
```

## Autenticación y Seguridad

### JWT (JSON Web Tokens)

El sistema utiliza JWT para autenticación stateless:

- **Storage**: `localStorage` con clave `token`
- **Formato**: `Bearer {token}`
- **Expiración**: 24 horas (configurado en backend)
- **Payload**: `{ id, rol, email }`

### Interceptor de Autenticación

El sistema cuenta con un interceptor automático que:
- Agrega tu token de autenticación a cada petición al servidor
- Detecta cuando tu sesión ha expirado
- Te redirige automáticamente al login si es necesario
- Maneja errores de autorización de forma transparente

### Protección de Rutas (Guards)

El sistema cuenta con mecanismos de seguridad que protegen las diferentes áreas:

- **AuthGuard**: Verifica que el usuario esté logueado antes de acceder a cualquier página protegida
- **AdminGuard**: Solo permite el acceso a administradores en las páginas de administración
- **EntrenadorGuard**: Protege las páginas exclusivas de entrenadores
- **MiembroGuard**: Protege las páginas exclusivas de miembros

Si intentas acceder a una página sin los permisos necesarios, automáticamente te redirige al login o a la página principal.

### Flujo de Autenticación

1. Usuario accede a `/login`
2. Ingresa credenciales (email/contraseña)
3. Backend valida y envía código 2FA por email
4. Usuario ingresa código de 6 dígitos
5. Backend valida código y retorna JWT
6. Frontend almacena token en localStorage
7. Interceptor agrega token a todas las peticiones
8. Guards protegen rutas según rol

## Sistema 2FA

Sistema de autenticación de dos factores **OBLIGATORIO** por correo electrónico.

### Características

- **Obligatorio**: Todos los usuarios deben verificar con código
- **Códigos**: 6 dígitos aleatorios
- **Expiración**: 10 minutos
- **Un solo uso**: Código se invalida después de usarse
- **Email HTML**: Plantilla profesional con branding

### Cómo Funciona el Login con 2FA

**Paso 1: Ingresar tus datos**
- Escribes tu email y contraseña
- El sistema valida que sean correctos
- Automáticamente envía un código de 6 dígitos a tu email
- Se activa un temporizador de 10 minutos

**Paso 2: Verificar el código**
- Recibes el email con el código
- Ingresas los 6 dígitos en la pantalla
- El sistema valida el código
- Si es correcto, accedes al sistema según tu rol (admin/entrenador/miembro)

### Cómo Funciona el Registro

**Paso 1: Solicitar código de verificación**
- Ingresas tu email
- El sistema envía un código de 6 dígitos
- Recibes el email con el código

**Paso 2: Completar tu información**
- Ingresas el código de verificación
- Llenas el formulario con tus datos personales
- Envías la información

**Paso 3: Recibir tus credenciales**
- El sistema genera automáticamente tu usuario y contraseña
- Se muestran en pantalla (debes guardarlos)
- Ya puedes iniciar sesión con esas credenciales

### Pantalla de Verificación 2FA

Cuando ingresas tus credenciales, aparece una pantalla especial que muestra:

- **Mensaje de confirmación**: Indica que se envió el código a tu email (parcialmente oculto por seguridad)
- **Campo de 6 dígitos**: Donde ingresas el código que recibiste
- **Temporizador**: Muestra el tiempo restante (10 minutos) antes de que expire el código
- **Botón Verificar**: Para enviar el código y completar el login
- **Botón Cancelar**: Para volver a la pantalla de credenciales

Si el tiempo se agota, deberás volver a iniciar el proceso de login.

## WebSockets

Sistema de notificaciones en tiempo real con Socket.IO.

### Sistema de Notificaciones en Tiempo Real

La aplicación utiliza WebSockets (Socket.IO) para enviar notificaciones instantáneas:

**Funcionalidades:**
- Recibir notificaciones sin necesidad de recargar la página
- Actualizaciones automáticas de datos
- Chat en tiempo real (si aplica)
- Eventos del sistema en vivo

**Eventos que puedes recibir:**
- Nuevas notificaciones
- Actualizaciones de información
- Mensajes del sistema

## Roles y Permisos

### Roles Disponibles

| Rol | Código | Descripción |
|-----|--------|-------------|
| Administrador | `admin` | Acceso total al sistema |
| Entrenador | `entrenador` | Gestión de rutinas, dietas, miembros asignados |
| Miembro | `miembro` | Acceso a perfil, rutinas, tienda |

### Matriz de Permisos

| Funcionalidad | Admin | Entrenador | Miembro |
|---------------|-------|------------|---------|
| Dashboard propio | ✅ | ✅ | ✅ |
| Ver todos los miembros | ✅ | ❌ | ❌ |
| Ver miembros asignados | ✅ | ✅ | ❌ |
| Crear/Editar miembros | ✅ | ❌ | ❌ |
| Crear/Asignar rutinas | ✅ | ✅ | ❌ |
| Ver rutinas propias | ✅ | ✅ | ✅ |
| Crear/Asignar dietas | ✅ | ✅ | ❌ |
| Ver dietas propias | ✅ | ✅ | ✅ |
| Gestionar productos | ✅ | ❌ | ❌ |
| Comprar productos | ✅ | ❌ | ✅ |
| Ver facturas todas | ✅ | ❌ | ❌ |
| Ver facturas propias | ✅ | ✅ | ✅ |
| Gestionar entrenadores | ✅ | ❌ | ❌ |
| Registro de asistencias | ✅ | ✅ | ❌ |
| Ver asistencias propias | ✅ | ✅ | ✅ |

### Redirección Automática según Rol

Cuando inicias sesión exitosamente, el sistema te redirige automáticamente a tu panel correspondiente:

- **Miembros**: Dashboard de miembro con rutinas, dieta y pagos
- **Entrenadores**: Dashboard de entrenador con miembros asignados y rutinas
- **Administradores**: Dashboard de administración con estadísticas generales

Esto sucede automáticamente después de verificar tu código 2FA.

## Componentes Clave

### 1. Login Component

**Ubicación**: `src/app/pages/login/`

**Funcionalidad**:
- Sistema de login en 2 pasos obligatorios
- Validación de datos ingresados
- Temporizador de 10 minutos para el código
- Redirección automática según tu rol
- Mensajes de error claros y amigables

### 2. Registro Component

**Ubicación**: `src/app/pages/registro/`

**Funcionalidad**:
- Registro en 3 pasos
- Verificación de email con código
- Formulario reactivo con validaciones
- Generación automática de credenciales

**Pasos**:
1. **formulario** - Ingreso de email
2. **verificacion** - Código de 6 dígitos
3. **exito** - Credenciales generadas

### 3. Admin Layout

**Ubicación**: `src/app/admin/admin-layout/`

**Funcionalidad**:
- Layout principal del módulo admin
- Sidebar con navegación
- Header con perfil de usuario
- Notificaciones en tiempo real
- Responsive design

### 4. Miembros Listar

**Ubicación**: `src/app/admin/miembros/miembros-listar/`

**Funcionalidad**:
- Tabla de miembros con búsqueda
- Filtros por estado, entrenador
- Paginación
- Acciones rápidas (ver, editar, eliminar)

### 5. Dashboard Components

Cada rol tiene su dashboard personalizado:

- **Admin Dashboard**: `src/app/admin/dashboard/`
  - Estadísticas generales
  - Gráficos de ingresos
  - Miembros activos/inactivos
  - Alertas de pagos pendientes

- **Entrenador Dashboard**: `src/app/entrenadores/dashboard/`
  - Miembros asignados
  - Rutinas pendientes
  - Asistencias del día

- **Miembro Dashboard**: `src/app/miembros/dashboard/`
  - Rutina del día
  - Próximo pago
  - Progreso físico

## Servicios

### 1. Servicio de Autenticación (AuthService)

**Ubicación**: `src/app/services/auth.ts`

**Funciones principales**:

- **Login tradicional**: Iniciar sesión sin 2FA (método antiguo)
- **Validar credenciales**: Primer paso del login con 2FA
- **Verificar código 2FA**: Segundo paso del login
- **Enviar código de registro**: Solicitar código para nuevo usuario
- **Completar registro**: Finalizar creación de cuenta nueva
- **Verificar autenticación**: Comprobar si estás logueado
- **Obtener rol**: Saber qué tipo de usuario eres
- **Verificar permisos**: Comprobar si tienes acceso a ciertas funciones
- **Cerrar sesión**: Salir del sistema

### 2. Servicio de Miembros (MiembrosService)

**Ubicación**: `src/app/admin/miembros/services/miembros.service.ts`

**Funciones principales**:

- **Ver todos los miembros**: Obtener lista completa
- **Ver un miembro específico**: Obtener detalles de un miembro
- **Crear nuevo miembro**: Registrar un miembro nuevo
- **Actualizar miembro**: Modificar información existente
- **Eliminar miembro**: Dar de baja un miembro
- **Ver miembros por entrenador**: Listar miembros asignados a un entrenador
- **Asignar entrenador**: Vincular un miembro con un entrenador

### 3. SocketService

**Ubicación**: `src/app/services/socket.service.ts`

Ver sección [WebSockets](#websockets) para detalles completos.

## Guards

### Cómo se Protegen las Rutas

La aplicación organiza sus páginas en tres grupos principales:

**Páginas Públicas** (sin necesidad de login):
- Página principal
- Login
- Registro
- Contacto
- Políticas y términos

**Área de Administración** (solo administradores):
- Requiere estar logueado
- Requiere rol de administrador
- Si no cumples los requisitos, te redirige al inicio

**Área de Entrenadores** (solo entrenadores):
- Requiere estar logueado
- Requiere rol de entrenador
- Si no cumples los requisitos, te redirige al inicio

**Área de Miembros** (solo miembros):
- Requiere estar logueado
- Requiere rol de miembro
- Si no cumples los requisitos, te redirige al inicio

## Solución de Problemas

### Error: No se puede enlazar un campo de entrada

**Síntoma**:
Aparece un mensaje de error que dice que no se puede enlazar `ngModel` a un campo input.

**Solución**:
Este es un problema técnico de configuración de módulos de Angular. El desarrollador debe agregar el módulo FormsModule a las importaciones del componente afectado.

### Error: CORS Policy

**Síntoma**:
```
Access to fetch at 'http://localhost:3000/api/...' from origin 'http://localhost:4200' 
has been blocked by CORS policy
```

**Solución**:
1. Verificar configuración de proxy en `proxy.conf.json`
2. Iniciar con: `ng serve --proxy-config proxy.conf.json`
3. Verificar que el backend tenga CORS habilitado

### Error: Token Inválido

**Síntoma**:
```
401 Unauthorized - Token inválido
```

**Solución**:
1. Verificar que el token esté en localStorage: `localStorage.getItem('token')`
2. Hacer logout y login nuevamente
3. Verificar que el interceptor esté configurado en `app.config.ts`

### Error: No se recibe el código 2FA

**Síntoma**:
El código de verificación no llega al correo electrónico.

**Solución**:
1. Verificar configuración de email en el backend (`.env`)
2. Revisar carpeta de spam
3. Verificar que el correo esté registrado correctamente
4. Comprobar logs del backend: `nodemon index.js`

### Error: El temporizador no funciona correctamente

**Síntoma**:
El contador de tiempo restante en la verificación 2FA no aparece o no cuenta hacia atrás.

**Solución**:
Este es un problema técnico con el código del temporizador. El desarrollador debe verificar que:
1. El temporizador se limpie correctamente cuando se sale de la pantalla
2. El formato de minutos:segundos se calcule correctamente
3. Los intervalos se ejecuten cada segundo

### Error: No se puede compilar por Socket.IO

**Síntoma**:
Aparece un error que dice que no se encuentra la definición de `io` al intentar compilar el proyecto.

**Solución**:
Es necesario crear un archivo de definiciones de tipos para Socket.IO. El desarrollador debe crear el archivo `src/typings/socket-io-client.d.ts` con las definiciones necesarias.

### Los guards no redirigen correctamente

**Síntoma**:
Los sistemas de protección de páginas no funcionan como deberían y no redirigen según el rol esperado.

**Solución**:
El desarrollador debe verificar:
1. Que los guards estén en el orden correcto (primero verificar login, luego verificar rol)
2. Que el guard obtenga correctamente el rol del usuario
3. Que las redirecciones se hagan a las rutas correctas
4. Que el servicio de autenticación funcione correctamente

## Contribución

### Proceso de Contribución

1. Fork del proyecto
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'feat: Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de Código

#### Nomenclatura
- **Componentes**: PascalCase (`MiembrosListarComponent`)
- **Servicios**: PascalCase + Service (`MiembrosService`)
- **Variables**: camelCase (`emailOfuscado`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`)
- **Archivos**: kebab-case (`miembros-listar.component.ts`)

#### Estructura de Componentes

Cada componente debe seguir un orden lógico:
1. Propiedades públicas (que se usan en la plantilla HTML)
2. Propiedades privadas (uso interno)
3. Constructor (donde se inyectan los servicios necesarios)
4. Métodos del ciclo de vida (inicialización, destrucción)
5. Métodos públicos (acciones del usuario)
6. Métodos privados (lógica interna)
7. Getters y Setters (propiedades calculadas)

#### Comentarios

Cada función importante debe tener un comentario que explique:
- Qué hace la función
- Qué parámetros recibe (si los tiene)
- Qué devuelve (si devuelve algo)

Dentro del código, agregar comentarios solo en partes complejas que requieran explicación adicional.

### Convenciones de Commits

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Tipos**:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato, punto y coma, etc (no afecta código)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

**Ejemplos**:
```bash
feat(auth): agregar sistema 2FA obligatorio
fix(miembros): corregir filtro por entrenador
docs(readme): actualizar sección de instalación
style(login): formatear código con prettier
refactor(services): extraer lógica común a servicio base
test(guards): agregar tests unitarios para admin guard
chore(deps): actualizar Angular a v20
```

## Licencia

ISC

## Autor

Desarrollado por: **antho**

---

**Universidad Técnica de Machala (UTMACH)**  
Sistema de Gestión de Gimnasio - Proyecto Educativo

### Enlaces Relacionados

- **Backend**: [gym-backend](https://github.com/Thonyan12/gym-backend)
- **Documentación Backend**: Ver README del backend para configuración de API

### Contacto y Soporte

Para más información, reportar bugs o solicitar features:
- Crear issue en GitHub
- Contactar al equipo de desarrollo

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2025  
**Angular Version**: 20.0.0  
**Node Version**: >= 18.0.0
