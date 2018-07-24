// 将字节转换为合适的格式
function bitConvert(limit){
    let size = "";
    if( limit < 0.1 * 1024 ){ //如果小于0.1KB转化成B
        size = limit.toFixed(2) + "B";
    }else if(limit < 0.1 * 1024 * 1024 ){//如果小于0.1MB转化成KB
        size = (limit / 1024).toFixed(2) + "KB";
    }else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + "MB";
    }else{ //其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }

    let sizestr = size + "";
    let len = sizestr.indexOf("\.");
    let dec = sizestr.substr(len + 1, 2);
    if(dec === "00"){//当小数点后为00时 去掉小数部分
        return sizestr.substring(0,len) + sizestr.substr(len + 3,2);
    }
    return sizestr;
}

function getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
}

// 日期格式化
function dateFormatter(str){//默认返回yyyy-MM-dd HH-mm-ss
    var hasTime = arguments[1] != false ? true : false;//可传第二个参数false，返回yyyy-MM-dd
    var d = new Date(str);
    var year = d.getFullYear();
    var month = (d.getMonth()+1)<10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
    var day = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
    var hour = d.getHours()<10 ? '0'+d.getHours() : d.getHours();
    var minute = d.getMinutes()<10 ? '0'+d.getMinutes() : d.getMinutes();
    var second = d.getSeconds()<10 ? '0'+d.getSeconds() : d.getSeconds();
    if(hasTime){
        return [year, month, day].join('-') + " " + [hour, minute, second].join(':');
    }else{
        return [year, month, day].join('-');
    }
}

// JSON美化
function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

//形如：{\"80\":[{\"HostIp\":\"0.0.0.0\",\"HostPort\":\"14752\"}]}
function formatPort1(port) {
    if(port === null || port === "") {
        return null;
    }

    port = port.toString().replace("\\", "");
    port = eval('(' + port + ')');

    let resArry = new Array();
    for (let key in port) {
        let value = port[key][0].HostPort;
        resArry.push(value + ":" + key);
    }
    return resArry.join(",");
}

// 形如：{\"80\":32111}
function formatPort2(port) {
    if(port === null || port === "") {
        return port;
    }
    let foo = port.toString().replace("\\","").replace("{","").replace("}","").replace("\"","").replace("\"","");
    let arr = foo.split(":");
    arr.reverse();
    return arr.join(":");
}
