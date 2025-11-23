═══════════════════════════════════════════════════════════════
🔐 IMPLEMENTACIÓN 2FA - INSTRUCCIONES PARA EL BACKEND
═══════════════════════════════════════════════════════════════

📋 RESUMEN: ¿QUÉ SE HA HECHO HASTA AHORA?
───────────────────────────────────────────────────────────────

✅ BASE DE DATOS (YA COMPLETADO):
   - Ejecutada migración SQL: migration_2fa_completa.sql
   - Creada tabla: codigos_verificacion
   - Agregadas columnas a tabla usuario:
     * email_verificado (boolean)
     * verificacion_2fa (boolean)
   - Estado: LISTO ✅

✅ ARQUITECTURA ANALIZADA:
   - usuario.usuario = CORREO ELECTRÓNICO (no username)
   - Trigger automático: miembro.correo → usuario.usuario
   - Contraseñas en texto plano: apellido1 + '123'
   - Estado: DOCUMENTADO ✅

🎯 LO QUE FALTA (BACKEND):
   - Instalar dependencias (nodemailer, jsonwebtoken)
   - Configurar .env con credenciales de email
   - Crear servicio de email
   - Crear modelos para códigos y usuarios
   - Crear rutas de autenticación (/api/auth)
   - Registrar rutas en app.js

═══════════════════════════════════════════════════════════════
🚀 TU TAREA: IMPLEMENTAR BACKEND
═══════════════════════════════════════════════════════════════

IMPORTANTE: La base de datos YA ESTÁ LISTA. Solo implementa el código.

═══════════════════════════════════════════════════════════════
PASO 1: INSTALAR DEPENDENCIAS
═══════════════════════════════════════════════════════════════

```bash
npm install nodemailer jsonwebtoken
```

NOTA: NO usamos bcrypt porque es un proyecto educativo.
Las contraseñas se guardan en texto plano (apellido1 + '123').

═══════════════════════════════════════════════════════════════
PASO 2: CONFIGURAR VARIABLES DE ENTORNO
═══════════════════════════════════════════════════════════════

Agregar a `.env`:

```env
# Email (Gmail) - NUEVO
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASSWORD=contraseña_de_aplicacion

# JWT - NUEVO
JWT_SECRET=clave_secreta_cambiar_en_produccion

# DB (ya existen, no tocar)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gym_db
DB_USER=postgres
DB_PASSWORD=password
```

⚠️ Para Gmail:
1. Ir a Cuenta de Google → Seguridad
2. Activar "Verificación en 2 pasos"
3. Generar "Contraseña de aplicación"
4. Usar esa contraseña en EMAIL_PASSWORD

═══════════════════════════════════════════════════════════════
PASO 3: CREAR NUEVOS ARCHIVOS
═══════════════════════════════════════════════════════════════

📁 services/emailService.js
───────────────────────────────────────────────────────────────

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

function generarCodigoVerificacion() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function enviarCodigoVerificacion(email, codigo, tipo) {
  const asunto = tipo === 'registro' 
    ? '🔐 Código de Verificación - Utmach Gym'
    : '🔒 Código de Autenticación - Utmach Gym';
  
  const mensaje = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0a1a2e 0%, #14213d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #fca311; margin: 0;">Utmach Gym</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0;">
        <p style="font-size: 16px;">Tu código de verificación es:</p>
        <div style="background: #fca311; padding: 20px; text-align: center; font-size: 36px; font-weight: bold; color: #14213d; border-radius: 8px; margin: 20px 0; letter-spacing: 8px;">
          ${codigo}
        </div>
        <p style="color: #666; font-size: 14px;">⏱️ Este código expira en <strong>10 minutos</strong>.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">Si no solicitaste este código, ignora este mensaje.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Utmach Gym" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: asunto,
    html: mensaje
  });
}

module.exports = { generarCodigoVerificacion, enviarCodigoVerificacion };
```

📁 models/codigoVerificacion.model.js
───────────────────────────────────────────────────────────────

```javascript
const db = require('../config/db');

exports.create = async (email, codigo, tipo) => {
  const expiraEn = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  const result = await db.query(
    `INSERT INTO codigos_verificacion (email, codigo, tipo, expira_en) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [email, codigo, tipo, expiraEn]
  );
  return result.rows[0];
};

exports.verify = async (email, codigo, tipo) => {
  const result = await db.query(
    `SELECT * FROM codigos_verificacion 
     WHERE email = $1 AND codigo = $2 AND tipo = $3 
     AND usado = FALSE AND expira_en > NOW()`,
    [email, codigo, tipo]
  );
  return result.rows[0];
};

exports.markAsUsed = async (id) => {
  await db.query(
    'UPDATE codigos_verificacion SET usado = TRUE WHERE id = $1',
    [id]
  );
};

module.exports = exports;
```

📁 models/usuario.model.js (ACTUALIZAR/AGREGAR)
───────────────────────────────────────────────────────────────

```javascript
const db = require('../config/db');

// Buscar por email (recordar: usuario.usuario ES el email)
exports.findByEmail = async (email) => {
  const result = await db.query(
    `SELECT u.*, m.nombre, m.apellido1, m.correo as correo_miembro
     FROM usuario u
     LEFT JOIN miembro m ON u.id_miembro = m.id_miembro
     WHERE u.usuario = $1 AND u.estado = TRUE`,
    [email]
  );
  return result.rows[0];
};

// Verificar si email existe
exports.emailExiste = async (email) => {
  // Verificar en miembro
  const miembro = await db.query(
    "SELECT id_miembro FROM miembro WHERE correo = $1",
    [email]
  );
  
  // Verificar en usuario (usuario.usuario ES el email)
  const usuario = await db.query(
    "SELECT id_usuario FROM usuario WHERE usuario = $1",
    [email]
  );
  
  return miembro.rows.length > 0 || usuario.rows.length > 0;
};

// Verificar contraseña (comparación directa - SIN bcrypt)
exports.verifyPassword = async (plainPassword, storedPassword) => {
  return plainPassword === storedPassword;
};

module.exports = exports;
```

NOTA IMPORTANTE: Las contraseñas se comparan directamente (texto plano).
El trigger crea contraseñas como: apellido1 + '123'

📁 routes/auth.routes.js (NUEVO)
───────────────────────────────────────────────────────────────

```javascript
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');
const Miembro = require('../models/miembro.model');
const CodigoVerificacion = require('../models/codigoVerificacion.model');
const { generarCodigoVerificacion, enviarCodigoVerificacion } = require('../services/emailService');

// 1️⃣ REGISTRO - Enviar código de verificación
router.post('/registro/enviar-codigo', async (req, res) => {
  const { correo } = req.body;
  
  try {
    const emailExiste = await Usuario.emailExiste(correo);
    
    if (emailExiste) {
      return res.status(400).json({ 
        success: false, 
        message: 'Este correo ya está registrado' 
      });
    }

    const codigo = generarCodigoVerificacion();
    await CodigoVerificacion.create(correo, codigo, 'registro');
    await enviarCodigoVerificacion(correo, codigo, 'registro');

    res.json({ 
      success: true, 
      message: 'Código enviado a tu correo' 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar el código' 
    });
  }
});

// 2️⃣ REGISTRO - Verificar código y crear usuario
router.post('/registro/verificar', async (req, res) => {
  const { correo, codigo, ...datosMiembro } = req.body;
  
  try {
    const codigoValido = await CodigoVerificacion.verify(correo, codigo, 'registro');

    if (!codigoValido) {
      return res.status(400).json({ 
        success: false, 
        message: 'Código inválido o expirado' 
      });
    }

    // Crear miembro (el trigger crea automáticamente el usuario)
    // El trigger genera contraseña como: apellido1 + '123'
    const nuevoMiembro = await Miembro.create({
      ...datosMiembro,
      correo
    });

    // Marcar código como usado
    await CodigoVerificacion.markAsUsed(codigoValido.id);

    // Obtener el usuario creado por el trigger
    const usuario = await Usuario.findByEmail(correo);
    
    // Generar contraseña temporal (mismo formato que el trigger)
    const contraseniaTemp = datosMiembro.apellido1 + '123';

    res.json({
      success: true,
      message: 'Registro exitoso',
      data: {
        id_usuario: usuario.id_usuario,
        id_miembro: nuevoMiembro.id_miembro,
        email: correo,
        credenciales: {
          usuario: correo,
          contrasenia: contraseniaTemp
        }
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al completar el registro' 
    });
  }
});

// 3️⃣ LOGIN - Validar y enviar código 2FA
router.post('/login/validar', async (req, res) => {
  const { email, contrasenia } = req.body;
  
  try {
    // Buscar usuario por email (usuario.usuario ES el email)
    const user = await Usuario.findByEmail(email);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const contraseniaValida = await Usuario.verifyPassword(contrasenia, user.contrasenia);
    
    if (!contraseniaValida) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    // Verificar si tiene 2FA habilitado
    if (user.verificacion_2fa) {
      // Enviar código 2FA
      const codigo = generarCodigoVerificacion();
      await CodigoVerificacion.create(user.usuario, codigo, '2fa');
      await enviarCodigoVerificacion(user.usuario, codigo, '2fa');

      return res.json({ 
        success: true, 
        message: 'Código 2FA enviado a tu correo',
        requiresTwoFactor: true,
        email: user.usuario.replace(/(.{2})(.*)(@.*)/, '$1***$3')
      });
    } else {
      // Login sin 2FA (usuarios antiguos)
      const token = jwt.sign(
        { 
          id: user.id_usuario, 
          rol: user.rol,
          email: user.usuario
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        message: 'Login exitoso',
        requiresTwoFactor: false,
        token: token,
        usuario: {
          id: user.id_usuario,
          nombre: user.nombre,
          rol: user.rol
        }
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el login' 
    });
  }
});

// 4️⃣ LOGIN - Verificar código 2FA
router.post('/login/verificar-2fa', async (req, res) => {
  const { email, codigo } = req.body;
  
  try {
    const user = await Usuario.findByEmail(email);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    const codigoValido = await CodigoVerificacion.verify(user.usuario, codigo, '2fa');

    if (!codigoValido) {
      return res.status(400).json({ 
        success: false, 
        message: 'Código 2FA inválido o expirado' 
      });
    }

    await CodigoVerificacion.markAsUsed(codigoValido.id);

    const token = jwt.sign(
      { 
        id: user.id_usuario, 
        rol: user.rol,
        email: user.usuario
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

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
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al verificar código 2FA' 
    });
  }
});

module.exports = router;
```

📁 app.js o server.js (REGISTRAR RUTAS)
───────────────────────────────────────────────────────────────

```javascript
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);
```

═══════════════════════════════════════════════════════════════
PASO 5: PRUEBAS CON CURL
═══════════════════════════════════════════════════════════════

Test 1: Enviar código de registro
```bash
curl -X POST http://localhost:3000/api/auth/registro/enviar-codigo \
  -H "Content-Type: application/json" \
  -d '{"correo":"test@example.com"}'
```

Test 2: Verificar código (después de recibir el código por email)
```bash
curl -X POST http://localhost:3000/api/auth/registro/verificar \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "test@example.com",
    "codigo": "123456",
    "cedula": "1234567890",
    "nombre": "Juan",
    "apellido1": "Pérez",
    "apellido2": "González",
    "edad": 25,
    "direccion": "Calle 123",
    "altura": 1.75,
    "peso": 70,
    "contextura": "Normal",
    "objetivo": "Fitness",
    "sexo": "M"
  }'
```

Test 3: Login
```bash
curl -X POST http://localhost:3000/api/auth/login/validar \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","contrasenia":"password123"}'
```

Test 4: Verificar 2FA
```bash
curl -X POST http://localhost:3000/api/auth/login/verificar-2fa \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","codigo":"654321"}'
```

═══════════════════════════════════════════════════════════════
CHECKLIST FINAL
═══════════════════════════════════════════════════════════════

[ ] Migración SQL ejecutada correctamente
[ ] Dependencias instaladas
[ ] Variables .env configuradas
[ ] Servicio emailService.js creado
[ ] Modelo codigoVerificacion.model.js creado
[ ] Modelo usuario.model.js actualizado
[ ] Rutas auth.routes.js creadas
[ ] Rutas registradas en app.js
[ ] Pruebas con curl exitosas
[ ] Correos llegando correctamente

═══════════════════════════════════════════════════════════════
NOTAS FINALES
═══════════════════════════════════════════════════════════════

✅ usuario.usuario = EMAIL (no es username, es el correo)
✅ Para login usa: email + contraseña
✅ El trigger automático crea usuario cuando se crea miembro
✅ Contraseñas en texto plano: apellido1 + '123' (ej: Granger123, Stark123)
✅ NO se usa bcrypt (proyecto educativo)
✅ Los códigos expiran en 10 minutos
✅ Cada código se puede usar solo una vez
✅ 2FA es opcional (se puede habilitar/deshabilitar por usuario)

═══════════════════════════════════════════════════════════════