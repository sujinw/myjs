//==================================================DEMO============================
/*
html 

<div id="div1"></div>

css

#div1{width:100px;height:100px;border:1px solid red;background:black;opacity:100;position:absolute;}


js����
var animate = new animate("#div1",{
	styles:{
		//width:200,
		//height:400,
		left:200,
		opacity:20
		//background:"#ddd",
	},
	timeIn:1000,//�����ڿ�ʼ����
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
	tips : ��һ�γ�ʼ��ʱҪʵ�ֵĶ���д�ڲ�����style�
			��������ʽ����д��callback����������next������
			�������һ�����飬����װ��object��ÿһ�鶯��һ��object
	����˵����speed �ٶȣ�Խ�󻺳�Ч��Խ���ԣ�
			  timeIn ÿ��������ʼ��ʱ��
			  style  default Ĭ�϶�������������css����
			  callback �������ִ��
			  
		error �� Ŀǰnext������֧�ֻص�����֧����ʽ��next().next()
		
		Ŀǰ��֧��css3,����������ֵ��Ҫ��js��Ĭ��С�շ����������ԣ���fontSize

*/
//++++++++++++++++++++++++++++++++++++++++++++++++DEMO++++++++++++++++++++++++++++++++++


//��չ��ȡ��ʽ
HTMLElement.prototype.__defineGetter__("currentStyle", function () { 
	return this.ownerDocument.defaultView.getComputedStyle(this, null); 
});
//�ϲ�json*/ 
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
//�ж�json�Ƿ���ĳ��key
function jsonHasKey(json,key){
	if(typeof json !== 'object') return false;
	if(json[key]){return true}
	return false;
}
//��������
function attr(ele,key,value){
	ele.setAttribute(key,value);
}
//ɾ���ڵ�
function removeNodeById(id) {
	var node = document.getElementById(id);
	if (node) {
		node.parentNode.removeChild(node);
	}
}
//��ȡcss
function getStyle(curEle,attr){  
    var val = null,reg = null;  
    if("getComputedStyle" in window){
		if(attr === "background"){
			val = curEle.currentStyle.backgroundColor;
		}else{
			val = window.getComputedStyle(curEle,null)[attr];
		}
        
    } else {   //ie6~8��֧����������  
        //������  
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
//ʮ��������ɫֵ��������ʽ  
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;  
/*RGB��ɫת��Ϊ16����*/  
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
  
/*16������ɫתΪRGB��ʽ*/  
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
        //������λ����ɫֵ  
        var sColorChange = [];  
        for(var i=1; i<7; i+=2){  
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
        }  
        return "rgb(" + sColorChange.join(", ") + ")";  
    }else{  
        return sColor;    
    }  
}; 
//ѡ����
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
//����������װ
function animate(ele,option){
	this.defaultOption = {
		styles:{},
		speed:20,
		timeIn:1000,
		type:'default',//css3�������
		callback:function(obj){console.log(obj);alert("ִ������ˣ�")}
	}
	var options = typeof option === 'object' ? option : {};
	this.opt = addJson(this.defaultOption,options);
	this.ele = selector(ele);
	this.nextNum = 0;
	this.nextOption = {};
	this.nextEnd = false;
	console.log("����Ԫ�ؼ���");
	console.log(this.ele);
	console.log("Ŀǰ������");
	console.log(this.opt);
	//console.log(getStyle(this.ele[0],'background'));
	this.init();
}

animate.prototype = {
	init:function(){
		this.getOldStyle();
				
		console.log("ԭ����style");
		console.log(this.oldStyle);
		var self = this;
		setTimeout(function(){
			self.setNewStyle();
		},this.opt.timeIn);
	},
	getOldStyle:function(){
		//��ȡԭ����style���Ҹ����µ�targit �����µ�ֵ
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
		this.oldStyle = oldStyle;//��ԭ����style��Ϊ����Ķ��󣬹�����Ӽ��ͷ��ز���
	},
	setNewStyle:function(next){
		//�����µ�����
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
								//alert("�����");
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
			console.log("�˴ζ����Ѿ������")
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