/**
 * 获取最后一个交互操作
 * @export
 * @returns
 */
export default function () {
  let lastEvent;
  ['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'].forEach(eventType => {
    document.addEventListener(eventType, (event) => {
      lastEvent = event;
    }, {
      capture: true, // 捕获阶段
      passive: true // 默认不阻止默认事件
    });
  });
  return lastEvent;
}