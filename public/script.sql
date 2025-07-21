-- ==============================
-- Tabla: Producto
-- ==============================
CREATE TABLE
    Producto (
        id_producto SERIAL PRIMARY KEY,
        nombre_prod VARCHAR(255) NOT NULL,
        tipo_prod VARCHAR(100) NOT NULL,
        precio_prod DOUBLE PRECISION NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        estado BOOLEAN NOT NULL DEFAULT TRUE,
        f_registro DATE NOT NULL DEFAULT CURRENT_DATE
    );

-- ==============================
-- Tabla: Rutina
-- ==============================
CREATE TABLE
    Rutina (
        id_rutina SERIAL PRIMARY KEY,
        nivel VARCHAR(100) NOT NULL,
        tipo_rut VARCHAR(100) NOT NULL,
        descripcion_rut VARCHAR(255) NOT NULL,
        duracion_rut VARCHAR(255) NOT NULL,
        estado BOOLEAN NOT NULL DEFAULT TRUE,
        f_registro DATE NOT NULL DEFAULT CURRENT_DATE
    );

-- ==============================
-- Tabla: Dieta
-- ==============================
CREATE TABLE
    Dieta (
        id_dieta SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        objetivo VARCHAR(255) NOT NULL,
        descripcion TEXT NOT NULL,
        duracion_dias INT NOT NULL,
        id_rutina INT NOT NULL,
        estado BOOLEAN NOT NULL DEFAULT TRUE,
        f_registro DATE NOT NULL DEFAULT CURRENT_DATE,
        CONSTRAINT fk_dieta_rutina FOREIGN KEY (id_rutina) REFERENCES Rutina (id_rutina)
    );

-- ==============================
-- Tabla: Comida
-- ==============================
CREATE TABLE
    Comida (
        id_comida SERIAL PRIMARY KEY,
        id_dieta INT NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        tipo VARCHAR(100) NOT NULL,
        hora_recomendada TIME NOT NULL,
        descripcion TEXT NOT NULL,
        estado BOOLEAN NOT NULL DEFAULT TRUE,
        f_registro DATE NOT NULL DEFAULT CURRENT_DATE,
        CONSTRAINT fk_comida_dieta FOREIGN KEY (id_dieta) REFERENCES Dieta (id_dieta)
    );

-- ==============================
-- Tabla: Miembro
-- ==============================
CREATE TABLE
    Miembro (
        id_miembro SERIAL PRIMARY KEY,
        cedula VARCHAR(20) UNIQUE NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        apellido1 VARCHAR(255) NOT NULL,
        apellido2 VARCHAR(255) NOT NULL,
        edad INT NOT NULL,
        direccion VARCHAR(255) NOT NULL,
        altura NUMERIC(5, 2) NOT NULL,
        peso NUMERIC(5, 2) NOT NULL,
        contextura VARCHAR(100) NOT NULL,
        objetivo TEXT NOT NULL,
        sexo VARCHAR(20) NOT NULL,
        fecha_inscripcion DATE NOT NULL DEFAULT CURRENT_DATE,
        estado BOOLEAN NOT NULL DEFAULT TRUE,
        correo VARCHAR(255) UNIQUE NOT NULL,
        estado_registro BOOLEAN NOT NULL DEFAULT TRUE,
        f_registro DATE NOT NULL DEFAULT CURRENT_DATE
    );

-- ==============================
-- Tabla: Entrenador
-- ==============================
CREATE TABLE
    Entrenador (
        id_entrenador SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        apellido VARCHAR(255) NOT NULL,
        especialidad VARCHAR(255) NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
        estado BOOLEAN NOT NULL DEFAULT TRUE
    );

-- ==============================
-- Tabla: Usuario (admin, entrenador o miembro)
-- ==============================
CREATE TABLE
    Usuario (
        id_usuario SERIAL PRIMARY KEY,
        usuario VARCHAR(255) UNIQUE NOT NULL,
        contrasenia VARCHAR(255) NOT NULL,
        rol VARCHAR(50) NOT NULL, -- admin, entrenador, miembro
        id_coach INT NULL,
        id_miembro INT NULL,
        estado BOOLEAN NOT NULL DEFAULT TRUE,
        fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
        CONSTRAINT fk_usuario_coach FOREIGN KEY (id_coach) REFERENCES Entrenador (id_entrenador),
        CONSTRAINT fk_usuario_miembro FOREIGN KEY (id_miembro) REFERENCES Miembro (id_miembro)
    );

-- ==============================
-- Tabla: Perfil_fisico
-- ==============================
CREATE TABLE
    Perfil_fisico (
        id_perfil SERIAL PRIMARY KEY,
        id_miembro INT NOT NULL,
        altura NUMERIC(5, 2) NOT NULL,
        peso NUMERIC(5, 2) NOT NULL,
        observaciones TEXT NOT NULL,
        fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
        estado BOOLEAN NOT NULL DEFAULT TRUE,
        CONSTRAINT fk_perfil_miembro FOREIGN KEY (id_miembro) REFERENCES Miembro (id_miembro)
    );

-- ==============================
-- Tabla: Mensualidad
-- ==============================
CREATE TABLE
    Mensualidad (
        id_mensualidad SERIAL PRIMARY KEY,
        id_miembro INT NOT NULL,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE NOT NULL,
        monto DOUBLE PRECISION NOT NULL,
        estado_mensualidad VARCHAR(100) NOT NULL,
        estado BOOLEAN NOT NULL DEFAULT TRUE,
        f_registro DATE NOT NULL DEFAULT CURRENT_DATE,
        CONSTRAINT fk_mensualidad_miembro FOREIGN KEY (id_miembro) REFERENCES Miembro (id_miembro)
    );

-- ==============================
-- Tabla: Registro_de_clases
-- ==============================
CREATE TABLE
    Registro_de_clases (
        id_registro SERIAL PRIMARY KEY,
        id_miembro INT NOT NULL,
        horario VARCHAR(100) NOT NULL,
        fecha_asistencia DATE NOT NULL,
        estado BOOLEAN NOT NULL DEFAULT TRUE,
        f_registro DATE NOT NULL DEFAULT CURRENT_DATE,
        CONSTRAINT fk_registro_miembro FOREIGN KEY (id_miembro) REFERENCES Miembro (id_miembro)
    );

-- ==============================
-- Tabla: Asignacion_entrenador
-- ==============================
CREATE TABLE
    Asignacion_entrenador (
        id_asignacion SERIAL PRIMARY KEY,
        id_miembro INT NOT NULL,
        id_entrenador INT NOT NULL,
        fecha DATE NOT NULL DEFAULT CURRENT_DATE,
        estado BOOLEAN NOT NULL DEFAULT TRUE,
        f_registro DATE NOT NULL DEFAULT CURRENT_DATE,
        CONSTRAINT fk_asig_entrenador_miembro FOREIGN KEY (id_miembro) REFERENCES Miembro (id_miembro),
        CONSTRAINT fk_asig_entrenador_entrenador FOREIGN KEY (id_entrenador) REFERENCES Entrenador (id_entrenador)
    );

-- ==============================
-- Tabla: Asignacion_rutina
-- ==============================
CREATE TABLE
    Asignacion_rutina (
        id_asignacion SERIAL PRIMARY KEY,
        id_miembro INT NOT NULL,
        id_rutina INT NOT NULL,
        descripcion_rut VARCHAR(255) NOT NULL,
        estado BOOLEAN NOT NULL DEFAULT TRUE,
        f_registro DATE NOT NULL DEFAULT CURRENT_DATE,
        fecha_inicio DATE NOT NULL,
        CONSTRAINT fk_asignacionrutina_miembro FOREIGN KEY (id_miembro) REFERENCES Miembro (id_miembro),
        CONSTRAINT fk_asignacionrutina_rutina FOREIGN KEY (id_rutina) REFERENCES Rutina (id_rutina)
    );

-- ==============================
-- Tabla: Factura (actualizada con admin)
-- ==============================
CREATE TABLE
    Factura (
        id_factura SERIAL PRIMARY KEY,
        id_miembro INT NOT NULL,
        id_admin INT NOT NULL,
        fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
        total DOUBLE PRECISION NOT NULL,
        estado_registro BOOLEAN NOT NULL DEFAULT TRUE,
        f_registro DATE NOT NULL DEFAULT CURRENT_DATE,
        CONSTRAINT fk_factura_miembro FOREIGN KEY (id_miembro) REFERENCES Miembro (id_miembro),
        CONSTRAINT fk_factura_admin FOREIGN KEY (id_admin) REFERENCES Usuario (id_usuario)
    );

-- ==============================
-- Tabla: Detalle_Factura (polimórfica)
-- ==============================
CREATE TABLE
    Detalle_Factura (
        id_detalle SERIAL PRIMARY KEY,
        id_factura INT NOT NULL,
        tipo_detalle VARCHAR(100) NOT NULL CHECK (
            tipo_detalle IN (
                'pago mensual',
                'compra producto',
                'compra suplemento',
                'servicio adicional'
            )
        ),
        referencia_id INT NOT NULL,
        descripcion TEXT NOT NULL,
        monto DOUBLE PRECISION NOT NULL,
        iva DOUBLE PRECISION NOT NULL DEFAULT 0.15,
        metodo_pago VARCHAR(100) NOT NULL,
        estado_registro BOOLEAN NOT NULL DEFAULT TRUE,
        f_registro DATE NOT NULL DEFAULT CURRENT_DATE,
        CONSTRAINT fk_detalle_factura FOREIGN KEY (id_factura) REFERENCES Factura (id_factura)
    );

-- ==============================
-- Tabla: Carrito (con campo procesado)
-- ==============================
CREATE TABLE
    Carrito (
        id_carrito SERIAL PRIMARY KEY,
        id_miembro INT NOT NULL,
        total_pago DOUBLE PRECISION DEFAULT 0,
        procesado BOOLEAN NOT NULL DEFAULT FALSE,
        estado BOOLEAN NOT NULL DEFAULT TRUE,
        f_registro DATE NOT NULL DEFAULT CURRENT_DATE,
        CONSTRAINT fk_carrito_miembro FOREIGN KEY (id_miembro) REFERENCES Miembro (id_miembro)
    );

-- ==============================
-- Tabla: Notificacion (emisor + receptor)
-- ==============================
CREATE TABLE
    Notificacion (
        id_notificacion SERIAL PRIMARY KEY,
        id_usuario INT NOT NULL, -- receptor
        id_usuario_remitente INT, -- emisor
        tipo VARCHAR(100) NOT NULL,
        contenido TEXT NOT NULL,
        fecha_envio DATE NOT NULL DEFAULT CURRENT_DATE,
        leido BOOLEAN NOT NULL DEFAULT FALSE,
        estado BOOLEAN NOT NULL DEFAULT TRUE,
        f_registro DATE NOT NULL DEFAULT CURRENT_DATE,
        CONSTRAINT fk_notificacion_usuario FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario),
        CONSTRAINT fk_notificacion_remitente FOREIGN KEY (id_usuario_remitente) REFERENCES Usuario (id_usuario)
    );

CREATE TABLE
    Detalle_Carrito (
        id_detalle_carrito SERIAL PRIMARY KEY,
        id_carrito INT NOT NULL,
        id_producto INT NOT NULL,
        cantidad INT NOT NULL,
        precio_unitario DOUBLE PRECISION NOT NULL,
        subtotal DOUBLE PRECISION GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
        estado BOOLEAN NOT NULL DEFAULT TRUE,
        f_registro DATE NOT NULL DEFAULT CURRENT_DATE,
        CONSTRAINT fk_detallecarrito_carrito FOREIGN KEY (id_carrito) REFERENCES Carrito (id_carrito),
        CONSTRAINT fk_detallecarrito_producto FOREIGN KEY (id_producto) REFERENCES Producto (id_producto)
    );