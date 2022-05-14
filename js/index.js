window.onload = function(){
    /* 
        本机大小 100*100
        默认敌机为 69*90
    */
    var mainObj=document.getElementById('main');
    var smallPlaneArray = [];//小飞机数组 超出屏幕remove掉
    var bigPlaneArray = [];//大飞机数组
    var speedArray = [];//加速数组
    var protectArray = [];//无敌数组
    var frogArray = [];//青蛙数组
    var bulletArray = []; //子弹数组
    var double_flag=0;
    var protect_flag=0;
    var frog_flag=0;
    var double_flag_timer='';
    var protect_flag_timer='';
    var frog_flag_timer='';
    //按键开关
    var upBtn = false;
    var leftBtn = false;
    var rightBtn = false;
    var downBtn = false;
    //杀敌数
    var killNum = document.getElementById('killNum');
    //杀敌分数
    var killScore = document.getElementById('killScore');
    //杀敌数
    var killNum_page = document.getElementById('enemy_num');
    //杀敌分数
    var killScore_page = document.getElementById('score');

    var player =new playerPlaneProto("./img/本机.png",50,500,10);//玩家飞机的创建
    player.imgNode.style.height='100px';
    player.imgNode.style.width='100px';
    // console.log('player.imgNode.style.height',player.imgNode.height);128
    // console.log('player.imgNode.style.width',player.imgNode.width);
    var planeMoveTimer = '';//小飞机移动

    var smallPlaneTimer = '';//创建小飞机
    var bigPlaneTimer = '';//创建大飞机
    var speedTimer = '';//创建
    var protectTimer = '';//创建
    var frogTimer = '';//创建
    //var bigPlaneTimer_flag='';//创建大飞机flag
    var ctrlPlayTimer = '';//30毫秒监听一次 监听键盘按键
    var bulletMoveTimer = '';//子弹的移动
    var crashCheckTimer = '';//判断碰撞
    //var backgroundMusic='';//播放背景音乐
    
    var createBigPlane_flag=false;
    var check_score=()=>{
        if(parseInt(killNum_page.innerHTML)<parseInt(killNum.innerHTML)){
            killNum_page.innerHTML=parseInt(killNum.innerHTML);
        }
        if(parseInt(killScore_page.innerHTML)<parseInt(killScore.innerHTML)){
            killScore_page.innerHTML=parseInt(killScore.innerHTML);
        }

        JSON.stringify({ "杀敌": parseInt(killNum.innerHTML), "分数": parseInt(killScore.innerHTML) })
    }
var read_history=()=>{
    var Ajax = function () {
        $.getJSON("./排行榜.json", function (data) {
            // console.log('排行榜',data[0]['杀敌']);
            killScore_page.innerHTML=parseInt(data[0]['分数']);
            killNum_page.innerHTML=parseInt(data[0]['杀敌']);
            

        });
    }();

}
var startGame_audio_play=()=>{
    var audio = document.getElementById("game_music");
    audio.play();
}
var startGame_audio_pause=()=>{
    var audio = document.getElementById("game_music");
    audio.pause();
}
// var change_big_flag=function(){
//     createBigPlane_flag=true;
//     console.log('change success!');
// }
// var check_big_flag=()=>{
//     console.log('createBigPlane_flag',createBigPlane_flag);
//     if(createBigPlane_flag==true)
//         bigPlaneTimer = setInterval(createBigPlane,2000);//创建大飞机
// }
    //页面操作js
        //开始游戏bigPlaneTimer=setInterval(createBigPlane,2000)
        startGame = function(){
            read_history();
            var start = document.getElementById('start');
            start.style.display = 'none';
            start_game_timer();
            startGame_audio_play();
        }
        //暂停按钮

var clear=()=>{
    clearInterval(smallPlaneTimer);
    clearInterval(bigPlaneTimer);
    clearInterval(speedTimer);
    clearInterval(protectTimer);
    clearInterval(frogTimer);
    clearInterval(planeMoveTimer);
    clearInterval(ctrlPlayTimer);
    clearInterval(bulletMoveTimer);
    clearInterval(crashCheckTimer);
}

var start_game_timer=()=>{
    planeMoveTimer = setInterval(PlaneMove,50);//道具移动
    smallPlaneTimer = setInterval(createSmallPlane,1500);//创建小飞机
    bigPlaneTimer = setInterval(createBigPlane,3000);//创建大飞机
    console.log('开始创建加速道具!');
    speedTimer = setInterval(createDouble,5000);//创建double子弹
    console.log('开始创建无敌道具!');
    protectTimer = setInterval(createProtect,5000);;//创建无敌
    console.log('开始创建frog道具!');
    frogTimer = setInterval(createFrog,5000);//创建frog
    ctrlPlayTimer = setInterval(ctrlPlay,30);//30毫秒监听一次 监听键盘按键
    bulletMoveTimer = setInterval(bulletMove,10);//子弹的移动
    crashCheckTimer = setInterval(crashCheck,10);//判断碰撞
}
        mystopgame = function (){
            var stop=document.getElementById("stop");
            stop.style.display="block";
        clear();
            // var audio = document.getElementById("game_music");
            startGame_audio_pause();
        }
        //继续游戏
        continuegame = function(){
            var stop=document.getElementById("stop");
            stop.style.display="none";
            start_game_timer();
            startGame_audio_play();
        }
        //新的游戏or你被击毁
        newgame = function(){
            window.location.reload();
        }

    //游戏内的js    
        // 创建敌方小飞机
        /* 
            属性：
                图片节点
                图片是哪一个
                x，y的坐标
                速度
            行为：
                移动
                初始化  把图片节点添加到main内
        */
        function PlaneProto(imgSrc,x,y,speed,size){
            this.imgNode = document.createElement('img');
            this.imgSrc=imgSrc;
            this.x=x;
            this.y=y;
            this.isDead = false;//敌方飞机存活状态
            if(size==0||size==2)
                this.exTime = 30;//地方小飞机,加速 无敌道具 死亡倒计时
            else if(size==1) 
                this.exTime = 50;//地方大飞机死亡倒计时
            this.speed=speed;
            this.init=function(){
                this.imgNode.src=this.imgSrc;
                this.imgNode.style.position='absolute';
                //absolute脱离出文档流
                this.imgNode.style.left=this.x+"px";
                this.imgNode.style.top=this.y+"px";
                if(size==0||size==2)
                    this.imgNode.setAttribute('blood','1');
                else if(size==1)
                    this.imgNode.setAttribute('blood','5');
                // console.log('this.imgNode',this.imgNode)
                //div main
                mainObj.appendChild(this.imgNode)
            }
            this.init();
            //飞机移动函数
            this.move=function(){//只会往下移动
                this.imgNode.style.top = parseInt(this.imgNode.style.top)+this.speed+"px";
            }
        }

            

        //创建地方小飞机 实例化smallPlaneProto对象，并添加到smallPlaneArray数组中
        function createSmallPlane(){
        setTimeout(function(){
            var smallPlane = new PlaneProto("./img/敌机.png",parseInt(Math.random()*(400-69)),-parseInt(Math.random()*140),parseInt(Math.random()*10)+1,0);
            // var smallPlane = new smallPlaneProto("./img/敌机.png",parseInt(Math.random()*(400-69)),0,parseInt(Math.random()*10)+1);
            //y轴位置也随机一下吧
            // smallPlane.imgNode.style.width='40px';
            // console.log('小飞机的size',smallPlane.imgNode.width);
            smallPlaneArray.push(smallPlane);
        }
        ,Math.random()*1000
        );
        }
        function createBigPlane(){
            setTimeout(function(){
                var bigPlane = new PlaneProto("./img/enemy2.png",parseInt(Math.random()*(400-69)),-parseInt(Math.random()*140),parseInt(Math.random()*10)+1,1);
                // var smallPlane = new smallPlaneProto("./img/敌机.png",parseInt(Math.random()*(400-69)),0,parseInt(Math.random()*10)+1);
                //y轴位置也随机一下吧
                bigPlaneArray.push(bigPlane);
            }
            ,Math.random()*1000//确保产生东西的时间有点随机
            );

        }
        function createDouble(){
            setTimeout(function(){
                var speedup = new PlaneProto("./img/加速.png",parseInt(Math.random()*(400-69)),-parseInt(Math.random()*140),parseInt(Math.random()*10)+1,2);
                speedArray.push(speedup);
            }
            ,Math.random()*1000
            );
        }
        function createProtect(){
            setTimeout(function(){
                var protect = new PlaneProto("./img/防护.png",parseInt(Math.random()*(400-69)),-parseInt(Math.random()*140),parseInt(Math.random()*10)+1,2);
                protectArray.push(protect);
            }
            ,Math.random()*1000
            );
        }
        function createFrog(){
            setTimeout(function(){

                var frog = new PlaneProto("./img/青蛙标志.png",parseInt(Math.random()*(400-69)),-parseInt(Math.random()*140),parseInt(Math.random()*10)+1,2);
                frog.imgNode.style.width='64px';
                frog.imgNode.style.height='64px';
                // console.log('小飞机的size',frog.imgNode.width);
                frogArray.push(frog);
            }
            ,Math.random()*1000
            );
        }
        //给每一个敌方飞机调用飞机移动函数
        function move(array){
            for(var i=0;i<array.length;i++){
                //如果敌方飞机还活着
                if (array[i].isDead == false) {
                    array[i].move()
                    //判断飞机移除界面，若移除界面则移除该img标签
                    if(parseInt(array[i].imgNode.style.top)>=600){
                        //删除html中的img标签
                        mainObj.removeChild(array[i].imgNode);
                        //删除数组中的位置
                        array.splice(i,1);
                    }
                }else{
                    //小飞机死亡时(死亡时有一段时间 将进行倒计时主要用于播放飞机爆炸动画)  移除飞机节点以及数组中的位置 
                    //死亡时 倒计时每隔50毫秒 -1，从30减少到0的时候就销毁当前小飞机
                    array[i].exTime--;
                    if (array[i].exTime == 0) {
                        mainObj.removeChild(array[i].imgNode);
                        array.splice(i,1);
                    }
                }
            }
        }

        function PlaneMove(){
            move(smallPlaneArray);
            move(bigPlaneArray);
            move(speedArray);
            move(protectArray);
            move(frogArray);
            //speed道具
        }
        // 玩家飞机
        /* 
            属性：
                图片节点
                图片是哪一个
                x，y的坐标
                速度
            行为：
                移动    上下左右
                可以发送子弹
                初始化  把图片节点添加到main内
        */
        function playerPlaneProto(imgSrc,x,y,speed){
            //创建图片节点
            this.imgNode=document.createElement("img");
            this.imgSrc = imgSrc;
            this.x=x;
            this.y=y;
            this.speed=speed;
            this.playerIsDead = false;
            this.init = function(){
                this.imgNode.id = "player";
                this.imgNode.src=this.imgSrc;
                this.imgNode.style.position="absolute";
                this.imgNode.style.left = this.x+"px";
                this.imgNode.style.top = this.y+"px";
                mainObj.appendChild(this.imgNode);

            }
            this.init();
            this.moveLeft = function(){
                //到时候根据玩家按键 来执行相应事件 进行移动
                if(this.imgNode.style.left=="-90px"){
                    this.imgNode.style.left = "400px";//移动到边缘 来循环
                }else{
                    this.imgNode.style.left = parseInt(this.imgNode.style.left)-this.speed+"px";
                }
            }
            this.moveRight = function(){
                //到时候根据玩家按键 来执行相应事件
                if(this.imgNode.style.left=="400px"){
                    this.imgNode.style.left = "-90px";//移动到边缘
                }else{
                    this.imgNode.style.left = parseInt(this.imgNode.style.left)+this.speed+"px";
                }
            }
            this.moveUp = function(){
                //到时候根据玩家按键 来执行相应事件
                if(this.imgNode.style.top == "0px"){
                    this.imgNode.style.top = "0px";//移动到上下边缘不变
                }else{
                    this.imgNode.style.top = parseInt(this.imgNode.style.top)-this.speed+"px";
                }
            }
            this.moveDown = function(){
                //到时候根据玩家按键 来执行相应事件
                if(this.imgNode.style.top == "550px"){
                    this.imgNode.style.top = "550px";
                }else{
                    this.imgNode.style.top = parseInt(this.imgNode.style.top)+this.speed+"px";
                }
            }
            this.shoot=function(){
                //发射子弹事件
                var newBullet = new bulletProto("./img/子弹.png",parseInt(this.imgNode.style.left)+55,parseInt(this.imgNode.style.top)-40,10);
                bulletArray.push(newBullet);
                var audio = new Audio("./Sound/bullet.mp3");
                audio.play();
                // var audio1=setTimeout("new Audio(\"./Sound/bullet.mp3\").play()",200);

            }
            this.doubleshoot=function(){
                //发射子弹事件
                var newBullet0 = new bulletProto("./img/子弹.png",parseInt(this.imgNode.style.left)+55,parseInt(this.imgNode.style.top)-40,10);
                var newBullet1 = new bulletProto("./img/子弹.png",parseInt(this.imgNode.style.left)+55,parseInt(this.imgNode.style.top)-80,10);
                bulletArray.push(newBullet0);
                bulletArray.push(newBullet1);
                var audio = new Audio("./Sound/bullet.mp3");
                audio.play();
                var audio1=setTimeout("new Audio(\"./Sound/bullet.mp3\").play()",200);

            }
            
        }
        
        //在整个body网页按下键盘时 做的事情 移动玩家飞机
        document.body.onkeydown=function(){
            var e = window.event||arguments[0];
            if(e.keyCode==37){
                leftBtn=true;
            }
            if(e.keyCode==38){
                upBtn=true;
            }
            if(e.keyCode==39){
                rightBtn=true;
            }
            if(e.keyCode==40){
                downBtn=true;
            }
            if(e.keyCode == 32){
                if(!frog_flag)
                {
                if(double_flag)
                    player.doubleshoot();
                else
                    player.shoot();
                }
                else {
                    var audio = new Audio("./Sound/frog.mp3");
                    audio.play();
                }

        }
    }
        //当键盘放开时，停止移动  将值改为false
        document.body.onkeyup=function(){
            var e = window.event||arguments[0];
            if(e.keyCode==37){
                leftBtn=false;
            }
            if(e.keyCode==38){
                upBtn=false;
            }
            if(e.keyCode==39){
                rightBtn=false;
            }
            if(e.keyCode==40){
                downBtn=false;
            }
        }
        function ctrlPlay(){
            if(leftBtn == true){
                player.moveLeft();
            }
            if(rightBtn == true){
                player.moveRight();
            }
            if(upBtn == true){
                player.moveUp();
            }
            if(downBtn == true){
                player.moveDown();
            }
        }
        //子弹模板
        function bulletProto(imgSrc,x,y,speed) {
            this.imgNode=document.createElement("div");
            this.imgSrc = imgSrc;
            this.x = x;
            this.y = y;
            this.speed = speed;
            this.init = function(){
                this.imgNode.style.background = "url('"+ this.imgSrc +"')";
                this.imgNode.id = "playerbt";
                this.imgNode.style.position = "absolute";
                this.imgNode.style.left = this.x+"px";
                this.imgNode.style.top = this.y+"px";
                mainObj.appendChild(this.imgNode);
            }
            this.init();
            //子弹移动方法
            this.move = function(){
                this.imgNode.style.top =parseInt(this.imgNode.style.top)-speed+"px";
            }
        }
        //子弹移动的方法
        function bulletMove(){
            for(var i =0;i<bulletArray.length;i++){
                //调用移动的方法
                bulletArray[i].move()
                //如果子弹超出上面的位置则进行删除
                if(parseInt(bulletArray[i].imgNode.style.top)<=-30){
                    mainObj.removeChild(bulletArray[i].imgNode);
                    bulletArray.splice(i,1);
                }
            }
        }
        //碰撞函数crashCheck 可以添加其他的元素，加速子弹射击和运动速度，吃完变青蛙 无敌状态 加血的 射击炸弹爆炸
        function crashCheck(){
            for(var i=0;i<smallPlaneArray.length;i++){
                for(var j=0;j<bulletArray.length;j++){
                    //子弹的左边
                    var btLeft = parseInt(bulletArray[j].imgNode.style.left);
                    //子弹的顶部
                    var btTop = parseInt(bulletArray[j].imgNode.style.top);
                    //飞机的顶部
                    var plTop = parseInt(smallPlaneArray[i].imgNode.style.top);
                    //飞机的左边
                    var plLeft = parseInt(smallPlaneArray[i].imgNode.style.left);
                    if (smallPlaneArray[i].isDead == false) {
                        if (btLeft>=plLeft && btLeft<=plLeft+64 && btTop>=plTop && btTop<plTop+64) {
                            //子弹与飞机发生了碰撞
                            // console.log('bigPlaneArray[i]',smallPlaneArray[i].imgNode.getAttribute('blood'));
                            var audio = new Audio("./Sound/enemy1_down.mp3");
                            audio.play();
                            mainObj.removeChild(bulletArray[j].imgNode);
                            //碰撞上的子弹移除数组上的位置
                            bulletArray.splice(j,1);
                            //地方小飞机做一个改变，替换图片路径
                            smallPlaneArray[i].imgNode.src="./img/敌机爆炸.png";
                            smallPlaneArray[i].isDead = true;
                            //杀敌积分 +1
                            killNum.innerHTML = parseInt(killNum.innerHTML)+1;
                            killScore.innerHTML = parseInt(killScore.innerHTML)+2;
                            check_score();
                        }
                    }
                }
            }

            for(var i=0;i<bigPlaneArray.length;i++){
                for(var j=0;j<bulletArray.length;j++){
                    //子弹的左边
                    var btLeft = parseInt(bulletArray[j].imgNode.style.left);
                    //子弹的顶部
                    var btTop = parseInt(bulletArray[j].imgNode.style.top);
                    //飞机的顶部
                    var plTop = parseInt(bigPlaneArray[i].imgNode.style.top);
                    //飞机的左边
                    var plLeft = parseInt(bigPlaneArray[i].imgNode.style.left);
                    if (bigPlaneArray[i].isDead == false) {
                        if (btLeft>=plLeft && btLeft<=plLeft+64 && btTop>=plTop && btTop<plTop+64) {
                            //子弹与飞机发生了碰撞
                            var blood=Number(bigPlaneArray[i].imgNode.getAttribute('blood'));
                            mainObj.removeChild(bulletArray[j].imgNode);
                            //碰撞上的子弹移除数组上的位置
                            bulletArray.splice(j,1);
                            if(blood>1){
                                bigPlaneArray[i].imgNode.setAttribute('blood',String(blood-1));
                                // console.log('大飞机血量：',Number(bigPlaneArray[i].imgNode.getAttribute('blood')));
                                if(blood==4||blood==3)
                                    bigPlaneArray[i].imgNode.src='./img/enemy2_down1.png';
                                if(blood==2||blood==1)
                                    bigPlaneArray[i].imgNode.src='./img/enemy2_down2.png';
                            }
                            else {
                            // console.log('blood',blood);
                            var audio = new Audio("./Sound/enemy2_down.mp3");
                            audio.play();
                            //地方小飞机做一个改变，替换图片路径
                            bigPlaneArray[i].imgNode.src="./img/enemy2_down3.png";
                            bigPlaneArray[i].isDead = true;
                            //杀敌积分 +1
                            killNum.innerHTML = parseInt(killNum.innerHTML)+1;
                            killScore.innerHTML = parseInt(killScore.innerHTML)+5;
                            }
                        }
                    }
                }
            }
            
//加速道具
            for(var i=0;i<speedArray.length;i++){
                for(var j=0;j<bulletArray.length;j++){
                    //子弹的左边
                    var btLeft = parseInt(bulletArray[j].imgNode.style.left);
                    //子弹的顶部
                    var btTop = parseInt(bulletArray[j].imgNode.style.top);
                    //飞机的顶部
                    var plTop = parseInt(speedArray[i].imgNode.style.top);
                    //飞机的左边
                    var plLeft = parseInt(speedArray[i].imgNode.style.left);
                    if (speedArray[i].isDead == false) {
                        if (btLeft>=plLeft && btLeft<=plLeft+64 && btTop>=plTop && btTop<plTop+64) {
                            //子弹与飞机发生了碰撞
                            double_flag=1;
                            double_flag_timer=setTimeout(function() {double_flag=!double_flag;},3000);//3秒的双倍子弹！
                            mainObj.removeChild(bulletArray[j].imgNode);
                            //碰撞上的子弹移除数组上的位置
                            bulletArray.splice(j,1);

                            // console.log('blood',blood);
                            var audio = new Audio("./Sound/get_bomb.mp3");
                            audio.play();
                            //地方小飞机做一个改变，替换图片路径
                            speedArray[i].imgNode.src="./img/加速_destory.png";
                            speedArray[i].isDead = true;
                            //杀敌积分 +1
                            killNum.innerHTML = parseInt(killNum.innerHTML)+0;
                            killScore.innerHTML = parseInt(killScore.innerHTML)+5;
                            }
                        }
                    }
                }
//无敌道具
                for(var i=0;i<protectArray.length;i++){
                    for(var j=0;j<bulletArray.length;j++){
                        //子弹的左边
                        var btLeft = parseInt(bulletArray[j].imgNode.style.left);
                        //子弹的顶部
                        var btTop = parseInt(bulletArray[j].imgNode.style.top);
                        //飞机的顶部
                        var plTop = parseInt(protectArray[i].imgNode.style.top);
                        //飞机的左边
                        var plLeft = parseInt(protectArray[i].imgNode.style.left);
                        if (protectArray[i].isDead == false) {
                            if (btLeft>=plLeft && btLeft<=plLeft+64 && btTop>=plTop && btTop<plTop+64) {
                                //子弹与飞机发生了碰撞
                                protect_flag=1;
                                document.getElementById('player').src="./img/本机_无敌.png";
                                // console.log('应该替换了？');
                                protect_flag_timer=setTimeout(function() {
                                    protect_flag=!protect_flag;
                                    document.getElementById('player').src="./img/本机.png";
                                }
                                ,3000);//3秒的无敌时间！
                                mainObj.removeChild(bulletArray[j].imgNode);
                                //碰撞上的子弹移除数组上的位置
                                bulletArray.splice(j,1);
    
                                // console.log('blood',blood);
                                var audio = new Audio("./Sound/get_bomb.mp3");
                                audio.play();
                                //地方小飞机做一个改变，替换图片路径
                                protectArray[i].imgNode.src="./img/防护_destory.png";
                                protectArray[i].isDead = true;
                                
                                //杀敌积分 +1
                                killNum.innerHTML = parseInt(killNum.innerHTML)+0;
                                killScore.innerHTML = parseInt(killScore.innerHTML)+3;
                                }
                            }
                        }
                    }
                for(var i=0;i<protectArray.length;i++){
                    for(var j=0;j<bulletArray.length;j++){
                        //子弹的左边
                        var btLeft = parseInt(bulletArray[j].imgNode.style.left);
                        //子弹的顶部
                        var btTop = parseInt(bulletArray[j].imgNode.style.top);
                        //飞机的顶部
                        var plTop = parseInt(protectArray[i].imgNode.style.top);
                        //飞机的左边
                        var plLeft = parseInt(protectArray[i].imgNode.style.left);
                        if (protectArray[i].isDead == false) {
                            if (btLeft>=plLeft && btLeft<=plLeft+64 && btTop>=plTop && btTop<plTop+64) {
                                //子弹与飞机发生了碰撞
                                protect_flag=1;
                                document.getElementById('player').src="./img/本机_无敌.png";
                                // console.log('应该替换了？');
                                protect_flag_timer=setTimeout(function() {
                                    protect_flag=!protect_flag;
                                    document.getElementById('player').src="./img/本机.png";
                                }
                                ,3000);//3秒的无敌时间！
                                mainObj.removeChild(bulletArray[j].imgNode);
                                //碰撞上的子弹移除数组上的位置
                                bulletArray.splice(j,1);
    
                                // console.log('blood',blood);
                                var audio = new Audio("./Sound/get_bomb.mp3");
                                audio.play();
                                //地方小飞机做一个改变，替换图片路径
                                protectArray[i].imgNode.src="./img/防护_destory.png";
                                protectArray[i].isDead = true;
                                
                                //杀敌积分 +1
                                killNum.innerHTML = parseInt(killNum.innerHTML)+0;
                                killScore.innerHTML = parseInt(killScore.innerHTML)+3;
                                }
                            }
                        }
                    }
                    //frog
                    for(var i=0;i<frogArray.length;i++){
                        for(var j=0;j<bulletArray.length;j++){
                            //子弹的左边
                            var btLeft = parseInt(bulletArray[j].imgNode.style.left);
                            //子弹的顶部
                            var btTop = parseInt(bulletArray[j].imgNode.style.top);
                            //飞机的顶部
                            var plTop = parseInt(frogArray[i].imgNode.style.top);
                            //飞机的左边
                            var plLeft = parseInt(frogArray[i].imgNode.style.left);
                            if (frogArray[i].isDead == false) {
                                if (btLeft>=plLeft && btLeft<=plLeft+64 && btTop>=plTop && btTop<plTop+64) {
                                    //子弹与飞机发生了碰撞
                                    frog_flag=1;
                                    document.getElementById('player').src="./img/frog.png";
                                    player.imgNode.style.height='40px';
                                    player.imgNode.style.width='40px';
                                    // console.log('player.imgNode.style.height',player.imgNode.height);
                                    // console.log('应该替换了？');
                                    frog_flag_timer=setTimeout(function() {
                                        frog_flag=!frog_flag;
                                        document.getElementById('player').src="./img/本机.png";
                                        // console.log('player.imgNode.style.height',player.imgNode.height);
                                        player.imgNode.style.height='100px';
                                        player.imgNode.style.width='100px';

                                    }
                                    ,3000);//3秒的无敌时间！
                                    mainObj.removeChild(bulletArray[j].imgNode);
                                    //碰撞上的子弹移除数组上的位置
                                    bulletArray.splice(j,1);
        
                                    // console.log('blood',blood);
                                    var audio = new Audio("./Sound/out_porp.mp3");
                                    audio.play();
                                    //地方小飞机做一个改变，替换图片路径
                                    frogArray[i].imgNode.src="./img/青蛙标志_destory.png";
                                    frogArray[i].isDead = true;
                                    
                                    //杀敌积分 +1
                                    killNum.innerHTML = parseInt(killNum.innerHTML)+0;
                                    killScore.innerHTML = parseInt(killScore.innerHTML)-3;
                                    }
                                }
                            }
                        }
            }

        //调用本机碰撞
        setInterval(userCrash,10);
        //本机碰撞
        function end(i,array,imgsrc){
            startGame_audio_pause();
            var audio = new Audio("./Sound/game_over.mp3");
            audio.play();
            //敌方小飞机做一个改变，替换图片路径
            // smallPlaneArray[i].imgNode.src="./img/敌机爆炸.png";
            array[i].imgNode.src=imgsrc;
            array[i].isDead = true;
            //我方飞机做一个改变，替换图片
            player.imgNode.src = './img/本机爆炸.png';
            player.imgNode.playerIsDead = true;
            var over = document.getElementById('over');
            over.style.display = 'block';
            clear();
        }
        function userCrash(){
            for(var i=0;i<smallPlaneArray.length;i++){
                //敌方飞机的顶部
                var plTop2 = parseInt(smallPlaneArray[i].imgNode.style.top);
                //敌方飞机的左边
                var plLeft2 = parseInt(smallPlaneArray[i].imgNode.style.left);
                //我方飞机的左边
                var playerLeft = parseInt(player.imgNode.style.left);
                //我方飞机的顶部
                var playerTop = parseInt(player.imgNode.style.top);
                if (smallPlaneArray[i].isDead == false) {
                    if (plLeft2>=playerLeft&&plLeft2<=playerLeft+90&&plTop2>=playerTop&&plTop2<=playerTop+20) {
                        if(!protect_flag)
                            end(i,smallPlaneArray,"./img/敌机爆炸.png");
                        else {
                            var audio = new Audio("./Sound/enemy1_down.mp3");
                            audio.play();
                            //地方小飞机做一个改变，替换图片路径
                            smallPlaneArray[i].imgNode.src="./img/敌机爆炸.png";
                            smallPlaneArray[i].isDead = true;
                            //杀敌积分 +1
                            killNum.innerHTML = parseInt(killNum.innerHTML)+1;
                            killScore.innerHTML = parseInt(killScore.innerHTML)+5;
                        }
                    }
                }
            }

            for(var i=0;i<bigPlaneArray.length;i++){
                //敌方飞机的顶部
                var plTop2 = parseInt(bigPlaneArray[i].imgNode.style.top);
                //敌方飞机的左边
                var plLeft2 = parseInt(bigPlaneArray[i].imgNode.style.left);
                //我方飞机的左边
                var playerLeft = parseInt(player.imgNode.style.left);
                //我方飞机的顶部
                var playerTop = parseInt(player.imgNode.style.top);
                if (bigPlaneArray[i].isDead == false) {
                    if (plLeft2>=playerLeft&&plLeft2<=playerLeft+90&&plTop2>=playerTop&&plTop2<=playerTop+20) {//这个值主观设定即可
                        if(!protect_flag)
                            end(i,bigPlaneArray,"./img/敌机爆炸2.png");
                        else {
                        var audio = new Audio("./Sound/enemy2_down.mp3");
                        audio.play();
                        //地方小飞机做一个改变，替换图片路径
                        bigPlaneArray[i].imgNode.src="./img/敌机爆炸2.png";
                        bigPlaneArray[i].isDead = true;
                        //杀敌积分 +1
                        killNum.innerHTML = parseInt(killNum.innerHTML)+1;
                        killScore.innerHTML = parseInt(killScore.innerHTML)+5;
                        }
                    }
                }
            }
        }
}