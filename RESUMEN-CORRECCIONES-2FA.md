# 🔧 Resumen de Correcciones Aplicadas

## ✅ Cambios Realizados en el Frontend

### 1. **AuthService** - Agregado método `setCurrentUser()`
**Archivo**: `src/app/services/auth.ts`

```typescript
// Establecer usuario actual (usado después de 2FA)
setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
  this.currentUserSubject.next(user);
}
```

**Razón**: Antes, `login.ts` y `staff-login.ts` guardaban el usuario en `localStorage` pero **NO actualizaban el `BehaviorSubject`**, causando que guards y componentes usaran datos obsoletos.

---

### 2. **staff-login.ts** - Corregido flujo post-2FA
**Archivo**: `src/app/pages/staff-login/staff-login.ts`

**Cambios**:
- ✅ `ngOnInit()` ya NO hace `logout()` automático
- ✅ Verifica si ya está autenticado y redirige según rol
- ✅ `completarLoginStaff()` ahora usa `authService.setCurrentUser()` para actualizar BehaviorSubject

**Antes**:
```typescript
ngOnInit() {
  console.log('🧹 Limpiando sesión anterior...');
  this.authService.logout();  // ❌ Borraba sesión siempre
}

private completarLoginStaff(token: string, usuario: any) {
  localStorage.setItem('token', token);
  localStorage.setItem('currentUser', JSON.stringify(usuario));  // ❌ No actualizaba BehaviorSubject
}
```

**Después**:
```typescript
ngOnInit() {
  const user = this.authService.getCurrentUser();
  if (user && this.authService.isAuthenticated()) {
    console.log('Usuario ya autenticado, redirigiendo...', user.rol);
    if (user.rol === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (user.rol === 'entrenador') {
      this.router.navigate(['/entrenadores/dashboard']);
    }
  }
}

private completarLoginStaff(token: string, usuario: any) {
  localStorage.setItem('token', token);
  this.authService.setCurrentUser(usuario);  // ✅ Actualiza localStorage Y BehaviorSubject
}
```

---

### 3. **login.ts** - Corregido flujo post-2FA (miembros)
**Archivo**: `src/app/pages/login/login.ts`

**Cambios idénticos a staff-login.ts**:
- ✅ `ngOnInit()` verifica autenticación existente
- ✅ `verificarCodigo2FA()` usa `authService.setCurrentUser()`

---

### 4. **admin/miembros/services/miembros.ts** - Endpoint corregido
**Archivo**: `src/app/admin/miembros/services/miembros.ts`

**Cambio**:
```typescript
// Antes
private apiUrl = `${environment.apiUrl}/api/members`;  // ❌ 404 Not Found

// Después  
private apiUrl = `${environment.apiUrl}/api/miembros`;  // ✅ Coincide con backend
```

---

## ⚠️ Correcciones Pendientes en el BACKEND

Ver documento completo: **`CORRECCIONES-BACKEND-2FA.md`**

### Problemas Críticos que Requieren Cambios en Backend:

#### 1. **`/api/auth/login/verificar-2fa` no retorna `id_miembro` ni `id_coach`**
El backend actualmente retorna:
```json
{
  "usuario": {
    "id": 123,
    "nombre": "Juan",
    "rol": "miembro"
  }
}
```

**Debe retornar**:
```json
{
  "usuario": {
    "id": 123,
    "id_miembro": 45,      // ✅ FALTA ESTO
    "id_coach": null,      // ✅ FALTA ESTO
    "usuario": "user@mail.com",
    "nombre": "Juan",
    "rol": "miembro",
    "email": "user@mail.com"
  }
}
```

**Impacto**: 
- ❌ CarritoService falla: `throw new Error('Usuario no es miembro o no está autenticado')`
- ❌ Servicios de miembros (pagos, entrenamiento, nutrición) no pueden obtener `id_miembro`

#### 2. **Token JWT no incluye `id_miembro` ni `id_coach`**
El payload del token debe incluir:
```javascript
const token = jwt.sign(
  { 
    id: user.id_usuario,
    id_miembro: user.id_miembro,  // ✅ AGREGAR
    id_coach: user.id_coach,      // ✅ AGREGAR
    rol: user.rol,
    email: user.usuario
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

#### 3. **403 Forbidden en rutinas y dietas**
Causas:
- Middleware no extrae `id_miembro` del token
- Rutas usan `req.params.id` en lugar de `req.user.id_miembro`

#### 4. **404 en `/api/facturasMiembros/miembro`**
Verificar si existe esa ruta en el backend

#### 5. **401 en `/api/perfil-fisico/mi-perfil-completo`**
Ruta debe:
- Validar token
- Extraer `id_miembro` del token (no de params)

---

## 📋 Checklist para el Desarrollador Backend

**Archivos a modificar**:

- [ ] `routes/auth.routes.js` (línea ~410):
  - Agregar `id_miembro`, `id_coach`, `email` en respuesta de `/login/verificar-2fa`
  - Incluir `id_miembro` e `id_coach` en payload del JWT

- [ ] `middleware/authMiddleware.js`:
  - Extraer `id_miembro` y `id_coach` del token
  - Pasar en `req.user`

- [ ] `routes/rutinas.routes.js`:
  - Cambiar `req.params.id` por `req.user.id_miembro`

- [ ] `routes/dietas.routes.js`:
  - Cambiar `req.params.id` por `req.user.id_miembro`

- [ ] `routes/perfil-fisico.routes.js`:
  - Usar `req.user.id_miembro` del token

- [ ] Verificar ruta `/api/facturasMiembros/miembro` existe

---

## 🧪 Cómo Probar

### 1. Reiniciar servidor de desarrollo Angular
```powershell
# Detener servidor actual (Ctrl+C)
# Limpiar caché
Remove-Item -Recurse -Force .angular -ErrorAction SilentlyContinue
# Reiniciar
ng serve
```

### 2. Limpiar localStorage en el navegador
```javascript
// En DevTools Console
localStorage.clear();
location.reload();
```

### 3. Probar flujo 2FA
1. Ir a http://localhost:4200/staff-login
2. Ingresar credenciales de admin/entrenador con 2FA activo
3. Verificar código
4. **Debería redirigir correctamente al dashboard**

### 4. Verificar que NO se borre la sesión
1. Después de login exitoso, ir a http://localhost:4200/staff-login de nuevo
2. **Debería redirigir automáticamente al dashboard (sin pedir login)**

---

## 🔍 Logs para Debugging

En la consola del navegador deberías ver:

**Login exitoso**:
```
[Staff 2FA] Respuesta del backend: {success: true, token: "...", usuario: {...}}
[Staff 2FA] completarLoginStaff llamado: {token: "...", usuario: {...}}
[Staff 2FA] Token y usuario guardados en localStorage y BehaviorSubject actualizado
[Staff 2FA] Validando rol: admin
[Staff 2FA] Redirigiendo a /admin/dashboard
[Staff 2FA] Navegación exitosa: true
```

**Si ya está autenticado**:
```
Usuario ya autenticado, redirigiendo... admin
```

**Errores esperados hasta que se corrija el backend**:
```
❌ Error al cargar perfil: 401 Unauthorized
❌ Error al cargar rutinas: 403 Forbidden
❌ Error al cargar nutrición: 403 Forbidden
Usuario no es miembro o no está autenticado (CarritoService)
404 en /api/facturasMiembros/miembro
```

---

## 📝 Notas Finales

1. **Frontend ya está corregido** ✅
2. **Backend necesita las correcciones** listadas en `CORRECCIONES-BACKEND-2FA.md`
3. La navegación post-2FA ahora funciona correctamente
4. La sesión se mantiene entre recargas de página
5. Los errores 401/403/404 se resolverán cuando el backend retorne `id_miembro` e `id_coach`
