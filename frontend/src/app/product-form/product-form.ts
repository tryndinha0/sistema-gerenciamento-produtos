import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../models/product.models';

import { ProductService } from '../services/product'; 
import { CommonModule } from '@angular/common'; 

// Angular Material Imports específicos para o formulário
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog'; // <-- Para os elementos do diálogo


@Component({
  selector: 'app-product-form',
  standalone: true, 
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatDialogTitle, 
    MatDialogContent, 
    MatDialogActions, 
    MatDialogClose 
  ],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) { }

  ngOnInit(): void {
    this.isEditMode = !!this.data;
    this.productForm = this.fb.group({
      id: [this.data ? this.data.id : null],
      name: [this.data ? this.data.name : '', Validators.required],
      price: [this.data ? this.data.price : null, [Validators.required, Validators.min(0.01)]],
      description: [this.data ? this.data.description : ''],
      quantity: [this.data ? this.data.quantity : null, [Validators.required, Validators.min(0)]]
    });
  }

  onSave(): void {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      if (this.isEditMode && product.id) {
        this.productService.updateProduct(product.id, product).subscribe(() => {
          this.dialogRef.close(true);
        }, error => {
          console.error('Erro ao atualizar produto:', error);
        });
      } else {
        this.productService.createProduct(product).subscribe(() => {
          this.dialogRef.close(true);
        }, error => {
          console.error('Erro ao criar produto:', error);
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
  
}