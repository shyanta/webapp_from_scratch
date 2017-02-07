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
    var myVariables = {
        sandbox: "SANDBOX"
        , linear: "LINEAIR"
        , gps_available: "GPS_AVAILABLE"
        , gps_unavailable: "GPS_UNAVAILABLE"
        , position_updated: "POSITION_UPDATED"
        , refresh_rate: 1000
        , currentPosition: currentPositionMarker = customDebugging = debugId = map = interval = intervalCounter = updateMap = false
        , locatieRij: markerRij = []
    };
    
    // Event functies - bron: http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/ Copyright (c) 2010 Nicholas C. Zakas. All rights reserved. MIT License
    // Gebruik: ET.addListener('foo', handleEvent); ET.fire('event_name'); ET.removeListener('foo', handleEvent);
    var eventTarget = (function(){
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
        
        return { 
            prototype : {
                constructor : constructorMaker,
                addListener : addListenerMethod,
                fire : fireMethod,
                removeListener : removeListenerMethod
            }
        }
    })();
    
    var ET = new EventTarget();
        
    // Test of GPS beschikbaar is (via geo.js) en vuur een event af
    function init() {
        debug_message("Controleer of GPS beschikbaar is...");
        ET.addListener(myVariables.gps_available, _start_interval);
        ET.addListener(myVariables.gps_unavailable, function () {
            debug_message('GPS is niet beschikbaar.')
        });
        (geo_position_js.init()) ? myVariables.ET.fire(myVariables.gps_available): myVariables.ET.fire(myVariables.gps_unavailable);
    }
})();