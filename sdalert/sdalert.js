/**
 * 移动端model弹窗和提示插件封装
 */
//////////////////////////////////////////////////////////////////////////////////////////////
//=============================DEMO======================================================== //
//	
/*var model1 = new model({
	title:"模态框标题",
	content:"这是一条模态框的提示说明",
  button:{
    '确定':{
      callback:function(){
        model1.close(function(){
          new model({
            id:"aa",
          });
        });
      }
    }
  }
});*/
// new model({id:"test"});
/*new tips({
  closed:function(){
    new tips({
      id:'tips-1',
      icon:'success',
      closed:function(){
        new tips({
          id:"warn",
          icon:"warn",
          closed:function(){
            alert('全部展示完成了');
          }
        });
      }
    });
  }
});                                                                                      //
                                                                                   //
//////////////////////////////////////////////////////////////////////////////////////////////
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
function debug(title,data){
	console.log(title);
	console.log(data)
}
function jsonHasKey(json,key){
	if(typeof json !== 'object') return false;
	if(json[key]){return true}
	return false;
}
function attr(ele,key,value){
	ele.setAttribute(key,value);
}
function removeNodeById(id) {
	var node = document.getElementById(id);
	if (node) {
		node.parentNode.removeChild(node);
	}
}


/**
 * [模态框]
 * @param    {[type]}                 window [description]
 * @return   {[type]}                        [description]
 * @Author   Rukic
 * @DateTime 2016-09-24T20:55:33+0800
 */
;(function(window){

	function model(option){
		var defaultOpt = {
			id:"model",
			button:{
				"取消":{
					style:{'background':'#fff',"color":"#999"},
					callback:function(){}
				},
				"确定":{
					style:{'background':'#fff',"color":"#0BB20C"},
					callback:function(){}
				}
			},
			content:"model封装",
			title:"标题",
			shadow:true,//遮罩
			shadowClose:true,
			closed:function(){},
		}
		option = typeof option === 'object' ? option : {};
		this.opt = addJson(defaultOpt,option);
		this.init();	
	}
	model.prototype = {
		init:function(){
			this.createCss();
			this.createShadow();
			this.createWin();
			this.createTitle();
			this.createContent();
			this.createBtn();
			this.innsertToBody();

			//事件
			//this.closeEvent();

			if(this.opt.shadowClose){
				var shadow = document.getElementsByClassName('model-shadow')[0];

				var self = this;
				shadow.onclick = function(){
					self.close();
				}
			}
		},
		createWin:function(){
			var win = document.createElement('div');
			//设置id
			attr(win,'id',this.opt['id']);
			attr(win,'class','model-phone');
			console.log(win);
			this.win = win;
		},
		createShadow:function(){
			var shadow = document.createElement('div');
				attr(shadow,'id','model-shadow-'+this.opt.id);
				attr(shadow,'class','model-shadow');
				this.shadow = shadow;
		},
		createTitle:function(){
			var title = document.createElement('div');
			attr(title,'class','model-title');
			title.innerHTML = this.opt.title;
			this.title = title;
			this.win.appendChild(this.title);
		},
		createContent:function(){
			var content = document.createElement('div');
			attr(content,'class','model-content');
			content.innerHTML = this.opt['content'];
			console.log(content);
			this.content=content;
			this.win.appendChild(content);
		},
		createBtn:function(){
			var btns = this.opt.button;
			var btnBox = document.createElement('div');
			attr(btnBox,'class','model-btn-box');
			var i=0;
			for(var k in btns){

				var btn = document.createElement('a');

				if((i+1)%2 == 0 ){
					attr(btn,"class","two-btn");
				}
				btn.innerHTML = k;
				if(jsonHasKey(btns[k],'style')){
					var styleText = "";
					for(var key in btns[k]['style']){
						styleText += key + ":" + btns[k]['style'][key] + ";";
					}
					attr(btn,'href','javascript:;');
					attr(btn,'style',styleText);
					console.log(btns[k]['style']);
				}
				if(jsonHasKey(btns[k], 'callback')){
					debug('事件',typeof btns[k]['callback']);
					//绑定回调
					if(typeof btns[k]['callback'] === 'function'){
						btn.onclick =  function(){
							btns[k]['callback']();
						}
					}
				}
				btnBox.appendChild(btn);
				i++;
			}
			console.log(btnBox)
			this.btnBox;
			this.win.appendChild(btnBox);
			
		},
		createCss:function(){
			var cssText = document.createElement("style");
				attr(cssText,'id',this.opt['id']+"_style");
			var str = ".model-shadow{position: fixed;z-index: 1000;width: 100%;height: 100%;top: 0;left: 0;background: rgba(0,0,0,.6);}";
				str+= ".model-phone{position: fixed;z-index: 5000;width: 85%;top: 50%;left: 50%;-webkit-transform: translate(-50%,-50%); transform: translate(-50%,-50%);background-color: #fafafc;text-align: center; border-radius: 3px;overflow: hidden;}"
				str+= ".model-phone .model-title{font-weight: 400;font-size: 17px;padding: 1.2em 20px .5em;}";
				str+= ".model-phone .model-content{padding: 0 20px;font-size: 15px;color: #888;word-wrap: break-word; word-break: break-all;}";
				str+= ".model-phone .model-btn-box{position: relative;line-height: 42px;margin-top: 20px;font-size: 17px;display: -webkit-box;display: -webkit-flex; display: flex;}";
				str+= ".model-phone .model-btn-box:after{content: '';position: absolute;left: 0; top: 0; right: 0;height: 1px; border-top: 1px solid #D5D5D6; color: #D5D5D6; -webkit-transform-origin: 0 0;transform-origin: 0 0; -webkit-transform: scaleY(0.5);transform: scaleY(0.5);}";
				str+= ".model-phone .model-btn-box .two-btn:after{content: ''; position: absolute; left: 0;top: 0; width: 1px; bottom: 0; border-left: 1px solid #D5D5D6;color: #D5D5D6; -webkit-transform-origin: 0 0;transform-origin: 0 0; -webkit-transform: scaleX(0.5);transform: scaleX(0.5);}";
				str+= ".model-phone .model-btn-box a{display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1; color: #3cc51f;text-decoration: none; -webkit-tap-highlight-color: rgba(0,0,0,0);position: relative;}";
			cssText.innerHTML = str;			
			this.cssText = cssText;
			document.getElementsByTagName('body')[0].appendChild(this.cssText);

		},
		innsertToBody:function(){
			//插入
			var body = document.getElementsByTagName('body')[0];
			if(jsonHasKey(this.opt,'shadow')){
				//this.shadow.appendChild(this.win);
				body.appendChild(this.shadow);
				body.appendChild(this.win);
			}else{
				body.appendChild(this.win);
			}
		},
		//事件开始
		close:function(fun){
			var shadow = document.getElementsByClassName('model-shadow')[0];
			var win = document.getElementsByClassName('model-phone')[0];
			console.log(shadow);
			win.style.display = 'none';
			shadow.style.display = 'none';
			removeNodeById('model-shadow-'+this.opt.id)
			removeNodeById(this.opt['id']+"_style")
			removeNodeById(this.opt.id)
			this.opt.closed();
			if(typeof fun === 'function'){
				fun();
			}
		}
	}
	window.model = model;
})(window)
/**
 * [提示插件]
 * @param    {[type]}                 window [description]
 * @return   {[type]}                        [description]
 * @Author   Rukic
 * @DateTime 2016-09-24T22:07:07+0800
 */
;(function(window){
	function tips(option){
		var defaultOpt = {
				id:"tips",
				icon:'loading',//false不要,success,warn,loading
				tips:"提示信息",
				timeOut:3,//单位秒
				closed:function(){},
			}
			option = typeof option === 'object' ? option : {};
			this.opt = addJson(defaultOpt,option);
			this.init();
	}
	tips.prototype = {
		init:function(){
			this.createCss();
			this.createWin();
			this.createIcon();
			this.createTips();
			this.insertToBody();

			//自动关闭
			if(this.opt.timeOut){
				var self = this;
				setTimeout(function(){
					self.close(self.closed());
				},parseInt(self.opt.timeOut)*1000);
			}
		},
		createWin : function(){
			var win = document.createElement('div');
			attr(win,"id",this.opt.id);
			attr(win,"class",'tips-win');
			this.win = win;
		},
		createIcon : function(){
			var icon = document.createElement('i');
			if(this.opt.icon){
				attr(icon,'class','tips-icon '+this.opt.icon);
			}
			this.icon = icon;
			this.win.appendChild(icon);
		},
		createTips:function(){
			var tips = document.createElement('p');
			attr(tips,'class','tips-content');
			tips.innerHTML = this.opt.tips;
			this.tips = tips;
			this.win.appendChild(tips);
		},
		createCss:function(){
			var style = document.createElement('style');
			var cssText = "@font-face {font-weight: normal;font-style: normal;  font-family: 'weui';  src: url('data:application/octet-stream;base64,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') format('truetype');}";
				cssText += ".tips-win{position: fixed;z-index: 5000; width: 7.6em; min-height: 7.6em; top: 180px; left: 50%; margin-left: -3.8em;background: rgba(40, 40, 40, 0.75); text-align: center; border-radius: 5px;color: #FFFFFF;}"		
				cssText += ".tips-win .tips-icon{margin: 22px 0 0; display: block;}";
				cssText += ".tips-win .tips-icon:before{color: #FFFFFF;font-size: 55px;font-family: 'weui'; font-style: normal;font-weight: normal; speak: none;display: inline-block;vertical-align: middle;text-decoration: inherit;width: 1em;margin-right: .2em;text-align: center;font-variant: normal;text-transform: none;line-height: 1em;margin-left: .2em; text-shadow: 1px 1px 1px rgba(127, 127, 127, 0.3); }"
				cssText += ".tips-win .success:before{ content:'\\EA08';}";
				cssText += ".tips-win .warn:before{ content:'\\EA0B';}";
				cssText += ".tips-win .loading{width: 20px; height: 20px;display: inline-block;vertical-align: middle;-webkit-animation: weuiLoading 1s steps(12, end) infinite;animation: weuiLoading 1s steps(12, end) infinite; background: transparent url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iciIgd2lkdGg9JzEyMHB4JyBoZWlnaHQ9JzEyMHB4JyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJub25lIiBjbGFzcz0iYmsiPjwvcmVjdD4KICAgIDxyZWN0IHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjRTlFOUU5JwogICAgICAgICAgdHJhbnNmb3JtPSdyb3RhdGUoMCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+CiAgICA8L3JlY3Q+CiAgICA8cmVjdCB4PSc0Ni41JyB5PSc0MCcgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHJ4PSc1JyByeT0nNScgZmlsbD0nIzk4OTY5NycKICAgICAgICAgIHRyYW5zZm9ybT0ncm90YXRlKDMwIDUwIDUwKSB0cmFuc2xhdGUoMCAtMzApJz4KICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyM5Qjk5OUEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+CiAgICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz4KICAgIDwvcmVjdD4KICAgIDxyZWN0IHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjQTNBMUEyJwogICAgICAgICAgdHJhbnNmb3JtPSdyb3RhdGUoOTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNBQkE5QUEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxMjAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNCMkIyQjInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxNTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNCQUI4QjknCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxODAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNDMkMwQzEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyMTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNDQkNCQ0InCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyNDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNEMkQyRDInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyNzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNEQURBREEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgzMDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNFMkUyRTInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgzMzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0Pgo8L3N2Zz4=) no-repeat;background-size: 100%;}";
				cssText += ".tips-win .loading{margin: 30px 0 0;width: 38px;height: 38px;vertical-align: baseline;}";
				cssText += "@-webkit-keyframes weuiLoading {0% { -webkit-transform: rotate3d(0, 0, 1, 0deg);}100% {-webkit-transform: rotate3d(0, 0, 1, 360deg);}}@keyframes weuiLoading {0%{-webkit-transform: rotate3d(0, 0, 1, 0deg);}100% {-webkit-transform: rotate3d(0, 0, 1, 360deg);}}";
				attr(style,'id',this.opt.id+"-style");
				style.innerHTML = cssText;
				this.css = style;
		},
		insertToBody:function(){
			var body = document.getElementsByTagName('body')[0];
			body.appendChild(this.css);
			body.appendChild(this.win);
		},
		close:function(fun){
			var win = document.getElementById(this.opt.id);
			var style = document.getElementById(this.opt.id+"-style");
			win.style.display = 'none';
			removeNodeById(this.opt.id);
			removeNodeById(this.opt.id+"-style");
			if(typeof fun === 'function'){
				fun();
			}
		},
		closed:function(){
			if(typeof this.opt.closed === 'function'){
				this.opt.closed();
			}
		}
	}
	window.tips = tips;
})(window)