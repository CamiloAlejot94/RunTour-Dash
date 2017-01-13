import { Injectable } from '@angular/core';


export class DetalleService {
  array_information: MapInfo = {};
  constructor() {
    this.array_information['premise'] = 'Place';
    this.array_information['neighborhood'] = 'Neighborhood';
    this.array_information['postal_code'] = 'Postal code';
    this.array_information['sublocality_level_5'] = 'Sublocality 5';
    this.array_information['sublocality_level_4'] = 'Sublocality 4';
    this.array_information['sublocality_level_3'] = 'Sublocality 3';
    this.array_information['sublocality_level_2'] = 'Sublocality 2';
    this.array_information['sublocality_level_1'] = 'Sublocality 1';
    this.array_information['locality'] = 'Locality 5';
    this.array_information['administrative_area_level_5'] = 'Area level 5';
    this.array_information['administrative_area_level_4'] = 'Area level 4';
    this.array_information['administrative_area_level_3'] = 'Area level35';
    this.array_information['administrative_area_level_2'] = 'Area level 2';
    this.array_information['administrative_area_level_1'] = 'Area level 1';
    this.array_information['country'] = 'Country';
  }
  setInfo(p_array) {
    let mapa = {}
    for (let comp of p_array) {
      for (let type of comp.types) {
        if (this.array_information[type]) {
          let name = '' + this.array_information[type];
          mapa[name] = comp.long_name;
          break;
        }
      }

    }
    return mapa;
  }

  getMap(p_array) {
    return Promise.resolve(this.setInfo(p_array));
  }

}


interface MapInfo {
  [name: string]: string;
}
