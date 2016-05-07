var config = require('config');
var liskApi = require('./liskApi.js');
var _ = require('underscore');

function investService(){

}

investService.prototype.getInvestSummary = function(callback){

    var summary = {
        totalProfit:0,
        totalInput:0,
        maxProfit:0
    }

    liskApi.getAccountInfo(config.investAccount.secret,function(err,result){
        //console.log(result);
        if(!result)return;
        summary.totalInput = result.account.balance;
        summary.maxProfit = summary.totalInput/10;

        //lose
        liskApi.getTransactionsBySenderAndRecipient(config.investAccount.address,config.walletAccount.address,function(err,output){
            var outputAmount = 0;
            _.forEach(output.transactions,function(tran){
                outputAmount += tran.amount;
            })
            //win
            liskApi.getTransactionsBySenderAndRecipient(config.walletAccount.address,config.investAccount.address,function(err,input){

                if(err){
                    return console.log(err);
                }

                var inputAmount = 0;
                _.forEach(input.transactions,function(tran){
                    inputAmount += tran.amount;
                });

                var profit = inputAmount - outputAmount;
                summary.totalProfit = profit;
                return callback(null,summary);

            });

            //console.log(output);

        })


    })

    //liskApi.getTransactionsByRecipientId(config.investAccount.address,function(err,inputData){
    //
    //    _.forEach(inputData.transactions,function(tran){
    //        summary.totalInput += tran.amount;
    //    })
    //
    //    console.log(inputData);
    //    //liskApi.getTransactionsBySenderId(config.investAddress,function(err,outputData){
    //    //    console.log(inputData);
    //    //    console.log(outputData);
    //    //});
    //
    //    summary.maxProfit = summary.totalInput/100;
    //
    //    return callback(null,summary);
    //
    //});



}

investService.prototype.doInvest = function(secret,senderPublicKey,amount,callback){
    liskApi.sendTransaction(secret,config.investAccount.address,senderPublicKey,amount,callback);
}

investService.prototype.getInvestHistory = function(callback){
    liskApi.getTransactionsByRecipientId(config.investAccount.address,callback);
}

investService.prototype.doDivest = function(address,amount,callback){
    liskApi.sendTransaction(config.investAccount.secret,address,config.investAccount.publicKey,amount,callback);
}

module.exports = new investService();