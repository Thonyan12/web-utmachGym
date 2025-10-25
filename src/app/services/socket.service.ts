import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Import dinámico de socket.io-client para evitar fallo en build si no está instalado
let io: any = null;

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: any = null;

  connect(url = 'http://localhost:3000', opts: any = {}) {
    // Carga dinámica de socket.io-client solo si es necesario
    if (!io) {
      import('socket.io-client')
        .then((m: any) => {
          io = m.default || m;
          try {
            if (!this.socket) this.socket = io(url, { ...opts, autoConnect: true });
          } catch (e) {
            // ignore connect errors
          }
        })
        .catch(() => {
          io = null;
        });
      return;
    }
    if (!this.socket) {
      try { this.socket = io(url, { ...opts, autoConnect: true }); } catch (e) { /* ignore */ }
    }
  }

  disconnect() {
    if (this.socket) {
      try { this.socket.disconnect(); } catch (e) { /* ignore */ }
      this.socket = null;
    }
  }

  on<T = any>(event: string): Observable<T> {
    return new Observable(observer => {
      if (!io) {
        observer.complete();
        return;
      }
      if (!this.socket) this.connect();
      const handler = (data: T) => observer.next(data);
      this.socket.on(event, handler);
      return () => {
        try { this.socket.off(event, handler); } catch (e) { /* ignore */ }
      };
    });
  }

  emit(event: string, payload?: any) {
    try { this.socket?.emit(event, payload); } catch (e) { /* ignore */ }
  }
}
