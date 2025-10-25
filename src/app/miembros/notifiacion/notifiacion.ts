import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionesMiembroService, NotificacionMiembro } from '../services/notificaciones-miembro';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-notifiacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifiacion.html',
  styleUrls: ['./notifiacion.css']
})
export class Notifiacion implements OnInit, OnDestroy {
  notificaciones: NotificacionMiembro[] = [];

  loading = true;
  error: string | null = null;
  private intervalo: number | null = null;
  private socketSub: import('rxjs').Subscription | null = null;

  constructor(
    private notiService: NotificacionesMiembroService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    console.log('🚀 Iniciando componente de notificaciones...');
    this.cargarNotificaciones();
    this.verificarAutenticacion();

    // Conectar Socket (si está disponible) y escuchar nuevas notificaciones
    try {
      if (this.socketService && typeof this.socketService.connect === 'function') {
        this.socketService.connect();
        this.socketSub = this.socketService.on && this.socketService.on('nueva-notificacion')
          ? this.socketService.on('nueva-notificacion').subscribe((notif: any) => {
              try {
                console.log('🔔 Notificación en tiempo real recibida:', notif);
                const mapped = this.normalizeNotification(notif);
                if (!this.notificaciones.find(n => n.id_notificacion === mapped.id_notificacion)) {
                  this.notificaciones = [mapped, ...this.notificaciones];
                  this.mostrarNotificacionBrowser(mapped.titulo || this.getTitulo(mapped), mapped.contenido || '');
                }
              } catch (e) {
                console.warn('Error manejando notificación socket:', e);
              }
            })
          : null;
      }
    } catch (e) {
      console.warn('SocketService no disponible o fallo al conectar:', e);
    }
  }

  ngOnDestroy() {
    if (this.intervalo) {
      clearInterval(this.intervalo as number);
      this.intervalo = null;
    }
    if (this.socketSub) {
      this.socketSub.unsubscribe();
      this.socketSub = null;
    }
    try {
      if (this.socketService && typeof this.socketService.disconnect === 'function') {
        this.socketService.disconnect();
      }
    } catch (e) {
      // ignore
    }
  }

  // para verificar autenticación
  verificarAutenticacion() {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    
    console.log('🔐 Verificando autenticación...');
    console.log('Token presente:', !!token);
    console.log('UserInfo presente:', !!userInfo);
    
    if (!token) {
      console.warn('⚠️ No hay token de autenticación');
      this.error = 'Por favor, inicia sesión para acceder a las notificaciones.';
      return false;
    }
    
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        console.log('👤 Usuario autenticado:', user.email || user.id);
      } catch (error) {
        console.warn('⚠️ Error al leer información del usuario:', error);
      }
    }
    
    return true;
  }

  //  para testear conexión con el backend
  testearConexion() {
    console.log('🌐 Probando conexión con el backend...');
    
    this.notiService.getMisNotificaciones().subscribe({
      next: (notificaciones: any) => {
        console.log('✅ Conexión exitosa! Notificaciones recibidas:', notificaciones.length || 0);
        this.error = null;
      },
      error: (error: any) => {
        console.error('❌ Error de conexión:', error);
        
        if (error.status === 0) {
          this.error = 'No se puede conectar con el servidor. Verifica que esté ejecutándose.';
        } else if (error.status === 401) {
          this.error = 'Error de autenticación. Inicia sesión nuevamente.';
        } else {
          this.error = `Error de conexión: ${error.status} - ${error.statusText}`;
        }
      }
    });
  }

  cargarNotificaciones() {
    console.log('📋 Cargando notificaciones...');
    this.loading = true;
    this.error = null;

    this.notiService.getMisNotificaciones().subscribe({
      next: (res: any) => {
        console.log('📡 Respuesta del servidor:', res);
        if (res.success) {
          // Mapear propiedades del backend a la interfaz esperada por el frontend
          this.notificaciones = (res.data || []).map((n: any) => {
            // Normalizar campos: algunos endpoints usan id_usuario en vez de id_miembro
            const fecha = n.fecha_envio ? new Date(n.fecha_envio).toISOString() : new Date().toISOString();
            return {
              ...n,
              id_notificacion: (n.id_notificacion ?? n.id) || Date.now(),
              id_miembro: n.id_miembro ?? n.id_usuario ?? n.id_usuario_destino ?? null,
              fecha_envio: fecha,
              titulo: n.titulo ?? this.getTituloFromTipo(n.tipo),
            } as NotificacionMiembro;
          }).sort((a: NotificacionMiembro, b: NotificacionMiembro) => {
            return new Date(b.fecha_envio).getTime() - new Date(a.fecha_envio).getTime();
          });
          this.loading = false;
          console.log('✅ Notificaciones cargadas:', this.notificaciones.length);
        } else {
          this.error = 'No se pudieron cargar las notificaciones';
          this.loading = false;
        }
      },
      error: (err: any) => {
        this.error = 'Error al cargar notificaciones';
        this.loading = false;
        console.error('❌ Error al cargar notificaciones:', err);
      }
    });
  }

  // Generar un título por tipo cuando no venga en la notificación
  private getTituloFromTipo(tipo: string | undefined): string {
    if (!tipo) return '📢 Notificación';
    switch (tipo) {
      case 'asignacion_coach': return '🎯 Coach Asignado';
      case 'informacion': return '📋 Información Importante';
      case 'bienvenida': return '🎉 ¡Bienvenido!';
      case 'recordatorio': return '⏰ Recordatorio';
      case 'promocion': return '🎁 Promoción';
      case 'nuevo_miembro': return '🆕 Nuevo Miembro';
      case 'checkout': return '🧾 Checkout';
      case 'nuevo_carrito': return '🛒 Nuevo Carrito';
      case 'stock_bajo': return '⚠️ Stock Bajo';
      case 'miembro_activado': return '✅ Miembro Activado';
      default: return '📢 Notificación';
    }
  }

  // Normalizar notificación entrante del backend a la interfaz usada en frontend
  private normalizeNotification(n: any): NotificacionMiembro {
    const fecha = n.fecha_envio ? new Date(n.fecha_envio).toISOString() : new Date().toISOString();
    const id_notificacion = (n.id_notificacion ?? n.id) || Date.now();
    const id_miembro = n.id_miembro ?? n.id_usuario ?? n.id_usuario_destino ?? null;
    return {
      ...n,
      id_notificacion,
      id_miembro,
      fecha_envio: fecha,
      titulo: n.titulo ?? this.getTituloFromTipo(n.tipo)
    } as NotificacionMiembro;
  }

  // para verificar entrenador con autenticación
  verificarEntrenadorAsignado() {
    console.log('🔄 Verificando entrenador asignado...');
    
    // Verificar autenticación primero
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No hay token de autenticación');
      this.error = 'No estás autenticado. Inicia sesión nuevamente.';
      return;
    }

    this.notiService.generarNotificacionEntrenador().subscribe({
      next: (response: any) => {
        console.log('🎯 Respuesta verificación entrenador:', response);

        if (response.success) {
          if (response.notificacion) {
            console.log('🔔 Nueva notificación de entrenador generada!');
            setTimeout(() => {
              this.cargarNotificaciones();
            }, 1000);

            this.mostrarNotificacionBrowser(
              '🎯 Coach Asignado',
              response.notificacion.contenido || 'Se te ha asignado un entrenador'
            );
          } else {
            console.log('ℹ️ Mensaje del servidor:', response.message);
          }
        }
      },
      error: (error: any) => {
        console.error('❌ Error al verificar entrenador:', error);
        console.error('❌ Status:', error.status);
        console.error('❌ Error detallado:', error.error);
        
        if (error.status === 401 || error.status === 403) {
          this.error = 'Error de autenticación. Inicia sesión nuevamente.';
        } else if (error.status === 500) {
          this.error = 'Error interno del servidor. Verifica el backend.';
          console.log('💡 Revisar logs del backend para más detalles');
        } else if (error.status === 404) {
          this.error = 'Endpoint no encontrado en el servidor.';
        }
      }
    });
  }

  verificarNuevasNotificaciones() {
    this.notiService.getMisNotificaciones().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          const nuevasNotificaciones = res.data.filter((notif: NotificacionMiembro) =>
            !this.notificaciones.find(existing => existing.id_notificacion === notif.id_notificacion)
          );

          if (nuevasNotificaciones.length > 0) {
            // Mapear y normalizar nuevas notificaciones y mantener orden por fecha (más recientes primero)
            const mapped = nuevasNotificaciones.map((n: any) => this.normalizeNotification ? this.normalizeNotification(n) : n);
            this.notificaciones = [...mapped, ...this.notificaciones].sort((a: NotificacionMiembro, b: NotificacionMiembro) => new Date(b.fecha_envio).getTime() - new Date(a.fecha_envio).getTime());
            console.log('🔔 Nuevas notificaciones detectadas:', nuevasNotificaciones.length);

            nuevasNotificaciones.forEach((notif: NotificacionMiembro) => {
              if (notif.tipo === 'asignacion_coach') {
                this.mostrarNotificacionCoach(notif);
              }
            });
          }
        }
      },
      error: (err: any) => {
        console.error('❌ Error al verificar nuevas notificaciones:', err);
      }
    });
  }

  mostrarNotificacionBrowser(titulo: string, mensaje: string) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(titulo, {
          body: mensaje,
          icon: '/assets/coach-icon.png',
          badge: '/assets/gym-badge.png'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(titulo, {
              body: mensaje,
              icon: '/assets/coach-icon.png'
            });
          }
        });
      }
    }
  }

  mostrarNotificacionCoach(notificacion: NotificacionMiembro) {
    this.mostrarNotificacionBrowser(
      notificacion.titulo || '🎯 Coach Asignado',
      notificacion.contenido
    );
  }

  marcarComoLeida(notificacion: NotificacionMiembro) {
    if (!notificacion.leido) {
      this.notiService.marcarComoLeida(notificacion.id_notificacion).subscribe({
        next: () => {
          notificacion.leido = true;
          console.log(`✅ Notificación ${notificacion.id_notificacion} marcada como leída`);
        },
        error: (err: any) => {
          console.error('❌ Error al marcar como leída:', err);
        }
      });
    }
  }

  forzarVerificacionEntrenador() {
    console.log('🔄 Forzando verificación de entrenador...');
    this.verificarEntrenadorAsignado();
  }

  // MÉTODO CORREGIDO para testear conexión
  testearConexionManual() {
    console.log('🧪 Testeando conexión manual...');

    this.notiService.getMisNotificaciones().subscribe({
      next: (response: any) => {
        console.log('✅ Test de conexión exitoso:', response);
        console.log('🔍 Estructura de respuesta:', {
          success: response.success,
          data_length: response.data?.length || 0,
          first_notification: response.data?.[0] || null
        });
      },
      error: (error: any) => {
        console.error('❌ Error en test de conexión:', error);
        console.error('❌ Status:', error.status);
        console.error('❌ Message:', error.message);
        console.error('❌ URL:', error.url);
      }
    });
  }

  recargarNotificaciones() {
    console.log('🔄 Recargando notificaciones manualmente...');
    this.cargarNotificaciones();
  }

  // MÉTODOS DE FECHA CORREGIDOS:

  formatearFecha(fecha: string): string {
    if (!fecha) return 'Fecha no disponible';

    try {
      const date = new Date(fecha);

      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }

      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Error en fecha';
    }
  }

  esReciente(fecha: string): boolean {
    if (!fecha) return false;

    try {
      const ahora = new Date();
      const fechaNotif = new Date(fecha);

      if (isNaN(fechaNotif.getTime())) {
        return false;
      }

      const diferenciaMs = ahora.getTime() - fechaNotif.getTime();
      const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);

      return diferenciaHoras < 24 && diferenciaHoras >= 0;
    } catch (error) {
      console.error('Error al verificar si es reciente:', error);
      return false;
    }
  }

  formatearFechaRelativa(fecha: string): string {
    if (!fecha) return 'Fecha no disponible';

    try {
      const ahora = new Date();
      const fechaNotif = new Date(fecha);

      if (isNaN(fechaNotif.getTime())) {
        return 'Fecha inválida';
      }

      const diferenciaMs = ahora.getTime() - fechaNotif.getTime();
      const minutos = Math.floor(diferenciaMs / (1000 * 60));
      const horas = Math.floor(minutos / 60);
      const dias = Math.floor(horas / 24);

      if (minutos < 1) {
        return 'Hace un momento';
      } else if (minutos < 60) {
        return `Hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
      } else if (horas < 24) {
        return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
      } else if (dias < 7) {
        return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
      } else {
        return this.formatearFecha(fecha);
      }
    } catch (error) {
      console.error('Error al formatear fecha relativa:', error);
      return this.formatearFecha(fecha);
    }
  }
  // Manejar tipo undefined
  getIconoTipo(tipo: string | undefined): string {
    if (!tipo) return 'bi-bell-fill'; // Ícono por defecto

    switch (tipo) {
      case 'asignacion_coach':
        return 'bi-person-check-fill';
      case 'nuevo_miembro':
        return 'bi-person-plus-fill';
      case 'checkout':
        return 'bi-receipt';
      case 'nuevo_carrito':
        return 'bi-cart-plus';
      case 'stock_bajo':
        return 'bi-exclamation-triangle-fill';
      case 'informacion':
        return 'bi-info-circle-fill';
      case 'bienvenida':
        return 'bi-heart-fill';
      case 'recordatorio':
        return 'bi-clock-fill';
      case 'promocion':
        return 'bi-gift-fill';
      default:
        return 'bi-bell-fill';
    }
  }

  // Manejar tipo undefined
  getColorTipo(tipo: string | undefined): string {
    if (!tipo) return 'text-secondary'; // Color por defecto

    switch (tipo) {
      case 'asignacion_coach':
        return 'text-success';
      case 'nuevo_miembro':
        return 'text-primary';
      case 'checkout':
        return 'text-dark';
      case 'nuevo_carrito':
        return 'text-info';
      case 'stock_bajo':
        return 'text-danger';
      case 'informacion':
        return 'text-info';
      case 'bienvenida':
        return 'text-primary';
      case 'recordatorio':
        return 'text-warning';
      case 'promocion':
        return 'text-danger';
      default:
        return 'text-secondary';
    }
  }

  // ✅ MÉTODO CORREGIDO - Manejar undefined en tipo y titulo
  getTitulo(notificacion: NotificacionMiembro): string {
    // Si tiene título, usarlo
    if (notificacion.titulo) {
      return notificacion.titulo;
    }

    // Si no tiene tipo, usar título genérico
    if (!notificacion.tipo) {
      return '📢 Notificación';
    }

    // Generar título basado en el tipo
    switch (notificacion.tipo) {
      case 'asignacion_coach':
        return '🎯 Coach Asignado';
      case 'informacion':
        return '📋 Información Importante';
      case 'bienvenida':
        return '🎉 ¡Bienvenido!';
      case 'recordatorio':
        return '⏰ Recordatorio';
      case 'promocion':
        return '🎁 Promoción';
      default:
        return '📢 Notificación';
    }
  }


  trackByNotificacion(index: number, notificacion: NotificacionMiembro): number {
    return notificacion.id_notificacion;
  }

  // ✅ MÉTODO NUEVO - Para activar verificación automática cuando todo funcione
  activarVerificacionAutomatica() {
    console.log('🔄 Activando verificación automática...');

    // Verificar entrenador al iniciar
    this.verificarEntrenadorAsignado();

    // Configurar intervalo cada 30 segundos
    this.intervalo = setInterval(() => {
      this.verificarNuevasNotificaciones();
      this.verificarEntrenadorAsignado();
    }, 30000);

    console.log('✅ Verificación automática activada');
  }

  // ✅ MÉTODO NUEVO - Para crear notificación de prueba
  crearNotificacionPrueba() {
    console.log('🧪 Creando notificación de prueba...');

    const notificacionPrueba: NotificacionMiembro = {
      id_notificacion: Date.now(), // ID temporal
      id_miembro: 1,
      titulo: '🧪 Notificación de Prueba',
      contenido: 'Esta es una notificación de prueba para verificar el diseño y funcionalidad.',
      fecha_envio: new Date().toISOString(),
      leido: false,
      tipo: 'informacion',
      estado: true
    };

    // Agregar al principio de la lista
    this.notificaciones = [notificacionPrueba, ...this.notificaciones];
    console.log('✅ Notificación de prueba creada');
  }
}