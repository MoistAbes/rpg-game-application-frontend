import {Component, OnInit} from '@angular/core';
import {ZoneApiService} from '../../../../services/api/zone-api.service';
import {ZoneModel} from '../../../../models/zone-model';
import {NgForOf, NgIf} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import {CenterModalComponent} from '../../../../global/components/center-modal/center-modal.component';
import {FormsModule} from '@angular/forms';
import {NgSelectComponent} from '@ng-select/ng-select';
import {EnemyTypeApiService} from '../../../../services/api/enemy-type-api.service';
import {EnemyTypeModel} from '../../../../models/enemy/enemy-type-model';  // dodaj ten import!


@Component({
  selector: 'app-admin-zones-page',
  imports: [
    NgForOf,
    NgIf,
    FontAwesomeModule,
    CenterModalComponent,
    FormsModule,
    NgSelectComponent
  ],
  templateUrl: './admin-zones-page.component.html',
  styleUrl: './admin-zones-page.component.css',
  standalone: true
})
export class AdminZonesPageComponent implements OnInit {

  //curtain
  showCurtain: boolean = false;
  showModal: boolean  = false;

  //icons
  faEdit = faEdit;  // zadeklaruj ikonę jako właściwość

  zones: ZoneModel[] = []
  selectedZoneCopy: ZoneModel = new ZoneModel();

  enemyTypes: EnemyTypeModel[] = [];
  selectedEnemyTypes: EnemyTypeModel[] = []

  constructor(private zoneApiService: ZoneApiService,
              private enemyTypeApiService: EnemyTypeApiService) {
  }

  ngOnInit(): void {
    this.loadZones();

  }

  loadZones(): void {
    this.zoneApiService.getZones().subscribe({
      next: data => {
        this.zones = data;
        console.log("Loaded zones: ", this.zones);

      },
      error: () => {},
      complete: () => {}
    })
  }

  loadAllEnemyTypes() {
    this.enemyTypeApiService.getAllEnemyTypes().subscribe({
      next: data => {
        this.enemyTypes = data;
      },
      error: () => {},
      complete: () => {}
    })
  }

  onZoneClicked(zone: ZoneModel) {
    console.log("zone clicked");
    this.selectedZoneCopy = {...zone};
  }

  onZoneEditClicked() {
    this.loadAllEnemyTypes()
  }

  onModalClose() {

  }

  removeType(type: any) {
    this.selectedEnemyTypes = this.selectedEnemyTypes.filter(t => t.id !== type.id);
  }

}
