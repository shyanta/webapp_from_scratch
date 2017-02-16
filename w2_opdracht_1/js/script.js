/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/

(function () {
    //Execute code in strict mode
    'use strict';
    
    //Select elements in DOM and store them in selectedElements
    var selectedElements = {
        landingPage : document.getElementById('start'),
        quiz : document.getElementById('categories'),
        categoryList : document.querySelector('#categorylist'),
        titleInput : document.querySelector('input[name="title"]'),
        generateQuizButton : document.querySelector('button[type="submit"]'),
        quizGenerator : document.querySelector('#quizgenerator'),
        allQuestions : document.querySelector('.allquestions'),
        givenTitle : document.querySelector('.mytitle')
    };
    
    //Store data of api's in data.
    var data = {
        tv : function(){
            aja()
                .method('get')
                //API from https://opentdb.com/api_config.php
                .url('https://opentdb.com/api.php?amount=20&category=14&difficulty=easy&type=multiple')
                .type('json')
                .on('200', function(tv){ //If the API is succesful, store the data in tv
                    localStorage.setItem('tv', JSON.stringify(tv)); //Source 1, put the data into local storage
                    sections.render(tv, 'api'); //Execute function sections.render with the parameter that has the data from the api and a string to tell where the data is being loaded from
                })
                .go(); 
        },
        scienceNature : function(){
            aja()
                .method('get')
                //API from https://opentdb.com/api_config.php
                .url('https://opentdb.com/api.php?amount=20&category=17&difficulty=easy&type=multiple')
                .type('json')
                .on('200', function(scienceNature){
                    localStorage.setItem('scienceNature', JSON.stringify(scienceNature)); //source 1
                    sections.render(scienceNature, 'api');
                })
                .go();
        },
        sports : (function(){
            aja()
                .method('get')
                //API from https://opentdb.com/api_config.php
                .url('https://opentdb.com/api.php?amount=20&category=21&difficulty=easy&type=multiple')
                .type('json')
                .on('200', function(sports){
                    localStorage.setItem('sports', JSON.stringify(sports)); //source 1
                    sections.render(sports, 'api');
                })
                .go();
        })(),
        celebrities : (function(){
            aja()
                .method('get')
                //API from https://opentdb.com/api_config.php
                .url('https://opentdb.com/api.php?amount=20&category=26&difficulty=easy&type=multiple')
                .type('json')
                .on('200', function(celebrities){
                    localStorage.setItem('celebrities', JSON.stringify(celebrities)); //source 1
                    sections.render(celebrities, 'api');
                })
                .go();
        })()
    };
    
    var categoryNames = [
        Object.getOwnPropertyNames(data)[0], 
        Object.getOwnPropertyNames(data)[1], 
        Object.getOwnPropertyNames(data)[2], 
        Object.getOwnPropertyNames(data)[3]
    ];
    
    var directives = {
        category : {
            href: function(params){
                return '#category/#' + this.value;
            },
            text : function(params){
                return this.value;
            }
        }
    };
    
    Transparency.render(selectedElements.categoryList, categoryNames, directives);
    
//    (function(){
//        selectedElements.quizGenerator.hidden = true;
//        
//        selectedElements.generateQuizButton.addEventListener('click', function(event){
//            event.preventDefault();
//            
//            var titleQuiz = {
//                mytitle : selectedElements.titleInput.value
//            };
//            Transparency.render(selectedElements.quizGenerator, titleQuiz);
//            Transparency.render(selectedElements.allQuestions, categoryNames);
//            selectedElements.quizGenerator.hidden = false;
//            selectedElements.landingPage.hidden = true;
//        });
//    })();
//    
    //Settings for starting app.
    var app = {
        init: function(){
            routes.init();
        }
    };
    
    //Default settings, initiate toggle, if hash changes again initiate toggle 
    var routes = {
        init: function(){ 
            location.hash = '#home';
            
            routie({
                'home': function() {
                    console.log('home');
                    sections.toggle('home');
                },
                'categories': function(){
                    sections.toggle('categories');
                },
                'quizgenerator': function(){
                    sections.toggle('quizgenerator');
                },
                'categories/:name': function(name) {
                    localStorage.getItem(name) ? sections.render(JSON.parse(localStorage.getItem(name)), 'local') : data[name]();
                }
            });
        }
    };
    
    var sections = {
        render: function(data, source) {
            event.preventDefault();
            selectedElements.categoryList.hidden = false;
            // render html with transparency + data
            // this.toggle()
        },
        toggle: function(route){
            //Change all the other sections to hidden, except the active tab. Source: Shyanta Vleugel
            var currentSection = document.querySelector('#' + route),
                unactiveSections = document.querySelectorAll('section:not(#' + route + ')');
            
            unactiveSections.forEach(function(unactiveSections){
                unactiveSections.hidden = true;
                currentSection.hidden = false;
            });
        }
    };
    
    //Initiate app
    app.init();
    
})();

//Sources:
//1 : Stackoverflow. (2010). Storing Objects in HTML5 localStorage. Source:
//http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage

//Rubbish
//
    //Output all the questions
//    (function(){
//        for(var i=0; i < data.results.length; i++){
//        selectedElements.categoryList.innerHTML += '<li id="question' + [i] + '"><a href="#question' + [i] + '">' + data.results[i].question + '</a></li><form><input type="radio" name="question' + [i] + '" value="' + data.results[i].incorrect_answers[0] + '" /><p>' + data.results[i].incorrect_answers[0] + '</p><input type="radio" name="question' + [i] + '" value="' + data.results[i].incorrect_answers[1] + '" /><p>' + data.results[i].incorrect_answers[1] + '</p><input type="radio" name="question' + [i] + '" value="' + data.results[i].incorrect_answers[2] + '" /><p>' + data.results[i].incorrect_answers[2] + '<input type="radio" name="question' + [i] + '" value="' + data.results[i].correct_answer + '" /><p>' + data.results[i].correct_answer + '</p></form>';
//        }  
//        selectedElements.answersInput = document.querySelectorAll('input[name^="question"]');
//        selectedElements.answersParagraph = document.querySelectorAll('#categories p');
//        
//    })();