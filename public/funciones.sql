-- ============================================
-- FUNCIÓN: Asignar rutina automáticamente según características físicas
-- ============================================
CREATE OR REPLACE FUNCTION asignar_rutina_automatica(
    p_id_miembro INT,
    p_edad INT,
    p_peso NUMERIC,
    p_altura NUMERIC,
    p_contextura VARCHAR,
    p_sexo VARCHAR,
    p_objetivo TEXT
) RETURNS VOID AS $$
DECLARE
    v_id_rutina INT;
    v_imc NUMERIC;
BEGIN
    -- Calcular IMC para mejor asignación
    v_imc := p_peso / ((p_altura / 100.0) * (p_altura / 100.0));
    
    -- Lógica de asignación según características físicas
    IF p_contextura = 'Ectomorfo' AND v_imc < 18.5 THEN
        -- Persona delgada, necesita ganar masa muscular
        SELECT id_rutina INTO v_id_rutina 
        FROM Rutina 
        WHERE nivel = 'Principiante' AND tipo_rut = 'Full Body' 
        LIMIT 1;
        
    ELSIF p_contextura = 'Endomorfo' OR v_imc > 25 THEN
        -- Persona con tendencia a ganar peso, necesita cardio
        SELECT id_rutina INTO v_id_rutina 
        FROM Rutina 
        WHERE tipo_rut = 'Cardio y Resistencia' 
        LIMIT 1;
        
    ELSIF p_contextura = 'Mesomorfo' AND p_edad BETWEEN 25 AND 40 THEN
        -- Contextura atlética, rutina de fuerza
        SELECT id_rutina INTO v_id_rutina 
        FROM Rutina 
        WHERE nivel = 'Intermedio' AND tipo_rut = 'Fuerza' 
        LIMIT 1;
        
    ELSIF p_edad > 40 THEN
        -- Personas mayores, rutina funcional
        SELECT id_rutina INTO v_id_rutina 
        FROM Rutina 
        WHERE tipo_rut = 'Funcional' 
        LIMIT 1;
        
    ELSIF p_edad < 25 AND p_contextura = 'Mesomorfo' THEN
        -- Jóvenes atléticos, rutina de hipertrofia
        SELECT id_rutina INTO v_id_rutina 
        FROM Rutina 
        WHERE nivel = 'Avanzado' AND tipo_rut = 'Hipertrofia' 
        LIMIT 1;
        
    ELSE
        -- Por defecto: rutina básica para principiantes
        SELECT id_rutina INTO v_id_rutina 
        FROM Rutina 
        WHERE nivel = 'Principiante' AND tipo_rut = 'Full Body' 
        LIMIT 1;
    END IF;
    
    -- Verificar que se encontró una rutina
    IF v_id_rutina IS NOT NULL THEN
        -- Insertar asignación de rutina
        INSERT INTO Asignacion_rutina (
            id_miembro, 
            id_rutina, 
            descripcion_rut, 
            fecha_inicio
        ) VALUES (
            p_id_miembro,
            v_id_rutina,
            'Rutina asignada automáticamente: ' || p_contextura || ' - IMC: ' || ROUND(v_imc, 2) || ' - Objetivo: ' || p_objetivo,
            CURRENT_DATE
        );
        
        RAISE NOTICE 'Rutina % asignada automáticamente al miembro % (IMC: %)', v_id_rutina, p_id_miembro, ROUND(v_imc, 2);
    ELSE
        RAISE WARNING 'No se encontró rutina disponible para asignar';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCIÓN: Notificar nuevo miembro registrado a todos los admins
-- ============================================
CREATE OR REPLACE FUNCTION notificar_nuevo_miembro(
    p_id_miembro INT,
    p_nombre_completo VARCHAR
) RETURNS VOID AS $$
DECLARE
    admin_record RECORD;
BEGIN
    -- Notificar a todos los administradores
    FOR admin_record IN 
        SELECT id_usuario 
        FROM Usuario 
        WHERE rol = 'admin' AND estado = TRUE
    LOOP
        INSERT INTO Notificacion (
            id_usuario,
            id_usuario_remitente,
            tipo,
            contenido
        ) VALUES (
            admin_record.id_usuario,
            NULL, -- Sistema automático
            'nuevo_miembro',
            '🆕 NUEVO MIEMBRO REGISTRADO: ' || p_nombre_completo || 
            '. Debe crear una mensualidad para activar su acceso al gimnasio. ID: ' || p_id_miembro ||
            '. Revise la lista de miembros pendientes para proceder con la activación.'
        );
    END LOOP;
    
    RAISE NOTICE 'Notificaciones enviadas a administradores sobre nuevo miembro: %', p_nombre_completo;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCIÓN: Trigger para nuevo miembro registrado (CORREGIDA)
-- ============================================
CREATE OR REPLACE FUNCTION trigger_nuevo_miembro_registrado()
RETURNS TRIGGER AS $$
DECLARE
    nombre_completo VARCHAR;
    contraseña_generada VARCHAR;
BEGIN
    -- Construir nombre completo
    nombre_completo := NEW.nombre || ' ' || NEW.apellido1 || 
                      CASE WHEN NEW.apellido2 IS NOT NULL 
                           THEN ' ' || NEW.apellido2 
                           ELSE '' END;
    
    contraseña_generada := NEW.apellido1 || '123';
    
    -- Solo procesar si el miembro está siendo registrado por primera vez
    IF NEW.estado = FALSE THEN
        -- 1. Asignar rutina automáticamente
        PERFORM asignar_rutina_automatica(
            NEW.id_miembro,
            NEW.edad,
            NEW.peso,
            NEW.altura,
            NEW.contextura,
            NEW.sexo,
            NEW.objetivo
        );
        
        -- 2. ✅ CREAR USUARIO INMEDIATAMENTE
        INSERT INTO Usuario (usuario, contrasenia, rol, id_miembro)
        VALUES (
            NEW.correo,
            contraseña_generada,
            'miembro',
            NEW.id_miembro
        );
        
        -- 3. Notificar a administradores
        PERFORM notificar_nuevo_miembro(NEW.id_miembro, nombre_completo);
    END IF;
    
    RAISE NOTICE 'Miembro % registrado con usuario creado. Contraseña: %', nombre_completo, contraseña_generada;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger
DROP TRIGGER IF EXISTS trigger_registro_miembro ON Miembro;
CREATE TRIGGER trigger_registro_miembro
    AFTER INSERT ON Miembro
    FOR EACH ROW
    EXECUTE FUNCTION trigger_nuevo_miembro_registrado();

-- ============================================
-- FUNCIÓN: Activar miembro automáticamente al crear mensualidad
-- ============================================
CREATE OR REPLACE FUNCTION trigger_activar_miembro_por_mensualidad()
RETURNS TRIGGER AS $$
DECLARE
    miembro_record RECORD;
    nombre_completo VARCHAR;
BEGIN
    -- Obtener datos del miembro
    SELECT * INTO miembro_record 
    FROM Miembro 
    WHERE id_miembro = NEW.id_miembro;
    
    nombre_completo := miembro_record.nombre || ' ' || miembro_record.apellido1 || 
                      CASE WHEN miembro_record.apellido2 IS NOT NULL 
                           THEN ' ' || miembro_record.apellido2 
                           ELSE '' END;
    
    -- 1. SOLO ACTIVAR EL MIEMBRO (usuario ya existe desde el registro)
    UPDATE Miembro 
    SET estado = TRUE 
    WHERE id_miembro = NEW.id_miembro;
    
    -- 2. Notificar a administradores (SIN CONTRASEÑA)
    INSERT INTO Notificacion (id_usuario, tipo, contenido)
    SELECT 
        u.id_usuario,
        'miembro_activado',
        '✅ MIEMBRO ACTIVADO: ' || nombre_completo || 
        ' ha sido activado exitosamente. Mensualidad desde ' || NEW.fecha_inicio || 
        ' hasta ' || NEW.fecha_fin || '. Monto: $' || NEW.monto || 
        '. El miembro ya puede acceder al gimnasio.'
    FROM Usuario u
    WHERE u.rol = 'admin' AND u.estado = TRUE;
    
    -- 3. Notificar al miembro (SIN CONTRASEÑA - ya la sabe)
    INSERT INTO Notificacion (id_usuario, tipo, contenido)
    SELECT 
        u.id_usuario,
        'activacion_exitosa',
        '🎉 ¡BIENVENIDO AL UTMACH GYM! Tu membresía ha sido activada exitosamente. ' ||
        'Ya puedes acceder al gimnasio con las credenciales que recibiste al registrarte. ' ||
        'Tu membresía vence el ' || NEW.fecha_fin || '. ¡Disfruta tu entrenamiento!'
    FROM Usuario u
    WHERE u.id_miembro = NEW.id_miembro;
    
    RAISE NOTICE 'Miembro % activado por mensualidad', nombre_completo;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger
DROP TRIGGER IF EXISTS trigger_activacion_mensualidad ON Mensualidad;
CREATE TRIGGER trigger_activacion_mensualidad
    AFTER INSERT ON Mensualidad
    FOR EACH ROW
    EXECUTE FUNCTION trigger_activar_miembro_por_mensualidad();


-- ============================================
-- FUNCIÓN: Verificar y desactivar membresías expiradas
-- ============================================
CREATE OR REPLACE FUNCTION desactivar_miembros_expirados()
RETURNS TABLE(miembros_desactivados INT, detalles TEXT) AS $$
DECLARE
    count_desactivados INT := 0;
    miembro_record RECORD;
    detalle_texto TEXT := '';
BEGIN
    -- Buscar miembros con mensualidad expirada
    FOR miembro_record IN 
        SELECT 
            m.id_miembro,
            m.nombre || ' ' || m.apellido1 || 
            CASE WHEN m.apellido2 IS NOT NULL 
                 THEN ' ' || m.apellido2 
                 ELSE '' END as nombre_completo,
            men.fecha_fin
        FROM Miembro m
        INNER JOIN Mensualidad men ON m.id_miembro = men.id_miembro
        WHERE men.fecha_fin < CURRENT_DATE
        AND m.estado = TRUE
        AND men.estado = TRUE
    LOOP
        -- Desactivar miembro
        UPDATE Miembro 
        SET estado = FALSE 
        WHERE id_miembro = miembro_record.id_miembro;
        
        -- Notificar a administradores
        INSERT INTO Notificacion (id_usuario, tipo, contenido)
        SELECT 
            u.id_usuario,
            'miembro_expirado',
            '⚠️ MEMBRESÍA EXPIRADA: ' || miembro_record.nombre_completo || 
            ' (ID: ' || miembro_record.id_miembro || ') ha sido desactivado automáticamente. ' ||
            'Membresía venció el ' || miembro_record.fecha_fin || '. Contacte al miembro para renovar.'
        FROM Usuario u
        WHERE u.rol = 'admin' AND u.estado = TRUE;
        
        -- Notificar al miembro
        INSERT INTO Notificacion (id_usuario, tipo, contenido)
        SELECT 
            u.id_usuario,
            'membresia_vencida',
            '😔 Tu membresía ha expirado el ' || miembro_record.fecha_fin || 
            '. Tu acceso al gimnasio ha sido suspendido temporalmente. ' ||
            'Contacta con administración para renovar y continuar disfrutando del gimnasio.'
        FROM Usuario u
        WHERE u.id_miembro = miembro_record.id_miembro;
        
        count_desactivados := count_desactivados + 1;
        detalle_texto := detalle_texto || miembro_record.nombre_completo || ' (vencido: ' || miembro_record.fecha_fin || '), ';
    END LOOP;
    
    -- Retornar resultados
    miembros_desactivados := count_desactivados;
    detalles := CASE 
        WHEN count_desactivados = 0 THEN 'No hay membresías expiradas'
        ELSE 'Desactivados: ' || RTRIM(detalle_texto, ', ')
    END;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Evaluar nuevas rutinas al actualizar perfil físico
-- ============================================
CREATE OR REPLACE FUNCTION trigger_actualizar_rutinas_por_perfil()
RETURNS TRIGGER AS $$
DECLARE
    miembro_record RECORD;
BEGIN
    -- Obtener nombre del miembro para notificaciones
    SELECT nombre, apellido1, apellido2 INTO miembro_record
    FROM Miembro 
    WHERE id_miembro = NEW.id_miembro;
    
    -- Solo evaluar si hay cambios significativos en peso o altura
    IF (OLD.peso IS NULL OR ABS(NEW.peso - OLD.peso) >= 2) OR 
       (OLD.altura IS NULL OR ABS(NEW.altura - OLD.altura) >= 2) THEN
        
        -- Evaluar y asignar nuevas rutinas si es necesario
        PERFORM evaluar_nuevas_rutinas_por_perfil(
            NEW.id_miembro,
            NEW.altura,
            NEW.peso,
            NEW.observaciones
        );
        
        -- Notificar a administradores sobre la actualización
        INSERT INTO Notificacion (id_usuario, tipo, contenido)
        SELECT 
            u.id_usuario,
            'perfil_actualizado',
            '📊 PERFIL FÍSICO ACTUALIZADO: ' || miembro_record.nombre || ' ' || miembro_record.apellido1 || 
            ' ha actualizado su perfil. Altura: ' || NEW.altura || 'cm, Peso: ' || NEW.peso || 
            'kg. Sistema evaluando nuevas rutinas automáticamente.'
        FROM Usuario u
        WHERE u.rol = 'admin' AND u.estado = TRUE;
        
        RAISE NOTICE 'Perfil físico actualizado para miembro % - evaluando nuevas rutinas', NEW.id_miembro;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger
DROP TRIGGER IF EXISTS trigger_perfil_fisico_actualizado ON Perfil_fisico;
CREATE TRIGGER trigger_perfil_fisico_actualizado
    AFTER UPDATE ON Perfil_fisico
    FOR EACH ROW
    EXECUTE FUNCTION trigger_actualizar_rutinas_por_perfil();

-- ============================================
-- FUNCIÓN: Reasignar rutinas basado en nuevo perfil físico
-- ============================================
CREATE OR REPLACE FUNCTION evaluar_nuevas_rutinas_por_perfil(
    p_id_miembro INT,
    p_altura_nueva NUMERIC,
    p_peso_nuevo NUMERIC,
    p_observaciones TEXT
) RETURNS VOID AS $$
DECLARE
    v_miembro_record RECORD;
    v_id_rutina_nueva INT;
    v_imc_nuevo NUMERIC;
    v_progreso TEXT;
    v_rutinas_actuales INT;
BEGIN
    -- Obtener datos del miembro
    SELECT * INTO v_miembro_record 
    FROM Miembro 
    WHERE id_miembro = p_id_miembro;
    
    -- Calcular nuevo IMC
    v_imc_nuevo := p_peso_nuevo / ((p_altura_nueva / 100.0) * (p_altura_nueva / 100.0));
    
    -- Contar rutinas actuales activas
    SELECT COUNT(*) INTO v_rutinas_actuales
    FROM Asignacion_rutina 
    WHERE id_miembro = p_id_miembro AND estado = TRUE;
    
    -- Evaluar progreso y determinar nueva rutina
    IF v_rutinas_actuales = 0 THEN
        -- Primera rutina (miembro nuevo)
        v_progreso := 'PRINCIPIANTE';
    ELSIF v_rutinas_actuales BETWEEN 1 AND 2 THEN
        -- Ha completado 1-2 rutinas
        v_progreso := 'INTERMEDIO';
    ELSE
        -- Miembro experimentado
        v_progreso := 'AVANZADO';
    END IF;
    
    -- Lógica de asignación basada en perfil físico actualizado
    IF v_miembro_record.contextura = 'Ectomorfo' AND v_imc_nuevo < 18.5 THEN
        -- Persona delgada, necesita ganar masa
        IF v_progreso = 'PRINCIPIANTE' THEN
            SELECT id_rutina INTO v_id_rutina_nueva 
            FROM Rutina WHERE nivel = 'Principiante' AND tipo_rut = 'Full Body' LIMIT 1;
        ELSE
            SELECT id_rutina INTO v_id_rutina_nueva 
            FROM Rutina WHERE nivel = 'Avanzado' AND tipo_rut = 'Hipertrofia' LIMIT 1;
        END IF;
        
    ELSIF v_miembro_record.contextura = 'Endomorfo' OR v_imc_nuevo > 25 THEN
        -- Necesita cardio y pérdida de grasa
        IF v_progreso = 'PRINCIPIANTE' THEN
            SELECT id_rutina INTO v_id_rutina_nueva 
            FROM Rutina WHERE tipo_rut = 'Cardio y Resistencia' LIMIT 1;
        ELSE
            SELECT id_rutina INTO v_id_rutina_nueva 
            FROM Rutina WHERE nivel = 'Intermedio' AND tipo_rut = 'Funcional' LIMIT 1;
        END IF;
        
    ELSIF v_miembro_record.contextura = 'Mesomorfo' THEN
        -- Contextura atlética
        IF v_progreso = 'PRINCIPIANTE' THEN
            SELECT id_rutina INTO v_id_rutina_nueva 
            FROM Rutina WHERE nivel = 'Principiante' AND tipo_rut = 'Full Body' LIMIT 1;
        ELSIF v_progreso = 'INTERMEDIO' THEN
            SELECT id_rutina INTO v_id_rutina_nueva 
            FROM Rutina WHERE nivel = 'Intermedio' AND tipo_rut = 'Fuerza' LIMIT 1;
        ELSE
            SELECT id_rutina INTO v_id_rutina_nueva 
            FROM Rutina WHERE nivel = 'Avanzado' AND tipo_rut = 'Hipertrofia' LIMIT 1;
        END IF;
        
    ELSE
        -- Por defecto según nivel de progreso
        IF v_progreso = 'PRINCIPIANTE' THEN
            SELECT id_rutina INTO v_id_rutina_nueva 
            FROM Rutina WHERE nivel = 'Principiante' LIMIT 1;
        ELSIF v_progreso = 'INTERMEDIO' THEN
            SELECT id_rutina INTO v_id_rutina_nueva 
            FROM Rutina WHERE nivel = 'Intermedio' LIMIT 1;
        ELSE
            SELECT id_rutina INTO v_id_rutina_nueva 
            FROM Rutina WHERE nivel = 'Avanzado' LIMIT 1;
        END IF;
    END IF;
    
    -- SIEMPRE insertar nueva rutina si se encontró una
    IF v_id_rutina_nueva IS NOT NULL THEN
        INSERT INTO Asignacion_rutina (
            id_miembro, 
            id_rutina, 
            descripcion_rut, 
            fecha_inicio
        ) VALUES (
            p_id_miembro,
            v_id_rutina_nueva,
            'Rutina actualizada por progreso físico - ' || v_progreso || 
            ' | IMC: ' || ROUND(v_imc_nuevo, 2) || ' | ' || p_observaciones,
            CURRENT_DATE
        );
        
        -- Notificar al miembro sobre nueva rutina
        INSERT INTO Notificacion (id_usuario, tipo, contenido)
        SELECT 
            u.id_usuario,
            'nueva_rutina',
            '🆕 ¡NUEVA RUTINA ASIGNADA! Basada en tu progreso físico actualizado (' || 
            v_progreso || '). Altura: ' || p_altura_nueva || 'cm, Peso: ' || p_peso_nuevo || 
            'kg, IMC: ' || ROUND(v_imc_nuevo, 2) || '. ¡Consulta tu nueva rutina en tu perfil!'
        FROM Usuario u
        WHERE u.id_miembro = p_id_miembro;
        
        RAISE NOTICE 'Nueva rutina % asignada al miembro % por progreso físico', v_id_rutina_nueva, p_id_miembro;
    ELSE
        RAISE NOTICE 'No se encontró rutina para el miembro %', p_id_miembro;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCIÓN: Obtener estadísticas del gimnasio
-- ============================================
CREATE OR REPLACE FUNCTION obtener_estadisticas_gimnasio()
RETURNS TABLE(
    miembros_activos INT,
    miembros_pendientes INT,
    mensualidades_vigentes INT,
    rutinas_asignadas_hoy INT,
    ingresos_mes_actual NUMERIC,
    total_notificaciones_pendientes INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM Miembro WHERE estado = TRUE)::INT as miembros_activos,
        (SELECT COUNT(*) FROM Miembro WHERE estado = FALSE)::INT as miembros_pendientes,
        (SELECT COUNT(*) FROM Mensualidad WHERE fecha_fin >= CURRENT_DATE AND estado = TRUE)::INT as mensualidades_vigentes,
        (SELECT COUNT(*) FROM Asignacion_rutina WHERE fecha_inicio = CURRENT_DATE)::INT as rutinas_asignadas_hoy,
        (SELECT COALESCE(SUM(total), 0) FROM Factura WHERE EXTRACT(MONTH FROM fecha_emision) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha_emision) = EXTRACT(YEAR FROM CURRENT_DATE))::NUMERIC as ingresos_mes_actual,
        (SELECT COUNT(*) FROM Notificacion WHERE leido = FALSE)::INT as total_notificaciones_pendientes;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCIÓN: Obtener historial completo de rutinas de un miembro
-- ============================================
DROP FUNCTION IF EXISTS obtener_historial_rutinas_miembro(integer);

CREATE OR REPLACE FUNCTION obtener_historial_rutinas_miembro(p_id_miembro INT)
RETURNS TABLE(
    id_asignacion INT,
    id_rutina INT,
    rutina_nombre VARCHAR,
    rutina_tipo VARCHAR,
    rutina_nivel VARCHAR,
    descripcion_rutina VARCHAR,
    duracion_rutina VARCHAR,
    descripcion_asignacion VARCHAR,
    fecha_inicio DATE,
    fecha_registro DATE,
    estado_rutina BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ar.id_asignacion,
        r.id_rutina,
        (r.nivel || ' - ' || r.tipo_rut)::varchar as rutina_nombre,
        r.tipo_rut::varchar as rutina_tipo,
        r.nivel::varchar as rutina_nivel,
        r.descripcion_rut::varchar as descripcion_rutina,
        r.duracion_rut::varchar as duracion_rutina,
        ar.descripcion_rut::varchar as descripcion_asignacion,
        ar.fecha_inicio,
        ar.f_registro as fecha_registro,
        ar.estado as estado_rutina
    FROM Asignacion_rutina ar
    INNER JOIN Rutina r ON ar.id_rutina = r.id_rutina
    WHERE ar.id_miembro = p_id_miembro
    ORDER BY ar.f_registro DESC, ar.fecha_inicio DESC;
END;
$$ LANGUAGE plpgsql;
-- ============================================
-- NUEVAS FUNCIONES Y TRIGGERS
-- ============================================
-- 1) Funciones de notificación
CREATE OR REPLACE FUNCTION notify_admin(p_tipo VARCHAR, p_contenido TEXT) RETURNS VOID AS $$
BEGIN
  INSERT INTO Notificacion (
    id_usuario, id_usuario_remitente, tipo, contenido, fecha_envio, leido, estado
  )
  SELECT u.id_usuario, NULL, p_tipo, p_contenido, CURRENT_DATE, FALSE, TRUE
  FROM Usuario u
  WHERE u.rol = 'admin';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_member(p_member_id INT, p_tipo VARCHAR, p_contenido TEXT) RETURNS VOID AS $$
DECLARE
  v_user_id INT;
BEGIN
  -- ✅ Buscar el id_usuario basado en el id_miembro
  SELECT id_usuario INTO v_user_id
  FROM Usuario 
  WHERE id_miembro = p_member_id 
  AND estado = TRUE;
  
  -- ✅ Solo insertar si encontramos el usuario
  IF v_user_id IS NOT NULL THEN
    INSERT INTO Notificacion (
      id_usuario, id_usuario_remitente, tipo, contenido, fecha_envio, leido, estado
    ) VALUES (
      v_user_id, NULL, p_tipo, p_contenido, CURRENT_DATE, FALSE, TRUE
    );
    
    RAISE NOTICE 'Notificación enviada al usuario % (miembro %)', v_user_id, p_member_id;
  ELSE
    RAISE WARNING 'No se encontró usuario activo para miembro %', p_member_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 2) Trigger: stock bajo en Producto
CREATE OR REPLACE FUNCTION trg_low_stock() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock <= 5 AND OLD.stock > 5 THEN
    PERFORM notify_admin(
      'stock_bajo',
      'Stock bajo para producto ' || NEW.nombre_prod || 
      ' (ID: ' || NEW.id_producto || '), quedan ' || NEW.stock || ' unidades'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS low_stock_trigger ON Producto;
CREATE TRIGGER low_stock_trigger
  AFTER UPDATE ON Producto
  FOR EACH ROW
  WHEN (NEW.stock <= 5 AND OLD.stock > 5)
  EXECUTE FUNCTION trg_low_stock();

-- 3) Trigger: nuevo carrito
CREATE OR REPLACE FUNCTION trg_new_cart() RETURNS TRIGGER AS $$
DECLARE
  v_member_name VARCHAR;
BEGIN
  -- Obtener nombre del miembro
  SELECT m.nombre || ' ' || m.apellido1 INTO v_member_name
  FROM Miembro m 
  WHERE m.id_miembro = NEW.id_miembro;
  
  -- ✅ SOLO NOTIFICAR SI EL CARRITO TIENE TOTAL > 0
  -- Esto significa que ya tiene productos añadidos
  IF NOT NEW.procesado AND NEW.total_pago > 0 THEN
    PERFORM notify_admin(
      'nuevo_carrito',
      'Nuevo carrito #' || NEW.id_carrito || 
      ' creado por ' || COALESCE(v_member_name, 'miembro ' || NEW.id_miembro) ||
      '. Total: $' || NEW.total_pago || '. Estado: Pendiente'
    );
    
    RAISE NOTICE 'Carrito % notificado - Miembro: %, Total: $%', 
                 NEW.id_carrito, NEW.id_miembro, NEW.total_pago;
  ELSE
    RAISE NOTICE 'Carrito % creado pero sin productos - no se notifica', NEW.id_carrito;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ✅ TRIGGER QUE SE DISPARA CUANDO EL TOTAL CAMBIA DE 0 A >0
-- Esto significa que se añadió el primer producto
DROP TRIGGER IF EXISTS new_cart_trigger ON Carrito;
CREATE TRIGGER new_cart_trigger
  AFTER UPDATE OF total_pago ON Carrito
  FOR EACH ROW
  WHEN (NOT NEW.procesado AND OLD.total_pago = 0 AND NEW.total_pago > 0)
  EXECUTE FUNCTION trg_new_cart();

-- ✅ CORREGIR TRIGGER DE CHECKOUT (información más precisa)
CREATE OR REPLACE FUNCTION trg_checkout_cart() RETURNS TRIGGER AS $$
DECLARE
  rec RECORD;
  v_total NUMERIC := 0;
  v_member_name VARCHAR;
  v_productos_texto TEXT := '';
  v_count_productos INT := 0;
BEGIN
  -- Solo cuando cambie de false → true
  IF NEW.procesado AND NOT OLD.procesado THEN

    -- Obtener nombre del miembro
    SELECT m.nombre || ' ' || m.apellido1 INTO v_member_name
    FROM Miembro m 
    WHERE m.id_miembro = NEW.id_miembro;

    -- ✅ 1. Decrementar stock, calcular total y construir detalle
    FOR rec IN 
      SELECT 
        dc.id_producto, 
        dc.cantidad, 
        dc.precio_unitario, 
        dc.subtotal,
        p.nombre_prod
      FROM Detalle_Carrito dc
      INNER JOIN Producto p ON dc.id_producto = p.id_producto
      WHERE dc.id_carrito = NEW.id_carrito
    LOOP
      -- Decrementar stock
      UPDATE Producto
        SET stock = stock - rec.cantidad
      WHERE id_producto = rec.id_producto;
      
      -- Sumar al total
      v_total := v_total + rec.subtotal;
      
      -- Construir texto de productos
      v_count_productos := v_count_productos + 1;
      v_productos_texto := v_productos_texto || rec.cantidad || 'x ' || rec.nombre_prod;
      
      IF v_count_productos < 3 THEN
        v_productos_texto := v_productos_texto || ', ';
      ELSIF v_count_productos = 3 THEN
        v_productos_texto := v_productos_texto || '...';
        EXIT; -- Solo mostrar los primeros 3 productos
      END IF;
    END LOOP;

    -- ✅ 2. NOTIFICAR A ADMINS con información detallada
    PERFORM notify_admin(
      'checkout',
      '🛒 CHECKOUT COMPLETADO - Carrito #' || NEW.id_carrito || 
      ' por ' || COALESCE(v_member_name, 'miembro ' || NEW.id_miembro) || 
      '. Productos: ' || RTRIM(v_productos_texto, ', ') ||
      '. Total: $' || ROUND(v_total, 2) || 
      '. ⚠️ REQUIERE FACTURACIÓN MANUAL.'
    );
    
    -- ✅ 3. NOTIFICAR AL MIEMBRO
    PERFORM notify_member(
      NEW.id_miembro,
      'compra',
      '✅ ¡Pedido procesado exitosamente! Tu carrito #' || NEW.id_carrito || 
      ' con ' || v_count_productos || ' producto(s) ha sido confirmado. ' ||
      'Total: $' || ROUND(v_total, 2) || 
      '. 📋 Espera la confirmación del administrador para recibir tu factura oficial.'
    );
    
    RAISE NOTICE 'Carrito % procesado por %. Total: $%. Stock actualizado.', 
                 NEW.id_carrito, v_member_name, ROUND(v_total, 2);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1) función auxiliar para recalcular total_pago
CREATE OR REPLACE FUNCTION trg_recalc_total_pago() RETURNS TRIGGER AS $$
DECLARE
  v_cart INT;
BEGIN
  -- Determinar carrito según operación
  IF TG_OP = 'DELETE' THEN
    v_cart := OLD.id_carrito;
  ELSE
    v_cart := NEW.id_carrito;
  END IF;

  -- Recalcular total_pago
  UPDATE Carrito
    SET total_pago = COALESCE(
      (SELECT SUM(subtotal)
         FROM Detalle_Carrito
        WHERE id_carrito = v_cart),
      0
    )
  WHERE id_carrito = v_cart;

  -- Devolver la fila adecuada
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Disparador AFTER INSERT
DROP TRIGGER IF EXISTS recalc_total_after_ins ON Detalle_Carrito;
CREATE TRIGGER recalc_total_after_ins
  AFTER INSERT ON Detalle_Carrito
  FOR EACH ROW
  EXECUTE FUNCTION trg_recalc_total_pago();

-- Disparador AFTER UPDATE
DROP TRIGGER IF EXISTS recalc_total_after_upd ON Detalle_Carrito;
CREATE TRIGGER recalc_total_after_upd
  AFTER UPDATE OF cantidad, precio_unitario ON Detalle_Carrito
  FOR EACH ROW
  EXECUTE FUNCTION trg_recalc_total_pago();

-- Disparador AFTER DELETE
DROP TRIGGER IF EXISTS recalc_total_after_del ON Detalle_Carrito;
CREATE TRIGGER recalc_total_after_del
  AFTER DELETE ON Detalle_Carrito
  FOR EACH ROW
  EXECUTE FUNCTION trg_recalc_total_pago();

-- ✅ SOLUCIÓN DEFINITIVA: Eliminar triggers duplicados y crear uno solo inteligente

-- 1) Eliminar todos los triggers de carrito existentes
DROP TRIGGER IF EXISTS new_cart_trigger ON Carrito;
DROP TRIGGER IF EXISTS checkout_cart_trigger ON Carrito;
DROP TRIGGER IF EXISTS carrito_eventos_trigger ON Carrito;

-- 2) Crear UN SOLO trigger que maneje todo
CREATE OR REPLACE FUNCTION trg_carrito_eventos() RETURNS TRIGGER AS $$
DECLARE
  rec RECORD;
  v_total NUMERIC := 0;
  v_member_name VARCHAR;
  v_productos_texto TEXT := '';
  v_count_productos INT := 0;
BEGIN
  -- Obtener nombre del miembro
  SELECT m.nombre || ' ' || m.apellido1 INTO v_member_name
  FROM Miembro m 
  WHERE m.id_miembro = NEW.id_miembro;

  -- ✅ EVENTO 1: NUEVO CARRITO CON PRODUCTOS (solo cuando total pasa de 0 a >0)
  IF TG_OP = 'UPDATE' AND OLD.total_pago = 0 AND NEW.total_pago > 0 AND NOT NEW.procesado THEN
    PERFORM notify_admin(
      'nuevo_carrito',
      'Nuevo carrito #' || NEW.id_carrito || 
      ' creado por ' || COALESCE(v_member_name, 'miembro ' || NEW.id_miembro) ||
      '. Total: $' || NEW.total_pago || '. Estado: Pendiente'
    );
    
    RAISE NOTICE 'Carrito % con productos notificado - Miembro: %, Total: $%', 
                 NEW.id_carrito, NEW.id_miembro, NEW.total_pago;
  END IF;

  -- ✅ EVENTO 2: CHECKOUT COMPLETADO (solo cuando procesado cambia de false a true)
  IF TG_OP = 'UPDATE' AND NOT OLD.procesado AND NEW.procesado THEN
    
    -- Calcular detalles del checkout
    FOR rec IN 
      SELECT 
        dc.id_producto, 
        dc.cantidad, 
        dc.precio_unitario, 
        dc.subtotal,
        p.nombre_prod
      FROM Detalle_Carrito dc
      INNER JOIN Producto p ON dc.id_producto = p.id_producto
      WHERE dc.id_carrito = NEW.id_carrito
    LOOP
      -- Decrementar stock
      UPDATE Producto SET stock = stock - rec.cantidad WHERE id_producto = rec.id_producto;
      
      -- Sumar al total
      v_total := v_total + rec.subtotal;
      
      -- Construir texto de productos
      v_count_productos := v_count_productos + 1;
      v_productos_texto := v_productos_texto || rec.cantidad || 'x ' || rec.nombre_prod;
      
      IF v_count_productos < 3 THEN
        v_productos_texto := v_productos_texto || ', ';
      ELSIF v_count_productos = 3 THEN
        v_productos_texto := v_productos_texto || '...';
        EXIT;
      END IF;
    END LOOP;

    -- Notificar a admins
    PERFORM notify_admin(
      'checkout',
      '🛒 CHECKOUT COMPLETADO - Carrito #' || NEW.id_carrito || 
      ' por ' || COALESCE(v_member_name, 'miembro ' || NEW.id_miembro) || 
      '. Productos: ' || RTRIM(v_productos_texto, ', ') ||
      '. Total: $' || ROUND(v_total, 2) || 
      '. ⚠️ REQUIERE FACTURACIÓN MANUAL.'
    );
    
    -- Notificar al miembro
    PERFORM notify_member(
      NEW.id_miembro,
      'compra',
      '✅ ¡Pedido procesado exitosamente! Tu carrito #' || NEW.id_carrito || 
      ' con ' || v_count_productos || ' producto(s) ha sido confirmado. ' ||
      'Total: $' || ROUND(v_total, 2) || 
      '. 📋 Espera la confirmación del administrador para recibir tu factura oficial.'
    );
    
    RAISE NOTICE 'Checkout completado - Carrito: %, Total: $%', NEW.id_carrito, ROUND(v_total, 2);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3) Crear UN SOLO trigger para manejar ambos eventos
CREATE TRIGGER carrito_eventos_trigger
  AFTER UPDATE ON Carrito
  FOR EACH ROW
  EXECUTE FUNCTION trg_carrito_eventos();

-- ============================================
-- FUNCIÓN: Desactivar automáticamente rutinas anteriores al asignar una nueva
-- ============================================
CREATE OR REPLACE FUNCTION desactivar_rutinas_anteriores(
    p_id_miembro INT
) RETURNS VOID AS $$
BEGIN
    -- Desactivar rutinas activas anteriores del miembro
    UPDATE Asignacion_rutina
    SET estado = FALSE
    WHERE id_miembro = p_id_miembro AND estado = TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Desactivar rutinas anteriores al insertar una nueva asignación
-- ============================================
CREATE OR REPLACE FUNCTION trg_desactivar_rutinas_anteriores()
RETURNS TRIGGER AS $$
BEGIN
    -- Desactivar rutinas anteriores solo si hay una nueva asignación
    IF TG_OP = 'INSERT' THEN
        PERFORM desactivar_rutinas_anteriores(NEW.id_miembro);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger
DROP TRIGGER IF EXISTS desactivar_rutinas_anteriores_trigger ON Asignacion_rutina;
CREATE TRIGGER desactivar_rutinas_anteriores_trigger
    BEFORE INSERT ON Asignacion_rutina
    FOR EACH ROW
    EXECUTE FUNCTION trg_desactivar_rutinas_anteriores();

-- ============================================
-- FUNCIÓN: Obtener perfil físico actual de un miembro
-- ============================================
CREATE OR REPLACE FUNCTION obtener_perfil_fisico_actual(p_id_miembro INT)
RETURNS TABLE(
    id_perfil INT,
    altura NUMERIC,
    peso NUMERIC,
    observaciones TEXT,
    fecha_registro DATE,
    estado BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pf.id_perfil,
        pf.altura,
        pf.peso,
        pf.observaciones,
        pf.fecha_registro,
        pf.estado
    FROM Perfil_fisico pf
    WHERE pf.id_miembro = p_id_miembro
    ORDER BY pf.fecha_registro DESC, pf.id_perfil DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION generar_factura_desde_mensualidad()
RETURNS TRIGGER AS $$
DECLARE
    v_id_factura INT;
    v_total_factura NUMERIC;
    v_iva_calculado NUMERIC;
BEGIN
    -- Calcular el IVA y el total de la factura
    v_iva_calculado := NEW.monto * 0.15;
    v_total_factura := NEW.monto + v_iva_calculado;

    -- Insertar en la tabla 'factura'
    INSERT INTO factura (id_miembro, id_admin, fecha_emision, total, estado_registro, f_registro)
    VALUES (
        NEW.id_miembro,
        1, -- ID de administrador por defecto
        NEW.fecha_inicio,
        v_total_factura,
        TRUE,
        CURRENT_DATE
    )
    RETURNING id_factura INTO v_id_factura;

    -- Insertar en la tabla 'detalle_factura'
    INSERT INTO detalle_factura (
        id_factura, tipo_detalle, referencia_id, descripcion, monto, iva,
        metodo_pago, estado_registro, f_registro
    )
    VALUES (
        v_id_factura,
        'pago mensual',
        NEW.id_mensualidad,
        'Pago de Mensualidad del ' || TO_CHAR(NEW.fecha_inicio, 'YYYY-MM-DD') || ' al ' || TO_CHAR(NEW.fecha_fin, 'YYYY-MM-DD'),
        NEW.monto,
        0.15,
        'Pendiente',
        TRUE,
        CURRENT_DATE
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para desactivar miembro al eliminar mensualidad
CREATE OR REPLACE FUNCTION desactivar_miembro_al_eliminar_mensualidad()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE Miembro
    SET estado = FALSE
    WHERE id_miembro = OLD.id_miembro;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger para llamar a la función después de eliminar una mensualidad
DROP TRIGGER IF EXISTS trg_desactivar_miembro_delete_mensualidad ON Mensualidad;
CREATE TRIGGER trg_desactivar_miembro_delete_mensualidad
AFTER DELETE ON Mensualidad
FOR EACH ROW
EXECUTE FUNCTION desactivar_miembro_al_eliminar_mensualidad();
-- ============================================
-- TRIGGER: Actualizar altura y peso en Miembro al insertar Perfil_fisico
-- ============================================
CREATE OR REPLACE FUNCTION actualizar_miembro_al_insertar_perfil()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE Miembro
    SET altura = NEW.altura,
        peso = NEW.peso
    WHERE id_miembro = NEW.id_miembro;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_actualizar_miembro_perfil ON Perfil_fisico;
CREATE TRIGGER trg_actualizar_miembro_perfil
AFTER INSERT ON Perfil_fisico
FOR EACH ROW
EXECUTE FUNCTION actualizar_miembro_al_insertar_perfil();

-- Trigger: Evaluar nuevas rutinas al insertar un nuevo perfil físico
CREATE OR REPLACE FUNCTION trigger_asignar_rutina_por_nuevo_perfil()
RETURNS TRIGGER AS $$
BEGIN
    -- Evaluar y asignar nuevas rutinas si es necesario
    PERFORM evaluar_nuevas_rutinas_por_perfil(
        NEW.id_miembro,
        NEW.altura,
        NEW.peso,
        NEW.observaciones
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_nuevo_perfil_fisico ON Perfil_fisico;
CREATE TRIGGER trigger_nuevo_perfil_fisico
AFTER INSERT ON Perfil_fisico
FOR EACH ROW
EXECUTE FUNCTION trigger_asignar_rutina_por_nuevo_perfil();