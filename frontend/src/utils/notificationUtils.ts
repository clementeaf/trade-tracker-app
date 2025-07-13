export interface NotificationOptions {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  showInBrowser?: boolean;
}

class NotificationManager {
  private hasPermission = false;

  constructor() {
    this.checkPermission();
  }

  private async checkPermission() {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        this.hasPermission = true;
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        this.hasPermission = permission === 'granted';
      }
    }
  }

  async requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
      return this.hasPermission;
    }
    return this.hasPermission;
  }

  showBrowserNotification(options: NotificationOptions) {
    if (!this.hasPermission || !options.showInBrowser) return;

    const notification = new Notification(options.title, {
      body: options.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'trade-tracker',
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }

  showToastNotification(options: NotificationOptions) {
    // Crear elemento toast
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
    
    // Estilos según tipo
    const styles = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-yellow-500 text-black',
      info: 'bg-blue-500 text-white',
    };
    
    toast.className += ` ${styles[options.type]}`;
    toast.innerHTML = `
      <div class="flex items-start">
        <div class="flex-1">
          <h4 class="font-semibold">${options.title}</h4>
          <p class="text-sm mt-1">${options.message}</p>
        </div>
        <button class="ml-2 text-lg hover:opacity-70" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    document.body.appendChild(toast);

    // Animar entrada
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);

    // Auto-remove
    const duration = options.duration || 5000;
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  async notify(options: NotificationOptions) {
    // Mostrar toast notification
    this.showToastNotification(options);
    
    // Mostrar browser notification si está habilitado
    if (options.showInBrowser) {
      this.showBrowserNotification(options);
    }
  }

  // Métodos de conveniencia
  success(title: string, message: string, showInBrowser = false) {
    return this.notify({ title, message, type: 'success', showInBrowser });
  }

  error(title: string, message: string, showInBrowser = true) {
    return this.notify({ title, message, type: 'error', showInBrowser });
  }

  warning(title: string, message: string, showInBrowser = false) {
    return this.notify({ title, message, type: 'warning', showInBrowser });
  }

  info(title: string, message: string, showInBrowser = false) {
    return this.notify({ title, message, type: 'info', showInBrowser });
  }
}

export const notificationManager = new NotificationManager(); 