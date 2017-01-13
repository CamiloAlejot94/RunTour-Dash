import { Component, OnInit, NgZone } from '@angular/core';
import { environment } from '../environments/environment'
import * as _ from 'underscore';

import { DetalleService } from './detalle'

declare var firebase: any
declare var swal: any

declare var google: any;
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [DetalleService]
})

export class AppComponent implements OnInit {
	map: any
	marker: any
	myLatLng: any
	newLatLng: any
	infoMArker: any

	listaPuntos = []

	name: string
	Description: string
	infoSigth: string

	load: boolean

	key: string

	placeTemporal:any

	index:number

	listMarker = []

	constructor(private _detalleService: DetalleService, private zone: NgZone) {
		this.load = false
	}

	ngOnInit() {
		this.myLatLng = { lat: 4.598434, lng: -74.076680 };
		this.map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: this.myLatLng,
			disableDefaultUI: true
		});
		this.marker = new google.maps.Marker({
			map: this.map,
		});



		this.map.addListener('click', (event) => {

			this.zone.run(()=>{
				this.key = null
				this.name = null
				this.Description = null
				this.infoSigth = null
			})

			

			let localitation = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
			if (this.marker == null) {
				this.marker = new google.maps.Marker({
					position: localitation,
					map: this.map,
					title: 'Hello World!'
				});
			}
			else {
				this.marker.setPosition(localitation);
			}

			let geocoder = new google.maps.Geocoder();
			geocoder.geocode({ 'location': localitation }, (result, status) => {
				if (status === google.maps.GeocoderStatus.OK) {
					this._detalleService.getMap(result[0].address_components).then(mapas => {
						mapas['lat'] = result[0].geometry.location.lat();
						mapas['lng'] = result[0].geometry.location.lng();
						mapas['place_id'] = result[0].place_id;
						this.infoMArker = mapas;
					});
				}
			});
		});

		this.loadScript('https://www.gstatic.com/firebasejs/3.6.5/firebase.js', () => {
			firebase.initializeApp(environment.config)
			//-----------------------------------------------------------------
			// puntos agregados
			//-----------------------------------------------------------------
			firebase.database().ref('/points').on('child_added', snap => {

				let place = snap.val()
				this.zone.run(() => {
					 this.listaPuntos.push(place)
				})
				let direction = new google.maps.LatLng(place['localitation'].lat, place['localitation'].lng);
				let marker = new google.maps.Marker({
					position: direction,
					map: this.map,
					animation: true,
					zIndex: 0,
					icon: "assets/img/PinPuntos.svg"
				});

				marker.addListener('click', () => {
					if(this.marker){
						this.marker.setMap(null)
						this.marker = null
					}
					this.zone.run(() => {
						this.key = snap.key
						this.name = place.name
						this.Description = place.description
						this.infoSigth = place.info
						this.placeTemporal = place
					})
				})

				this.listMarker[snap.key] = marker

			})
			//-----------------------------------------------------------------
			// puntos cambiados
			//-----------------------------------------------------------------
			firebase.database().ref('/points').on('child_changed', snap=>{
				let place = snap.val()
				this.listaPuntos[this.index] = place
				let marker = this.listMarker[snap.key]
				google.maps.event.clearListeners(marker, 'click');


				marker.addListener('click', () => {
					if(this.marker){
						this.marker.setMap(null)
						this.marker = null
					}
					this.zone.run(() => {
						this.key = snap.key
						this.name = place.name
						this.Description = place.description
						this.infoSigth = place.info
						this.placeTemporal = place
					})
				})
			})



		})


	}



	loadScript(filename, callback) {
		var fileref = document.createElement('script');
		fileref.setAttribute("type", "text/javascript");
		fileref.onload = callback;
		fileref.setAttribute("src", filename);
		if (typeof fileref != "undefined") {
			document.getElementsByTagName("head")[0].appendChild(fileref)
		}
	}

	centerPoint(lat, lng) {
		let localitation = new google.maps.LatLng(lat, lng);
		this.map.setCenter(localitation);
		this.map.setZoom(18);
	}


	validador(variable, mensaje, dato) {
		if (mensaje == "" && variable == null)
			mensaje = dato;
		else if (variable == null)
			mensaje += ", " + dato;
		return mensaje
	}


	save() {
		if (this.infoMArker == null) {
			swal("Error", "No selected place", "error")
		}
		else {
			let imconpleteFill = "";
			let file = (<HTMLInputElement>document.getElementById("file")).files[0]
			imconpleteFill = this.validador(this.name, imconpleteFill, 'name')
			imconpleteFill = this.validador(this.Description, imconpleteFill, 'description')
			imconpleteFill = this.validador(file, imconpleteFill, 'image file')

			if (imconpleteFill != "") {
				swal({
					title: "Warning",
					text: "The following fields are empty: " + imconpleteFill + ". Are you sure to save place?",
					type: "warning",
					showCancelButton: true,
					closeOnConfirm: false,
					confirmButtonText: "Yes"
				}
				).then(() => {
					if (file != null) {
						this.load = true
						let storageRef = firebase.storage().ref();
						let uploadTask = storageRef.child('images/' + file.name).put(file);
						uploadTask.on('state_changed', function (snapshot) {
							// Observe state change events such as progress, pause, and resume
							// See below for more detail
						}, function (error) {
							console.log(error)
							// Handle unsuccessful uploads
						}, () => {
							// Handle successful uploads on complete
							// For instance, get the download URL: https://firebasestorage.googleapis.com/...
							var downloadURL = uploadTask.snapshot.downloadURL;
							this.savePlace(downloadURL, uploadTask.snapshot.a.fullPath)
						});
					}
					else {
						this.savePlace("", "")
					}
				})
			}
			else {



				let storageRef = firebase.storage().ref();
				let uploadTask = storageRef.child('images/' + file.name).put(file);
				this.load = true
				uploadTask.on('state_changed', function (snapshot) {
					// Observe state change events such as progress, pause, and resume
					// See below for more detail
				}, function (error) {
					console.log(error)
					// Handle unsuccessful uploads
				}, () => {
					// Handle successful uploads on complete
					// For instance, get the download URL: https://firebasestorage.googleapis.com/...
					var downloadURL = uploadTask.snapshot.downloadURL;
					this.savePlace(downloadURL, uploadTask.snapshot.a.fullPath)
				});
			}
		}
	}


	savePlace(url: string, path: string) {
		this.load = false
		let obejct = {
			'description': this.Description + "",
			'name': this.name,
			'info': this.infoSigth,
			'localitation': this.infoMArker,
			'imgurl': url,
			'path': path
		};
		(<HTMLInputElement>document.getElementById("file")).value = null
		let pat = firebase.database().ref('points/').push(obejct);
		this.marker.setMap(null);
		this.marker = null;
		this.name = null;
		this.Description = null;
		this.infoMArker = null;
		this.infoSigth = null
		swal("Success", "The place was saved", "success")

	}

	update(){

		this.index = _.indexOf(this.listaPuntos,this.placeTemporal)
		let obejct = {
			'description': this.Description + "",
			'name': this.name,
			'info': this.infoSigth
		}
		firebase.database().ref('points/'+this.key).update(obejct)
		this.name = null;
		this.Description = null;
		this.infoMArker = null;
		this.infoSigth = null
		this.key = null
		this.placeTemporal = null
		swal("Success", "The place was update", "success")
		
	}

}
