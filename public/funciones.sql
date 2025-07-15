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
    
    -- Verificar que no sea la misma rutina que ya tiene activa
    IF NOT EXISTS (
        SELECT 1 FROM Asignacion_rutina 
        WHERE id_miembro = p_id_miembro 
        AND id_rutina = v_id_rutina_nueva 
        AND estado = TRUE
    ) AND v_id_rutina_nueva IS NOT NULL THEN
        
        -- Insertar nueva asignación de rutina
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
        RAISE NOTICE 'No se requiere nueva rutina para el miembro % o ya tiene la rutina óptima', p_id_miembro;
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
CREATE OR REPLACE FUNCTION obtener_historial_rutinas_miembro(p_id_miembro INT)
RETURNS TABLE(
    id_asignacion INT,
    rutina_nombre VARCHAR,
    rutina_tipo VARCHAR,
    rutina_nivel VARCHAR,
    descripcion_asignacion VARCHAR,
    fecha_inicio DATE,
    fecha_registro DATE,
    estado_rutina BOOLEAN,
    duracion_semanas VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ar.id_asignacion,
        (r.nivel || ' - ' || r.tipo_rut) as rutina_nombre,
        r.tipo_rut as rutina_tipo,
        r.nivel as rutina_nivel,
        ar.descripcion_rut as descripcion_asignacion,
        ar.fecha_inicio,
        ar.f_registro as fecha_registro,
        ar.estado as estado_rutina,
        r.duracion_rut as duracion_semanas
    FROM Asignacion_rutina ar
    INNER JOIN Rutina r ON ar.id_rutina = r.id_rutina
    WHERE ar.id_miembro = p_id_miembro
    ORDER BY ar.f_registro DESC, ar.fecha_inicio DESC;
END;
$$ LANGUAGE plpgsql;