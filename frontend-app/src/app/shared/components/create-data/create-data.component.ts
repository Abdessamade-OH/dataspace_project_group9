import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimalsDataService } from '../../services/animals-data.service';

@Component({
  selector: 'app-create-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-data.component.html',
  styleUrls: ['./create-data.component.css']
})
export class CreateDataComponent implements OnInit, OnChanges {
  // Input: the title (data type), e.g., "Animals"
  @Input() title: string = '';

  // Input for update mode: when provided, the form will be pre-filled with this data
  @Input() updateData?: any;

  // Output event to signal that the modal should close after update
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  // Form model following the AnimalData schema:
  // Main fields: category, item, year, unit, value.
  // Metadata will be automatically set in TS and not shown to the user.
  animalForm = {
    category: '',
    item: '',
    year: null as number | null,
    unit: '',
    value: null as number | null,
    metadata: {
      source: '',
      dataType: '',
      status: '',
      country: ''
    }
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private animalsDataService: AnimalsDataService) {}

  ngOnInit(): void {
    if (this.title.toLowerCase() === 'animals') {
      // Pre-fill defaults matching your schema/sample document.
      this.animalForm.category = 'Producing Animals/Slaughtered';
      this.animalForm.metadata = {
        source: 'livestock_integration',
        dataType: 'animal_production',
        status: 'processed',
        country: 'Morocco'
      };
    }

    // If updateData exists on initialization, prefill the form with its values.
    if (this.updateData) {
      this.prefillForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Whenever updateData is passed (or changed), prefill the form.
    if (changes['updateData'] && this.updateData) {
      this.prefillForm();
    }
  }

  prefillForm(): void {
    // Use a shallow copy to prefill the form.
    // Adjust this if your structure needs a deeper clone.
    this.animalForm = { ...this.updateData };
  }

  onSubmit(): void {
    // Build the production field based on the main fields:
    const production = {
      category: this.animalForm.category,
      item: this.animalForm.item,
      measurement: {
        value: this.animalForm.value,
        unit: this.animalForm.unit,
        year: this.animalForm.year
      }
    };

    // Combine the form data with the production field.
    const dataToSubmit = {
      ...this.animalForm,
      production: production
    };

    if (this.updateData) {
      // Update mode: call the update service method with two arguments: id and data.
      this.animalsDataService.updateAnimal(this.updateData._id, dataToSubmit).subscribe({
        next: (data) => {
          this.successMessage = 'Animal data updated successfully!';
          this.errorMessage = '';
          this.resetForm();
          this.closeModal.emit(); // signal parent to close the modal
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error updating animal data.';
          this.successMessage = '';
        }
      });
    } else {
      // Create mode: call the create service method.
      this.animalsDataService.createAnimal(dataToSubmit).subscribe({
        next: (data) => {
          this.successMessage = 'Animal data created successfully!';
          this.errorMessage = '';
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error creating animal data.';
          this.successMessage = '';
        }
      });
    }
  }

  // Reset the form fields (keeping default values for category and metadata)
  resetForm(): void {
    this.animalForm.item = '';
    this.animalForm.year = null;
    this.animalForm.unit = '';
    this.animalForm.value = null;
    // Metadata and category remain unchanged.
  }
}
