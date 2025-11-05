import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  private darkMode = false;

  constructor() {
    this.loadTheme();
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      this.darkMode = savedTheme === 'dark';
    } else {
      // Check system preference
      this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  private applyTheme(): void {
    document.body.classList.toggle('dark', this.darkMode);
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    this.applyTheme();
    localStorage.setItem(this.THEME_KEY, this.darkMode ? 'dark' : 'light');
  }

  setDarkMode(enabled: boolean): void {
    this.darkMode = enabled;
    this.applyTheme();
    localStorage.setItem(this.THEME_KEY, this.darkMode ? 'dark' : 'light');
  }
}
