import { Component, OnInit } from '@angular/core';

declare var google: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{ 
  map: any
	marker: any 
	myLatLng: any
	newLatLng: any
ngOnInit(){
this.myLatLng = { lat: 4.598434, lng: -74.076680 };
	
		this.map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: this.myLatLng,
			disableDefaultUI: true
		});

		
  this.marker = new google.maps.Marker({
    position: this.myLatLng,
    map: this.map,		
  });
	

 }

 setMarker(){
	//  debugger	
		this.map.addListener('click', (event)=> {
 				this.newLatLng = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng())
				 this.marker.setPosition(this.newLatLng)
  });	
 }
}
