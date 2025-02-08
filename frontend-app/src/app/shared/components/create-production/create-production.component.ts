import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductionDataService } from '../../services/production-data.service';

@Component({
  selector: 'app-create-production',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-production.component.html',
  styleUrls: ['./create-production.component.css']
})
export class CreateProductionComponent implements OnInit {
  // Input: the title (data type), e.g., "Production"
  @Input() title: string = '';

  // Form model based on ProductionData schema:
  // Main fields: year, category, product, indicator, value
  // Metadata is auto-generated in TS
  productionForm = {
    year: null as number | null,
    category: '',
    product: '',
    indicator: '',
    value: null as number | null,
    metadata: {
      source: '',
      status: ''
    }
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private productionDataService: ProductionDataService) {}

  ngOnInit(): void {
    if (this.title.toLowerCase() === 'production') {
      // Set automatic defaults for metadata based on your sample
      this.productionForm.metadata = {
        source: 'data_integration_pipeline',
        status: 'processed'
      };
    }
  }

  onSubmit(): void {
    // Submit the production data using the service.
    this.productionDataService.createProduction(this.productionForm).subscribe({
      next: (data) => {
        this.successMessage = 'Production data created successfully!';
        this.errorMessage = '';
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error creating production data.';
        this.successMessage = '';
      }
    });
  }

  resetForm(): void {
    this.productionForm.year = null;
    this.productionForm.category = '';
    this.productionForm.product = '';
    this.productionForm.indicator = '';
    this.productionForm.value = null;
    // Metadata remains as set by default.
  }
}
