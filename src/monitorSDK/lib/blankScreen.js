import tracker from '../utils/tracker';
import onload from '../utils/onload';

function getSelector(element) {
  if (element.id) {
    return '#' + element.id;
  } else if (element.className) { // 考虑多个类名的情况
    return '.' + element.className.split(' ').filter(item => !!item).join('.');
  } else {
    return element.nodeName.toLowerCase();
  }
}

export function blankScreen() {
  const REFERENCE_POINTS = 9; // 参考点个数
  const MAX_BLANK_POINTS = 14; // 最大空白点数
  const wrapperElemnts = ['html', 'body', '#container', '.content'];
  let emptyPoints = 0;
  function isWrapper(element) {
    const selector = getSelector(element);
    if (wrapperElemnts.indexOf(selector) != -1) {
      emptyPoints++;
    }
  }
  // 因为脚本inject到了head，所以检测白屏需要等onload完成
  onload(function() {
    for (let i = 1; i <= REFERENCE_POINTS; i++) {
      let xElements = document.elementsFromPoint(window.innerWidth * i / 10, window.innerHeight / 2);
      let yElements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight * i / 10);
      isWrapper(xElements[0]);
      isWrapper(yElements[0]);
    }

    if (emptyPoints > MAX_BLANK_POINTS) {
      const centerElements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      tracker.send({
        kind: 'stability',
        type: 'blank',
        emptyPoints,
        screen: window.screen.width + ' X ' + window.screen.height,
        viewPoint: window.innerWidth + ' X ' + window.innerHeight,
        selector: getSelector(centerElements[0])
      })
    }
  })
}
