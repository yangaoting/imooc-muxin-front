window.app = {
	
	/* 后台地址访问地址*/
	serverUrl:'http://192.168.1.3:8080',
	
	/** 图片服务器地址*/
	imgServerUrl:'http://47.106.232.229:88/imooc/',
	
	/**
	 * 判断字符串是否为空
	 * @param {Object} str
	 */
	isNotNull:function(str){
		return str != null && str != '' && str != undefined;
	},
	
	/**
	 * 弹出提示框
	 */
	showToast:function(msg,type){
		plus.nativeUI.toast(msg,{
			icon:"image/" + type + ".png",
			verticalAlign:"center"
			});
	},
	
	/**
	 * 保存用户的全局对象
	 * @param {Object} user
	 */
	setUerGlobalInfo:function(user){
		var userInfoStr = JSON.stringify(user);
		plus.storage.setItem("userInfo",userInfoStr);
	},
	
	/**
	 * 获取全局用户对象
	 */
	getUerGlobalInfo:function(){
		var userInfoStr = plus.storage.getItem("userInfo");
		return JSON.parse(userInfoStr);
	},
	
	/**
	 * 用户推出，清空用户缓存
	 */
	userLogout:function(){
		plus.storage.removeItem("userInfo");
	},
	
	/**
	 * 保存用户的联系人列表
	 * @param {Object} contactList
	 */
	setContactList:function(contactList){
		var contactListStr = JSON.stringify(contactList);
		plus.storage.setItem("contactList",contactListStr);
	},
	/**
	 * 获取联系人列表
	 */
	getContactList:function(){
		var contactListStr = plus.storage.getItem("contactList");
		if(!this.isNotNull(contactListStr)){
			return [];
		}
		return JSON.parse(contactListStr);
	}
};