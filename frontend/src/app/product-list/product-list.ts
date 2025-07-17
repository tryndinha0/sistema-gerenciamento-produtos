import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProductService } from '../services/product'; // <-- Importe o serviço do arquivo 'product' (sem .service)
import { Product } from '../models/product.models'

import { CommonModule } from '@angular/common'; // Necessário para diretivas como *ngIf, *ngFor, etc.
import { FormsModule } from '@angular/forms'; // Para two-way binding ([ngModel]) no input de busca

// Angular Material Imports específicos para este componente
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Para a tabela
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator'; // Para a paginação
import { MatSort, MatSortModule } from '@angular/material/sort'; // Para a ordenação
import { MatButtonModule } from '@angular/material/button'; // Para botões
import { MatIconModule } from '@angular/material/icon'; // Para ícones (editar, excluir, adicionar)
import { MatDialog } from '@angular/material/dialog'; // Para abrir modais (formulário, confirmação)
import { MatSnackBar } from '@angular/material/snack-bar'; // Para a barra de notificações (snackbar) [cite: 49]
import { MatFormFieldModule } from '@angular/material/form-field'; // Para o campo de formulário do input de busca
import { MatInputModule } from '@angular/material/input'; // Para o input de busca
import { MatToolbarModule } from '@angular/material/toolbar'; // Para a barra superior da aplicação


import { ProductFormComponent } from '../product-form/product-form'; // (Nome do arquivo gerado pelo CLI)
// Se você já gerou ConfirmDialogComponent, verifique o caminho e nome do arquivo
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog'; 

@Component({
  selector: 'app-product-list',
  // Define como componente autônomo
  imports: [
    CommonModule, // Essencial para diretivas estruturais (*ngIf, *ngFor)
    FormsModule, // Para two-way binding no campo de busca
    MatTableModule, // Módulo da tabela
    MatPaginatorModule, // Módulo do paginador
    MatSortModule, // Módulo de ordenação
    MatButtonModule, // Módulo de botões
    MatIconModule, // Módulo de ícones
    MatFormFieldModule, // Módulo para campos de formulário
    MatInputModule, // Módulo para inputs de texto
    MatToolbarModule, // Módulo da barra de ferramentas

    
  ],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss'],
  standalone: true, 
})
export class ProductListComponent implements OnInit, AfterViewInit {
  // Define as colunas que serão exibidas na tabela
  displayedColumns: string[] = ['id', 'name', 'price', 'quantity', 'actions'];
  // DataSource para a tabela do Angular Material
  dataSource = new MatTableDataSource<Product>();
  // Total de elementos para a paginação, obtido do backend
  totalElements: number = 0;
  // Tamanho da página padrão
  pageSize: number = 10;
  // Índice da página atual (começa em 0)
  currentPage: number = 0;
  // Coluna para ordenação padrão
  sortColumn: string = 'id';
  // Direção da ordenação padrão (ascendente ou descendente)
  sortDirection: string = 'asc';
  // Para o desafio extra: filtro de pesquisa por nome de produto 
  searchName: string = '';

  // Referências aos componentes MatPaginator e MatSort no template usando @ViewChild
  // O '!' é um operador de asserção de não-nulo, diz ao TypeScript que essas propriedades serão inicializadas
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Injeção de dependências
  constructor(
    private productService: ProductService, // O serviço para fazer chamadas à API
    private dialog: MatDialog, // O serviço para abrir diálogos (modais)
    private snackBar: MatSnackBar // O serviço para exibir notificações (snackbars) [cite: 49]
  ) { }

  ngOnInit(): void {
    // Carrega os produtos assim que o componente é inicializado
    this.loadProducts();
  }

  // ngAfterViewInit é chamado após a inicialização das views do componente e de seus filhos
  ngAfterViewInit() {
    // Configura os listeners para eventos de paginação e ordenação
    // Estes eventos são emitidos pelos componentes MatPaginator e MatSort
    if (this.paginator) { // Garante que o paginator foi inicializado
        this.paginator.page.subscribe((event: PageEvent) => {
          this.currentPage = event.pageIndex;
          this.pageSize = event.pageSize;
          this.loadProducts();
        });
    }


    if (this.sort) { // Garante que o sort foi inicializado
        this.sort.sortChange.subscribe(sort => {
          this.sortColumn = sort.active;
          this.sortDirection = sort.direction;
          // Ao mudar a ordenação, resetamos para a primeira página para evitar inconsistências
          this.currentPage = 0;
          if (this.paginator) { // Atualiza o índice do paginador se ele existir
            this.paginator.pageIndex = 0;
          }
          this.loadProducts();
        });
    }
  }

  // Método principal para carregar os produtos do backend com paginação, ordenação e filtro
  loadProducts(): void {
    // Constrói a string de ordenação no formato esperado pelo backend (ex: "id,asc")
    const sortString = `${this.sortColumn},${this.sortDirection}`;
    // Chama o serviço para obter os produtos
    this.productService.getProducts(this.currentPage, this.pageSize, sortString, this.searchName)
      .subscribe(response => {
        // O backend retorna um objeto Page, onde os dados estão em 'content' e o total em 'totalElements'
        this.dataSource.data = response.content;
        this.totalElements = response.totalElements;
      }, error => {
        console.error('Erro ao carregar produtos:', error);
        this.snackBar.open('Erro ao carregar produtos.', 'Fechar', { duration: 3000 }); // Exibe notificação de erro
      });
  }

  // Método para aplicar o filtro de pesquisa por nome
  applySearch(): void {
    this.currentPage = 0; // Reinicia a paginação ao aplicar um novo filtro
    if (this.paginator) { // Atualiza o índice do paginador se ele existir
        this.paginator.pageIndex = 0;
    }
    this.loadProducts(); // Recarrega os produtos com o novo filtro
  }

  // Abre o formulário de produto (para criar ou editar) em um diálogo modal
  openProductForm(product?: Product): void {
    const dialogRef = this.dialog.open(ProductFormComponent, { // Abre o ProductFormComponent como um diálogo
      width: '500px', // Define a largura do modal
      data: product // Passa os dados do produto para o formulário se for uma edição (senão, será undefined para criação)
    });

    // Assina o evento de fechamento do modal
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Se o modal foi fechado com sucesso (o formulário retornou 'true')
        this.loadProducts(); // Recarrega a lista de produtos para refletir as mudanças
        this.snackBar.open(`Produto ${product ? 'atualizado' : 'criado'} com sucesso!`, 'Fechar', { duration: 3000 }); // Notifica o usuário [cite: 49]
      }
    });
  }

  // Abre um diálogo de confirmação antes de excluir um produto
  confirmDeleteProduct(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { // Abre o ConfirmDialogComponent como um diálogo
      width: '300px', // Define a largura do modal
      data: { title: 'Confirmar Exclusão', message: 'Tem certeza que deseja excluir este produto?' } // Passa título e mensagem
    });

    // Assina o evento de fechamento do modal de confirmação
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Se o usuário confirmou a exclusão (o diálogo retornou 'true')
        this.productService.deleteProduct(id).subscribe(() => {
          this.loadProducts(); // Recarrega a lista após a exclusão
          this.snackBar.open('Produto excluído com sucesso!', 'Fechar', { duration: 3000 }); // Notifica o usuário [cite: 49]
        }, error => {
          console.error('Erro ao excluir produto:', error);
          this.snackBar.open('Erro ao excluir produto.', 'Fechar', { duration: 3000 }); // Exibe notificação de erro
        });
      }
    });
  }
}