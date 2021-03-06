!function (global, factory) {
    'object'===typeof exports && 'undefined'!==typeof module ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.xyplayer = factory());
  }(this, function () {
    'use strict';
    var $this;
    var xyplayer = function (c) {
        //显示版权信息
        this.onVer();
        //全局变量,方便全局操作。
        $this=this;
        //类变量，网址type参数
        this.type = _GET("type");
        //类变量，外部对象名称
        this.variable=c.variable||"xyplay";
        //类变量,线路切换图标容器
        this.logo = c.logo || '.logo';
        //类变量,剧集切换图标容器
        this.list = c.list || '.list';
        //类变量,线路列表容器
        this.pline = c.pline || '#line';
        //类变量,线路容器
        this.line = c.line || '#line';
        //类变量,直播容器
        this.plive = c.plive || '#live';
        //类变量,播放列表容器
        this.plist = c.plist || '#list';
        //类变量,播放列表 来源列表容器
        this.flaglist = c.flaglist || '#flaglist';
        //类变量,播放列表 视频列表容器
        this.playlist = c.playlist || '#playlist';
        //类变量,视频容器
        this.player = c.player || '#player';
        //类变量,广告容器
        this.playad = c.playad || '#playad';
        //类变量,搜索输入框容器
        this.input = c.input || '#wd';
        //类变量,列表是否自动隐藏
        this.autohide = c.autohide || false;
        //类变量,加载图片
        this.loadimg = c.loadimg || false;
        //类变量,api地址
        this.api = c.api || 'api.php';
        //类变量,显示标题
        this.mytitle = document.title;
        //类变量,当前线路
        this.myurl = 0;
        //类变量,线路列表
        this.url_array = [];
        //类变量,播放数据
        this.list_array = [];
        //类变量,当前来源
        this.pflag = 0;
        //类变量,当前集数
        this.part=_GET("part")|| 0;
        //类变量,来源列表
        this.flaglist_array = [];
        //类变量,集数列表
        this.playlist_array = [];
        //类变量,线路选择标志
        this.onflag = 'auto';
        //类变量,设备标志
        this.lswap = is_mobile();
        //类变量,app标志
        this.app = false;
        //类变量,全局倒计时计数
        this.count = 0;
        //类变量,配置缓存过期时间毫秒数,默认2小时
        this.timestamp=2*3600*1000;
        //类变量，网址url参数
        this.url = _GET("url", true) || _GET("v", true);
        
        
        
        //网址v参数中文输入智能检测
        if (this.url && this.url.search(/^[\u4e00-\u9fa5]+/) !== -1) {
            this.wd = this.url;
        } else {
            this.wd = _GET("wd");
        }
        var data=this.getlocId();
        if(data)
        { 
   
           this.tp=data.type;
   
           if(data.type==="id"){

           //this.wd='index'; 
           this.id = data.id;
           this.flag =data.flag;  
           this.part =data.part>0? Number(data.part)-1:0;
            }else{
               this.id =data.id >0? Number(data.id )-1:0;
            }
           
           
        }else{
           this.id = _GET("id");
        //类变量，网址flag参数
           this.flag = _GET("flag");
        }
   
   
   
        //获取播放配置
        this.playparm=localStorage.getItem('playparm');
        if(this.playparm)
       {
            var data=JSON.parse(this.playparm);
            if(new Date().getTime()>data.timestamp)
            {
                  this.GetPlayParm(); 
            }else{
                 console.log("使用缓存配置（修改配置后请清空浏览器缓存）");  
                 this.app = data.app;
                 //初始化配置
                 this.init(data.val);  
            }
        }else{
                this.GetPlayParm();  
        }
    };
    
    xyplayer.prototype = {
        /*
         主要函数部分开始
         主接口函数：
         */
        init: function (c) {
            //类全局变量,播放参数
            this.play = new Function('return ' + strdecode(c))();
            //类全局变量，访问超时时间
            this.timeout = this.play.define.timeout * 1000;
            //类全局变量，cookie保存时间
            this.timecookie = this.play.define.timecookie;
            //类全局变量，网站目录
            this.host = this.play.define.host;
            //类全局变量，自定义右键
            this.contextmenu=this.play.play.all.contextmenu;
            //判断是否显示
            if (this.play.style.logo_show === "1") {$(this.logo).show(); } else { $(this.logo).hide();}
            if (this.play.style.list_show !== "1") {$(this.plist).hide(); }
            if(this.play.style.flaglist_show === "1"){$($this.flaglist).show();}else{$($this.flaglist).hide();};
            if (this.play.style.playlist_show === "1") {$($this.playlist).show();}else{$($this.playlist).hide();}
            //刷新线路列表
            this.url_array = this.play.define.parse;
            this.reline();
            //检测是否允许调试
            //endebug(this.play.off.debug, this.play.all.decode);

            //智能设置变量
            if (this.lswap) {
                this.intLine = this.play.line.wap.line;
                if (this.intLine === "-1") { this.intLine = random(1, Number(this.play.define.jx_url.length));}  //随机线路

                this.jxtime = this.play.line.wap.infotime;
                this.wait=this.play.line.wap.wait;
                this.myplayer = this.play.play.wap.player;
                this.diyplayer = this.play.play.wap.player_diy;
                this.autoplay = this.play.play.wap.autoplay;
               

            } else {
                this.intLine = this.play.line.pc.line;
                if (this.intLine === "-1") { this.intLine = random(1, Number(this.play.define.jx_url.length)); }  //随机线路
                this.jxtime = this.play.line.pc.infotime;
                this.wait=this.play.line.pc.wait;
                this.myplayer = this.play.play.pc.player;
                this.diyplayer = this.play.play.pc.player_diy;
                this.autoplay = this.play.play.pc.autoplay;
            };

      
            //线路智能检测
            var autoline = this.play.line.all.autoline;
            if (this.url !== "" && autoline.off === "1") {
                for (var key in autoline.val) {
                    if (this.url.indexOf(key) > -1) {
                        this.intLine = autoline.val[key];
                        console.log('线路智能检测：' + this.intLine);
                        break;
                    }

                }
                
                this.myurl = Number(this.intLine) - 1;

            }else{
        
                var num=getCookie("url_num");
                if(num===''){
                    this.myurl =(Number(this.intLine) - 1);
                }else{
                    this.myurl =getCookie("url_num");
                }
            }
            //播放器智能检测
            var autoline = this.play.play.all.autoline;
            if (this.url !== "" && autoline.off === "1") {
                for (var key in autoline.val) {
                    if (this.url.indexOf(key) > -1) {
                        this.myplayer = autoline.val[key];

                        break;
                    }

                }
     
            }

           //设置播放标志
            if (this.play.off.ckplay === "0") {
                this.onflag = 'line';
            }

            console.log('当前线路:' + (Number(this.myurl) + 1));
            console.log('当前播放器：' + this.myplayer);
            console.log('当前标志：' + this.onflag);

            $this.loadtime();

            //监听鼠标动作
            this.control();


           //判断类型 
           if(this.wd!==""){
               
               if(this.part===0){
                   
                      this.tp = "wd"; 
               }else{
                      this.tp = "title"; 
                   
               }
    
            }else if(this.tp==='id'){
                this.tp = "id";  
           }else if(this.tp==='live'){
                this.tp='live';    
           
           }else if(this.url!==""){
                this.tp='url';          
           }else{
                this.tp = "null";
           }
           
            console.log("解析类型:" + this.tp);
            switch (this.tp) {
                case 'wd':
                    this.listname = this.wd;
                    //console.log(this.wd);
                    //this.getvideo();
                    this.farme(this.player, 'so.php?wd=' + this.wd, this.success);
                    //检查线路列表图标
                    if (this.play.style.logo_show === "1") {$(this.logo).show(); }
                    
                    break;
              
                case 'url':
                    this.listname = this.url;
                    
                  
                     if(this.lsplay('ext',this.url)){ 
                         
                        // localStorage.removeItem('videoparm');
            
                         this.title="直链播放";
  
                         this.xyplay(this.url); 
                     
                   }else{
      
                        this.checkUrl(this.url);
         
                     
                  }
                    
                    break;
                    
                case 'id':   
                try {
                     var xyplay = new Function('return parent.parent.' + this.variable)();
                    if("undefined" === typeof xyplay){ xyplay = new Function('return parent.' + this.variable)();}
                    $(this.logo).hide();
                    xyplay.listname=this.flag+this.id;
                    xyplay.id=this.id;xyplay.flag=this.flag;
                    xyplay.getvideo("id",this.wd,false,xyplay);
                    break;
                 } catch (error) {
                      
                    this.listname = this.flag + this.id;
                    this.getvideo();
                    break;
                }

              case 'live':

                    this. liveplay(this.id);

               break;

             case 'title':

                     this.getvideo("title");
                      break;

                case 'null':
                    console.log("URL地址或关键字不能为空!");
                    
                    try{
                        var xyplay = new Function('return parent.parent.' + this.variable)();
                        if("undefined" === typeof xyplay){ xyplay = new Function('return parent.' + this.variable)();}
                        if("undefined" === typeof xyplay){
                            // this.loadtime(true); 
                             this.href('so.php'); 
                        }else{
                            // xyplay.loadtime(true); 
                             xyplay.href('so.php'); 
                             
                             
                        }
                          break;
                    }catch(e){
                          this.loadtime(true); 
                          this.href('so.php'); 
                    break;
                    
                    
                    
                }
            }
        },

        /**   内部函数: 成功 回调函数  */
        success:function (code,data,get) {
            var lsget=get||false;
     
            switch (code) {
                /* 获取播放配置成功 */
                case 0:    
                    //取得app标识
                    this.app = data.app;
                    //初始化配置
                    this.init(data.val);
                    //写入过期时间戳 
                    data.timestamp=new Date().getTime()+this.timestamp;  
                    //将配置写入本地缓存 
                    localStorage.setItem('playparm',JSON.stringify(data));
                    break;

             /* 本地数据查询成功 */
                case 1:
           
                    this.data = data;
                     //获取标题和播放器
                    this.title = data.title || '';
                    if ("undefined" !== typeof data.player && data.player !== "") {
                        this.myplayer = data.player;
                    }

                    //刷新选集列表并显示图标
                    if (data.info) {
                        this.list_array = data.info;
                        this.relist(true);
                        if (this.play.style.list_show === "1") {
                            $(this.list).show();
                        }
                    }

                    //设置当前集数
                    this.part = getCookie(this.listname) || (Number(data.part) - 1);
                    if (data.part > this.playlist_array.length || !this.part) {
                        this.part = 0;
                    }

                    //重新加载线路列表
                    this.reline();
                    var url = ("undefined" !== typeof data.url) ? data.url : (this.playlist_array.length >= this.part ? this.playlist_array[this.part] : "");
                            
                     console.log("获取本地数据成功");
                      this.AutoPlay();
                     
                     
                        if (this.onflag !== 'line') {
                            this.onflag = 'yun';
                            this.AutoPlay('list', url, data.type);
                        } else {
                            this.AutoPlay('line');
                        };
                  

                    break;


                /*  链接查询成功  */
                case 2:
                    
                    

                    if (data.type === "js") {
                        console.log("链接查询js成功");
                        this.loadhtml(data.js);
                        setTimeout(function () {
                            $this.Getvideobyurl($this.url, true);
                        }, 1 * 1000);
                        break;

                    }
                    console.log("链接查询成功");
                    
                    this.data = data;

                    //获取标题
                    this.title = data.title || '';
                    
                    //if ("undefined" !== typeof data.player && data.player !== "") {
                        //this.myplayer = data.player;
                   // }
                    //调用云播放

                    //  if(this.onflag!=='line' ){this.xyplay(data.url);}else{this.AutoPlay('line');}

                    if (this.onflag !== 'line') {this.AutoPlay('list', data.url, data.type); } else {this.AutoPlay('line'); }

                    //重新加载线路列表
                    this.reline();
                    //刷新选集列表并显示图标
                    if (data.info) {
                        this.list_array = data.info;
                        this.relist();
                        if (this.play.style.list_show === "1") {
                            $(this.list).show();
                        };
                    }
                    //设置当前集数
                    this.part = getCookie(this.listname) || (Number(data.part) - 1);
                    if (data.part > this.playlist_array.length || !this.part) {
                        this.part = 0;
                    }
                    //后台继续获取全部源站数据
                    if (!data.info && this.play.off.yun === "1" ) {
                        this.getvideo("url", this.url, true);
                    }
                    break;

                /* 获取源站视频数据成功(getvideo) */
                case 3:
                   this.data = data;

                    //获取标题和播放器
                    this.title = data.title || '';
                    if ("undefined" !== typeof data.player && data.player !== "") {
                        this.myplayer = data.player;
                    }

                    //刷新选集列表并显示图标
                    if (data.info) {
                        this.list_array = data.info;
                        this.relist(true);
                        if (this.play.style.list_show === "1") {
                            $(this.list).show();
                        }
                    }

                    //设置当前集数
                    this.part = getCookie(this.listname) || (Number(data.part) - 1);
                    if (data.part > this.playlist_array.length || !this.part) {
                        this.part = 0;
                    }

                    //重新加载线路列表
                    this.reline();
                    var url = ("undefined" !== typeof data.url) ? data.url : (this.playlist_array.length >= this.part ? this.playlist_array[this.part] : "");
                   
                     console.log("获取云资源成功");
                        
                       if(!lsget){
                           
                             this.AutoPlay('list',url);
                           
                       }
      
                    break;

                /* 搜索视频成功(wd) */
                case 4:
                    //全局变量，用于外部调用
                    this.data = data;
                    
                      console.log(this.data);
                    
                    
                    this.farme(this.player, 'so.php?wd=' + this.wd, this.success);
                    //检查线路列表图标
                    if (this.play.style.logo_show === "1") {$(this.logo).show(); }
                    break;
                /*  搜索视频成功(id,flag) */
                case 5:
                    
                    this.data = data;
                    
                    console.log("id搜索视频成功");
                    
                  //  console.log(data);
                    //获取标题和播放器
                    this.title = data.title || '';
                    
                    localStorage.setItem('title',this.title);
                    
                    if ("undefined" !== typeof data.player && data.player !== "") {
                        this.myplayer = data.player;
                    }
                    
                    //重新加载线路列表
                    this.reline();
                    //刷新选集列表并显示图标
                    if (data.info) {
                        this.list_array = data.info;
                        this.relist();
                        if (this.play.style.list_show === "1") {
                            $(this.list).show();
                        }
                    }
                    
                    var video= this.playlist_array[this.part];
                  
                    this.AutoPlay('list',video); 
                    
                    //console.log(video);
                    
                    
                   //检查线路列表图标
                    if (this.play.style.logo_show === "1") {$(this.logo).show(); }

                    if (this.part > this.playlist_array.length || !this.part) {
                        this.part = 0;
                    }

                    break;

               /* 检测视频成功 */
               case 6:

                console.log("检测视频成功:"+data.type);
               
               this.url=data.url;
                if(data.type==='link'){ 
                        this.open(data.url);
                }else if(data.type==='video') {
                        this.xyplay(this.url);
                 }else if(data.type==='hls') {
                        this.xyplay(this.url+"#.m3u8");
                 }else if(data.type==='mp4') {
                       this.xyplay(this.url+"#.mp4");
                }else {
                     this.jxplay(); 
                }
       
               break;
               
             
               
        

                //框架加载成功
                default:
                    try {
                        setTimeout(function () { $this.loadtime(true); },($this.onflag === 'line'? Number($this.jxtime):0)* 1000);
                    } catch (e) {

                        $this.loadtime(true);
                    }
                    break;
            }
        },
        
        checkUrl:function (url){
        $.ajax({
        url: $this.api+"?tp=checkPlay&url="+url,
        timeout: $this.timeout,
        dataType: "json",
        success: function(data) {
            
            console.log("检测类型成功:"+data.type);
            $this.url=data.url;
             if(data.type==='link'){   
                      $this.open(data.url);
               }else if(data.type==='video' || data.type==='hls' || data.type==='mp4'){
                       $this.xyplay(data.url);
                     //后台继续获取全部源站数据
                    if (!data.info && $this.play.off.yun === "1" ) {
                        $this.getvideo("url", url, true);
                    }
                       
                       
               }else {
                     
                      if ($this.play.off.jmp === '1' || $this.play.off.yun === '0') {
                             $this.GetLocalVideo();      //本地
                        } else if ($this.play.off.yun === "1" ) {
                            $this.getvideo();             //云播
                        } else {
                           $this.jxplay($this.myurl, url);  //调用解析
                        }
                }
          }
    });
     
        },
      
        /*    内部函数  获取资源(ajax)失败 回调函数  */
        error: function (code, data) {
            switch (code) {

                /* 获取播放配置失败 */
                case 0:
                    $(this.logo).hide();
                    this.echo("<span style='color:red;'>读取配置失败,请检查防火墙设置!</span>&nbsp;<span style='color:#00f;'><a href = 'javascript:;' onclick ='location.reload();'>刷新</a></span>", false, false, this.playad);
                    break;

                 case 1:
                    console.log("本地数据查询失败");
                    //调用链接查询或云搜索
                    if (this.play.off.link === '1' && this.tp === "url") {
                            this.Getvideobyurl();
                    }else if(this.play.off.yun === "1") {
                        this.getvideo();
                    } else {
                        this.AutoPlay('line');
                    };
                    break;
 
                /* 链接查询失败  */
                case 2:
                    console.log("链接查询失败");

                    //调用云搜索
                    if (this.play.off.yun === "1") {
                        this.getvideo();
                    } else {
                        this.AutoPlay('line');
                    };
                    break;

                /* 获取云资源失败  */
                case 3:
                    console.log("获取云资源失败");
                    if (this.tp === 'url') {
                        if (!this.play.off.jx || ("undefined" !== typeof data && "undefined" !== typeof data.code && data.code === 404)) {
                            this.href("404.php");
                            break;

                        } else {
                           // this.echo("服务器调用解析中,请稍后...");

                            this.AutoPlay('line');
                            break;
                        }

           

                    } else {
                        this.errorHandler('未搜索到资源', true);
                    }
                    break;
 
            }
        },

        /*  内部函数 链接跳转 检测  */
        lsurljmp: function () {
            var list = this.play.define.url_jmp;
            for (var key in list) {
                if (list[key].off === "1") {
                    var reg = new RegExp(list[key].url, "i");
                    if (reg.test(this.url)) {
                        this.url = list[key].href;
                        console.log('使用本地视频库：' + this.url);
                        break;
                    }
                }
            }
        },
        

        /*  0. 内部函数 获取播放配置  */
        GetPlayParm: function () {
            $.ajax({
                url: $this.api + '?out=jsonp&tp=getparm&referer' + document.referer,
                dataType: 'jsonp',
                jsonp: 'cb',
                success: function (data) {
                    if (data.success) {
                        $this.success(0, data);
                    } else {
                        $this.error(0, data);
                    }
                },
                error: function () {
                    
                     console.log("读取配置出错");  
                    
                    $this.error(0);
                }
            });
        },
        
    
        /* 1. 内部函数 本地资源库查询 */
        GetLocalVideo: function (url) {
            var tp = 'tp=local&url=';
            if ($this.play.off.debug === "1") {
                tp = 'dd=1&' + tp;
            }
          
            url = url || $this.url;
            $.ajax({
                url: $this.api + '?out=jsonp&' + tp + encodeURIComponent(url),
                timeout: $this.timeout,
                dataType: 'jsonp',
                jsonp: 'cb',
                success: function (data) {
                    if (data.success) {
                        $this.success(1, data);
                    } else {
                        $this.error(1, data);
                    }
                },
                error: function () {
                    $this.error(1);
                }
            });
        },

        /* 2. 内部函数 链接查询数据 */
        Getvideobyurl: function (url, loadjs) {
            var tp = 'tp=link&url=';
            if ($this.play.off.debug === "1") {
                tp = 'dd=1&' + tp;
            }
            if (loadjs) {
                tp = 'loadjs=1&' + tp;
            }

            url = url || $this.url;
            $.ajax({
                url: $this.api + '?out=jsonp&' + tp + encodeURIComponent(url),
                timeout: $this.timeout,
                dataType: 'jsonp',
                jsonp: 'cb',
                success: function (data) {
                    if (data.success) {
                        $this.success(2, data);
                    } else {
                        $this.error(2, data);
                    }
                },
                error: function () {
                    $this.error(2);
                }
            });
        },


        /* 3-6  内部函数 搜索云资源  */
        getvideo: function (type, val,get,obj) {
            obj=obj||$this; 
            var type = type || obj.tp;
            var url = val || obj.url;
            var wd = val || obj.wd;
            var part=obj.part;
            var lsget=get||false;
            var lsword = false;
            var lsflag = false;
            switch (type) {
                case "url":
                    var tp = "url=";
                    var word =encodeURI(url);
                    break;
                case "id":
                    word = "";
                    tp = "flag=" + $this.flag + "&id=" + $this.id;
                    lsflag = true;
                    break;

                case "wd":
                    word = encodeURIComponent(wd);
                    tp = "wd=";
                    lsword = true;
                   
                    break;
                    
                case 'checkPlay':   
                    var tp = "tp=checkPlay&url=";
                    var word = encodeURI(url);
                    
                    
                    
                    break;
                case 'title':
                     word = encodeURIComponent(wd);
                     var tp="tp=wd&part="+part+"&wd=";
                     break;
            };
        
       
            $.ajax({
                url: $this.api + '?out=jsonp&' + tp + word,
                timeout: obj.timeout,
                dataType: 'jsonp',
                jsonp: 'cb',
                success: function (data) {
              
              
                if(data.title && $($this.input).length > 0){$($this.input).val(data.title);}
                    switch (type) {
                       case 'title': 
                        case "url":
                            if (data.success) {

                                    obj.success(3, data,lsget);
                     
                            } else {  
                                
                                if(!lsget){obj.error(3, data);}
                                
                           
                            }
                            break;
                            
                       
                        case "id":
                            if (data.success) {
                                   obj.success(5, data,lsget);
                               
                            } else {
                              
                                    if(!lsget){obj.error(3, data);}
                            }
                            break;
                        case "wd":
                    
                            obj.success(4, data,lsget);
  
                            break;
                 
                             
                        case "checkPlay":
                            
                               if (data.success) {
                         
                                  obj.success(6, data,lsget);
                         
                            
                            } else {
                               
                                   if(!lsget){obj.error(3, data);}
                            }
                            break;
                   
                   
                   
                   
                   
                    }
                },
                error: function () {
                       if(!lsget){ obj.error(3);}
                  
                }
            });

        },

        /*   内部函数  监听鼠标动作         */
        control: function () {

            //屏蔽右键
           // $(document).ready(function () { $(document).bind("contextmenu", function (e) { return false; });});

            //LOGO鼠标移动
            $($this.logo).mouseover(function () {
                if (!$this.lswap) {
                    $this.reline();
                    $($this.pline).show();
                    $($this.line).show();
                    $($this.plive).show();
                }
            });
            //LOGO 鼠标点击
            $($this.logo).click(function () {
                $this.online();
            });
            //线路列表 鼠标移出
            $($this.pline).mouseleave(function () {

                if ($this.autohide ) {
                    $($this.pline).hide();
                }
            });


            //选集列表 鼠标移动
            $($this.list).mouseover(function () {
                if (!$this.lswap) {
                    $this.relist();
                    $($this.plist).show();
                }
            });
            //播放列表图标 鼠标点击事件
            $($this.list).click(function () {
                  $this.onlist();
            });
            //播放列表 鼠标移出
            $(this.plist).mouseleave(function () {

                if (!$this.lswap) {
                     $($this.plist).hide();
                }
            });
            //列表 鼠标点击
            $(document).on('click', '.click_work', function () {
                var num = $(this).attr("num");
                var type = $(this).attr("type");
                if (type === "line") {
                    switch (num) {
                        //帮助
                        case 'h':
                            switch ($this.onflag) {
                                case 'auto':
                                    alert($this.play.all.ver + "\r\n当前线路：自动" + "\r\n" + $this.play.all.info);
                                    break;

                                case 'yun':
                                    alert($this.play.all.ver + "\r\n当前线路：云播放" + "\r\n" + $this.play.all.info);
                                    break;

                                case 'line':
                                    alert($this.play.all.ver + "\r\n当前线路：线路" + (Number($this.myurl) + 1) + "\r\n" + $this.play.all.info);
                                    break;

                                case 'live':
                                    alert($this.play.all.ver + "\r\n当前直播：" + $this.live_num + "\r\n" + $this.play.all.info);
                                    break;

                            }
                            return;
                        //自动
                        case 'auto':
                            $this.onflag = 'auto';
                            $this.myurl = 0;
                            setCookie("url_num", '');
                            location.replace(location.href);
                            break;
                        //云播放
                        case 'yun':
                            if ($this.play.style.list_show === "1") {
                                $($this.list).show();
                            }
                            $this.onflag = 'yun';
                            $this.AutoPlay('list');
                            break;

                        //搜索
                        case 'submit':
                            $this.open('so.php?wd='+$($this.input).val());
                            break;

                        //线路
                        default:
                            $this.onflag = 'line';
                            $this.myurl = Number(num);
                            $this.AutoPlay('line');
                            break;

                    }

                    //自定义链接
                } else if (type === "link") {
                    var url = $this.play.define.jx_link[num];
                    setTimeout(url, 0);

                    //直播
                } else if (type === "live") {
                    $this.liveplay(num);

                    //视频列表
                } else if (type === "list") {
                    $this.part = Number(num);
                    
                    localStorage.setItem("part",Number(num)+1);
        
                    var url=$this.playlist_array[$this.part];
                    $this.AutoPlay('list',url);
                    if ($this.lswap) {
                        $($this.plist).hide();
                    }else{
                        $this.replaylist();
                    }
                    //来源列表
                } else if (type === "flag") {
                    $this.pflag = Number(num);
                    $this.reflaglist();
                    $this.replaylist($this.pflag);
                }

               if(type && type !== "flag" && type !== "list" ){
                    $this.reline();
                    if ($this.lswap || $this.autohide) { $($this.pline).hide();}
                }
            });

        },

       setTitle:function (title) {
           document.title=title;    
       },
       
       
       
        /*  内部函数  智能检测播放    */
        AutoPlay: function (type, url, play) {

              //来自播放列表
              if(type==="list"){
                 
                 url = url || this.playlist_array[this.part]|| localStorage.getItem('video');

                  if(this.lsplay('ext',url)){
                     this.xyplay(url); 
                      
                  }else{
                      this.getvideo('checkPlay',url);
             
                      
                  }
           //来自线路
              }else if(type==="line"){
                  
               //  url = url || this.url || localStorage.getItem('video');
        
                  this.jxplay();
        
              }

        },

        /*  内部函数  解析播放    */
        jxplay: function (num, word, nosave) {
            word = word || this.url|| localStorage.getItem('video');  if(word===''){$this.loadtime(true);return;}
            num = num || this.myurl;
            nosave = nosave || false;
            setCookie("live_num", "", $this.timecookie);

            if (!nosave) {
                setCookie("url_num", num, $this.timecookie);
                this.myurl = num;
                this.onflag = 'line';
            }
            if (this.url_array.length > 0) {
                if (this.myurl > this.url_array.length) {
                    this.myurl = 0;
                }
               // console.log(this.url_array);
                
                var url = this.url_array[this.myurl].url; 
                if (url !== "") {
                    var url = this.url_array[this.myurl].url + word;
                    this.farme(this.player, url, this.success);
                    console.log("当前播放(解析)：" +this.url);
                } else {

                   this.errorHandler('解析失败！', true);
                    console.log("未发现有效解析,请检查配置！");
                }
            } else {


               this.errorHandler('解析失败！', true);
            }

        },

        /* 内部函数  直播播放 */
        liveplay: function (num, nosave) {
            nosave = nosave || false;
            if ("undefined" !== typeof this.play.define.live_url && num !== "") {
                var url = Base64.decode(this.play.define.live_url[num]);
                try {
                    top.document.title = "正在直播:【" + num + "】" + "--" + this.mytitle;
                } catch (error) {
                    document.title = "正在直播:【" + num + "】" + "--" + this.mytitle;
                }
                this.live_num = num;
                this.relive();
                if (!nosave) {
                    setCookie("live_num", num, $this.timeout);
                } else {
                    setCookie("live_num", "", $this.timeout);
                }
                setTimeout(url, 0);
            }
        },
        /* 外部简化函数  直播播放 */
        live: function (url, myplay) {

            this.xyplay(url, 1, myplay);
        },

        /* 外部简化函数  直播跨域播放   */
        lives: function (url, myplay) {
            url = this.host + "video/m3u8.php?url=" + encodeURIComponent(url) + "#.m3u8";
            this.xyplay(url, 1, myplay);
        },

        /* 外部简化函数  链接播放   */
        href: function (url) {    
            this.echo(url, false, true);

            $(this.list).hide();

        },

        /* 外部简化函数  链接跳转   */
        jmp: function (url) {
            location.href = url;
        },

        /* 外部简化函数   框架内打开链接   */
       open:function(url){

         $(this.player).html('<iframe id="lineFrame" width="100%" height="100%" src="' + url + '" frameborder="0" border="0" marginwidth="0" marginheight="0" scrolling="no" allowfullscreen="allowfullscreen"  mozallowfullscreen="mozallowfullscreen"  msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen"></iframe>');
         $this.loadtime(true);
     
       },


        /* 内部函数  https协议自适应   */
        lshttps: function (word) {
            var protocol = getCookie("protocol");
            //https访问http资源时尝试替换协议
            if (protocol === "") {
                protocol = (/https:/i.test(word)) ? "https:" : "http:";
                if ("https:" === location.protocol && "http:" === protocol) {
                    setCookie("protocol", protocol, $this.timecookie);
                    location.protocol = protocol;
                    console.log("当前协议：" + location.protocol + "=>资源协议:" + protocol);
                    return 0;
                }
                //替换成功
            } else if (protocol === location.protocol) {
                setCookie("protocol", "", 0);
                return 1;
                //替换失败
            } else {
                return -1;
            }
        },

        /* 内部函数  本地播放   */
        xyplay: function (word, live, myplay) {
            word = word || this.playlist_array[this.part];
            
           //将当前播放视频写入缓存,用于线路切换
            localStorage.setItem('video',word);
         
            if (!this.lsplay('play', word)) {
                this.onflag = 'auto';
                this.farme(this.player, "./?v=" + word, this.success);
                return true;
            }
            live = live || _GET('live') ? 1 : 0;
            myplay = myplay || this.myplayer;
            
            //https协议自适应
            //if(this.play.off.lshttps==="1"){if(this.lshttps(word)===-1){word=word.replace("http:","https:");};}
            if (this.play.off.lshttps === "1" && "https:" === location.protocol) {
                word = word.replace("http:", "https:");
            }

            setCookie("list_num", this.part, $this.timecookie);


            if (myplay === "自定义") {
                var url = this.diyplayer + word;
            } else {
                var url = "" + myplay + "/?live=" + live + "&autoplay=" + this.autoplay + "&url=" + encodeURIComponent(word) + "&logo_off=" + this.play.play.all.logo_off + "&logo_style=" + this.play.play.all.logo_style + "&ver=" + (this.play.play.all.ver === "1" ? "x" : "") + "&p2pinfo=" + this.play.play.all.p2pinfo + "&posterr=" + this.play.off.posterr + "&seektime=" + this.play.play.all.seektime + "&danmaku=" + this.play.play.all.danmaku;
               
                url+="&menu_off="+this.play.play.all.contextmenu.off;
            
            }

            this.farme(this.player, "player/?url=" + Base64.encode(url), this.success);

            if (this.title && !live) {

                try {
                    top.document.title="正在播放:【" + this.title + "】part " + (Number(this.part) + 1) + "-- " + this.mytitle;
                } catch (error) {
                    document.title="正在播放:【" + this.title + "】part " + (Number(this.part) + 1) + "-- " + this.mytitle;
                }


            }

            if (!live) {
                this.live_num = "";
                setCookie("live_num", this.live_num, $this.timecookie);
                this.onflag = 'yun';
                console.log("当前播放(云播)：" + word);
   

            } else {
                this.onflag = 'live';
                console.log("当前播放(直播)：" + word);
            }

        },
        
          /* 共用函数    云播 上集  */
        video_part: function (part) {
            if (Number(part) <= 0 || umber(this.part) + 1 >= this.playlist_array.length) {
                return false;
            }
            this.part=part;
            this.AutoPlay('list');
        },
        
        
        /* 共用函数    云播 上集  */
        video_front: function () {
            if (Number(this.part) <= 0) {
                return false;
            }
            this.part--;
            this.AutoPlay('list');
        },
        /* 共用函数  云播 下集  */
        video_next: function () {
            if (Number(this.part) + 1 >= this.playlist_array.length) {
                return false;
            }
            this.part++;
            this.AutoPlay('list');
        },

        /* 共用函数  云播  停止处理  */
        endHandler: function () {
            this.video_next();
        },

        /*  内部函数，加载网页  */

        loadhtml: function (url, time) {
            this.farme(this.playad, url,this.success);
        },

        /*   内部函数，刷新线路列表   */
        reline: function () {

            $(this.line).empty();
            //如果非搜索(wd)，则显示自动切换
            if (this.tp !== "wd") {
                if (this.onflag === 'auto' || (this.play.off.yun === "0" && this.onflag === 'yun')) {
                    $(this.line).append('<li class="click_work"  style="' + this.play.style.line_on + '" type="line" num="auto"> 自动√</li>');
                } else {
                    $(this.line).append('<li class="click_work" type="line" num="auto">自动</li>');
                }
            }

            //如果选择标志为云播或存在剧集数据或可本地播放,则显示云播
            if (this.play.off.yun === "1" && (this.onflag === 'yun' || this.playlist_array.length > 0 || this.lsplay('ext', this.url))) {

                //如果选择标志为云播，则选中云播

                if (this.onflag === 'yun') {
                    $(this.line).append('<li class="click_work"  style="' + this.play.style.line_on + '" type="line" num="yun">' + this.play.all.yun_title + '√</li>');
                } else {
                    $(this.line).append('<li class="click_work" type="line" num="yun">' + this.play.all.yun_title + '</li>');
                }
            }
            //如果解析开关为开非搜索(wd)且样式显示开关为开且解析，则显示线路

            if (this.play.off.jx === "1"&& this.play.style.line_show === "1" && "undefined" !== typeof this.play.define.jx_url && this.play.define.jx_url.length > 0) {
                for (var i = 0, len = this.play.define.parse.length; i < len; i++) {
                    
                    if(this.play.define.parse[i].off==='0'){continue;}
                    
                     var name=this.play.define.parse[i].name;
      
                    //如果如果选择标志为线路且与缓存线路相同则选中
                    if (this.onflag === 'line' && Number(this.myurl) === i) {
                        $(this.line).append('<li class="click_work" style="' + this.play.style.line_on + '" type="line" num="' + i + '"> ' + name + '√</li>');
                    } else {
                        $(this.line).append('<li class="click_work" type="line" num="' + i + '"> ' + name + '</li>');
                    }
                }


            };
            //自定义链接
            if (this.play.off.mylink ==="1") {
                for (var key in $this.play.define.jx_link) {
                    if (key !== "") {
                        $(this.line).append('<li class="click_work" type="link" num="' + key + '">' + key + '</li>');
                    }
                };
            }

            //使用说明
            if (this.play.off.help === "1" && !this.app) {
                $(this.line).append('<li class="click_work" type="line" num="h">使用说明</li>');
            }

            if (this.play.off.live === "1") {
                this.relive();
            }

        },

     
     //刷新直播
        relive: function () {
            $(this.plive).empty();
            for (var key in $this.play.define.live_url) {
                if (key === this.live_num && 'live' === this.onflag) {
                    $(this.plive).append('<li class="click_work " style="' + this.play.style.line_on + '" type="live" num="' + key + '">' + key + '√</li>');
                } else {
                    $(this.plive).append('<li class="click_work" type="live" num="' + key + '">' + key + '</li>');
                }
            };
        },



        /*  内部函数 后台刷新播放列表   */
        relist: function (autoflag) {
            this.reflaglist();
            this.replaylist(null, autoflag);
        },

        /*  内部函数 刷新来源列表  */
        reflaglist: function (flag) {
            
            $(this.flaglist).empty();
            this.flaglist_array = [];
            for (var i = 0, len = this.list_array.length; i < len; i++) {
                this.flaglist_array.push(this.list_array[i].flag);
                var flag_name = this.list_array[i].flag_name ? this.list_array[i].flag_name : this.list_array[i].flag;
                if (i == this.pflag) {
                    $(this.flaglist).append('<li   class="click_work" type="flag" val="' + this.list_array[i].flag + '" num="' + i + '" style="' + this.play.style.play_on + '">' + flag_name + '</li>');
                } else {
                    $(this.flaglist).append('<li   class="click_work" type="flag" val="' + this.list_array[i].flag + '" num="' + i + '">' + flag_name + '</li>');
                }
            }
        },

        /* 内部函数  刷新剧集列表  */
        replaylist: function (flag, autoflag) {

            if (!flag) {
                flag = this.pflag;
                //刷新换资源
                if (this.play.off.autoflag === "1" && autoflag === true) {
                    flag = getCookie("pflag");
                    if (flag === "") {
                        flag = 0;
                    } else {
                        flag++;
                    }
                    if (flag + 1 > this.list_array.length) {
                        flag = 0;
                    }
                    setCookie("pflag", flag, this.timecookie);
                    this.pflag = flag;
                }
            }
            if ("undefined" !== typeof this.list_array[flag] && "undefined" !== typeof this.list_array[flag].video) {
                $(this.playlist).empty();
                this.playlist_array = [];
                this.namelist_array = [];
                var list = this.list_array[flag].video;
                localStorage.setItem('count',list.length);  //将总集数写入缓存
                
                for (var i = 0, len = list.length; i < len; i++) {
                
                    var array = list[i].split("$");
                    //播放列表影片名过滤
                    var pat = new RegExp(this.play.match.video);
                    if (!this.play.video_match || !pat.test(array[0])) {
                        this.namelist_array.push(array[0]);
                        this.playlist_array.push(array[1]);
                        var title=array[0];
                       if(title!=='')
                       

                       
                     {  
                        if (i === Number(this.part)) {
                            $(this.playlist).append('<li class="click_work" type="list" num="' + i + '" style="' + this.play.style.play_on + '">' +title+ '√</li>');
                        } else {
                            $(this.playlist).append('<li class="click_work" type="list" num="' + i + '">' + title + '</li>');
                        }           
                     }
                    }
                    
   
                }
               
                
                

            }

        },

        /*   内部函数   检测并设置滚动条   */
        setcroll: function () {
            $(this.plist).scrollTop(10);
            if ($(this.plist).scrollTop() > 0) {
                $(this.plist).css("right", "0px");
            } else {
                $(this.plist).css("right", "-30px");
            };
            $(this.plist).scrollTop(0);
        },

        /*  内部函数 检测播放  */
        lsplay: function (type, word) {
            word = word || this.url;
   
            switch (type) {
                case 'play':
                    return this.lsplay("ext", word) || this.lsplay("type", this.type);
                    break;

                //检测扩展名是否能本地播放
                case 'ext':
                    if (word === "" || word ===null || typeof word ==="undefined") {
                        return false;
                    }
                  
                    var n = word.search(/\.(ogg|mp4|webm|m3u8)/i);
                    if (n !== -1) {
                        return true;
                    } else if (this.type !== "") {
                        return isurl(this.play.match.playflag, this.type);
                    } else {
                        return false;
                    }
                    break;
                //检测播放文件类型
                case 'type':
                    if (word === "" || word ===null ||typeof word ==="undefined") {
                        return false;
                    }
                   
                    
                    var n = word.search(/(ogg|mp4|webm|m3u8|hls|normal)$/i);
                    if (n !== -1) {
                        return true;
                    } else if (this.type !== "") {
                        return isurl(this.play.match.playflag, this.type);
                    } else {
                        return false;
                    }
                    break;
 
                default:
                    break;

            }
        },

        /* 公共函数： 显示或隐藏线路列表   */
        online: function () {
   
            if ($($this.pline).css("display") === "none") {
                $this.reline();
                $($this.pline).show();
                if($this.lswap){ $($this.player).hide();}
            } else {
                if (this.autohide) {
                    $($this.pline).hide();
                    if($this.lswap){ $($this.player).show();}
                }
            }
        },

        /* 公共函数： 显示或隐藏播放列表   */
        onlist: function () {
           if ($($this.plist).css("display") === "none") {
               $this.relist();
               $($this.plist).show();
               if($this.lswap){ $($this.player).hide();}

           }else{
                $($this.plist).hide();
                if($this.lswap){ $($this.player).show();}
           }
        },

        /* 公共函数： 输出 用户友好提示   */
        echo: function (word, lslogo, lsurl, obj) {
            obj = obj || this.player;
            if (lsurl) {
                // if(this.lshttps(word)===-1){word=word.replace("http:","https:");}
                if (this.play.off.lshttps === "1" && "https:" === location.protocol) {
                    word = word.replace("http:", "https:");
                }
                this.farme(obj, "play.php?url=" + encodeURIComponent(word),this.success);

            } else {
            
                if (lslogo && this.loadimg) {
                    $(obj).html("<div style='margin-top:15%;'><strong >" + word + "</strong><br><img border='0' src='" + this.loadimg + "'></div>");
                } else {
                    $(obj).html("<div style='margin-top:15%;'><strong>" + word + "</strong></div>");
                }
            }
        },
     /*   内部函数：取伪静态参数  */
        getlocId:function () {
            var url=window.location.search.substr(1);
            var r=/^index(\d+)-(\d+)(?:-|)(?:(\d+|))\.(?:htm|html)$/i.exec(url);
            if (r !== null) {
                var videoparm= {type:'id',id:r[1],flag:r[2],part:r[3]};
                //localStorage.setItem('videoparm',JSON.stringify(videoparm));
                return videoparm;
            }else{
                 r= /^live-(\d+)\.(?:htm|html)$/i.exec(url);
                 if (r !== null) {
                 var videoparm= {type:'live',id:r[1]};
                 return videoparm;
             }
            };
            return false; 
        },


        /*  公共函数   输出 超文本信息  */
        html: function (word, obj) {
            obj = obj || this.player;
            $(obj).html(word);
        },

        /*   内部函数：输出 高亮调试信息  */
        onVer: function () {
            var message = "影视前线 by https://oqipo.xyz";
            if (typeof console === 'object') {
                console.log("\n %c 影视前线 %c https://oqipo.xyz  %c Video Parse Platform \n\n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #00f; padding:5px 0;", "background: #fadfa3; padding:5px 0;");
            } else if (typeof opera === 'object') {
                opera.postError(message);
            } else if (typeof java === 'object' && typeof java.lang === 'object') {
                java.lang.System.out.println(message);
            }
        },

        /*   公共函数：输出 调试信息  */
        log: function (message) {
            if ("undefined" !== typeof this.play && this.play.off.log === "1") {
                if (typeof console === 'object') {
                    console.log(message);
                } else if (typeof opera === 'object') {
                    opera.postError(message);
                } else if (typeof java === 'object' && typeof java.lang === 'object') {
                    java.lang.System.out.println(message);
                }
            }
        },

        /*  内部函数   加载倒计时 */
        loadtime: function (close) {
            if (close) {
                $($this.playad).empty().hide();
                $($this.player).show();
            } else {
                $($this.player).hide();
                $($this.playad).empty().show();
                $this.count = 0;
                $this.tipstime();
            }
        },

        /*  内部函数   加载框架   */
        farme: function (obj, url, code) {
            if ($($this.playad).is(':hidden')) {
                $this.loadtime();
            }
            $(obj).html('<iframe id="lineFrame" width="100%" height="100%" src="' + url + '" frameborder="0" border="0" marginwidth="0" marginheight="0" scrolling="no" allowfullscreen="allowfullscreen"  mozallowfullscreen="mozallowfullscreen"  msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen"></iframe>');
           
            if(this.wait==='0'){return code();}
           
            var iframe = document.getElementById("lineFrame");
            if (iframe.attachEvent) {
                iframe.attachEvent("onload", function () {

                    if (code) {
                        code();
                    }
                });
            } else {
                iframe.onload = function () {
                    if (code) {
                        code();
                    }
                };
            }

        },

        //显示读秒信息
        tipstime: function () {
            if (!$($this.playad).is(':hidden')) {
                this.echo(this.play.all.load_info+ this.count + "s", true, false, this.playad);
                if (this.count >= 20) {
                    this.echo("<span style='color:#f90;'>解析响应超时，请刷新重试！</span>&nbsp;<span style='color:#00f;'><a href = 'javascript:;' onclick ='location.reload();'>刷新</a></span>", false, false, this.playad);
                } else {
                    this.count += 1;
                    setTimeout(function () {
                        $this.tipstime();
                    }, 1000);
                };
            }
        },

        /* 共用函数  加载错误处理   */
        errorHandler: function (word) {
            word = !word ? '视频加载失败' : word;
            console.log("错误：" + word);
            var reload = getCookie("reload");
            if (reload !== window.location.href) {
                setCookie("reload", window.location.href, $this.timeout);
                window.location.replace(window.location.href);
            } else {
                setCookie("reload", "", $this.timeout);
                if (this.play.off.jx === '1' && "undefined" !== this.url_array && this.url_array.length > 0 && this.url!=='') {
                    this.jxplay(this.myurl, this.url);
                } else {
                    this.href("404.php");
                }
            }
        },
        loadjs: function (src) {
            var hm = document.createElement("script");
            hm.src = src;
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        },
     htmlspecialchars:function (str ) {
         return  str.replace(/<\/?.+?>/g, "");
     }
    };
    return xyplayer ;
});