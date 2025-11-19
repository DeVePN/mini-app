import { TelegramUser } from '@/types';

class TelegramWebAppSDK {
  private webApp: TelegramWebApp | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.webApp = window.Telegram?.WebApp || null;
    }
  }

  init() {
    if (this.isInitialized || !this.webApp) return;

    this.webApp.ready();
    this.webApp.expand();
    this.isInitialized = true;
  }

  getWebApp(): TelegramWebApp | null {
    return this.webApp;
  }

  getUser(): TelegramUser | null {
    const user = this.webApp?.initDataUnsafe?.user;
    if (!user) return null;

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      languageCode: user.language_code,
      photoUrl: user.photo_url,
    };
  }

  getInitData(): string {
    return this.webApp?.initData || '';
  }

  getColorScheme(): 'light' | 'dark' {
    return this.webApp?.colorScheme || 'light';
  }

  showBackButton(onClick: () => void) {
    if (!this.webApp) return;
    this.webApp.BackButton.onClick(onClick);
    this.webApp.BackButton.show();
  }

  hideBackButton() {
    if (!this.webApp) return;
    this.webApp.BackButton.hide();
  }

  showMainButton(text: string, onClick: () => void) {
    if (!this.webApp) return;
    this.webApp.MainButton.setText(text);
    this.webApp.MainButton.onClick(onClick);
    this.webApp.MainButton.show();
  }

  hideMainButton() {
    if (!this.webApp) return;
    this.webApp.MainButton.hide();
  }

  hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'medium') {
    if (!this.webApp) return;
    this.webApp.HapticFeedback.impactOccurred(type);
  }

  notificationFeedback(type: 'error' | 'success' | 'warning') {
    if (!this.webApp) return;
    this.webApp.HapticFeedback.notificationOccurred(type);
  }

  showAlert(message: string, callback?: () => void) {
    if (!this.webApp) {
      alert(message);
      callback?.();
      return;
    }
    this.webApp.showAlert(message, callback);
  }

  showConfirm(message: string, callback?: (confirmed: boolean) => void) {
    if (!this.webApp) {
      const confirmed = confirm(message);
      callback?.(confirmed);
      return;
    }
    this.webApp.showConfirm(message, callback);
  }

  close() {
    if (!this.webApp) return;
    this.webApp.close();
  }

  openLink(url: string) {
    if (!this.webApp) {
      window.open(url, '_blank');
      return;
    }
    this.webApp.openLink(url);
  }

  isAvailable(): boolean {
    return !!this.webApp;
  }
}

export const telegram = new TelegramWebAppSDK();
