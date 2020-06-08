const userAgent = require('user-agent');

const endpoint = 'cn-chengdu.log.aliyuncs.com'; // 域名
const project = 'zylmonitor'; // 项目名称
const logstoreName = 'zylmonitor-store'; // store的名称

function getExtraData() {
  return {
    title: document.title,
    url: location.href,
    timestamp: Date.now(),
    userAgent: userAgent.parse(navigator.userAgent).fullName
  }
}
class SendTracker {
  constructor() {
    this.url = `//${project}.${endpoint}/logstores/${logstoreName}/track`, // 上报路径
    this.xhr = new XMLHttpRequest;
  }
  send(data = {}) {
    let log = { ...getExtraData(), ...data };
    // 对象的值不能是数字，需要转字符串
    for (let key in log) {
      if (typeof log[key] === 'number') {
        log[key] = `${log[key]}`;
      }
    }
    console.log('log: ', log)
    // 接口定义的 request body格式
    let body = JSON.stringify({
      __logs__: [log]
    });
    this.xhr.open('POST', this.url, true);
    this.xhr.setRequestHeader('Content-Type', 'application/json'); // 请求体类型
    this.xhr.setRequestHeader('x-log-apiversion', '0.6.0'); // 版本号
    this.xhr.setRequestHeader('x-log-bodyrawsize', body.length); // 请求体大小
    this.xhr.onload = function(response) {
      console.log(response)
    }
    this.xhr.onerror = function(error) {
      console.log(error)
    }
    this.xhr.send(body)
  }
}

export default new SendTracker();
