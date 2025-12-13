# 🧪 GUÍA DE PRUEBAS - SISTEMA 2FA

## RESUMEN DE LA IMPLEMENTACIÓN

Se ha implementado **autenticación de dos factores (2FA) obligatoria** para TODOS los usuarios del sistema:
- ✅ **Miembros** (login en `/auth`)
- ✅ **Administradores** (login en `/staff-login`)
- ✅ **Entrenadores** (login en `/staff-login`)

---

## 🔧 CONFIGURACIÓN INICIAL

### 1. Activar 2FA en usuarios de prueba

Conectarse a PostgreSQL y ejecutar:

```sql
-- Activar 2FA para un miembro específico
UPDATE usuario 
SET verificacion_2fa = TRUE 
WHERE usuario = 'miembro@ejemplo.com';

-- Activar 2FA para un admin específico
UPDATE usuario 
SET verificacion_2fa = TRUE 
WHERE usuario = 'admin@ejemplo.com';

-- Activar 2FA para un entrenador específico
UPDATE usuario 
SET verificacion_2fa = TRUE 
WHERE usuario = 'entrenador@ejemplo.com';

-- Ver todos los usuarios y su estado 2FA
SELECT id_usuario, usuario, rol, verificacion_2fa 
FROM usuario;
```

### 2. Verificar variables de entorno en el backend

Archivo: `gym-backend/gateway/.env` (o donde esté tu backend)

```env
# Configuración de Email para 2FA
EMAIL_USER=satoruinfinito2004@gmail.com
EMAIL_PASSWORD=pzshjldceszkwezi

# JWT Secret
JWT_SECRET=tu_clave_secreta_segura
```

### 3. Asegurarse de que los servicios estén corriendo

```bash
# Terminal 1: Backend Gateway
cd C:\Users\Jordy\gym-backend\gateway
npm start

# Terminal 2: Backend Members Service
cd C:\Users\Jordy\gym-backend\members-service
npm start

# Terminal 3: Frontend Angular
cd C:\Users\Jordy\web-utmachGym
npm start
```

---

## 🧪 CASOS DE PRUEBA

### CASO 1: Registro de Nuevo Miembro con 2FA

**URL**: `http://localhost:4200/registro`

**Pasos**:
1. Llenar el formulario con datos válidos
2. Hacer clic en "Registrarse"
3. ✅ Verificar que aparezca la pantalla de verificación
4. ✅ Revisar el correo electrónico ingresado
5. ✅ Copiar el código de 6 dígitos del email
6. Ingresar el código en el formulario
7. Hacer clic en "Verificar Código"
8. ✅ Debe mostrar el modal con las credenciales generadas
9. ✅ Copiar usuario y contraseña

**Resultado esperado**:
- Email recibido con código de 6 dígitos
- Código válido por 10 minutos
- Modal muestra: Usuario (email) y Contraseña (Apellido1 + "123")

---

### CASO 2: Login de Miembro CON 2FA Activado

**URL**: `http://localhost:4200/auth`

**Prerequisito**: Usuario debe tener `verificacion_2fa = TRUE` en la BD

**Pasos**:
1. Ingresar email y contraseña del miembro
2. Hacer clic en "Ingresar"
3. ✅ Verificar que aparezca la pantalla de verificación 2FA
4. ✅ Verificar que el email aparezca ofuscado (ej: `us***@example.com`)
5. ✅ Revisar el correo electrónico
6. ✅ Copiar el código de 6 dígitos
7. Ingresar el código
8. Hacer clic en "Verificar y Acceder"
9. ✅ Debe redirigir a `/miembros/dashboard`

**Resultado esperado**:
- Email recibido con asunto "Código de Autenticación - Utmach Gym"
- Código válido por 10 minutos
- Redirección automática al dashboard de miembros

---

### CASO 3: Login de Miembro SIN 2FA (Usuario Legacy)

**URL**: `http://localhost:4200/auth`

**Prerequisito**: Usuario debe tener `verificacion_2fa = FALSE` en la BD

**Pasos**:
1. Ingresar email y contraseña del miembro
2. Hacer clic en "Ingresar"
3. ✅ Debe redirigir DIRECTAMENTE a `/miembros/dashboard` sin pedir código

**Resultado esperado**:
- Sin solicitud de código 2FA
- Acceso inmediato al dashboard

---

### CASO 4: Login de Admin/Entrenador CON 2FA

**URL**: `http://localhost:4200/staff-login`

**Prerequisito**: Usuario debe tener `verificacion_2fa = TRUE` en la BD

**Pasos**:
1. Ingresar email y contraseña del admin/entrenador
2. Hacer clic en "Ingresar"
3. ✅ Verificar que aparezca la pantalla de verificación 2FA
4. ✅ Revisar el correo electrónico
5. ✅ Copiar el código de 6 dígitos
6. Ingresar el código
7. Hacer clic en "Verificar y Acceder"
8. ✅ Si es admin: redirige a `/admin/dashboard`
9. ✅ Si es entrenador: redirige a `/entrenadores/dashboard`

**Resultado esperado**:
- Email recibido con código
- Redirección según el rol del usuario

---

### CASO 5: Reenvío de Código 2FA

**URL**: Cualquier pantalla de verificación 2FA

**Pasos**:
1. Estar en la pantalla de verificación de código
2. Esperar 60 segundos (o dejar que expire el countdown)
3. Hacer clic en "Reenviar código"
4. ✅ Verificar que llegue un nuevo código al correo
5. ✅ Verificar que el campo de código se limpie
6. ✅ Verificar que inicie el countdown de 60s nuevamente

**Resultado esperado**:
- Nuevo email con código diferente
- Countdown reinicia en 60 segundos
- Código anterior queda inválido

---

### CASO 6: Código Expirado o Inválido

**URL**: Cualquier pantalla de verificación 2FA

**Pasos**:
1. Esperar más de 10 minutos después de solicitar el código
2. Intentar ingresar el código expirado
3. ✅ Debe mostrar error: "Código inválido o expirado"
4. Hacer clic en "Reenviar código"
5. ✅ Debe recibir un nuevo código

**Resultado esperado**:
- Error claro al usar código expirado
- Opción de reenvío disponible

---

### CASO 7: Código Incorrecto

**URL**: Cualquier pantalla de verificación 2FA

**Pasos**:
1. Solicitar código
2. Ingresar un código INCORRECTO (ej: 000000)
3. Hacer clic en "Verificar"
4. ✅ Debe mostrar error: "Código inválido o expirado"
5. Código permanece válido para reintentos

**Resultado esperado**:
- Error claro al código incorrecto
- Usuario puede reintentar sin solicitar nuevo código

---

### CASO 8: Volver al Formulario de Login

**URL**: Cualquier pantalla de verificación 2FA

**Pasos**:
1. Estar en la pantalla de verificación
2. Hacer clic en "Volver al login"
3. ✅ Debe volver a la pantalla de credenciales
4. ✅ Los campos usuario y contraseña deben estar limpios o con valores anteriores

**Resultado esperado**:
- Regreso sin errores
- Countdown detenido
- Formulario listo para nuevo intento

---

### CASO 9: Miembro Intenta Acceder a Staff-Login

**URL**: `http://localhost:4200/staff-login`

**Prerequisito**: Credenciales de un MIEMBRO (no admin ni entrenador)

**Pasos**:
1. Ingresar credenciales de miembro en staff-login
2. Hacer clic en "Ingresar"
3. ✅ Debe mostrar error: "Acceso denegado. Usted es un miembro..."
4. ✅ NO debe permitir acceso
5. ✅ Token debe limpiarse

**Resultado esperado**:
- Error claro de acceso denegado
- Sin redirección
- Sin token guardado

---

### CASO 10: Admin/Entrenador Intenta Acceder a Login Miembros

**URL**: `http://localhost:4200/auth`

**Prerequisito**: Credenciales de ADMIN o ENTRENADOR

**Pasos**:
1. Ingresar credenciales de admin/entrenador en `/auth`
2. Hacer clic en "Ingresar"
3. ✅ Debe mostrar error: "Acceso denegado. Usted es parte del staff..."
4. ✅ NO debe permitir acceso

**Resultado esperado**:
- Error claro de acceso denegado
- Sugerencia de usar el portal de staff

---

## 📧 VERIFICACIÓN DE EMAILS

### Formato del Email de Registro

**Asunto**: 🔐 Código de Verificación - Utmach Gym

**Contenido**:
- Logo/Header del gimnasio
- Código de 6 dígitos en formato grande y destacado
- Mensaje: "Este código expira en 10 minutos"
- Advertencia de seguridad

### Formato del Email de Login 2FA

**Asunto**: 🔒 Código de Autenticación - Utmach Gym

**Contenido**:
- Logo/Header del gimnasio
- Código de 6 dígitos en formato grande y destacado
- Mensaje: "Este código expira en 10 minutos"
- Advertencia de seguridad

---

## 🐛 TROUBLESHOOTING

### Problema: No llega el email con el código

**Soluciones**:
1. Verificar que `EMAIL_USER` y `EMAIL_PASSWORD` estén correctos en `.env`
2. Verificar que la contraseña sea una "Contraseña de aplicación" de Google
3. Verificar que la verificación en 2 pasos esté activada en la cuenta de Gmail
4. Revisar la carpeta de SPAM del correo
5. Verificar logs del backend en la consola

### Problema: Error "Código inválido" con código correcto

**Soluciones**:
1. Verificar que el código no haya expirado (10 minutos)
2. Verificar que el código no se haya usado antes (un solo uso)
3. Verificar la hora del servidor vs hora del cliente
4. Revisar la tabla `codigos_verificacion` en la BD:
   ```sql
   SELECT * FROM codigos_verificacion 
   WHERE email = 'usuario@ejemplo.com' 
   ORDER BY creado_en DESC 
   LIMIT 5;
   ```

### Problema: Usuario no tiene 2FA pero le pide código

**Solución**:
```sql
-- Verificar estado 2FA del usuario
SELECT usuario, verificacion_2fa FROM usuario WHERE usuario = 'email@ejemplo.com';

-- Desactivar 2FA si es necesario
UPDATE usuario SET verificacion_2fa = FALSE WHERE usuario = 'email@ejemplo.com';
```

### Problema: Backend no responde

**Soluciones**:
1. Verificar que el gateway esté corriendo en puerto 3000
2. Verificar que el members-service esté corriendo en puerto 3002
3. Verificar conexión a PostgreSQL
4. Revisar logs del backend
5. Verificar que existan las rutas `/api/auth/login/validar` y `/api/auth/login/verificar-2fa`

---

## 🔒 ACTIVACIÓN MASIVA DE 2FA

Para activar 2FA en todos los usuarios del sistema:

```sql
-- Activar 2FA para TODOS los usuarios
UPDATE usuario SET verificacion_2fa = TRUE;

-- Activar 2FA solo para miembros
UPDATE usuario SET verificacion_2fa = TRUE WHERE rol = 'miembro';

-- Activar 2FA solo para staff
UPDATE usuario SET verificacion_2fa = TRUE WHERE rol IN ('admin', 'entrenador');

-- Ver estadísticas de 2FA
SELECT 
  rol,
  COUNT(*) as total_usuarios,
  SUM(CASE WHEN verificacion_2fa = TRUE THEN 1 ELSE 0 END) as con_2fa,
  SUM(CASE WHEN verificacion_2fa = FALSE THEN 1 ELSE 0 END) as sin_2fa
FROM usuario
GROUP BY rol;
```

---

## ✅ CHECKLIST FINAL

- [ ] Backend corriendo en puerto 3000
- [ ] Members-service corriendo en puerto 3002
- [ ] PostgreSQL activo y accesible
- [ ] Variables de entorno configuradas (EMAIL_USER, EMAIL_PASSWORD)
- [ ] Frontend corriendo en puerto 4200
- [ ] Al menos un usuario de cada rol con 2FA activado para pruebas
- [ ] Gmail configurado con "Contraseñas de aplicación"
- [ ] Tabla `codigos_verificacion` creada en la BD
- [ ] Columnas `email_verificado` y `verificacion_2fa` existen en tabla `usuario`

---

## 📊 MONITOREO

### Ver códigos generados recientemente

```sql
SELECT 
  email,
  codigo,
  tipo,
  usado,
  expira_en,
  creado_en,
  CASE 
    WHEN expira_en < NOW() THEN 'EXPIRADO'
    WHEN usado = TRUE THEN 'USADO'
    ELSE 'VÁLIDO'
  END as estado
FROM codigos_verificacion
ORDER BY creado_en DESC
LIMIT 20;
```

### Limpiar códigos antiguos

```sql
-- Eliminar códigos expirados (más de 1 hora)
DELETE FROM codigos_verificacion 
WHERE creado_en < NOW() - INTERVAL '1 hour';

-- Eliminar códigos usados (más de 1 día)
DELETE FROM codigos_verificacion 
WHERE usado = TRUE AND creado_en < NOW() - INTERVAL '1 day';
```

---

## 🎯 CRITERIOS DE ÉXITO

El sistema 2FA está funcionando correctamente si:

1. ✅ Usuarios con 2FA activado reciben código por email
2. ✅ Código es válido por 10 minutos exactos
3. ✅ Código solo se puede usar UNA vez
4. ✅ Usuarios sin 2FA pueden hacer login directo (legacy)
5. ✅ Email llega en menos de 5 segundos
6. ✅ Validación de roles funciona correctamente
7. ✅ Countdown de reenvío funciona (60 segundos)
8. ✅ Códigos inválidos muestran errores claros
9. ✅ Navegación entre pantallas es fluida
10. ✅ No hay errores en consola del navegador ni del backend

---

**Fecha de creación**: Diciembre 13, 2025  
**Versión**: 1.0.0  
**Estado**: Sistema 2FA completamente funcional
