var liskApi = require('./liskApi.js');
var config = require('config');
var crypto = require('crypto');

function betService(){

}

 function newlucky(serverKey, clientKey, rand) {
     var hmac = crypto.createHmac('sha512', serverKey);
     var hexstring = hmac.update(clientKey + ':' + rand).digest('hex');

     for (var i = 0; i < 26; i++) {
         var text = hexstring.substr(5 * i, 5); // or substring( 5*i, 5*i+5)
         var next = parseInt(text, 16) / 10000.0;
         if (next < 100.0) {
             return next;
         }
     }
     throw 'newlucky impossible to run here';
 }


 function isWin(chance, which, lucky) {
     //assert.equal('number', typeof chance);
     //assert.ok(['hi', 'lo'].indexOf(which) > -1, 'bad which');
     //assert.equal('number', typeof lucky);

     if (which == "hi") {
         if (lucky > 99.9999 - chance)
             return true;
         else
             return false;
     } else if (which == "lo") {
         if (lucky < chance)
             return true;
         else
             return false;
     } else {
         throw new Error('bad which');
     }
 }


betService.prototype.doBet = function(secret,publicKey,amount,address,which,callback){
    liskApi.sendTransaction(secret,config.walletAccount.address,publicKey,amount,function(err,data){
        var tranId = data.transactionId;
        var lucky = newlucky('fdasfsafasfasfsafas',tranId,Math.random(100,100000));

        var chance = 0;
        if(which == 'hi')
            chance = 49.9999
        else
            chance = 50.0000

        var win = isWin(chance,which,lucky);

        console.log('result:',win);

        //win = true;
        var result = {
            account:address,
            amount:amount,
            createTime:new Date().getTime(),
            lucky:lucky
        }

        if(win){
            result.result = 'Win '+amount*2+'LISK';
            callback(null,{success:true,result:result});

            //庄家转移到钱包,钱包转移给用户
            console.log('start from invest to wallet');
            liskApi.sendTransaction(config.investAccount.secret,config.walletAccount.address,config.investAccount.publicKey,amount,function(err,temp){

                amount = amount*2;
                result.result = 'Win '+amount+'LISK';

                console.log('start from wallet to user');
                liskApi.sendTransaction(config.walletAccount.secret,address,config.walletAccount.publicKey,amount,function(err,dealResult){

                   console.log('deal result',dealResult);
                });
            })


        }else{
            result.result = 'Lose '+amount+'LISK';
            callback(null,{success:true,result:result});
            console.log('start from wallet to invest');

            //liskApi.getAccountInfo(config.investAccount.secret,function(err,oldData){
            //    console.log('old data:',oldData);

                liskApi.sendTransaction(config.walletAccount.secret,config.investAccount.address,config.walletAccount.publicKey,amount,function(err,temp){
                    console.log('send result:',temp);


                    //liskApi.getAccountInfo(config.investAccount.secret,function(err,newData){
                    //   console.log('new data:',newData);
                    //});

                });

            //})


            //钱包转移给庄家
        }

        console.log('isWin:',win);


    });
}

betService.prototype.getBetHistory = function(){

}

module.exports = new betService();