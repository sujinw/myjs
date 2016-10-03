//==================================================DEMO============================
/*
html 

<div id="div1"></div>

css

#div1{width:100px;height:100px;border:1px solid red;background:black;opacity:100;position:absolute;}


js调用
var animate = new animate("#div1",{
	styles:{
		//width:200,
		//height:400,
		left:200,
		opacity:20
		//background:"#ddd",
	},
	timeIn:1000,//几秒内开始动画
	callback:function(ele,obj){
		animate.next([
			{
			top:500
		},{
			left:0
		},{
			top:0
		},{
			left:200,
			top:100,
		},{
			width:200,
			height:200,
		},{
			opacity:20
		}
		])
	}
});*/
/*
	tips : 第一次初始化时要实现的动画写在参数的style里，
			后续的链式动画写在callback里，调用自身的next方法，
			其参数是一个数组，里面装着object，每一组动画一个object
	参数说明：speed 速度，越大缓冲效果越明显，
			  timeIn 每个动画开始的时间
			  style  default 默认动画，后续考虑css动画
			  callback 动画完成执行
			  
		error ： 目前next方法不支持回调，不支持链式如next().next()
		
		目前不支持css3,动画的属性值需要传js的默认小驼峰命名的属性，如fontSize

*/
//++++++++++++++++++++++++++++++++++++++++++++++++DEMO++++++++++++++++++++++++++++++++++


//扩展获取样式
HTMLElement.prototype.__defineGetter__("currentStyle", function () { 
	return this.ownerDocument.defaultView.getComputedStyle(this, null); 
});
//合并json*/ 
function addJson(jsonbject1, jsonbject2) {
    var resultJsonObject={};
    for(var attr in jsonbject1){
        resultJsonObject[attr]=jsonbject1[attr];
    }
    for(var attr in jsonbject2){
        resultJsonObject[attr]=jsonbject2[attr];
    }
 
    return resultJsonObject;
};
//debug
function debug(title,data){
	console.log(title);
	console.log(data)
}
//判断json是否有某个key
function jsonHasKey(json,key){
	if(typeof json !== 'object') return false;
	if(json[key]){return true}
	return false;
}
//设置属性
function attr(ele,key,value){
	ele.setAttribute(key,value);
}
//删除节点
function removeNodeById(id) {
	var node = document.getElementById(id);
	if (node) {
		node.parentNode.removeChild(node);
	}
}
//获取css
function getStyle(curEle,attr){  
    var val = null,reg = null;  
    if("getComputedStyle" in window){
		if(attr === "background"){
			val = curEle.currentStyle.backgroundColor;
		}else{
			val = window.getComputedStyle(curEle,null)[attr];
		}
        
    } else {   //ie6~8不支持上面属性  
        //不兼容  
        if(attr === "opacity"){  
            val = curEle.currentStyle["filter"];   //'alpha(opacity=12,345)'  
            reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;  
            val = reg.test(val)?reg.exec(val)[1]/100:1;  
        }else {  
            val = curEle.currentStyle[attr];  
        }  
    }  
    reg = /^(-?\d+(\.\d)?)(px|pt|em|rem)?$/i;  
    return reg.test(val)?parseFloat(val):val;  
}
//十六进制颜色值的正则表达式  
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;  
/*RGB颜色转换为16进制*/  
String.prototype.colorHex = function(){  
    var that = this;  
    if(/^(rgb|RGB)/.test(that)){  
        var aColor = that.replace(/(?:||rgb|RGB)*/g,"").split(",");  
        var strHex = "#";  
        for(var i=0; i<aColor.length; i++){  
            var hex = Number(aColor[i]).toString(16);  
            if(hex === "0"){  
                hex += hex;   
            }  
            strHex += hex;  
        }  
        if(strHex.length !== 7){  
            strHex = that;    
        }  
        return strHex;  
    }else if(reg.test(that)){  
        var aNum = that.replace(/#/,"").split("");  
        if(aNum.length === 6){  
            return that;      
        }else if(aNum.length === 3){  
            var numHex = "#";  
            for(var i=0; i<aNum.length; i+=1){  
                numHex += (aNum[i]+aNum[i]);  
            }  
            return numHex;  
        }  
    }else{  
        return that;      
    }  
};  
  
//-------------------------------------------------  
  
/*16进制颜色转为RGB格式*/  
String.prototype.colorRgb = function(){  
    var sColor = this.toLowerCase();  
    if(sColor && reg.test(sColor)){  
        if(sColor.length === 4){  
            var sColorNew = "#";  
            for(var i=1; i<4; i+=1){  
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
            }  
            sColor = sColorNew;  
        }  
        //处理六位的颜色值  
        var sColorChange = [];  
        for(var i=1; i<7; i+=2){  
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
        }  
        return "rgb(" + sColorChange.join(", ") + ")";  
    }else{  
        return sColor;    
    }  
}; 
//选择器
function selector(obj){
	var ele = [];
	switch(typeof obj){
		case 'string' :
			switch (obj.charAt(0)){
				case '#' :  
					ele.push(document.querySelector(obj));
 				break;
				case '.' :   
					ele = document.querySelectorAll(obj);
				break;
				default :    
					ele = document.querySelectorAll(obj);
			}
		break;
		case 'object' :
			ele.push(obj);
		break;
	};
	return ele;
 };

;(function(window){
//动画函数封装
function animate(ele,option){
	this.defaultOption = {
		styles:{},
		speed:20,
		timeIn:1000,
		type:'default',//css3后续添加
		callback:function(obj){console.log(obj);alert("执行完成了！")}
	}
	var options = typeof option === 'object' ? option : {};
	this.opt = addJson(this.defaultOption,options);
	this.ele = selector(ele);
	this.nextNum = 0;
	this.nextOption = {};
	this.nextEnd = false;
	console.log("操作元素集合");
	console.log(this.ele);
	console.log("目前的配置");
	console.log(this.opt);
	//console.log(getStyle(this.ele[0],'background'));
	this.init();
}

animate.prototype = {
	init:function(){
		this.getOldStyle();
				
		console.log("原来的style");
		console.log(this.oldStyle);
		var self = this;
		setTimeout(function(){
			self.setNewStyle();
		},this.opt.timeIn);
	},
	getOldStyle:function(){
		//获取原来的style并且根据新的targit 设置新的值
		var oldStyle = [];
		if(this.opt.styles || typeof this.opt.styles === 'object'){
			
			if(typeof this.ele === 'object'){
				for(var i=0; i<this.ele.length;i++){
					for(var k in this.opt.styles){
						
						if(k == 'opacity'){  
							if(Math.round(parseFloat(getStyle(this.ele[i],k))*100)==0){  
								oldStyle[k] = Math.round(parseFloat(getStyle(this.ele[i],k))*100);  
							}else{  
								oldStyle[k] = Math.round(parseFloat(getStyle(this.ele[i],k))*100) || 100;  
							}     
						}else if(k == 'background'){
							oldStyle[k] = getStyle(this.ele[i],k).colorRgb();
						}else{  
							oldStyle[k] = parseInt(getStyle(this.ele[i],k)) || 0;  
						}  
					}
				}				
			}
		}
		this.oldStyle = oldStyle;//把原来的style存为本身的对象，供后面加减和返回操作
	},
	setNewStyle:function(next){
		//设置新的属性
		var next = next || false
		console.log("next"+next)
		if(typeof this.ele === 'object'){
			var self=this;
			
			var oldStyle = [];
			for(var i=0; i<self.ele.length;i++){
				(function(i){
					self.ele[i].timer = setInterval(function(){
						var isstop = true;
						for(var k in self.opt.styles){
							if(k == 'opacity'){  
								if(Math.round(parseFloat(getStyle(self.ele[i],k))*100)==0){  
									oldStyle[k] = Math.round(parseFloat(getStyle(self.ele[i],k))*100);  
								}else{  
									oldStyle[k] = Math.round(parseFloat(getStyle(self.ele[i],k))*100) || 100;  
								}     
							}else if(k == 'background'){
								oldStyle[k] = getStyle(self.ele[i],k).colorRgb();
								self.opt.styles[k] = self.opt.styles[k].colorRgb();
							}else{  
								oldStyle[k] = parseInt(getStyle(self.ele[i],k)) || 0;  
							}  
							//console.log(k+self.opt.styles[k]+"===="+k+oldStyle[k])
							var iSpeed = (parseInt(self.opt.styles[k]) - parseInt(oldStyle[k]))/self.opt.speed;
								iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
							if(self.opt.styles[k] != oldStyle[k]){ 
								//alert("完成了");
								isstop = false;  
							}
							if(k == 'opacity'){  
								self.ele[i].style.filter = 'alpha(opacity=' +(oldStyle[k] + iSpeed)+ ')';  
								self.ele[i].style.opacity = (oldStyle[k] + iSpeed)/100;     
							}else if(k == 'background'){
								self.ele[i].style['background'] = self.opt.styles[k];
							}else{  
								self.ele[i].style[k] = oldStyle[k] + iSpeed + 'px';  
							}
						}
						if(isstop){  
							clearInterval(self.ele[i].timer); 
							//console.log(typeof self.opt.callback)
							self.isend = true;
							//console.log("next"+next);
							if(next){
								self.nextNum ++;
								if(self.nextNum > self.nextOption.length){
									self.nextEnd = true;
								}
								self.next(self.nextOption);
								
							}
							if(typeof self.opt.callback == 'function' && !next){  
								self.opt.callback.call(self.ele[i],self.ele,self);
							}  
						}  
					},30);
				})(i);
			}
		}
	},
	next:function(obj){
		if(this.nextEnd){
			console.log("此次动画已经完完成")
			return false;
		}
		this.nextOption = obj;
		var objs = typeof this.nextOption[this.nextNum] == "object" ? this.nextOption[this.nextNum] :{};
		this.opt['styles']=objs;
		console.log(this.opt)
		var self = this;
		
		setTimeout(function(){
			self.setNewStyle(true);			
		},this.opt.timeIn);
		return false;
	}
	
}

window.animate = animate;
})(window)