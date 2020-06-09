
import getLastEvent from '../utils/getLastEvent';
import getSelector from '../utils/getSelector';
import tracker from '../utils/tracker';

function getLines(stack) {
  if (!stack) {
    return '';
  }
  return stack.split('\n').slice(1).map(item => item.replace(/^\s+at\s+/g, "")).join('^');
}

export function injectJsError() {
  // 监听全局未捕获的错误
  window.addEventListener('error', function(event) { // 错误事件对象
    console.log('event', event) 
    let lastEvent = getLastEvent(); // 最后一个交互事件  
    console.log('lastEvent', lastEvent)
    // 说明是脚本资源加载错误 (如script, link等)
    if (event.target && (event.target.src || event.target.href)) {
      tracker.send({
        kind: 'stability',
        type: 'error',
        errorType: 'resourceError', // js或css资源加载错误
        filename: event.target.src || event.target.href,
        tagName: event.target.tagName,
        selector: getSelector(event.target)
      })
    } else {
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
    }  
  }, true);
  // 当Promise被reject且没有reject处理器的时候，会触发unhandledrejection事件
  // 这可能发生在window下，也可能发生在Worker中，对于调试回退错误处理很有用
  window.addEventListener('unhandledrejection', function(event) {
    // console.log(event)
    let lastEvent = getLastEvent();
    let message = '', filename = '', lineno = 0, colno = 0, stack = '';
    const reason = event.reason;
    if (typeof reason === 'string') {
      message = reason
    } else if (typeof reason === 'object') {
      if (reason.stack) {
         const matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
         filename = matchResult[1]
         lineno = matchResult[2]
         colno = matchResult[3]
         stack = getLines(reason.stack)
      }   
      message =  reason.message 
    }
    tracker.send({
      kind: 'stability',
      type: 'error',
      errorType: 'promiseError',
      message,
      filename,
      position: `${lineno}:${colno}`,
      stack,
      selector: lastEvent ? getSelector(lastEvent.path) : ''
    })
  }, true);
}
