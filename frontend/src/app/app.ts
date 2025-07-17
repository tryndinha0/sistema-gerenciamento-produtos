// import { Component } from '@angular/core';

// import { ProductListComponent } from './product-list/product-list';

// @Component({
//   selector: 'app-root', 
//   standalone: true, 
//   imports: [
//     ProductListComponent 
//   ],
//   templateUrl: './app.html', 
//   styleUrls: ['./app.scss'] 
// })
// export class App {
//   title = 'Gerenciamento de Produtos';
// }

import { Component } from '@angular/core';

// Importe o ProductListComponent. O caminho reflete a estrutura de pastas.
// O nome do arquivo do componente é 'product-list.component.ts'
import { ProductListComponent } from './product-list/product-list';

@Component({
  selector: 'app-root', 
   
  imports: [
    
    ProductListComponent
    
  ],
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App { // O nome da classe deve ser AppComponent por convenção
  title = 'Gerenciamento de Produtos';
}