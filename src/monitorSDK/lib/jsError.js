
import getLastEvent from '../utils/getLastEvent';
import getSelector from '../utils/getSelector';
import tracker from '../utils/tracker';

function getLines(stack) {
  return stack.split('\n').slice(1).map(item => item.replace(/^\s+at\s+/g, "")).join('^');
}

export function injectJsError() {
    // 监听全局未捕获的错误
    window.addEventListener('error', function (event) { // 错误事件对象
      console.log('event', event) 
      let lastEvent = getLastEvent(); // 最后一个交互事件  
      console.log('lastEvent', lastEvent)
      // 脚本加载错误
      tracker.send({
        kind: 'stability',
        type: 'error',
        errorType: 'jsError', // JS执行错误
        message: event.message, // 报错信息
        filename: event.filename,
        position: `${event.lineno}:${event.colno}`, // 出错的行和列
        stack: getLines(event.error.stack),
        selector: lastEvent ? getSelector(lastEvent.path) : ''
      })
    }, true);
}
