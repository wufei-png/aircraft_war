# bytedance final 作业 飞机大战\_原生 js（杨健老师的游戏选项）

- github pages https://wufei-png.github.io/aircraft_war/

- 核心是使用 function 构建飞机道具等对象,游戏完成后查了下 canvas 的用法，发现要改成 canvas 要该很多代码,因此作罢，不过可以描述下：

  - canvas 关键用法在于 test.html 中的鼠标移动(onmouseup,计划使用鼠标来控制飞机), 以及 clearRect,drawImage 的使用来实现图像(飞机)的移动,只需要对一个 dom 对象(canvas)操作,确实会简便些。
    不过这个游戏并不复杂，因此代码量应该差距不大(这也是开始写的时候没用 canvas 的原因)。

- 玩法介绍：

  - 打开 index.html
  - 方向键移动，空格射击
  - 无敌: 不受伤害以及撞击可破坏敌机。
  - 双倍子弹: 无需解释。
  - 小青蛙: 变成小蛙蛙。
  - 排行榜,本意是设计为超过最高分写入 json 文件,下次开启游戏读取值,但是 js 不太支持写入本地文件,因此设为固定值。
  - 使用 less 转成 css.
  - 因为屏幕里的东西不会有很多，所以碰撞检测算法选择了一个实现上比较容易的 O(N^2) 复杂度的嵌套循环.
  - 碰撞发生时，会通过事件处理函数告知发生碰撞的实体做出对应行为.
- 疑问：

  - 138 行：
  - setTimeout(function(){
    bigPlaneTimer = setInterval(createBigPlane,3000);
    },3000);
    不能通过 clearInterval 停止,具体表现为暂停后依旧在顶部产生道具,将其改为不是延迟一段时间再产生道具后成功 clearInterval,也即代码为
    : bigPlaneTimer = setInterval(createBigPlane,3000);

    直觉上是由于闭包问题,bigPlaneTimer 存在两份,一份在闭包中,一份位于全局变量。不知是否正确？

- 小 bug:
  - 变成青蛙后我更改了 width,height,使其更小,时间到了后变成正常大小,而且变成正常大小是和更改为正常本机图像代码在一起的(672 行左右),但是当玩家变成青蛙后频率很高的按下空格,会出现本机大小也变小的情况,个人猜测是由于虽然代码在一起，但是 setinterval 播放音乐，音乐持续 1s，这段时间就是 bug 的时间了，执行了变为图像没有执行更改图像大小的代码。侧面说明代码的串行性质。
