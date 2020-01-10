import originJSONP from 'jsonp'
export default function jsonp(url,data,option){
    url+=(url.indexOf('?')<0?'?':'')+param(data)
    return new Promise((resolve,reject)=>{
        originJSONP(url,option,(err,data)=>{
            if(!err){
                resolve(data)
            }else{
                reject(err)
            }
        })
    })
}
//拼接路由参数，data是一个对象，拼接成a=1&b=2&c=3这样。
function param(data){
    let url=""
    for(var k in data){
        let value=data[k]!==undefined?data[k]:'' 
        url+=`&${k}=${encodeURIComponent(value)}`
    }
    return url?url.substring(1):'' //使用substring()删掉第一个&
}