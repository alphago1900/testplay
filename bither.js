var r = require('request');
// var url = 'https://service.bitpie.com/api/v1/agent/address/next';
var url = 'https://bitpie.getcai.com/api/v1/agent/address/next';

var options = {
  url: url,
  headers: {
    'Token': '79298cc4ab454a9447f27486256ef65f03984c836d269661fd418b4ba47aa083'
  }
};

//1NKGcgnnHdV87mZNYk7PX7rHCBPx5yCjH4
//9ed118edbff7925b7f1ea165fa33e0b89c69376ff89398f8d86ef71d9ecb0f8a
// 19EE8ZXn9RBecgxGkKmw8SShRoaZvkaTwg
var address = '1DSwXeEt5Mz2rq3HtGHoo8RDnRNntReTw1';
// var address = '19EE8ZXn9RBecgxGkKmw8SShRoaZvkaTwg';

var query = {
    url:'https://service.bitpie.com/api/v1/tx',
    headers: {
    'Token': '79298cc4ab454a9447f27486256ef65f03984c836d269661fd418b4ba47aa083'
  }
}

r.get(query,function(err,data){
    console.log(data.body);
});