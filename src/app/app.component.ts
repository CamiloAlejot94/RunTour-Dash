import { Component, OnInit } from '@angular/core';

declare var google: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{ 
  map: any


ngOnInit(){
let myLatLng = { lat: 4.598434, lng: -74.076680 };
	
		this.map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: myLatLng,
			disableDefaultUI: true
		});

 }
}
