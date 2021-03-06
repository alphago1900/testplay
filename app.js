'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute','angular-popups'
]).filter('formatAmount',function(){
    return function(input){
        return input/100000000;
    }
})
.controller('ctrl', function($scope,$http) {

    $scope.accountInfo = {};
    $scope.accountInfo.secret = 'garden scan oval hurdle mixed town next plastic exercise jungle bulk smile'
    $scope.secretDialog = {};
    $scope.msgDialog = {};
    //$scope.msgDialog.open = true;
    //$scope.msgDialog.title = 'haha';
    //$scope.msgDialog.content = 'hehe';
    $scope.secretDialog.open = true;

    var iosocket = io.connect();

    iosocket.on('play/bet',function(data){

        var isWin = data.result.result.indexOf('Win')>-1;
        if(isWin){
            $scope.invest.totalInput-=data.result.amount;
            $scope.invest.totalProfit -= data.result.amount;
        }else{
            $scope.invest.totalInput+=data.result.amount;
            $scope.invest.totalProfit += data.result.amount;
        }

        $scope.invest.maxProfit = $scope.invest.totalInput/10;

        if(data.result.account == $scope.account.address){

            $scope.account.balance -= 0.1;

            if(isWin){
                $scope.account.balance += data.result.amount;
            }else{
                $scope.account.balance -= data.result.amount;
            }

            endLoading();
        }else{
            console.log('not self');
        }

        $scope.betInfo.list.splice(0,0,data.result);
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    })



    iosocket.on('play/summary',function(data){
        return;
        console.log('refresh summary',new Date().getTime());
        $scope.invest = data;
        //data.totalProfit /= 100000000;
        //data.maxProfit /= 100000000;
        //data.totalInput /= 100000000;
        console.log('summary:',data);
        if(!$scope.$$phase) {
            $scope.$apply();
        }

    })

    iosocket.on('play/accountInfo',function(data){

        return;
        console.log('refresh account info',new Date().getTime());
        $scope.account = data.account;

        if (!$scope.$$phase) {
            $scope.$apply();
        }

        iosocket.emit('play/queryAccountInfo',{secret:secret});
    });

    iosocket.on('play/init',function(data){

        endLoading();
    });

    iosocket.on('connect', function () {
        //console.log('connect');

        //iosocket.on('welcome',function(data){
        //    console.log(data);
        //})
    });

    $scope.view = {};

    $scope.investInfo = {
        investAmount : 0,
        divestAmount : 0
    }

    var showLoading = function(text){
        $scope.view.inLoading = true;
        $scope.view.loadingText = text?text:'loading';

    }

    var endLoading = function(){
        $scope.view.loadingText='haha';
        $scope.view.inLoading = false;
    }


    var secret = '';
    //var secret = 'faculty disagree thumb bar outside obscure another adapt sponsor prefer retreat potato';
    //secret = 'garden scan oval hurdle mixed town next plastic exercise jungle bulk smile';
    var loadAccountInfo = function(callback) {
        $http.get('/api/accountInfo?secret='+secret).success(function (data) {
            $scope.account = data.account;

            if (!$scope.$$phase) {
                $scope.$apply();
            }

            callback()
        });
    }


    var loadSummary = function(callback){
        $http.get('/api/investSummary').success(function(data){
            $scope.invest = data;

            console.log('summary:',data);
            if(!$scope.$$phase) {
                $scope.$apply();
            }

            callback()

        });
    }

    var init = function() {
        showLoading('loading account info');
        loadAccountInfo(function () {
            showLoading('loading summary');
            loadSummary(function () {

                iosocket.emit('play/queryAccountInfo',{secret:secret});

                endLoading();
            })
        })
    }

    $scope.betInfo ={
        list:[]
        //list:[{
        //    account:'12345',
        //    amount:1,
        //    createTime:'2014-11-15',
        //    result:'Win(2)'
        //
        //}]
    };

    $scope.submitSecret = function(){
        secret = $scope.accountInfo.secret;
        $scope.secretDialog.open = false;

        init();
    }

    $scope.submitInvest = function(){

        $http.post('/api/doInvest',{secret:secret,amount:$scope.investInfo.investAmount,publicKey:$scope.account.publicKey}).success(function(data){
            if(data.success){
                $scope.investDialog.open = false;
                init();
            }

        });
    }

    $scope.submitDivest = function(){
        showLoading('start invest');
        $http.post('/api/doDivest',{address:$scope.account.address,amount:$scope.investInfo.divestAmount}).success(function(data){
           if(data.success)
            $scope.divestDialog.open = false;
            init();
        });
    }

    var doBet = function(type){

        //return iosocket.emit('s1',{haha:'hehe'});
        showLoading('start bet');
        iosocket.emit('play/doBet',{which:type,secret:secret,publicKey:$scope.account.publicKey,amount:100000000,address:$scope.account.address});
        //$http.post('/api/doBet',).success(function(data){
        //    if(data && data.success == true)
        //    {
        //        console.log(data.result);
        //        $scope.betInfo.list.splice(0,0,data.result);
        //
        //        endLoading();
        //        //init();
        //
        //    }
        //
        //});
    }

    $scope.doBetHi = function(){
        doBet('hi')
    }

    $scope.doBetLo = function(){
        doBet('lo')
    }

    $scope.account = {};
    $scope.invest = {};


    //init();

    //$scope.haha='cc';
});
