var iniciaApp = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('load', this.onLoad, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
//        window.addEventListener("orientationchange", orientationChange, true);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
//        app.receivedEvent('deviceready');  não usar
        
        
       
        function alertDismissed() {
            // do something
        }

        navigator.notification.alert(
            'Sistema carregado',  // message
            alertDismissed,         // callback
            'Pronto para uso!',            // title
            'OK'                  // buttonName
        );
        
    },
    onLoad: function() {
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
//        console.log('Received Event: ' + id);
//        angular.bootstrap(document, ["LPos"]);
    }
};


var app = angular.module('LPos', ["ngRoute", "mobile-angular-ui", "mobile-angular-ui.gestures", "cordovaNotificationModule"]); //"ngTouch"
//.factory('deviceReady', function(){
//  return function(done) {
//    if (typeof window.cordova === 'object') {
//      document.addEventListener('deviceready', function () {
//        alert('sim');
//      }, false);
//    } else {
//      alert('não');
//    }
//  };
//});


app.config(function($routeProvider) { //, $locationProvider) {
    $routeProvider.when('/',                 {templateUrl: "home.html", reloadOnSearch: false});
    $routeProvider.when('/adicionar_tarefa', {templateUrl: "adicionar_tarefa.html", reloadOnSearch: false});
    $routeProvider.when('/alerta',           {templateUrl: "alerta.html", reloadOnSearch: false});
    $routeProvider.when('/sobre',            {templateUrl: "sobre.html", reloadOnSearch: false});
    $routeProvider.when('/concluidas',       {templateUrl: "concluidas.html", reloadOnSearch: false});
});


//
// `$drag` example: drag to dismiss
//
app.directive('dragToDismiss', function($drag, $parse, $timeout){
  return {
    restrict: 'A',
    compile: function(elem, attrs) {
      var dismissFn = $parse(attrs.dragToDismiss);
      return function(scope, elem, attrs){
        var dismiss = false;

        $drag.bind(elem, {
          constraint: {
            minX: 0, 
            minY: 0, 
            maxY: 0 
          },
          move: function(c) {
            if( c.left >= c.width / 4) {
              dismiss = true;
              elem.addClass('dismiss');
            } else {
              dismiss = false;
              elem.removeClass('dismiss');
            }
          },
          cancel: function(){
            elem.removeClass('dismiss');
          },
          end: function(c, undo, reset) {
            if (dismiss) {
              elem.addClass('dismitted');
              $timeout(function() { 
                scope.$apply(function() {
                  dismissFn(scope);  
                });
              }, 400);
            } else {
              reset();
            }
          }
        });
      };
    }
  };
});