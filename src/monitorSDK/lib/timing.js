import tracker from '../utils/tracker';
import onload from '../utils/onload';

export function timing() {
  onload(function() {
    setTimeout(function() {
      const {
        fetchStart,
        connectStart,
        connectEnd,
        requestStart,
        responseStart,
        responseEnd,
        domLoading,
        domInteractive,
        domContentLoadedEventStart,
        domContentLoadedEventEnd,
        loadEventStart
      } = performance.timing;
      tracker.send({
        kind: 'experience', // 用户体验
        type: 'timing', // 统计每个阶段的时间
        connectTime: connectEnd - connectStart, // 连接时间
        ttfbTime: responseEnd - requestStart, // 首字节到达时间
        responseTime: responseEnd - responseStart, // 响应的读取时间
        parseDOMTime: loadEventStart - domLoading, // DOM解析时间
        domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart, // 
        timeToInteractive: domInteractive - fetchStart, // 首次DOM可交互时间
        loadTime: loadEventStart - fetchStart, // 完整的加载时间
      })
    }, 3000)
  })
}
