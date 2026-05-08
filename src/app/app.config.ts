import { ApplicationConfig, importProvidersFrom, inject, LOCALE_ID, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Eye, EyeOff, LucideAngularModule } from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AppConfigService } from './core/config/app-config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(
      LucideAngularModule.pick({
        Eye,
        EyeOff
      })
    ),
    provideAppInitializer(() => inject(AppConfigService).load()),
    { provide: LOCALE_ID, useValue: 'es-CO' }
  ]
};
