import { Injectable } from '@angular/core';
import {DBSchema, IDBPDatabase, openDB} from 'idb';
import {ZoneModel} from '../../models/zone-model';
import {LocationModel} from '../../models/location-model';


interface ZoneDB extends DBSchema {
  zones: { key: string; value: ZoneModel };
  locations: { key: string; value: LocationModel };
}

@Injectable({
  providedIn: 'root'
})
export class ZoneDbService {
  private readonly dbPromise: Promise<IDBPDatabase<ZoneDB>>;


  constructor() {
    this.dbPromise = openDB<ZoneDB>('ZoneDatabase', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('zones')) {
          db.createObjectStore('zones');
        }
        if (!db.objectStoreNames.contains('locations')) {
          db.createObjectStore('locations');
        }
      }
    });
  }

  async setZone(zone: ZoneModel) {
    const db = await this.dbPromise;
    await db.put('zones', zone, 'selectedZone');
  }

  async getZone(): Promise<ZoneModel | undefined> {
    const db = await this.dbPromise;
    return db.get('zones', 'selectedZone');
  }

  async setLocation(location: LocationModel) {
    const db = await this.dbPromise;
    await db.put('locations', location, 'selectedLocation');
  }

  async getLocation(): Promise<LocationModel | undefined> {
    const db = await this.dbPromise;
    return db.get('locations', 'selectedLocation');
  }

}
