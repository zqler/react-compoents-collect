import "whatwg-fetch";
import 'babel-polyfill';
import Alert from "../../components/alert/alert.jsx";

module.exports = {
    msgAlert(msg){//消息提示弹框
        Alert.showMsg({
            msg:msg,
            timeout:20,
            fade:true
        })
    },
    isEmptyObj(obj){//判断一个对象是否为空
        let arr = Object.keys(obj);
        if(arr.length==0){return true}
        else {return false}
    },
    fetchHandler(payload){//fetch请求封装
        let _this=this;
        function setOptions(payload){
            if(!payload.headers){
                payload.headers = {
                    'Content-Type': 'application/json;charset=utf-8'
                };
            }
            let body = payload.body||{},
                options = {
                    url: payload.url,
                    method: payload.type || 'post',
                    credentials: 'include',
                    headers:payload.headers,
                    body:(payload.type=="get" ||payload.type=="head")?undefined:JSON.stringify(body)
                };
            return options
        }
        function checkStatus(response){
            if (response.status >= 200 && response.status < 300) {
                return response
            } else {
                _this.msgAlert(response.statusText);
                let error = new Error(response.statusText);
                error.response = response;
                throw error
            }
        }
        function parseJSON(response) {
            return response.json()
        }
        const options = setOptions(payload);
        return fetch(options.url,options)
            .then(checkStatus)
            .then(parseJSON)
            .then((data)=>{
                if(!data.success){
                    if(payload.error){
                        payload.error(data);
                        return false;
                    }
                    if(data.errorMsg){
                        // 显示错误信息
                        _this.msgAlert(data.errorMsg)
                    }
                    return false
                }
                else {
                    payload.success(data.result)
                }
            }).catch((error)=>{
                if(payload.catchCbk){
                    payload.catchCbk(error)
                }
                console.log('request failed',error);
            })
    }
};