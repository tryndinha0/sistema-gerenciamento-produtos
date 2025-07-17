import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations'; // <-- Adicione esta importação
import { provideHttpClient } from '@angular/common/http'; // <-- Adicione esta importação



export const appConfig: ApplicationConfig = {
  providers: [
    
    provideClientHydration(),
    provideAnimations(), // <-- Adicione este provedor para o Angular Material
    provideHttpClient() // <-- Adicione este provedor para comunicação HTTP com o backend
  ]
};