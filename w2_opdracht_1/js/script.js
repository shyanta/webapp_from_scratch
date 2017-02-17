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
        givenTitle : document.querySelector('.mytitle'),
        questionPanel : document.querySelector('.questionpanel')
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
        geschiedenis : function(){
            aja()
                .method('get')
                //API from https://opentdb.com/api_config.php
                .url('https://opentdb.com/api.php?amount=20&category=23&difficulty=easy&type=multiple')
                .type('json')
                .on('200', function(geschiedenis){
                    localStorage.setItem('geschiedenis', JSON.stringify(geschiedenis)); //source 1
                    sections.render(geschiedenis, 'api');
                })
                .go();
        },
        muziek : function(){
            aja()
                .method('get')
                //API from https://opentdb.com/api_config.php
                .url('https://opentdb.com/api.php?amount=20&category=12&difficulty=easy&type=multiple')
                .type('json')
                .on('200', function(muziek){
                    localStorage.setItem('muziek', JSON.stringify(muziek)); //source 1
                    sections.render(muziek, 'api');
                })
                .go();
        }
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
                return '#categories/' + this.value;
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
                    sections.toggle('home');
                },
                'categories': function(){
                    selectedElements.categoryList.hidden = false;
                    selectedElements.questionPanel.hidden = true;
                    sections.toggle('categories');
                },
                'quizgenerator': function(){
                    sections.toggle('quizgenerator');
                },
                'categories/:name': function(name) {
                    console.log(data[name]);
                    selectedElements.categoryList.hidden = true;
                    selectedElements.questionPanel.hidden = false;
                    localStorage.getItem(name) ? sections.render(JSON.parse(localStorage.getItem(name)), 'local') : data[name]();
                }
            });
        }
    };
    
    var sections = {
        render: function(data, source) {
            console.log(data);
            var rolledUpData = data.results.map(function(val){
                return [
                    val.question,
                    val.incorrect_answers[0],
                    val.incorrect_answers[1],
                    val.incorrect_answers[2],
                    val.correct_answer
                ];
            });
            console.log(rolledUpData);
            var directives = {
                question : {
                    text: function(params){
                        return this[0];
                    }
                },
                answer1 : {
                    text : function(params){
                        return this[1];
                    }
                },
                answer2 : {
                    text : function(params){
                        return this[2];
                    }
                },
                answer3 : {
                    text : function(params){
                        return this[3];
                    }
                },
                correctanswer : {
                    text : function(params){
                        return this[4];
                    }
                }
            };
            
            Transparency.render(selectedElements.questionPanel, rolledUpData, directives);
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