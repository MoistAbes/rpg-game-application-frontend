import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {NgSelectComponent} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {CenterModalComponent} from '../../../global/components/center-modal/center-modal.component';
import {ZoneApiService} from '../../../services/api/zone-api.service';
import {ZoneModel} from '../../../models/zone-model';
import {LocationModel} from '../../../models/location-model';
import {Router} from '@angular/router';
import {ZoneDbService} from '../../../global/services/zone-db.service';

@Component({
  selector: 'app-map-page',
  imports: [
    NgForOf,
    NgOptimizedImage,
    NgSelectComponent,
    FormsModule,
    CenterModalComponent,
    NgIf
  ],
  templateUrl: './map-page.component.html',
  standalone: true,
  styleUrl: './map-page.component.css'
})
export class MapPageComponent implements OnInit ,AfterViewInit {
  @ViewChild('mapImg') mapImg!: ElementRef<HTMLImageElement>;


  showModal: boolean = false;

  selectedFilterZone: ZoneModel | undefined;

  scale: number = 1; // Initial zoom level
  maxZoom: number = 1; // Max zoom in level
  minZoom: number = 0.5; // Min zoom out level

  mouseMoved: boolean = false;

  private transformOriginX: number | null = null;
  private transformOriginY: number | null = null;

  zones: ZoneModel[] = [];
  selectedZone: ZoneModel | undefined;
  selectedLocation: LocationModel | undefined;

  isDragging = false;
  startX = 0;
  startY = 0;
  offsetX = 0;
  offsetY = 0;
  mapTransform = 'translate(0px, 0px)';

  mapWidth = 0;
  mapHeight = 0;

  isZoneImgLoadedList: boolean[] = []


  constructor(private zoneApiService: ZoneApiService,
              private zoneDBService: ZoneDbService,
              private router: Router) {}

  ngOnInit(): void {
    this.loadZones();
  }


  ngAfterViewInit() {
    this.mapWidth = this.mapImg.nativeElement.width;
    this.mapHeight = this.mapImg.nativeElement.height;
    console.log(`Map Size: ${this.mapWidth} x ${this.mapHeight}`);
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    event.preventDefault();

    // Adjust zoom level based on the scroll direction (zoom in or out)
    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
    let newScale = this.scale * zoomFactor;

    // Check if the new scale is within bounds, otherwise, stop execution
    if (newScale > this.maxZoom) {
      newScale = this.maxZoom;
    }

    if (newScale < this.minZoom) {
      newScale = this.minZoom;
    }

    // Update scale
    this.scale = newScale;

    // Get the position of the mouse relative to the map container
    const mapContainer = document.querySelector('.map-container') as HTMLElement;
    const rect = mapContainer.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Only calculate transform-origin if it's the first zoom OR if the mouse moved
    if (!this.transformOriginX || !this.transformOriginY || this.mouseMoved) {
      this.transformOriginX = (mouseX / rect.width) * 100;
      this.transformOriginY = (mouseY / rect.height) * 100;
      this.mouseMoved = false;
    }

    // Update the transform property immediately with the new scale
    this.updateZoom();
  }

// Method to apply zoom and translate
  updateZoom(): void {
    const mapContainer = document.querySelector('.map-container') as HTMLElement;

    console.log("offset x: ", this.offsetX + " | offset y: " + this.offsetY + " | scale: ", this.scale);
    // Apply the new zoom level and translation
    mapContainer.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;
  }

  startDrag(event: MouseEvent) {
    event.preventDefault();
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  onDrag(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();

    // Calculate new position
    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    this.updateBounds(dx, dy);

    // Maintain the map position during drag based on zoom level
    this.mapTransform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;

    // Update start position
    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  updateBounds(dx: number, dy: number) {

    let maxX: number;
    let maxY: number;

    if (this.scale == 1){
      maxX = window.innerWidth -4375;
      maxY = window.innerHeight - 2100;
    }else {
      maxX = (window.innerWidth - 4375) + 100;
      maxY = (window.innerHeight - 2100) + 100;
    }


    if (this.scale == 1){
      this.offsetX = Math.min(0, Math.max(maxX, (this.offsetX + dx)));
      this.offsetY = Math.min(0, Math.max(maxY, (this.offsetY + dy)));
    }
    else {
      this.offsetY = Math.min(0, Math.max(maxY, this.offsetY + dy));
      this.offsetX = Math.min(0, (Math.max(maxX, this.offsetX + dx)));
    }

  }

  endDrag() {
    this.isDragging = false;
    // After drag ends, ensure the correct zoom is applied
    this.updateZoom();
  }

  selectZone(zone: ZoneModel | undefined) {

    if (zone == null){
      return
    }

    this.selectedZone = zone;

    console.log('Selected Zone:', zone);

    // Define the zoom level when clicking a zone
    const zoomFactor = 1.5; // Adjust as needed
    this.scale = Math.min(this.maxZoom, zoomFactor);

    // Get the size of the map container
    const mapContainer = document.querySelector('.map-wrapper') as HTMLElement;
    const containerWidth = mapContainer.clientWidth;
    const containerHeight = mapContainer.clientHeight;

    // Calculate the new offsets to center the clicked zone
    const scaledMapWidth = this.mapWidth * this.scale;
    const scaledMapHeight = this.mapHeight * this.scale;

    // Center the zone based on the new scale
    const targetX = (containerWidth / 2) - (zone.positionX * this.scale);
    const targetY = (containerHeight / 2) - (zone.positionY * this.scale);

    // Limit movement so the map doesn't move too far
    const maxX = 0;
    const maxY = 0;
    const minX = containerWidth - scaledMapWidth;
    const minY = containerHeight - scaledMapHeight;

    this.offsetX = Math.min(maxX, Math.max(minX, targetX));
    this.offsetY = Math.min(maxY, Math.max(minY, targetY));

    // Apply changes
    this.updateZoom();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(): void {
    this.transformOriginX = null;
    this.transformOriginY = null;
    this.mouseMoved = true;

  }


  loadZones(): void {
    this.zoneApiService.getZones().subscribe({
      next: loadedZones => {
        this.zones = loadedZones;
        console.log('loadedZones loaded', this.zones);

        this.setIsZoneImgLoadedList();
      },
      error: err => {

      },
      complete: () => {}
    })
  }

  setIsZoneImgLoadedList(): void {
    this.zones.forEach(() => this.isZoneImgLoadedList.push(false))
  }

  async onEnterLocationClicked() {
    if (this.selectedZone && this.selectedLocation) {
      await this.zoneDBService.setZone(this.selectedZone);
      await this.zoneDBService.setLocation(this.selectedLocation);
    }


    this.router.navigate(['/location', this.selectedZone?.name, this.selectedLocation?.name]);
  }

  onLocationClicked(selectedLocation: LocationModel) {
    this.selectedLocation = this.selectedLocation?.id === selectedLocation.id ? undefined : selectedLocation;
    console.log("selected location: ", this.selectedLocation)

  }

  onModalClose() {
    this.selectedLocation = undefined; // Reset selection
  }


  onZoneImgLoad(zoneIndex: number) {
    this.isZoneImgLoadedList[zoneIndex] = true;

  }
}
