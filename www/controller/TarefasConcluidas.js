/*
 *
*/
app.controller('TarefasConcluidas', function($rootScope, $scope, $routeParams) {
    var tela;
    
    $rootScope.$on("$routeChangeStart", function(){
        $rootScope.loading = true;
    });

    $rootScope.$on("$routeChangeSuccess", function(){
        $rootScope.loading = false;
    }); 
    
    
    
    //carregaDados();
  
    var retornaDadosConcluidos = function(callback) {
        console.log("Dentro do retorna Dados CONCLUÍDOS");
        var retorno;
        db.transaction(
            function(tx) {
                tx.executeSql(
                    "SELECT id, descricao, detalhe, dt, status FROM tarefas WHERE (status IN ('C')) ORDER BY dt DESC, id ",
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
    
    var montaListaConcluidos = function(retorno) {
        console.log("Dentro do montalista() CONCLUÍDOS");
        var scrollItems = [];
        var total       = retorno.rows.length;
        console.log("total de tarefas: " + total);

        var tela = "";
        for (var i=0; i < total; i++) {
            tela = { id: retorno.rows.item(i).id, descricao: retorno.rows.item(i).descricao, detalhe: retorno.rows.item(i).detalhe, dt: formataDataHora(retorno.rows.item(i).dt), dtPadrao: retorno.rows.item(i).dt };
            scrollItems.push(tela);
        }

        $scope.tarefaConcluida = scrollItems;
        $scope.$digest();
    }
    
    retornaDadosConcluidos(montaListaConcluidos);  
});