var db;
var scrollItems = [];

var listaTarefas = [];
var temp;
var id;

//Iniciando banco
function carregaDados() {
    console.log('Dentro de carregaDados()');
    iniciaDB(); 
}

function iniciaDB() {
    console.log("Dentro de iniciaDB()");
    db = window.openDatabase("LPos", "1.0", "Banco do LPos", 200000);
    db.transaction(criarTabela);
}

function qryOk(tx, result) {
    var total = result.rows.length;
    console.log("Retorno: " + total);
    listaTarefas = [];
    if (total > 0) {
        for (var i = 0; i < total; i++) {
            listaTarefas[i] = result.rows.item(i);
        }
    }
}

function criarTabela(tx) {
    console.log("Criando a tabela");
    try {
//        tx.executeSql("DROP TABLE tarefas ");
        tx.executeSql("CREATE TABLE IF NOT EXISTS tarefas (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT NOT NULL, detalhe TEXT, dt DATE, status TEXT, hora TEXT) ");
//        tx.executeSql("INSERT INTO tarefas (descricao, detalhe, dt, status) VALUES ('Teste novo', 'Teste maior agora vai de novo', '2014-12-01', 'P') ");
    }
    catch (err) {
        console.log('opa: ' + err);
    }
}

 
erroDB = function(transaction, error){
    console.log("Erro: " + error.message);
    return true;
}

function okDB() {
    console.log("Comando executado com sucesso!");   
}

function formataData(data){
    var dataFormatada = "";
    if (data.length == 10) {
        dataFormatada =  data.substr(8, 2) + "/" + data.substr(5, 2) + "/" +data.substr(0, 4);
    }
    return dataFormatada
}

function formataDataHora(data){
    var dataFormatada = "";
    if (data.length == 16) {
        dataFormatada =  data.substr(8, 2) + "/" + data.substr(5, 2) + "/" + data.substr(0, 4) + " - " + data.substr(11, 5);
    }
    
    return dataFormatada
}

function dataAtualFormatada(){
    var data = new Date();
    var dia = data.getDate();
    if (dia.toString().length == 1)
      dia = "0"+dia;
    var mes = data.getMonth()+1;
    if (mes.toString().length == 1)
      mes = "0"+mes;
    var ano = data.getFullYear();  
    return dia+"/"+mes+"/"+ano;
}

//            document.addEventListener('deviceready', function () {
//
//                cordova.plugins.notification.local.on('schedule', function (notification) {
//                    console.log('onschedule', arguments);
//                    // showToast('scheduled: ' + notification.id);
//                });
//
//                cordova.plugins.notification.local.on('update', function (notification) {
//                    console.log('onupdate', arguments);
//                    // showToast('updated: ' + notification.id);
//                });
//
//                cordova.plugins.notification.local.on('trigger', function (notification) {
//                    console.log('ontrigger', arguments);
//                    showToast('triggered: ' + notification.id);
//                });
//
//                cordova.plugins.notification.local.on('click', function (notification) {
//                    console.log('onclick', arguments);
//                    showToast('clicked: ' + notification.id);
//                });
//
//                cordova.plugins.notification.local.on('cancel', function (notification) {
//                    console.log('oncancel', arguments);
//                    // showToast('canceled: ' + notification.id);
//                });
//
//                cordova.plugins.notification.local.on('clear', function (notification) {
//                    console.log('onclear', arguments);
//                    showToast('cleared: ' + notification.id);
//                });
//
//                cordova.plugins.notification.local.on('cancelall', function () {
//                    console.log('oncancelall', arguments);
//                    // showToast('canceled all');
//                });
//
//                cordova.plugins.notification.local.on('clearall', function () {
//                    console.log('onclearall', arguments);
//                    // showToast('cleared all');
//                });
//            }, false);
        