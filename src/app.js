/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
  var ajax = require('ajax');
var jsonProviders;
var main =new UI.Menu() ;
function getAidsData(pos){
  var URL = "https://locator.aids.gov/data?lat=" +pos.coords.latitude + "&long="+pos.coords.longitude;
  ajax({url: URL,type: 'json' },
      function(json){
      jsonProviders= json.services; //returns all the services in the json object.
        createMenu();
      },
      function(error){
        console.log('Ajax failed: ' + error);
      });
}

//if we get the position
function locationSuccess(pos) {
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  getAidsData(pos);
  
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}
var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 10000, 
  timeout: 10000
};
Pebble.addEventListener('ready',
  function(e) {
    // Request current position
   jsonProviders= navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
  }
);
function createMenu(){
for(var i in jsonProviders)
{
  var section ={title: jsonProviders[i].serviceType};
  main.section(i,section);
  for(var j in jsonProviders[i].providers)
  {
    var item = {title: jsonProviders[i].providers[j].title, subtitle: jsonProviders[i].providers[j].streetAddress};
    main.item(i,j,item);
    j++;
  }
  i++;
}  
    main.show();
}

main.on( 'select', function(e) {
  var item = e.itemIndex;
  var count = 0;
  for(var i in jsonProviders)
    {
      for(var j in jsonProviders[i].providers)
        {
          if(count == item){
             var card = new UI.Card();
              card.title(jsonProviders[i].providers[count].title);
              card.subtitle(jsonProviders[i].providers[count].telephone);
            card.body(jsonProviders[i].providers[count].streetAddress + " " +jsonProviders[i].providers[count].locality + " " +jsonProviders[i].providers[count].region + " " + jsonProviders[i].providers[count].postalCode );
          card.show();
          }
          count++;
          j++;
        }
      i++;
    }
  
});

