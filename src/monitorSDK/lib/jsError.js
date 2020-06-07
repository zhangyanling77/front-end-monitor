
import getLastEvent from '../utils/getLastEvent';
import getSelector from '../utils/getSelector';

export function injectJsError() {
    let lastEvent = getLastEvent(); // 最后一个交互事件
    window.addEventListener('error', function (event) { // 错误事件对象
      // 脚本加载错误
      if (event.target && (event.target.src || event.target.href)) {
        let log = {
          kind: 'stability', // 监控指标的大类，稳定性
          type: 'error', // 小类型 这是一个错误
          errorType: 'resourceError', // js或css资源加载错误
          filename: event.target.src || event.target.href, // 表示是哪个文件报错
          tagName: event.target.tagName, // SCRIPT
          selector: getSelector(event.target) // 代表最后一个操作的元素
        }
        console.log('>>>>>', log)
      } else {
        let log = {
          kind: 'stability',
          type: 'error',
          errorType: 'jsError', // JS执行错误
          message: event.message, // 报错信息
          filename: event.filename,
          position: `${event.lineno}:${event.colno}`, // 出错的行和列
          stack: getLines(event.error.stack),
          selector: lastEvent ? getSelector(lastEvent.path) : ''
        }
        console.log('>>>>>', log)
      }
    }, true);

    function getLines(stack) {
        return stack.split('\n').slice(1).map(item => item.replace(/^\s+at\s+/g, "")).join('^');
    }
}