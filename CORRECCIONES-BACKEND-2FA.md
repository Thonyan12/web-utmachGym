# 🔧 Correcciones Necesarias en el Backend

## ❌ Problema 1: `/api/auth/login/verificar-2fa` no retorna `id_miembro` ni `id_coach`

**Ubicación**: `routes/auth.routes.js` línea ~410-425

**Código Actual**:
```javascript
res.json({
  success: true,
  message: 'Autenticación exitosa',
  token: token,
  usuario: {
    id: user.id_usuario,
    nombre: user.nombre,
    rol: user.rol
  }
});
```

**Código Corregido**:
```javascript
res.json({
  success: true,
  message: 'Autenticación exitosa',
  token: token,
  usuario: {
    id: user.id_usuario,
    id_miembro: user.id_miembro,     // ✅ AGREGAR
    id_coach: user.id_coach,         // ✅ AGREGAR
    usuario: user.usuario,            // ✅ AGREGAR (username/email)
    nombre: user.nombre,
    rol: user.rol,
    email: user.usuario              // ✅ AGREGAR
  }
});
```

**Razón**: 
- `CarritoService` necesita `id_miembro` para obtener el carrito
- Otros servicios de miembros (`pagos.ts`, `entrenamiento.ts`, `nutricion.ts`) necesitan `id_miembro`
- Servicios de entrenador necesitan `id_coach`

---

## ❌ Problema 2: Error 404 en `/api/members`

**Error en consola**:
```
404 Not Found: http://localhost:3000/api/members
```

**Posible causa**: 
- El endpoint del admin usa `/api/members` pero el backend tiene `/api/miembros`
- O el backend no tiene esa ruta configurada

**Verificar**:
1. Abrir `routes/` del backend
2. Buscar `router.get('/members'` o `router.get('/miembros'`
3. Confirmar si existe y cuál es la ruta correcta

**Solución Frontend** (si backend usa `/api/miembros`):
- Cambiar en `src/app/admin/miembros/services/miembros.ts`:
```typescript
private apiUrl = 'http://localhost:3000/api/miembros'; // Era /api/members
```

---

## ❌ Problema 3: Error 403 en rutinas y dietas

**Errores**:
```
403 Forbidden: /api/rutinas/mis-rutinas
403 Forbidden: /api/dietas/miembro/plan-completo
```

**Causa probable**: Middleware de autenticación no reconoce el token o el rol

**Verificar en Backend**:
1. Middleware `authMiddleware.js` debe extraer `id_miembro` del token JWT
2. El token debe incluir `id_miembro` en el payload:
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

3. Rutas `/api/rutinas` y `/api/dietas` deben:
   - Usar `req.user.id_miembro` (no `req.params.id`)
   - Verificar rol antes de permitir acceso

---

## ❌ Problema 4: Error 404 en facturas

**Error**:
```
404 Not Found: /api/facturasMiembros/miembro
```

**Verificar**: 
- ¿Existe la ruta en el backend?
- ¿Debería ser `/api/facturas/miembro/:id`?

---

## ❌ Problema 5: Error 401 en perfil físico

**Error**:
```
401 Unauthorized: /api/perfil-fisico/mi-perfil-completo
```

**Causa**: Token no válido o no enviado

**Verificar**:
1. `auth-interceptor.ts` debe agregar header:
```typescript
Authorization: `Bearer ${token}`
```
2. Backend debe validar token en esta ruta
3. Backend debe extraer `id_miembro` del token (no de params)

---

## 📋 Checklist de Correcciones Backend

- [ ] **auth.routes.js**: Agregar `id_miembro`, `id_coach`, `email` en respuesta de `/login/verificar-2fa`
- [ ] **auth.routes.js**: Incluir `id_miembro` e `id_coach` en payload del token JWT
- [ ] Verificar ruta `/api/members` existe o cambiar a `/api/miembros`
- [ ] **authMiddleware.js**: Extraer y pasar `id_miembro` y `id_coach` en `req.user`
- [ ] **rutinas.routes.js**: Usar `req.user.id_miembro` en lugar de `req.params.id`
- [ ] **dietas.routes.js**: Usar `req.user.id_miembro` en lugar de `req.params.id`
- [ ] Verificar ruta `/api/facturasMiembros/miembro` existe
- [ ] **perfil-fisico.routes.js**: Validar token y usar `req.user.id_miembro`

---

## 🔐 Estructura de Token JWT Correcta

```javascript
{
  id: user.id_usuario,          // ID en tabla usuario
  id_miembro: user.id_miembro,  // ✅ ID en tabla miembro
  id_coach: user.id_coach,      // ✅ ID en tabla coach/entrenador
  rol: user.rol,                // 'miembro', 'admin', 'entrenador'
  email: user.usuario,          // Email/username
  iat: 1234567890,
  exp: 1234567890
}
```

## 📤 Estructura de Usuario en Respuesta 2FA

```json
{
  "success": true,
  "message": "Autenticación exitosa",
  "token": "eyJhbGc...",
  "usuario": {
    "id": 123,
    "id_miembro": 45,
    "id_coach": null,
    "usuario": "user@example.com",
    "nombre": "Juan Pérez",
    "rol": "miembro",
    "email": "user@example.com"
  }
}
```
