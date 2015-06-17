/*
 * Controle do Form de adicionar tarefa
 */
app.controller('CadastroForm', function($rootScope, $scope, $routeParams){
    $rootScope.$on("$routeChangeStart", function(){
        $rootScope.loading = true;
    });

    $rootScope.$on("$routeChangeSuccess", function(){
        $rootScope.loading = false;
    }); 
        
    $scope.cadastro = { 
        id: "",
        descricao: "",
        detalhe: "",
        dt: "",
        hora: "",
        dtTela: ""
    };
    
    var id = $routeParams.id;
    if (id > 0) {
        $scope.cadastro = { 
            id: $routeParams.id,
            descricao: $routeParams.descricao,
            detalhe: $routeParams.detalhe,
            dt: $routeParams.dt.replace(" ", "T"),
            hora: $routeParams.hora,
            dtTela: $routeParams.dtTela
        };              
        
        $scope.$digest;
    }
    
    //gravacao
    function gravaTarefas() {
        //console.log("Dentro -> " + $scope.cadastro.descricao);
        iniciaDB();
        
        var id        = $scope.cadastro.id;
        var descricao = $scope.cadastro.descricao;
        var detalhe   = $scope.cadastro.detalhe;
        var dt        = $scope.cadastro.dt.substr(0, 10) + ' ' + $scope.cadastro.dt.substr(11, 5);
        var hora      = $scope.cadastro.hora;
        
        db.transaction(function(tx) {
            try {
                var sql = "";
                                
                if (id > 0) {
                    console.log("Passando para ATUALIZAR: " + id + ' - ' + descricao + ' - ' + detalhe + ' - ' + dt + ' - ' + hora);
                    sql = "UPDATE tarefas SET descricao = ?, detalhe = ?, dt = ?, hora = ? WHERE id = ? ";
                    tx.executeSql(
                        sql, 
                        [descricao, detalhe, dt, hora, id], 
                        function(tx, results) {
                            if (! results.rowsAffected) {
                                $scope.msg = "Ops, erro ao incluir a tarefa!";    
                                $scope.$digest();  
                            }
                            else {                            
                                $scope.msg = "Tarefa alterada com sucesso!";
                                $scope.$digest();  
                            }
                        }, 
                        erroDB
                    );
                }
                else {
                    console.log("Passando para INCLUIR: " + descricao + ' - ' + detalhe + ' - ' + dt + ' - ' + hora);
                    sql = "INSERT INTO tarefas (descricao, detalhe, dt, hora, status) VALUES (:descricao, :detalhe, :dt, :hora, 'P') ";
                    tx.executeSql(
                        sql, 
                        [descricao, detalhe, dt, hora], 
                        function(tx, results) {
                            if (! results.rowsAffected) {
                                $scope.msg = "Ops, erro ao incluir a tarefa!";    
                            }
                            else {
                                id = results.insertId;  
                                console.log('ID -> ' + id);
                                $scope.cadastro.id = id;
                                $scope.cadastro.dtTela = formataData($scope.cadastro.dt);
                                $scope.msg = "Tarefa criada! Fique tranquilo que nós te lembraremos!";
                                $scope.$digest();                                   
                            }
                        }, 
                        erroDB
                    );                
                }            
            }
            catch(err) {
                console.log("erro na inclusão da tarefa: " + err.message);    
            }    
        });         
    }
    
    function concluirTarefa() {        
        iniciaDB();
        
        var id = $scope.cadastro.id;
        
        db.transaction(function(tx) {
            try {
                var sql = "";
                                
                if (id > 0) {
                    console.log("CONCLUÍNDO: " + id);
                    sql = "UPDATE tarefas SET status = 'C' WHERE id = ? ";
                    tx.executeSql(
                        sql, 
                        [id], 
                        function(tx, results) {
                            if (! results.rowsAffected) {
                                alert('Ops, erro ao concluir a tarefa!');    
                            }
                            else {                            
                                $scope.$digest();
                                document.location.href = "index.html";  //melhorar isso aqui                              
                            }
                        }, 
                        erroDB
                    );
                }      
            }
            catch(err) {
                console.log("erro na inclusão da tarefa: " + err.message);    
            }    
        });         
    }
    
 
    $scope.gravar = function() {
        if (($scope.cadastro.descricao != "") && ($scope.cadastro.dt != "")) {
            gravaTarefas();
        }     
    }
    //fim gravacao 
    
    $scope.concluir = function() {
        if ($scope.cadastro.id > 0) {
            concluirTarefa();    
        } 
        else {
            alert('Você precisa Gravar primeiro!');   
        }
    }
    
});