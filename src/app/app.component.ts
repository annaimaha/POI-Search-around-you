import { Component } from '@angular/core';
import { MapService } from '../services/map.service';
import { AppService } from './app.service';
import { Subject, Observable } from 'rxjs';
declare var L: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MapService, AppService]
})
export class AppComponent {
  about = 'Autocomplete By Angular 5, Leaflet and  debounce';
  title = 'Search place around around you';
  map: any;
  autocompleteInterest: boolean = false;
  markersLayer:any;
  collections: any;
  values = '';
  name: string;
  latitude: any;
  longitude: any
  titleText: any;  
  PoiSearchLatLong:any;
  selectedPlacemarker: any;

  redIcon = new L.Icon({ iconUrl: 'assets/images/marker-icon-red.png', shadowUrl: 'assets/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
  greenIcon = new L.Icon({ iconUrl: 'assets/images/marker-icon-blue.png', shadowUrl: 'assets/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
  public keyUp = new Subject<string>();

  constructor(private mapService: MapService, private appService: AppService) { }
  ngOnInit() {

    this.map = L.map('markdplaces',{ zoomControl: false}).setView([39.750307,-104.999472], 13);
    L.control.zoom({
      position:'topright'
    }).addTo(this.map);
    // // base layer
    this.map.addLayer(new L.TileLayer('https://{s}.tiles.mapbox.com/v4/mapquest.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwcXVlc3QiLCJhIjoiY2Q2N2RlMmNhY2NiZTRkMzlmZjJmZDk0NWU0ZGJlNTMifQ.mPRiEubbajc6a5y9ISgydg'));
    this.markersLayer = new L.LayerGroup();
    this.map.addLayer(this.markersLayer);

    const subscribtion = this.keyUp.map(event => event)
      .debounceTime(500)
      .distinctUntilChanged()
      .flatMap(search => Observable.of(search).delay(3))
      .subscribe((keyWord) => {
        let collection = this.appService.searchtheNearBy(keyWord).subscribe(
          data => {
            if(data['resultsCount']){
              this.collections = '';
              this.collections = data['searchResults'];
              this.autocompleteInterest = true;            
              this.locatemarkers();
            }                        
          }
        );
      });
  }


  selectMarkerLocation(datas) {
    if (datas !== null) {
      console.log(datas);
      // Method to update the search result  to the DTO

      //this.selectedValBind(datas);

      this.autocompleteInterest = false;
      this.latitude = Number(datas['fields']['lat']);
      this.longitude = Number(datas['fields']['lng']);
      this.titleText = datas['name'];

      this.locatemarkers();

      this.selectedPlacemarker = new L.Marker([this.latitude, this.longitude], { icon: this.redIcon });
      this.selectedPlacemarker.bindPopup(this.titleText);

      // Show the Address when mouseover on marker
      this.selectedPlacemarker.on('mouseover', function (e) {
        this.openPopup();
      });

      // Reomve the popup
      this.selectedPlacemarker.on('mouseout', function (e) {
        this.closePopup();
      });

      // Change the marker color when marker is clicked
      this.selectedPlacemarker.on("click", (event: MouseEvent) => {
        // this.selectedValBind(datas);
      });

      this.markersLayer.addLayer(this.selectedPlacemarker);
      this.map.panTo(new L.LatLng(this.latitude, this.longitude));
    }
  }

  locatemarkers() {
    this.removeAllMapMarkers();          

    if (this.collections !== null && this.collections !=="undefined") {
      this.PoiSearchLatLong = [];
      for (let i in this.collections) {
        if (this.collections[i] != null) {
          let title = this.collections[i]['name'];
          let loc = [this.collections[i]['fields']['lat'], this.collections[i]['fields']['lng']];
          
          let marker = new L.Marker(loc, { icon: this.greenIcon });

          marker.bindPopup(title);

          // Show the POI address on popup
          marker.on('mouseover', function (e) {
            this.openPopup();
          });

          // Change the color of marker when click on it
          marker.on("click", (event: MouseEvent) => {
            //this.selectedValBind(this.collections[i]);
            this.selectMarkerLocation(this.collections[i]);
            marker.setIcon(this.redIcon);

          });

          // Reomve the popup
          marker.on('mouseout', function (e) {
            this.closePopup();
          });
          this.markersLayer.addLayer(marker);                  
          this.PoiSearchLatLong.push(loc);              
        }
      }


      this.map.fitBounds(this.PoiSearchLatLong);
    }
  }


  // Method to Remove all Markers from layer
  removeAllMapMarkers() {
    this.markersLayer.clearLayers();
  }

}