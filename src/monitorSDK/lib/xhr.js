import tracker from '../utils/tracker';

export function injectXHR() {
  let XMLHttpRequest = window.XMLHttpRequest;
  // 缓存老的open方法,并重写该方法
  const oldOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, async) {
    // 日志上报 和 websocket 不发送
    if (!url.match(/logstores/) && !url.match(/sockjs/)) {
      this.logData = {
        method,
        url,
        async
      }
    }
    return oldOpen.apply(this, arguments)
  }
  const oldSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(body) {
    if (this.logData) {
      // 已经被拦截过了
      const startTime = Date.now();
      const handler = type => event => {
        const duration = Date.now() - startTime;
        const status = this.status; // 200 500
        const statusText = this.statusText; // OK / Server Error
        tracker.send({
          kind: 'stability',
          type: 'xhr',
          errorType: type, // load / error / abort
          pathname: this.logData.url, // 请求路径
          status: `${status} ${statusText}`,
          duration, // 持续时间
          response: this.response ? JSON.stringify(this.response) : '', // 响应体
          params: body || '' // 参数
        })
      }
      this.addEventListener('load', handler('load'), false);
      this.addEventListener('error', handler('error'), false);
      this.addEventListener('abort', handler('abort'), false);
    }
    return oldSend.apply(this, arguments)
  }
}
