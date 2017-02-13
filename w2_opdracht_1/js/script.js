/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/
aja()
    .method('get')
//API from https://opentdb.com/api_config.php
    .url('https://opentdb.com/api.php?amount=20&category=14&difficulty=easy&type=multiple')
    .type('json')
    .on('200', function(data){
        localStorage.setItem('data', JSON.stringify(data)); //source 1
    })
    .go();

console.log(JSON.parse(localStorage.getItem('data')));

//Sources:
//1 : Stackoverflow. (2010). Storing Objects in HTML5 localStorage. Source:
//http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage