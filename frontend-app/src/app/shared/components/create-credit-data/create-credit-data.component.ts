import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreditDataService } from '../../services/credit-data.service';

@Component({
  selector: 'app-create-credit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-credit-data.component.html',
  styleUrl: './create-credit-data.component.css'
})
export class CreateCreditComponent implements OnInit {
  // Input: the title (data type), e.g., "Credit"
  @Input() title: string = '';

  // Form model for Credit data based on the schema:
  // credit: { type, measurement: { value, unit, year } }
  // metadata will be generated automatically on the TS side.
  creditForm = {
    credit: {
      type: '',
      measurement: {
        value: null as number | null,
        unit: '',
        year: null as number | null
      }
    },
    metadata: {
      source: '',
      dataType: '',
      status: '',
      country: ''
    }
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private creditDataService: CreditDataService) {}

  ngOnInit(): void {
    if (this.title.toLowerCase() === 'credit') {
      // Set automatic defaults matching your sample document:
      this.creditForm.metadata = {
        source: 'credit_integration',
        dataType: 'agriculture_credit',
        status: 'processed',
        country: 'Morocco'
      };
    }
  }

  onSubmit(): void {
    this.creditDataService.createCreditData(this.creditForm).subscribe({
      next: (data) => {
        this.successMessage = 'Credit data created successfully!';
        this.errorMessage = '';
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error creating credit data.';
        this.successMessage = '';
      }
    });
  }

  // Reset the credit form fields (credit type and measurement fields)
  resetForm(): void {
    this.creditForm.credit.type = '';
    this.creditForm.credit.measurement.value = null;
    this.creditForm.credit.measurement.unit = '';
    this.creditForm.credit.measurement.year = null;
    // Metadata remains automatically set
  }
}
