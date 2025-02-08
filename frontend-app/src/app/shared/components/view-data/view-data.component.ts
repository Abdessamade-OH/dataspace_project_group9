import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AnimalsDataService } from '../../services/animals-data.service';
import { CreditDataService } from '../../services/credit-data.service';
import { EmploymentDataService } from '../../services/employment-data.service';
import { ProductionDataService } from '../../services/production-data.service';
import { WaterDataService } from '../../services/water-data.service';
import { TemperatureDataService } from '../../services/temperature-data.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-data',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-data.component.html',
  styleUrls: ['./view-data.component.css']
})

export class ViewDataComponent implements OnInit, OnChanges {

  @Input() selectedCategory: string | null = null;
  data: any[] = []; // Full data from the response
  paginatedData: any[] = []; // Data for the current page

  // Pagination properties
  pageSize: number = 6;     // Number of items per page
  currentPage: number = 1;  // Current page number
  totalPages: number = 0;

  // New property for filtering by year
  filterYear: number | null = null;

  // Properties for update modal (unchanged)
  showUpdateModal: boolean = false;
  selectedItemForUpdate: any = null;
  updateData: any = {};

  constructor(
    private animalsService: AnimalsDataService,
    private creditService: CreditDataService,
    private employmentService: EmploymentDataService,
    private productionService: ProductionDataService,
    private waterService: WaterDataService,
    private temperatureService: TemperatureDataService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  // Called whenever input properties change
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategory'] && !changes['selectedCategory'].firstChange) {
      this.fetchData();
    }
  }

  fetchData(): void {
    if (!this.selectedCategory) {
      this.data = [];
      this.initializePagination();
      return;
    }

    switch (this.selectedCategory) {
      case 'Animals':
        this.animalsService.getAllAnimals().subscribe(response => {
          console.log('Response:', response);
          this.data = (response && Array.isArray(response.documents)) ? response.documents : [];
          this.initializePagination();
        });
        break;
      case 'Credit':
        this.creditService.getAllCreditData().subscribe(response => {
          console.log('Response:', response);
          this.data = (response && Array.isArray(response.documents)) ? response.documents : [];
          this.initializePagination();
        });
        break;
      case 'Employment':
        this.employmentService.getAllEmployment().subscribe(response => {
          console.log('Response:', response);
          this.data = (response && Array.isArray(response.documents)) ? response.documents : [];
          this.initializePagination();
        });
        break;
      case 'Production':
        this.productionService.getAllProduction().subscribe(response => {
          console.log('Response:', response);
          this.data = (response && Array.isArray(response.documents)) ? response.documents : [];
          this.initializePagination();
        });
        break;
      case 'Water':
        this.waterService.getAllWaterData().subscribe(response => {
          console.log('Response:', response);
          this.data = (response && Array.isArray(response.documents)) ? response.documents : [];
          this.initializePagination();
        });
        break;
      case 'Temperature':
        this.temperatureService.getAllTemperature().subscribe(response => {
          console.log('Response:', response);
          this.data = (response && Array.isArray(response.documents)) ? response.documents : [];
          this.initializePagination();
        });
        break;
      default:
        this.data = [];
        this.initializePagination();
    }
  }

  // New method to fetch data by year using your service functions.
  fetchDataByYear(): void {
    if (!this.selectedCategory || this.selectedCategory === 'Water' || !this.filterYear) {
      // For Water or if no year is specified, load all data.
      this.fetchData();
      return;
    }

    let observable: Observable<any>;
    switch (this.selectedCategory) {
      case 'Animals':
        observable = this.animalsService.getAnimalsByYear(this.filterYear);
        break;
      case 'Credit':
        observable = this.creditService.getCreditDataByYear(this.filterYear);
        break;
      case 'Employment':
        observable = this.employmentService.getEmploymentByYear(this.filterYear);
        break;
      case 'Production':
        observable = this.productionService.getProductionByYear(this.filterYear);
        break;
      case 'Temperature':
        observable = this.temperatureService.getTemperatureByYear(this.filterYear);
        break;
      default:
        console.warn('Year filtering not supported for this category');
        return;
    }

    observable.subscribe(response => {
      console.log(`${this.selectedCategory} by year:`, response);
      // If response is an array, use it; otherwise, check if response.documents is an array.
      if (Array.isArray(response)) {
        this.data = response;
      } else if (response && Array.isArray(response.documents)) {
        this.data = response.documents;
      } else {
        this.data = [];
      }
      this.initializePagination();
    });
  }

  // New method to reset the year filter and reload all data.
  resetYearFilter(): void {
    this.filterYear = null;
    this.fetchData();
  }

  initializePagination(): void {
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.data.length / this.pageSize);
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.data.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedData();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  deleteItem(item: any): void {
    if (!this.selectedCategory || !item?._id) {
      return;
    }
    const id = item._id;
    switch (this.selectedCategory) {
      case 'Animals':
        this.animalsService.deleteAnimal(id).subscribe(response => {
          console.log('Deleted Animal:', response);
          this.fetchData();
        });
        break;
      case 'Credit':
        this.creditService.deleteCreditData(id).subscribe(response => {
          console.log('Deleted Credit:', response);
          this.fetchData();
        });
        break;
      case 'Employment':
        this.employmentService.deleteEmployment(id).subscribe(response => {
          console.log('Deleted Employment:', response);
          this.fetchData();
        });
        break;
      case 'Production':
        this.productionService.deleteProduction(id).subscribe(response => {
          console.log('Deleted Production:', response);
          this.fetchData();
        });
        break;
      case 'Water':
        this.waterService.deleteWaterData(id).subscribe(response => {
          console.log('Deleted Water:', response);
          this.fetchData();
        });
        break;
      case 'Temperature':
        this.temperatureService.deleteTemperature(id).subscribe(response => {
          console.log('Deleted Temperature:', response);
          this.fetchData();
        });
        break;
      default:
        console.warn('Delete operation not supported for this category');
    }
  }

  // The update modal methods remain unchanged.
  openUpdateModal(item: any): void {
    this.selectedItemForUpdate = item;
    this.updateData = { ...item };
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedItemForUpdate = null;
    this.updateData = {};
  }

  updateItem(): void {
    if (!this.selectedCategory || !this.selectedItemForUpdate?._id) {
      return;
    }
    const id = this.selectedItemForUpdate._id;
    if (this.updateData.metadata) {
      this.updateData.metadata.lastUpdated = new Date();
    } else {
      this.updateData.metadata = { lastUpdated: new Date() };
    }

    let updateObservable: Observable<any>;
    switch (this.selectedCategory) {
      case 'Animals':
        updateObservable = this.animalsService.updateAnimal(id, this.updateData);
        break;
      case 'Credit':
        updateObservable = this.creditService.updateCreditData(id, this.updateData);
        break;
      case 'Employment':
        updateObservable = this.employmentService.updateEmployment(id, this.updateData);
        break;
      case 'Production':
        updateObservable = this.productionService.updateProduction(id, this.updateData);
        break;
      case 'Water':
        updateObservable = this.waterService.updateWaterData(id, this.updateData);
        break;
      case 'Temperature':
        updateObservable = this.temperatureService.updateTemperature(id, this.updateData);
        break;
      default:
        console.warn('Update operation not supported for this category');
        return;
    }
  
    updateObservable.subscribe(response => {
      console.log('Updated item:', response);
      this.closeUpdateModal();
      this.fetchData();
    }, error => {
      console.error('Update failed:', error);
    });
  }
}