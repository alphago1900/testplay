var Hapi = require('hapi');
var liskApi = require('./liskApi.js');
var investService = require('./investService.js');
var betService = require('./betService.js');
var config = require('config');
var server = new Hapi.Server();



//liskApi.getAccountInfo(config.investAccount.secret,function(err,data){
//   console.log(data);
//});
//
//return;

var listen = {"port":3000};

server.connection(listen);

var io = require("socket.io")(server.listener)

var ioHandler = function (socket) {
    socket.emit("welcome", {
        message: "Hello from Hapi!",
        version: Hapi.version
    })


    var doBetHandler = function(data) {

        betService.doBet(data.secret,data.publicKey,data.amount,data.address,data.which,function(err,data){
            console.log('send emit');
            io.sockets.emit('play/bet',data);
        })
    }


    var loopSummary = function(){
        investService.getInvestSummary(function(err,data){
            io.sockets.emit('play/summary',data);
            loopSummary();
        })
    }

    loopSummary();

    var queryAccountInfo = function(data){
        liskApi.getAccountInfo(data.secret,function(err,data){
            socket.emit('play/accountInfo',data);
        })
    }

    socket.on("play/doBet", doBetHandler)
    socket.on('play/queryAccountInfo',queryAccountInfo);
}

io.on("connection", ioHandler)


server.register(require('inert'), function(err) {

    server.route({
        method:'GET',
        path:'/api/accountInfo',
        handler:function(request,reply){
            //var secret = 'faculty disagree thumb bar outside obscure another adapt sponsor prefer retreat potato';
            var secret = request.query.secret;
            liskApi.getAccountInfo(secret,function(err,data){
                reply(data);
            })
        }
    });

    server.route({
        method:'GET',
        path:'/api/investSummary',
        handler:function(request,reply){
            investService.getInvestSummary(function(err,data){
                reply(data);
            })
        }
    })

    server.route({
        method:'POST',
        path:'/api/doInvest',
        handler:function(request,reply){
            investService.doInvest(request.payload.secret,request.payload.publicKey,request.payload.amount,function(err,data){
               reply(data);
            });
        }
    })

    server.route({
        method:'POST',
        path:'/api/doBet',
        handler:function(request,reply){
            betService.doBet(request.payload.secret,request.payload.publicKey,request.payload.amount,request.payload.address,request.payload.which,function(err,data){
                reply(data);
            })
        }
    })

    server.route({
        method:'POST',
        path:'/api/doDivest',
        handler:function(request,reply){
            investService.doDivest(request.payload.address,request.payload.amount,function(err,data){
               reply(data);
            });
        }

    })

    //
    //server.route({
    //    method:'POST',
    //    path:'/api/validate',
    //    handler:function(request,reply){
    //        geetest.validate({
    //
    //            challenge: request.payload.geetest_challenge,
    //            validate: request.payload.geetest_validate,
    //            seccode: request.payload.geetest_seccode
    //
    //        }, function (err, result) {
    //
    //            var data = {status: "success"};
    //            console.log('err:',err);
    //            console.log('result:',result);
    //            if (err || !result) {
    //
    //                data.status = "fail";
    //            }
    //
    //            reply(JSON.stringify(data));
    //
    //        });
    //    }
    //
    //});




    server.route({
        method:'GET',
        path:'/{path*}',
        handler:function(req,reply){
            var reqPath = req.path;

            if(reqPath.indexOf('/agent/')>-1){
                if(reqPath[reqPath.length-1] == '/')
                    reqPath += 'index.html';
                else if(reqPath.indexOf('.') == -1)
                    reqPath += '/index.html';
            }

            if(reqPath.indexOf('.') == -1)
                reply.file(__dirname+'/index.html');
            else
                reply.file(__dirname+''+reqPath);


        }
    });



    server.start(function (err) {
        console.log('info', 'Server running at: ' + server.info.uri);
    });

});






return;

var config = require('config');



var liskApi = require('./liskApi.js');
var investService = require('./investService.js');

var account = {
    playerAccount:{
        secret:'faculty disagree thumb bar outside obscure another adapt sponsor prefer retreat potato',
        address:'4083732982828682929L'
    },
    investAccount:{
        secret:'blanket boring cover beyond retire uncover observe curious siren harsh noodle shed',
        address:'10469781448665495813L'
    },
    walletAccount:{
        secret:'neck improve melody loud neutral attract assault catch near drum cake arctic',
        address:'6769758546332969022L'
    }
}



var r = require('request');
// http://47.90.8.82/api/delegates/voters?publicKey=49b42522830b9c25eadfae63988df92370716760b1d10a90e4118d711fea7392
var url = 'http://47.90.8.82/api/delegates/voters?publicKey=bd2515b738dd1f2b7ad80dceb1f26002e442aa27774550f1e9c67bed7c2add0d'

// console.log('537 monitor starting...');
var crypto = require('crypto');
var last = 0;
var change = 0;

var url = 'https://login.lisk.io/api/accounts/delegates';

var baseUrl = 'https://login.lisk.io';
var banker = '12685348632358650202L'
var accountInfoUrl = baseUrl+'/api/accounts/open'
var transactionUrl = baseUrl+'/api/transactions';

// var outputTransaction = baseUrl+'/api/transactions?recipientId='+banker;
var investTransaction = baseUrl +'/api/transactions?recipientId='+account.investAccount.address;

investService.doDivest()

//investService.doInvest(account.playerAccount.secret,account.playerAccount.publicKey,5000000000,function(err,data){
//   console.log(data);
//});

return;

liskApi.getAccountInfo(config.investAccount.secret,function(err,data){
   console.log(data);



    //liskApi.sendTransaction(config.investAccount.secret,account.playerAccount.address,config.investAccount.publicKey,10,function(err,data){
    //    console.log(data);
    //});

});




return;
investService.getInvestHistory(function(err,data){
   console.log(data);
});

//liskApi.getAccountInfo(account.playerAccount.secret,function(err,data){
//
//    console.log(data);
//
//});

return;

//address1，庄家资金池，余额作为庄家资产
//address2，系统钱包。
//address1 流入address2的币，作为庄家亏损，address2流入address1的币，作为庄家盈利，实时发生



//庄家总资金=地址流入+地址流出

//固定地址流入作为利润
//固定地址流出作为亏损

//12685348632358650202L

// console.log(inputTransaction);

liskApi.getTransactionsBySenderId(account.playerAccount.address,function(err,data){

    var inputAmount = 0;
    data.transactions.forEach(function(tran){
        inputAmount += tran.amount;
    });

    console.log(inputAmount);
})


    


return;


// function newlucky(serverKey, clientKey, rand) {
//     var hmac = crypto.createHmac('sha512', serverKey);
//     var hexstring = hmac.update(clientKey + ':' + rand).digest('hex');

//     for (var i = 0; i < 26; i++) {
//         var text = hexstring.substr(5 * i, 5); // or substring( 5*i, 5*i+5)
//         var next = parseInt(text, 16) / 10000.0;
//         if (next < 100.0) {
//             return next;
//         }
//     }
//     throw 'newlucky impossible to run here';
// }

// var lucky = newlucky('fdasfsafasfasfsafas','fdasfasfa1e12312312fdsaf',1231231231);
// console.log(lucky);

// *
//  * 判断输赢
//  * @param  {[type]}  chance [description]
//  * @param  {[type]}  which  [description]
//  * @param  {[type]}  lucky  [description]
//  * @return {Boolean}        [description]
 
// function isWin(chance, which, lucky) {
//     assert.equal('number', typeof chance);
//     assert.ok(['hi', 'lo'].indexOf(which) > -1, 'bad which');
//     assert.equal('number', typeof lucky);

//     if (which == "hi") {
//         if (lucky > 99.9999 - chance)
//             return true;
//         else
//             return false;
//     } else if (which == "lo") {
//         if (lucky < chance)
//             return true;
//         else
//             return false;
//     } else {
//         throw new Error('bad which');
//     }
// }


// return;

// var json = {secret:'5418896',delegates:['+bd2515b738dd1f2b7ad80dceb1f26002e442aa27774550f1e9c67bed7c2add0d']};

// r({ url: accountInfoUrl, method: 'POST', form: {secret:'faculty disagree thumb bar outside obscure another adapt sponsor prefer retreat potato'}}, function(err,data){
//         console.log(err);
//         var info = JSON.parse(data.body);
        
//         console.log(info.account.address);
//         console.log(info.account.balance);
//         console.log(info.account.publicKey);
//         console.log(info.account.username);
//         console.log(info.account);
//         // vote();
// });

// return;

var sendTransactionUrl = baseUrl+'/api/transactions';

var secret = 'faculty disagree thumb bar outside obscure another adapt sponsor prefer retreat potato'

var recAddress='4083732982828682929L';
var json = {secret:account.playerAccount.secret,amount:50,recipientId:account.investAccount.address,publicKey:'3dde5695b93e60fa593b9a57b62116c69dc08a0c628fd9fed37a63cc6d0e79c4'};
r({url:sendTransactionUrl,method:'PUT',json:json},function(err,data){
    console.log(err);
    console.log(data.body);
});


return;


function vote(){


    var temp = parseInt(current);
    temp++;
    // json.secret = temp+'';
    var json = {secret:temp+'',delegates:['+bd2515b738dd1f2b7ad80dceb1f26002e442aa27774550f1e9c67bed7c2add0d']};
    
    current = temp;
    console.log(json);
    console.log('user '+json.secret+' start vote');

    r({ url: url, method: 'PUT', json: json}, function(err,data){
        console.log(data.body);
        vote();
    });
}

vote()

// r.put(url, json:json, function(err,data){
//     console.log(data);
// });

// function call(){

//     r.get(url,function(err,data){
//         var balance = 0
//         var json = JSON.parse(data.body);
        
//         json.accounts.forEach(function(account){
//             balance += account.balance;
//         });

//         // console.log('banalce:',balance);
//         var balance = balance/100000000

//         if(balance!=last){
//             change = balance - last;
//             last = balance;
//         }

//         console.log('balance:'+balance);


//         setTimeout(call,1000);
//     });

// }

// call();



