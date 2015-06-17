app.controller('MainController', function($rootScope, $scope, cordovaNotificationService){   
    var tela;
        
    $rootScope.$on("$routeChangeStart", function(){
        $rootScope.loading = true;    
        retornaDados(montaLista);  
    });

    $rootScope.$on("$routeChangeSuccess", function(){
        $rootScope.loading = false;
    }); 
    
    $scope.boxTarefaVisivel = false;
    $scope.dtAtual          = dataAtualFormatada();
    
    carregaDados();
  
    var retornaDados = function(callback) {
        console.log("Dentro do retorna Dados");
        var retorno;
        db.transaction(
            function(tx) {
                tx.executeSql(
                    "SELECT id, descricao, detalhe, dt, hora, status FROM tarefas WHERE (status IN ('P')) ORDER BY dt, id ",
                    [],
                    function(tx, resultado) {
                        retorno = resultado;    
                        callback(retorno);
                    },
                    function(tx, e) {
                        console.log("Erro ao retornar os dados 1: " + e.message);
                    }
                )                
            }
        );
    }
    
    var montaLista = function(retorno) {
        console.log("Dentro do montalista()");
        var scrollItems = [];
        var total       = retorno.rows.length;
        console.log("total de tarefas: " + total);

        var tela = "";
        for (var i=0; i < total; i++) {
            tela = { id: retorno.rows.item(i).id, descricao: retorno.rows.item(i).descricao, detalhe: retorno.rows.item(i).detalhe, dt: formataDataHora(retorno.rows.item(i).dt), dtPadrao: retorno.rows.item(i).dt, hora: retorno.rows.item(i).hora, status: retorno.rows.item(i).status };
            scrollItems.push(tela);
        }

        $scope.tarefaPendentes = scrollItems;
        $scope.$digest();
    }
    
    $scope.defineExclusao = function(item) {
        $scope.exclusao = {
            id: item.id,
            descricao: item.descricao,
            detalhe: item.detalhe,
            dt: item.dt
        }
    }
    
    $scope.excluirTarefa = function(id) {
        console.log('vai excluir ' + id);
        if (id > 0) {
            db.transaction(
            function(tx) {
                tx.executeSql(
                    "DELETE FROM tarefas WHERE (id = ?) ",
                    [id],
                    function(tx, resultado) {
                        //document.location.href = "index.html";  //melhorar isso aqui                              
                        $scope.boxTarefaVisivel = true;
                    },
                    function(tx, e) {
                        console.log("Erro ao excluir: " + e.message);
                    }
                )                
            }
        );        
        }
    }
    
    $scope.notificationService = cordovaNotificationService;

    $scope.alertResult = '-';
    $scope.confirmResult = '-';
    $scope.promptResult = '-';  

    /**
     * Alert sample.
     */
    $scope.alert = function() {
//        alert('funcionando');
        cordovaNotificationService.alert('A simple alert!', function(){ $scope.alertResult = 'Dismissed!'; });
    };

    /**
     * Confirm API sample.
     */                                                               
    $scope.confirm = function() {
        cordovaNotificationService.confirm('A simple confirmation!', function(buttonIndex){ $scope.confirmResult = 'Dismissed with button {' + buttonIndex + '}!'; });
    };

    /**
     * Prompt API sample.
     */
    $scope.prompt = function() {
        cordovaNotificationService.prompt('A simple confirmation!', function(result){ $scope.promptResult = 'Dismissed with button {' + result.buttonIndex + '} and value {' + result.input1 + '}!'; });
    };

    /**
     * Beep API sample.
     */
    $scope.beep = function() {
        cordovaNotificationService.beep(5);
    };

    /**
     * Vibrate API sample.
     */
    $scope.vibrate = function() {
        cordovaNotificationService.vibrate(2000);
    };  
});    