import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemperatureDataService } from '../../services/temperature-data.service';

@Component({
  selector: 'app-create-temperature',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-temperature.component.html',
  styleUrls: ['./create-temperature.component.css']
})
export class CreateTemperatureComponent implements OnInit {
  @Input() title: string = '';

  temperatureForm = {
    month: '',
    year: new Date().getFullYear(),
    unit: '°C', // Default to Celsius
    temperature: 0 as number, // Default valid number
    metadata: {
      source: '',
      dataType: '',
      status: '',
      region: '',
      country: '',
      lastUpdated: new Date()
    },
    measurement: {
      value: 0 as number,
      unit: '°C',
      period: {
        month: '',
        year: new Date().getFullYear()
      }
    }
  };

  successMessage: string = '';
  errorMessage: string = '';

  // Define allowed units
  allowedUnits: string[] = ['°C', '°F', 'K'];

  // Define months for the dropdown
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private temperatureDataService: TemperatureDataService) {}

  ngOnInit(): void {
    if (this.title.toLowerCase() === 'temperature') {
      this.temperatureForm.metadata = {
        source: 'temperature_integration',
        dataType: 'temperature',
        status: 'processed',
        region: 'Souss-Massa',
        country: 'Morocco',
        lastUpdated: new Date()
      };
    }
  }

  onSubmit(): void {
    if (isNaN(this.temperatureForm.year) || isNaN(this.temperatureForm.temperature)) {
      this.errorMessage = 'Year and Temperature must be valid numbers!';
      return;
    }

    // Ensure unit is valid
    if (!this.allowedUnits.includes(this.temperatureForm.unit)) {
      this.errorMessage = 'Invalid unit selected!';
      return;
    }

    this.temperatureForm.measurement = {
      value: this.temperatureForm.temperature,
      unit: this.temperatureForm.unit,
      period: {
        month: this.temperatureForm.month,
        year: this.temperatureForm.year
      }
    };

    this.temperatureDataService.createTemperature(this.temperatureForm).subscribe({
      next: () => {
        this.successMessage = 'Temperature data created successfully!';
        this.errorMessage = '';
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error creating temperature data.';
        this.successMessage = '';
      }
    });
  }

  resetForm(): void {
    this.temperatureForm.month = '';
    this.temperatureForm.year = new Date().getFullYear();
    this.temperatureForm.unit = '°C'; // Reset to default
    this.temperatureForm.temperature = 0;
  }
}
