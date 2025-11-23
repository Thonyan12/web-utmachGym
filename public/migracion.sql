-- ═══════════════════════════════════════════════════════════════
-- MIGRACIÓN COMPLETA: Sistema de Verificación y 2FA
-- ═══════════════════════════════════════════════════════════════
-- ARQUITECTURA ACTUAL:
-- - tabla.usuario.usuario = CORREO ELECTRÓNICO (ya existe)
-- - Un trigger crea automáticamente usuario desde miembro.correo
-- - SOLO necesitamos agregar: email_verificado y verificacion_2fa
-- ═══════════════════════════════════════════════════════════════

BEGIN;

-- ───────────────────────────────────────────────────────────────
-- 1) Crear tabla para códigos de verificación
-- ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS codigos_verificacion (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  codigo VARCHAR(6) NOT NULL,
  tipo VARCHAR(20) NOT NULL, -- 'registro' o '2fa'
  expira_en TIMESTAMP NOT NULL,
  usado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_codigos_verificacion_email ON codigos_verificacion (email);
CREATE INDEX IF NOT EXISTS idx_codigos_verificacion_tipo ON codigos_verificacion (tipo);

-- ───────────────────────────────────────────────────────────────
-- 2) Agregar SOLO columnas de verificación a USUARIO
--    (NO agregamos 'correo' porque 'usuario' YA ES el correo)
-- ───────────────────────────────────────────────────────────────

DO $$
BEGIN
  -- Agregar email_verificado si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='usuario' AND column_name='email_verificado'
  ) THEN
    ALTER TABLE usuario ADD COLUMN email_verificado BOOLEAN DEFAULT FALSE;
  END IF;

  -- Agregar verificacion_2fa si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='usuario' AND column_name='verificacion_2fa'
  ) THEN
    ALTER TABLE usuario ADD COLUMN verificacion_2fa BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

COMMIT;

-- ═══════════════════════════════════════════════════════════════
-- VERIFICACIÓN POST-MIGRACIÓN
-- ═══════════════════════════════════════════════════════════════

-- 1. Verificar que la tabla codigos_verificacion existe:
--    SELECT * FROM codigos_verificacion LIMIT 1;

-- 2. Verificar las nuevas columnas en usuario:
--    SELECT column_name, data_type, column_default 
--    FROM information_schema.columns 
--    WHERE table_name = 'usuario' 
--    AND column_name IN ('email_verificado', 'verificacion_2fa');

-- 3. Ver datos de ejemplo:
--    SELECT id_usuario, usuario, rol, email_verificado, verificacion_2fa 
--    FROM usuario LIMIT 5;

-- ═══════════════════════════════════════════════════════════════
-- NOTAS FINALES
-- ═══════════════════════════════════════════════════════════════
-- ✅ El campo 'usuario' en tabla usuario YA CONTIENE el correo electrónico
-- ✅ El trigger automático copia miembro.correo → usuario.usuario
-- ✅ Para enviar códigos de verificación usamos: usuario.usuario (que es el email)
-- ✅ Los códigos expiran en 10 minutos (se define en el backend)
-- ✅ Cada código solo se puede usar una vez (campo 'usado')
-- ═══════════════════════════════════════════════════════════════