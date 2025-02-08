import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateDataComponent } from "../../shared/components/create-data/create-data.component";
import { CreateCreditComponent } from "../../shared/components/create-credit-data/create-credit-data.component";
import { CreateEmploymentComponent } from "../../shared/components/create-employment/create-employment.component";
import { CreateProductionComponent } from "../../shared/components/create-production/create-production.component";
import { CreateWaterComponent } from "../../shared/components/create-water/create-water.component";
import { CreateTemperatureComponent } from "../../shared/components/create-temperature/create-temperature.component";
import { ViewDataComponent } from "../../shared/components/view-data/view-data.component";
import { Observable } from 'rxjs';
import { AnimalsDataService } from '../../shared/services/animals-data.service';
import { CreditDataService } from '../../shared/services/credit-data.service';
import { EmploymentDataService } from '../../shared/services/employment-data.service';
import { ProductionDataService } from '../../shared/services/production-data.service';
import { WaterDataService } from '../../shared/services/water-data.service';
import { TemperatureDataService } from '../../shared/services/temperature-data.service';
import { FormsModule } from '@angular/forms';

import Chart from 'chart.js/auto';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateDataComponent, CreateCreditComponent, CreateEmploymentComponent, CreateProductionComponent, CreateWaterComponent, CreateTemperatureComponent, ViewDataComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent {
  // Sidebar arrays
  categories = ['Animals', 'Credit', 'Employment', 'Production', 'Temperature', 'Water'];
  actions = ['Create', 'View', 'Bulk Upload', 'Graphs'];
  activeSection: string | null = null;
  selectedCategory: string | null = null;
  selectedAction: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;
  // Chart canvas references
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvasCount') chartCanvasCount!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvasTemp') chartCanvasTemp!: ElementRef<HTMLCanvasElement>;

  uploadError: string = '';
  uploadSuccess: string = '';
  isUploading: boolean = false;

  // Graph data storage
  graphData: any = null;              // For non-temperature categories
  graphDataCount: any = null;         // For Temperature: count of objects by year
  graphDataAvgTemp: any = null;       // For Temperature: average temperature by year

  // Chart.js instances
  private chart: Chart | undefined;       // For non-temperature categories
  private chartCount: Chart | undefined;    // For Temperature: objects count chart
  private chartTemp: Chart | undefined;     // For Temperature: average temperature chart

  constructor(
    private animalsService: AnimalsDataService,
    private creditService: CreditDataService,
    private employmentService: EmploymentDataService,
    private productionService: ProductionDataService,
    private waterService: WaterDataService,
    private temperatureService: TemperatureDataService
  ) {}

  toggleSection(category: string) {
    this.activeSection = this.activeSection === category ? null : category;
  }

  selectAction(category: string, action: string) {
    this.selectedCategory = category;
    this.selectedAction = action;
    // Clear messages and reset file input.
    this.uploadError = '';
    this.uploadSuccess = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    // Clear previous graph data.
    this.graphData = null;
    this.graphDataCount = null;
    this.graphDataAvgTemp = null;
    // If "Graphs" is selected, fetch graph data immediately.
    if (action === 'Graphs') {
      this.fetchGraphData();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (file.type !== 'application/json') {
      this.uploadError = 'Please select a JSON file';
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json) && json.length > 0 && Array.isArray(json[0].documents)) {
          this.processBulkUpload(json[0].documents);
        } else {
          this.uploadError = 'Invalid JSON format: could not find documents array';
        }
      } catch (error) {
        this.uploadError = 'Error parsing JSON file';
        console.error('JSON parse error:', error);
      }
    };
    reader.readAsText(file);
  }

  processBulkUpload(documents: any[]): void {
    if (!this.selectedCategory) {
      this.uploadError = 'Please select a category first';
      return;
    }
    this.isUploading = true;
    this.uploadError = '';
    this.uploadSuccess = '';
    let uploadObservable: Observable<any>;
    switch (this.selectedCategory) {
      case 'Animals':
        uploadObservable = this.animalsService.bulkUpdate(documents);
        break;
      case 'Credit':
        uploadObservable = this.creditService.bulkUpdateCreditData(documents);
        break;
      case 'Employment':
        uploadObservable = this.employmentService.bulkUpdate(documents);
        break;
      case 'Production':
        uploadObservable = this.productionService.bulkUpdate(documents);
        break;
      case 'Water':
        uploadObservable = this.waterService.bulkUpdate(documents);
        break;
      case 'Temperature':
        uploadObservable = this.temperatureService.bulkUpdate(documents);
        break;
      default:
        this.uploadError = 'Invalid category selected';
        this.isUploading = false;
        return;
    }
    uploadObservable.subscribe({
      next: (response) => {
        this.uploadSuccess = 'Bulk upload completed successfully';
        this.isUploading = false;
        this.fileInput.nativeElement.value = '';
      },
      error: (error) => {
        this.uploadError = 'Error during bulk upload: ' + (error.message || 'Unknown error');
        this.isUploading = false;
        console.error('Bulk upload error:', error);
      }
    });
  }

  // Fetch graph data for the selected category.
  fetchGraphData(): void {
    if (!this.selectedCategory) return;

    let observable: Observable<any>;
    switch (this.selectedCategory) {
      case 'Animals':
        observable = this.animalsService.getAllAnimals();
        break;
      case 'Credit':
        observable = this.creditService.getAllCreditData();
        break;
      case 'Employment':
        observable = this.employmentService.getAllEmployment();
        break;
      case 'Production':
        observable = this.productionService.getAllProduction();
        break;
      case 'Temperature':
        observable = this.temperatureService.getAllTemperature();
        break;
      default:
        console.warn('Graph function not available for this category');
        return;
    }
    observable.subscribe(response => {
      let docs: any[] = [];
      if (Array.isArray(response)) {
        docs = response;
      } else if (response && Array.isArray(response.documents)) {
        docs = response.documents;
      }
      if (this.selectedCategory === 'Temperature') {
        // For Temperature: calculate both the count of objects and average temperature.
        const counts: { [year: string]: number } = {};
        const tempsByYear: { [year: string]: { sum: number, count: number } } = {};
        docs.forEach((item: any) => {
          if (item.year) {
            counts[item.year] = (counts[item.year] || 0) + 1;
          }
          if (item.year && item.temperature != null && item.unit && item.unit.toLowerCase() === '°c') {
            if (!tempsByYear[item.year]) {
              tempsByYear[item.year] = { sum: 0, count: 0 };
            }
            tempsByYear[item.year].sum += item.temperature;
            tempsByYear[item.year].count += 1;
          }
        });
        this.graphDataCount = counts;
        const avgTemps: { [year: string]: number } = {};
        Object.keys(tempsByYear).forEach(year => {
          avgTemps[year] = tempsByYear[year].sum / tempsByYear[year].count;
        });
        this.graphDataAvgTemp = avgTemps;
      } else {
        // For other categories: group records by year and count them.
        const counts: { [year: string]: number } = {};
        docs.forEach((item: any) => {
          let year: number;
          switch (this.selectedCategory) {
            case 'Animals':
              year = item.year;
              break;
            case 'Credit':
              year = item.credit?.measurement?.year;
              break;
            case 'Employment':
              year = item.year;
              break;
            case 'Production':
              year = item.year;
              break;
            default:
              year = 0;
          }
          if (year) {
            counts[year] = (counts[year] || 0) + 1;
          }
        });
        this.graphData = counts;
      }
      console.log('Graph data:', {
        count: this.graphDataCount,
        avgTemp: this.graphDataAvgTemp,
        other: this.graphData
      });
      this.renderChart();
    });
  }

  // Render the chart(s) using Chart.js.
  private renderChart(): void {
    if (this.selectedCategory === 'Temperature') {
      // Destroy existing Temperature charts if any.
      if (this.chartCount) { this.chartCount.destroy(); }
      if (this.chartTemp) { this.chartTemp.destroy(); }
      
      // Render objects count chart.
      const yearsCount = Object.keys(this.graphDataCount).sort();
      const countValues = yearsCount.map(year => this.graphDataCount[year]);
      const ctxCount = this.chartCanvasCount.nativeElement.getContext('2d');
      if (ctxCount) {
        this.chartCount = new Chart(ctxCount, {
          type: 'bar',
          data: {
            labels: yearsCount,
            datasets: [{
              label: 'Number of Objects',
              data: countValues,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              x: { title: { display: true, text: 'Year' } },
              y: { title: { display: true, text: 'Count' }, beginAtZero: true }
            }
          }
        });
      }
      
      // Render average temperature chart.
      const yearsTemp = Object.keys(this.graphDataAvgTemp).sort();
      const tempValues = yearsTemp.map(year => this.graphDataAvgTemp[year]);
      const ctxTemp = this.chartCanvasTemp.nativeElement.getContext('2d');
      if (ctxTemp) {
        this.chartTemp = new Chart(ctxTemp, {
          type: 'line',
          data: {
            labels: yearsTemp,
            datasets: [{
              label: 'Average Temperature (°C)',
              data: tempValues,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: false,
              tension: 0.1
            }]
          },
          options: {
            scales: {
              x: { title: { display: true, text: 'Year' } },
              y: { title: { display: true, text: 'Temperature (°C)' }, beginAtZero: false }
            }
          }
        });
      }
    } else {
      // For non-Temperature categories, render a single chart.
      if (!this.chartCanvas) {
        return;
      }
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (!ctx) {
        return;
      }
      if (this.chart) {
        this.chart.destroy();
      }
      const years = Object.keys(this.graphData).sort();
      const dataValues = years.map(year => this.graphData[year]);
      const datasetLabel = 'Number of Objects';
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: years,
          datasets: [{
            label: datasetLabel,
            data: dataValues,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x: { title: { display: true, text: 'Year' } },
            y: { 
              title: { display: true, text: 'Count' },
              beginAtZero: true 
            }
          }
        }
      });
    }
  }
}