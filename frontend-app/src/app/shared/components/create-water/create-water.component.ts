import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WaterDataService } from '../../services/water-data.service';

@Component({
  selector: 'app-create-water',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-water.component.html',
  styleUrls: ['./create-water.component.css']
})
export class CreateWaterComponent implements OnInit {
  @Input() title: string = '';

  waterForm = {
    name: '',
    type: '',
    longitude: 0 as number, // Ensure longitude has a default valid number
    latitude: 0 as number, // Ensure latitude has a default valid number
    metadata: {
      source: '',
      dataType: '',
      status: '',
      region: '',
      country: ''
    },
    location: {
      type: 'Point',
      coordinates: [] as number[]
    }
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private waterDataService: WaterDataService) {}

  ngOnInit(): void {
    if (this.title.toLowerCase() === 'water') {
      this.waterForm.metadata = {
        source: 'infrastructure_integration',
        dataType: 'barrage',
        status: 'processed',
        region: 'Souss-Massa',
        country: 'Morocco'
      };
    }
  }

  onSubmit(): void {
    if (isNaN(this.waterForm.longitude) || isNaN(this.waterForm.latitude)) {
      this.errorMessage = 'Longitude and Latitude must be valid numbers!';
      return;
    }

    this.waterForm.location = {
      type: 'Point',
      coordinates: [this.waterForm.longitude, this.waterForm.latitude]
    };

    this.waterDataService.createWaterData(this.waterForm).subscribe({
      next: () => {
        this.successMessage = 'Water data created successfully!';
        this.errorMessage = '';
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error creating water data.';
        this.successMessage = '';
      }
    });
  }

  resetForm(): void {
    this.waterForm.name = '';
    this.waterForm.type = '';
    this.waterForm.longitude = 0; // Reset to default valid number
    this.waterForm.latitude = 0; // Reset to default valid number
  }
}
