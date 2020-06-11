## 1 为什么要做前端监控

- 更快的定位问题和解决问题

- 做产品决策的依据

- 为业务扩展提供更多可能性

## 2 前端监控的目标

### 2.1 稳定性（stability）

错误名称 | 备注
:-|:-
JS错误 | JS执行错误或Promise错误
资源异常 | script、link等资源加载异常
接口错误 | ajax或fetch请求接口异常
白屏 | 页面空白

### 2.2 用户体验

错误名称 | 备注
:-|:-
加载时间 | 各个阶段的加载时间
TTFB（time to first byte）首字节时间 | 指浏览器发起第一个请求到数据返回第一个字节所消耗的时间，这个时间包含了网络请求时间
FP（first paint）首次绘制 | 它包括了任何用户自定义的背景绘制，它是将第一个像素绘制到屏幕的时刻
FCP（first content paint） 首次内容绘制 | 指浏览器将第一个DOM绘制到屏幕的时间，可以是任何文本、图像、SVG等的时间
FMP（first meaningful paint） 首次有意义绘制 | 指页面可用性的量度标准
FID（firt input delay）首次输入延迟 | 用户首次和页面交互到页面响应交互的时间
卡顿 | 超过50ms的长任务

### 2.3 业务

错误名称 | 备注
:-|:-
PV | page view 即页面的浏览量或点击量
UV | 指访问某个站点的不同IP地址的人数
页面的停留时间 | 用户在每一个页面停留的时间

## 3 前端监控流程

- 数据上报

- 分析和计算 将采集到的数据进行加工汇总

- 可视化展示 将数据按照各种维度进行展示

- 监控报警 发现问题后按一定的条件触发报警

### 3.1 前端埋点

#### 3.1.1 代码埋点

- 代码埋点，是以嵌入代码的形式进行埋点，比如需要监控用户的点击事件，会在用户点击的地方插入一段代码，保存这个监听行为或者直接监听行为以某种数据格式直接传递给服务器

- 优点是可以在任意时刻，精确的发送或保存所需要的数据信息

- 缺点是工作量比较大

#### 3.1.2 可视化埋点

- 通过可视化交互的手段，代替代码埋点

- 将业务代码和埋点代码分离，提供一个可视化的界面，输入业务代码，通过可视化系统，可以在业务代码中自定义的增加埋点事件等，最后输出的代码耦合了业务代码和埋点代码

- 即用系统来替代手工插入埋点代码

#### 3.1.3 无痕埋点

- 前端的任意一个事件都被绑定一个标识，所有的事件都被记录

- 通过定期上传记录文件，配合文件解析，解析出我们要的数据，并生成可视化报告供专业人员分析

- 无痕埋点的优点是采集全量数据，不会出现漏埋和误埋的情况

- 缺点是给数据传输和服务器增加了压力，并且也无法灵活的定制数据结构

## 4 编写监控采集脚本

### 4.1 开通日志服务

阿里云 Log Service

### 4.2 监控错误

#### 4.2.1 错误分类

#### 4.2.2 数据模型

#### 4.2.3 实现

### 4.3 接口异常

### 4.4 白屏

#### 4.4.1 建模

#### 4.4.2 实现

属性 | 说明
:-|:-
screen | 返回当前window的screen对象，包含当前渲染窗口中和屏幕有关的属性
innerWidth | 只读的window属性，返回以像素为单位的窗口的内部高度
innerHeight | 窗口的内部高度（布局视口）的高度
elementsFromPoint | 方法可以获取到当前视口内指定坐标处，由里到外排列的所有元素

### 4.5 加载时间

Performance Timing

DOMContentLoaded

FMP

#### 4.5.1 阶段含义

字段 | 含义
:-|:-
navigationStart | 初始化页面，在同一个浏览器上下文中前一个页面unload的时间戳 如果没有前一个页面unload则与`fetchStart`值相等
redirectStart | 第一个HTTP重定向发生的时间 有跳转且是同域重定向，否则默认为0
redirectEnd | 最后一个重定向完成的时间 默认为0
fetchStart | 浏览器准备好使用http请求获取文档的时间 这个发生在检查缓存之前
domainLookUpStart | DNS域名开始查询的时间 如果有本地的缓存或keep-alive，则时间为0
domainLookUpEnd | DNS域名结束查询的时间
connectStart | TCP开始建立连接的时间，如果是持久连接，则与`fetchStart`值相等
secureConnectionStart | https连接开始的时间，如果不是安全连接默认为0
connectEnd | TCP完成握手的时间 如果是持久连接则与`fetchStart`值相等
requestStart | HTTP请求读取真实文档开始的时间 包括从本地缓存读取
requestEnd | HTTP请求读取真实文档结束的时间 包括从本地缓存读取
responseStart | 返回浏览器从服务器收到（或从本地缓存读取）第一个字节时的Unix毫秒时间戳
responseEnd | 返回浏览器从服务器收到（或从本地缓存读取，或从本地资源读取）最后一个字节时的Unix毫秒时间戳
unloadEventStart | 前一个页面的unload的时间戳 如果没有默认为0
unloadEventEnd | 与 `unloadEventStart` 相对应，返回的是unload函数执行完成的时间戳
domLoading | 返回当前网页DOM结构开始解析时的时间戳，此时 document.readyState 变为 loading，并将抛出 readyStateChange 事件
domInteractive | 返回当前网页DOM结构结束解析、开始加载内嵌资源时的时间戳 document.readyState 变为 interactive，并将抛出 readyStateChange 事件（注意只是DOM树解析完成，这时候并没有开始加载网页内的资源）
domContentLoadedEventStart | 网页domContentLoaded事件发生的时间
domContentLoadedEventEnd | 网页domContentLoaded事件脚本执行完毕的时间，domReady的时间
domComplete | DOM树解析完成，且资源也准备就绪的时间 document.readyState 变成 complete，并将抛出 readyStateChange 事件
loadEventStart | load事件发送给文档，即load回调函数开始执行的时间
loadEventEnd | load回调函数执行完成的时间

#### 4.5.2 阶段计算

字段 | 描述 | 计算方式
:-|:-|:-
unload | 前一个页面卸载耗时 | unloadEventEnd - unloadEventStart
redirect | 重定向耗时 | redirectEnd - redirectStart
appCache | 缓存读取耗时 | domainLookUpStart - fetchStart
dns | DNS解析耗时（可观察域名解析服务是否正常） | domainLookUpEnd - domainLookUpStart
tcp | TCP连接耗时 | connectEnd - connectStart
ssl | SSL安全连接耗时 | connectEnd - secureConnectionStart
ttfb | TTFB网络请求耗时（页面发出请求到收到应答数据首字节所花费的毫秒数） | responseStart - requestStart
response | 响应数据传输耗时，可观察网络是否正常 | responseEnd - responseStart
dom | DOM解析耗时，观察DOM结构是否合理，是否有JS阻塞页面解析 | domInteractive - responseEnd
dcl | DOMContentLoaded事件耗时 | domContentLoadedEventEnd - domContentLoadedEventStart
resources | 资源加载耗时，可观察文档流是否过大 | domComplete - domContentLoadedEventEnd
domReady | DOM阶段渲染耗时，DOM树和页面资源加载完成时间，会触发 DOMContentLoaded 事件 | domContentLoadedEventEnd - fetchStart
首次渲染耗时 | 加载文档到看到第一帧非空图像的时间，也叫白屏时间 | responseEnd - fetchStart
首次可交互时间 | DOM树解析完成时间，此时document.readyState 为interactive | domInteractive - fetchStart
首包耗时时间 | DNS解析到响应返回给浏览器第一个字节的时间 | responseStart - domainLookUpStart
页面完全加载时间 | 页面完全加载时间 | loadEventStart - fetchStart
onLoad | onLoad事件耗时 | loadEventEnd - loadEventStart

### 4.6 性能指标

PerformanceObserver.observe 方法用于观察传入的参数中指定的性能条目类型的集合。当记录一个指定类型的性能条目时，性能监测对象的回调函数将会被调用

entryType

paint-timing

event-timing

LCP

FMP

time-to-interactive

字段 | 描述 | 备注
:-|:-|:-
FP | First Paint（首次绘制）| 包括了任何用户自定义的背景绘制，它是首先将像素绘制到屏幕的时刻
FCP | First Content Paint（首次内容绘制）| 时浏览器将第一个DOM渲染到屏幕的时间，可能时文本、图像、SVG等，其实就是白屏时间
FMP | First Meaningful Paint（首次有意义绘制）| 页面有意义的内容渲染的时间
LCP | Largest Contentful Paint（最大内容渲染）| 代表在 viewpoint 中最大的页面元素加载的时间
DCL | DOMContentLoaded（DOM加载完成时间）| 当HTML文档被完全加载和解析完成后，DOMContentLoaded事件被触发，无需等待样式、图像和自框架完成加载
L | onLoad | 当依赖的资源全部加载完毕后触发
TTI | Time to Interactive （可交互时间）| 用于标记应用已经进行视觉渲染并能可靠响应用户输入的时间点
FID | First Input Delay（首次输入延迟）| 用户首次和页面交互（点击链接、点击按钮等）到页面响应交互的时间

## 5 查询报表
