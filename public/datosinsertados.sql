-- Insertar productos de ejemplo con nombres formateados
INSERT INTO Producto (nombre_prod, tipo_prod, precio_prod, stock)
VALUES 
('Creatina Monohidratada 300g', 'Suplemento', 24.99, 20),
('Proteína Whey 2lb Chocolate', 'Suplemento', 39.90, 15),
('Guantes de Entrenamiento', 'Accesorio', 12.50, 50),
('Camiseta Dry-Fit Larga', 'Ropa Deportiva', 18.99, 30),
('Mancuernas Ajustables 20kg', 'Implemento de Entrenamiento', 65.00, 10),
('BCAA 2:1:1 200g Frutas', 'Suplemento', 19.99, 25),
('Proteína Vegana 1lb Vainilla', 'Suplemento', 34.99, 20),
('Pre-Entreno NitroX 300g', 'Suplemento', 27.50, 15),
('Omega 3 1000mg x90 cápsulas', 'Suplemento', 21.99, 35),
('Glutamina 250g Polvo', 'Suplemento', 22.00, 20),
('Creatina Micronizada 500g', 'Suplemento', 29.99, 12),
('Proteína Isolate 5lb Fresa', 'Suplemento', 74.90, 8),
('Termogénico LipoX 60 cápsulas', 'Suplemento', 26.99, 18),
('Caseína Nocturna 2lb Vainilla', 'Suplemento', 42.50, 10),
('Multivitamínico Deportivo x120', 'Suplemento', 17.99, 30),

('Cinturón de Levantamiento', 'Accesorio', 22.99, 25),
('Rodilleras Pro Fitness', 'Accesorio', 16.00, 20),
('Straps para Levantamiento', 'Accesorio', 10.50, 40),
('Botella Shaker 700ml', 'Accesorio', 7.99, 60),
('Toalla Deportiva Microfibra', 'Accesorio', 9.90, 45),
('Pulseras Magnéticas Fitness', 'Accesorio', 11.50, 25),
('Lentes Antiempañantes Gym', 'Accesorio', 14.00, 15),
('Bolso Deportivo Grande', 'Accesorio', 29.99, 20),
('Soporte de Muñeca', 'Accesorio', 13.50, 30),
('Cuerda para Saltar Pro', 'Accesorio', 8.99, 50),

('Short Deportivo Hombre', 'Ropa Deportiva', 17.50, 25),
('Leggings Mujer Compresión', 'Ropa Deportiva', 22.99, 30),
('Top Deportivo Mujer M', 'Ropa Deportiva', 16.00, 20),
('Chaqueta Fitness Unisex', 'Ropa Deportiva', 29.90, 15),
('Pantalón Jogger Seca Rápido', 'Ropa Deportiva', 24.99, 18),
('Gorra Dry Fit', 'Ropa Deportiva', 12.00, 40),
('Medias Antideslizantes Gym', 'Ropa Deportiva', 5.99, 60),
('Camiseta sin Mangas M', 'Ropa Deportiva', 13.50, 35),
('Faja Deportiva Reductora', 'Ropa Deportiva', 18.00, 22),
('Sudadera Hoodie XL', 'Ropa Deportiva', 34.99, 12);

-- Insertar rutinas de ejemplo
INSERT INTO Rutina (nivel, tipo_rut, descripcion_rut, duracion_rut)
VALUES
('Principiante', 'Full Body', 'Rutina general para iniciar entrenamiento de todo el cuerpo.', '4 semanas'),
('Intermedio', 'Fuerza', 'Ejercicios enfocados en aumentar fuerza progresiva en tren superior e inferior.', '6 semanas'),
('Avanzado', 'Hipertrofia', 'Entrenamiento dividido por grupos musculares para ganar masa muscular.', '8 semanas'),
('Principiante', 'Cardio y Resistencia', 'Rutina con ejercicios aeróbicos para mejorar capacidad cardiovascular.', '3 semanas'),
('Intermedio', 'Funcional', 'Circuitos de movimientos funcionales para rendimiento deportivo.', '5 semanas');

-- Insertar dietas de ejemplo
INSERT INTO Dieta (nombre, objetivo, descripcion, duracion_dias, id_rutina)
VALUES
('Dieta Inicial', 'Adaptación metabólica y nutricional básica', 'Incluye tres comidas balanceadas con frutas, proteínas y vegetales.', 28, 1),
('Dieta Fuerza', 'Aumento de fuerza y recuperación muscular', 'Alta en proteínas, carbohidratos complejos y grasas saludables.', 42, 2),
('Dieta Hipertrofia', 'Incremento de masa muscular', 'Cinco comidas ricas en proteínas animales, vegetales, y suplementación.', 56, 3),
('Dieta Cardio', 'Pérdida de grasa y resistencia cardiovascular', 'Reducción calórica moderada con enfoque en comidas ligeras.', 21, 4),
('Dieta Funcional', 'Rendimiento físico y agilidad', 'Enfocada en alimentos energéticos, vitaminas y antioxidantes.', 35, 5);

-- Insertar comidas para las dietas
INSERT INTO Comida (id_dieta, nombre, tipo, hora_recomendada, descripcion)
VALUES
-- Dieta 1: Dieta Inicial
(1, 'Avena con frutas y yogurt', 'Desayuno', '07:30', 'Proporciona energía y fibra para iniciar el día.'),
-- Dieta 2: Dieta Fuerza
(2, 'Pechuga de pollo con arroz integral y brócoli', 'Almuerzo', '13:00', 'Ideal para la recuperación muscular.'),
-- Dieta 3: Dieta Hipertrofia
(3, 'Batido de proteína con banana y avena', 'Post-entreno', '17:30', 'Aporte proteico inmediato tras el entrenamiento.'),
-- Dieta 4: Dieta Cardio
(4, 'Ensalada de atún con aguacate', 'Cena', '19:30', 'Cena ligera rica en grasas saludables.'),
-- Dieta 5: Dieta Funcional
(5, 'Smoothie de espinaca, manzana y chía', 'Merienda', '10:30', 'Antioxidante y energético para media mañana.');

INSERT INTO Miembro (cedula, nombre, apellido1, apellido2, edad, direccion, altura, peso, contextura, objetivo, sexo, correo)
VALUES
-- 1. Goku – objetivo: aumento de musculatura
('1102857391', 'Goku', 'Son', 'Kakarotto', 35, 'Av. Ferroviaria y Bolívar, Machala', 1.75, 78.5, 'Mesomorfo', 'Aumento de masa muscular', 'Masculino', 'goku@dbzmail.com'),

-- 2. Hermione – objetivo: pérdida de grasa
('1102845002', 'Hermione', 'Granger', 'Jean', 28, 'Cdla. El Cambio, Machala', 1.64, 58.0, 'Ectomorfo', 'Pérdida de grasa corporal', 'Femenino', 'hermione@hogwarts.edu'),

-- 3. Tony Stark – objetivo: recomposición corporal
('1102845003', 'Tony', 'Stark', 'Howard', 42, 'Av. Principal, Pasaje', 1.82, 82.0, 'Endomorfo', 'Recomposición corporal', 'Masculino', 'tony@starkindustries.com'),

-- 4. Wonder Woman – objetivo: tonificación general
('1102845004', 'Diana', 'Prince', 'Themyscira', 30, 'Ciudadela del Deportista, Machala', 1.78, 70.0, 'Mesomorfo', 'Tonificación muscular', 'Femenino', 'diana@amazonas.org'),

-- 5. Naruto – objetivo: ganar resistencia
('1102845005', 'Naruto', 'Uzumaki', 'Namizake', 24, 'Cdla. Los Ángeles, Pasaje', 1.70, 65.0, 'Ectomorfo', 'Mejorar resistencia física', 'Masculino', 'naruto@konoha.jp');

INSERT INTO Entrenador (nombre, apellido, especialidad, telefono)
VALUES
-- 1. Jean Carlo – entrenamiento funcional
('Jean', 'Carlo', 'Entrenamiento Funcional', '0991234567'),

-- 2. Carolina Aguirre – tonificación y cardio
('Carolina', 'Aguirre', 'Tonificación y Cardio', '0987654321'),

-- 3. Deyna Castellanos – alto rendimiento y fuerza
('Deyna', 'Castellanos', 'Alto Rendimiento y Fuerza', '0976543210'),

-- 4. Jefferson Pérez – marcha y resistencia
('Jefferson', 'Pérez', 'Resistencia y Marcha Deportiva', '0953217890'),

-- 5. Ángela Tenorio – velocidad y rendimiento atlético
('Ángela', 'Tenorio', 'Velocidad y Rendimiento Atlético', '0960001112');

-- ===============================
-- Usuarios: Miembros
-- ===============================
INSERT INTO Usuario (usuario, contrasenia, rol, id_miembro)
VALUES
('goku.kakarotto', 'Goku123', 'miembro', 1),
('hermione.granger', 'Hermione123', 'miembro', 2),
('tony.stark', 'Ironman123', 'miembro', 3),
('diana.prince', 'Wonder123', 'miembro', 4),
('naruto.uzumaki', 'Naruto123', 'miembro', 5);

-- ===============================
-- Usuarios: Entrenadores
-- ===============================
INSERT INTO Usuario (usuario, contrasenia, rol, id_coach)
VALUES
('jean.carlo', '123456', 'entrenador', 1),
('carolina.aguirre', '123456', 'entrenador', 2),
('deyna.castellanos', '123456', 'entrenador', 3),
('jefferson.perez', '123456', 'entrenador', 4),
('angela.tenorio', '123456', 'entrenador', 5);

-- ===============================
-- Usuarios: Administradores
-- ===============================
INSERT INTO Usuario (usuario, contrasenia, rol, id_miembro, id_coach)
VALUES
('admin', 'Admin123', 'admin', NULL, NULL);

INSERT INTO Perfil_fisico (id_miembro, altura, peso, observaciones)
VALUES
-- Goku (Objetivo: Aumento de musculatura)
(1, 1.75, 85.0, 'Físico muy desarrollado, enfoque en hipertrofia.'),

-- Hermione Granger (Objetivo: Reposición corporal)
(2, 1.64, 55.0, 'Contextura delgada, enfocarse en equilibrio y fuerza funcional.'),

-- Tony Stark (Objetivo: Pérdida de grasa)
(3, 1.78, 82.0, 'Nivel moderado de grasa abdominal, necesita cardio y déficit calórico.'),

-- Wonder Woman (Objetivo: Mantenimiento físico)
(4, 1.76, 70.0, 'Físico atlético, mantener rendimiento y resistencia.'),

-- Naruto Uzumaki (Objetivo: Aumento de resistencia)
(5, 1.70, 60.0, 'Alta energía, mejorar masa magra y resistencia cardiovascular.');

INSERT INTO Mensualidad (id_miembro, fecha_inicio, fecha_fin, monto, estado_mensualidad)
VALUES
-- Goku
(1, '2025-06-01', '2025-06-30', 30.00, 'Pagada'),

-- Hermione Granger
(2, '2025-06-01', '2025-06-30', 30.00, 'Pagada'),

-- Tony Stark
(3, '2025-06-01', '2025-06-30', 30.00, 'Pendiente'),

-- Wonder Woman
(4, '2025-06-01', '2025-06-30', 30.00, 'Pagada'),

-- Naruto Uzumaki
(5, '2025-06-01', '2025-06-30', 30.00, 'Pagada');

INSERT INTO Registro_de_clases (id_miembro, horario, fecha_asistencia)
VALUES
-- Goku
(1, '08:00 AM', '2025-06-22'),

-- Hermione Granger
(2, '10:00 AM', '2025-06-22'),

-- Tony Stark
(3, '04:00 PM', '2025-06-22'),

-- Wonder Woman
(4, '06:00 PM', '2025-06-22'),

-- Naruto Uzumaki
(5, '07:00 AM', '2025-06-22');
INSERT INTO Asignacion_entrenador (id_miembro, id_entrenador)
VALUES
-- Goku con Jean Carlo
(1, 1),
-- Hermione con Carolina Aguirre
(2, 2),
-- Tony Stark con Deyna Castellanos
(3, 3),
-- Wonder Woman con Jefferson Pérez
(4, 4),
-- Naruto con Ángela Tenorio
(5, 5);

INSERT INTO Asignacion_rutina (id_miembro, id_rutina, descripcion_rut, fecha_inicio)
VALUES
-- Goku: Full Body
(1, 1, 'Rutina de fuerza y volumen', '2025-06-01'),
-- Hermione: Cardio y Resistencia
(2, 4, 'Rutina de cardio para pérdida de grasa', '2025-06-01'),
-- Tony Stark: Fuerza
(3, 2, 'Rutina de fuerza para recomposición corporal', '2025-06-01'),
-- Wonder Woman: Funcional
(4, 5, 'Rutina funcional para tonificación', '2025-06-01'),
-- Naruto: Hipertrofia
(5, 3, 'Rutina avanzada para resistencia y masa muscular', '2025-06-01');

-- FACTURAS SOLO MENSUALIDAD
INSERT INTO Factura (id_miembro, id_admin, fecha_emision, total)
VALUES
(1, 11, '2025-06-22', 34.50),
(2, 11, '2025-06-22', 34.50),
(3, 11, '2025-06-22', 34.50),
(4, 11, '2025-06-22', 34.50),
(5, 11, '2025-06-22', 34.50);

-- DETALLE FACTURA SOLO MENSUALIDAD
INSERT INTO Detalle_Factura (
    id_factura, tipo_detalle, referencia_id, descripcion, monto, iva, metodo_pago
)
VALUES
(1, 'pago mensual', 1, 'Mensualidad de junio', 34.50, 0.15, 'EFECTIVO'),
(2, 'pago mensual', 2, 'Mensualidad de junio', 34.50, 0.15, 'TARJETA'),
(3, 'pago mensual', 3, 'Mensualidad de junio', 34.50, 0.15, 'EFECTIVO'),
(4, 'pago mensual', 4, 'Mensualidad de junio', 34.50, 0.15, 'TARJETA'),
(5, 'pago mensual', 5, 'Mensualidad de junio', 34.50, 0.15, 'EFECTIVO');

-- FACTURAS SOLO COMPRA DE PRODUCTO
INSERT INTO Factura (id_miembro, id_admin, fecha_emision, total)
VALUES
(1, 11, '2025-06-22', 28.74),
(2, 11, '2025-06-22', 45.89),
(3, 11, '2025-06-22', 14.38),
(4, 11, '2025-06-22', 21.84),
(5, 11, '2025-06-22', 74.75);

-- DETALLE FACTURA SOLO COMPRA DE PRODUCTO
INSERT INTO Detalle_Factura (
    id_factura, tipo_detalle, referencia_id, descripcion, monto, iva, metodo_pago
)
VALUES
(6, 'compra producto', 1, 'Creatina Monohidratada 300g', 28.74, 0.15, 'EFECTIVO'),
(7, 'compra producto', 2, 'Proteína Whey 2lb Chocolate', 45.89, 0.15, 'TARJETA'),
(8, 'compra producto', 3, 'Guantes de Entrenamiento', 14.38, 0.15, 'EFECTIVO'),
(9, 'compra producto', 4, 'Camiseta Dry-Fit Larga', 21.84, 0.15, 'TARJETA'),
(10, 'compra producto', 5, 'Mancuernas Ajustables 20kg', 74.75, 0.15, 'EFECTIVO');
-- Carritos de ejemplo para los miembros
INSERT INTO Carrito (id_miembro, total_pago, procesado)
VALUES
(1, 24.99, FALSE),
(2, 39.80, TRUE),
(3, 12.50, FALSE),
(4, 18.99, TRUE),
(5, 65.00, FALSE);

 
INSERT INTO Detalle_Carrito (id_carrito, id_producto, cantidad, precio_unitario)
VALUES
(1, 1, 1, 24.99),
(2, 2, 2, 39.90),
(3, 3, 1, 12.50),
(4, 4, 1, 18.99),
(5, 5, 1, 65.00);

INSERT INTO Notificacion (id_usuario, id_usuario_remitente, tipo, contenido, fecha_envio, leido)
VALUES
(1, 11, 'pago', '¡Tu pago de mensualidad de junio fue registrado exitosamente!', '2025-06-22', FALSE),
(2, 11, 'compra', 'Has comprado 2 unidades de Proteína Whey 2lb Chocolate. ¡Gracias por tu compra!', '2025-06-22', TRUE),
(3, 11, 'rutina', 'Nueva rutina de fuerza asignada. Consulta tu perfil para más detalles.', '2025-06-21', FALSE),
(4, 11, 'compra', 'Tu pedido de Camiseta Dry-Fit Larga está listo para retirar.', '2025-06-21', TRUE),
(5, 11, 'clase', '¡Felicidades! Has completado tu clase de resistencia hoy.', '2025-06-22', FALSE);