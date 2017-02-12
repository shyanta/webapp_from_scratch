/*jslint browser: true, devel: true, white: true, eqeq: true, plusplus: true, sloppy: true, vars: true*/
/***
 * cmdaan.js
 *   Bevat functies voor CMDAan stijl geolocatie welke uitgelegd
 *   zijn tijdens het techniek college in week 5.
 *
 *   Author: J.P. Sturkenboom <j.p.sturkenboom@hva.nl>
 *   Credit: Dive into html5, geo.js, Nicholas C. Zakas
 *
 *   Copyleft 2012, all wrongs reversed.
 */
(function () {
    //Placed all the variables in one variable in an object..
    var myVariables = {
        sandbox: "SANDBOX"
        , linear: "LINEAIR"
        , gps_available: "GPS_AVAILABLE"
        , gps_unavailable: "GPS_UNAVAILABLE"
        , position_updated: "POSITION_UPDATED"
        , refresh_rate: 1000
        //Divided one lang variable into multiple properties to make it more organised
        , currentPosition: currentPositionMarker
        , currentPositionMarker : customDebugging
        , customDebugging : debugId
        , debugId : map
        , map : interval
        , interval : intervalCounter
        , intervalCounter : updateMap
        , updateMap : false
        , locatieRij: markerRij = []
    };
    
    // Event functies - bron: http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/ Copyright (c) 2010 Nicholas C. Zakas. All rights reserved. MIT License
    // Gebruik: ET.addListener('foo', handleEvent); ET.fire('event_name'); ET.removeListener('foo', handleEvent);
    
    //Placed the functions I thought belonged together into one variable
    var EventTarget = (function(){
        //Placed all the functions in properties which I later use in the return
        var constructorMaker = this._listeners={},
            addListenerMethod = function(a,c){
                "undefined"==typeof this._listeners[a]&&(this._listeners[a]=[]);
                this._listeners[a].push(c)
            },
            fireMethod = function(a){
                "string"==typeof a&&(a={type:a});
                a.target||(a.target=this);
                if(!a.type)throw Error("Event object missing 'type' property.");
                if(this._listeners[a.type]instanceof Array)for(var c=this._listeners[a.type],b=0,d=c.length;b<d;b++)c[b].call(this,a)
                    },
            removeListenerMethod = function(a,c){
                if(this._listeners[a]instanceof Array)for(var b= this._listeners[a],d=0,e=b.length;d<e;d++)if(b[d]===c){
                    b.splice(d,1);
                    break
                }
            } 
        
        //To make it more organised, made a return with all the properties
            return { 
                prototype : {
                    constructor : constructorMaker,
                    addListener : addListenerMethod,
                    fire : fireMethod,
                    removeListener : removeListenerMethod
                }
            }
        })();
    
    //Made a new object
    var ET = new EventTarget();
    
    //I use the same structure in the other variables in this document
    var GetLocation = (function(){
        var init = function init() {
            DB.debugMessage("Controleer of GPS beschikbaar is...");
            ET.addListener(myVariables.gps_available, GT.startInterval);
            ET.addListener(myVariables.gps_unavailable, function () {
                DB.debugMessage('GPS is niet beschikbaar.')
            });
            (geo_position_js.DB.init()) ? myVariables.ET.fire(myVariables.gps_available): myVariables.ET.fire(myVariables.gps_unavailable);
        },
            startInterval = function _start_interval(event){
            DB.debugMessage("GPS is beschikbaar, vraag positie.");
            GT.updatePosition();
            interval = self.setInterval(GT.updatePosition, myVariables.refresh_rate);
            ET.addListener(myVariables.position_updated, DB.checkLocation);
        },
            updatePosition = function _update_position(){
            intervalCounter++;
            geo_position_js.getCurrentPosition(GT.setPosition, DB.geoErrorHandler, {enableHighAccuracy:true});
        },
            checkLocation = function _check_locations(event){
            // Liefst buiten google maps om... maar helaas, ze hebben alle coole functies
            for (var i = 0; i < locaties.length; i++) {
                var locatie = {coords:{latitude: locaties[i][3],longitude: locaties[i][4]}};

                if(GT.calculateDistance(locatie, currentPosition)<locaties[i][2]){

                    // Controle of we NU op die locatie zijn, zo niet gaan we naar de betreffende page
                    if(window.location!=locaties[i][1] && localStorage[locaties[i][0]]=="false"){
                        // Probeer local storage, als die bestaat incrementeer de locatie
                        try {
                            (localStorage[locaties[i][0]]=="false")?localStorage[locaties[i][0]]=1:localStorage[locaties[i][0]]++;
                        } catch(error) {
                            DB.debugMessage("Localstorage kan niet aangesproken worden: "+error);
                        }

        // TODO: Animeer de betreffende marker

                        window.location = locaties[i][1];
                        DB.debugMessage("Speler is binnen een straal van "+ locaties[i][2] +" meter van "+locaties[i][0]);
                    }
                }
            }
        },
            calculateDistance = function _calculate_distance(p1, p2){
            var pos1 = new google.maps.LatLng(p1.coords.latitude, p1.coords.longitude);
            var pos2 = new google.maps.LatLng(p2.coords.latitude, p2.coords.longitude);
            return Math.round(google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2), 0);
        },
            setPosition = function _set_position(position){
            currentPosition = position;
            ET.fire("POSITION_UPDATED");
            DB.debugMessage(intervalCounter+" positie lat:"+position.coords.latitude+" long:"+position.coords.longitude);
        }
        
        return {
            init : init,
            startInterval : startInterval,
            updatePosition : updatePosition,
            checkLocation : checkLocation,
            calculateDistance : calculateDistance,
            setPosition : setPosition
        }
    })();
    
    var GT = new GetLocation();
    
    var MakeMap = (function(){
        var generateMap = function generate_map(myOptions, canvasId){
        // TODO: Kan ik hier asynchroon nog de google maps api aanroepen? dit scheelt calls
            DB.debugMessage("Genereer een Google Maps kaart en toon deze in #"+canvasId)
            map = new google.maps.Map(document.getElementById(canvasId), myOptions);

            var routeList = [];
            // Voeg de markers toe aan de map afhankelijk van het tourtype
            DB.debugMessage("Locaties intekenen, tourtype is: "+tourType);
            for (var i = 0; i < locaties.length; i++) {

                // Met kudos aan Tomas Harkema, probeer local storage, als het bestaat, voeg de locaties toe
                try {
                    (localStorage.visited==undefined||MM.isNumber(localStorage.visited))?localStorage[locaties[i][0]]=false:null;
                } catch (error) {
                    DB.debugMessage("Localstorage kan niet aangesproken worden: "+error);
                }

                var markerLatLng = new google.maps.LatLng(locaties[i][3], locaties[i][4]);
                routeList.push(markerLatLng);

                markerRij[i] = {};
                for (var attr in locatieMarker) {
                    markerRij[i][attr] = locatieMarker[attr];
                }
                markerRij[i].scale = locaties[i][2]/3;

                var marker = new google.maps.Marker({
                    position: markerLatLng,
                    map: map,
                    icon: markerRij[i],
                    title: locaties[i][0]
                });
            }
        // TODO: Kleur aanpassen op het huidige punt van de tour
            if(tourType == LINEAIR){
                // Trek lijnen tussen de punten
                DB.debugMessage("Route intekenen");
                var route = new google.maps.Polyline({
                    clickable: false,
                    map: map,
                    path: routeList,
                    strokeColor: 'Black',
                    strokeOpacity: .6,
                    strokeWeight: 3
                });

            }

            // Voeg de locatie van de persoon door
            currentPositionMarker = new google.maps.Marker({
                position: kaartOpties.center,
                map: map,
                icon: positieMarker,
                title: 'U bevindt zich hier'
            });

            // Zorg dat de kaart geupdated wordt als het POSITION_UPDATED event afgevuurd wordt
            ET.addListener(myVariables.position_updated, MM.updatePositie);
        },
            isNumber = function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
            updatePositie = function update_positie(event){
            // use currentPosition to center the map
            var newPos = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
            map.setCenter(newPos);
            currentPositionMarker.GT.setPosition(newPos);
        }

        return {
            generateMap : generateMap,
            isNumber : isNumber,
            updatePositie : updatePositie
        }
    })();
    
    var MM = new MakeMap();
    
    var Debugging = (function(){
        var geoErrorHandler = function _geo_error_handler(code, message) {
            DB.debugMessage('geo.js error '+code+': '+message);
        },
            debugMessage = function debug_message(message){
            (customDebugging && debugId)?document.getElementById(debugId).innerHTML:console.log(message);
        },
            setCustomDebugging = function set_custom_debugging(debugId){
            debugId = this.debugId;
            customDebugging = true;
        }
        
        return {
            geoErrorHandler : geoErrorHandler,
            debugMessage : debugMessage,
            setCostumDebugging : setCustomDebugging
        }
    })();
    
    var DB = new Debugging();
})();