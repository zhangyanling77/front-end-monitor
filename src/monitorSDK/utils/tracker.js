
class SendTracker {
  constructor() {
    this.url = '', // 上报路径
    this.xhr = new XMLHttpRequest;
  }
  send(data = {}) {
    console.log(data)
  }
}

export default new SendTracker();
