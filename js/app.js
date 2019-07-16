window.app = {
	/**
	 * nettty后端URL
	 */
	nettyServerUrl:'ws://192.168.1.3:8088/ws',
	
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
	},
	/**
	 * 获取好友信息从联系人列表中
	 * @param {Object} friendId
	 */
	getFriendFromContactList: function(friendId){
		var contactListStr = plus.storage.getItem("contactList");
		if(!this.isNotNull(contactListStr)){
			return null;
		}
		var contactList = JSON.parse(contactListStr);
		for(var i = 0 ; i < contactList.length ; i++){
			var friend = contactList[i].myFriend;
			if(friend.id == friendId){
				return friend;
			}
		}
	},
	/**
	 * 保存聊天记录
	 * @param {Object} myId
	 * @param {Object} friendId
	 * @param {Object} msg
	 * @param {Object} flag
	 */
	saveUserChatHistory: function(myId,friendId,msg,flag){
		var me = this;
		var chatKey = "chat-" + myId + "-" + friendId ;
		
		var chatHistoryListStr = plus.storage.getItem(chatKey);
		var chatHistoryList = [];
		if(me.isNotNull(chatHistoryListStr)){
			chatHistoryList = JSON.parse(chatHistoryListStr);
		}
		//追加聊天记录
		var singleMsg = new me.ChatHistory(myId,friendId,msg,flag);
		chatHistoryList.push(singleMsg);
		
		plus.storage.setItem(chatKey,JSON.stringify(chatHistoryList));
	},
	/**
	 * 删除聊天记录
	 * @param {Object} myId
	 * @param {Object} friendId
	 */
	deleteUserChatHistory:function(myId,friendId){
		var chatKey = "chat-" + myId + "-" + friendId ;
		plus.storage.removeItem(chatKey);
	},
	/**
	 * 保存聊天快照
	 * @param {Object} myId
	 * @param {Object} friendId
	 * @param {Object} msg
	 * @param {Object} flag
	 */
	saveUserChatSnapshot: function(myId,friendId,msg,isRead){
		var me = this;
		var chatKey = "chat-snapshot" + myId;
		
		var singleMsg = new me.ChatSnapshot(myId,friendId,msg,isRead);
		
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList = [];
		if(me.isNotNull(chatSnapshotListStr)){
			chatSnapshotList = JSON.parse(chatSnapshotListStr);
			
			for(var i = 0 ; i < chatSnapshotList.length ; i++){
				if(chatSnapshotList[i].friendId == friendId){
					if(!isRead){
						singleMsg.unReadCount += chatSnapshotList[i].unReadCount;
					}
					//删除重复项
					chatSnapshotList.splice(i,1);
					break;
				}
			}
		}
		//追加聊天记录
		
		chatSnapshotList.unshift(singleMsg);
		
		plus.storage.setItem(chatKey,JSON.stringify(chatSnapshotList));
	},
	/**
	 * 获取聊天快照
	 * @param {Object} myId
	 */
	getUserChatSnapshot: function(myId){
		var me = this;
		var chatKey = "chat-snapshot" + myId  ;
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList = [];
		if(me.isNotNull(chatSnapshotListStr)){
			chatSnapshotList = JSON.parse(chatSnapshotListStr);
		}
		
		return chatSnapshotList;
	},
	/**
	 * 删除快照
	 * @param {Object} myId
	 * @param {Object} friendId
	 */
	deleteUserChatSnapshot:function(myId,friendId){
		var me = this;
		var chatKey = "chat-snapshot" + myId;
		
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList = [];
		if(me.isNotNull(chatSnapshotListStr)){
			chatSnapshotList = JSON.parse(chatSnapshotListStr);
			
			for(var i = 0 ; i < chatSnapshotList.length ; i++){
				if(chatSnapshotList[i].friendId == friendId){
					//删除重复项
					chatSnapshotList.splice(i,1);
					break;
				}
			}
		}else{
			return;
		}
		
		plus.storage.setItem(chatKey,JSON.stringify(chatSnapshotList));
	},
	/**
	 * 标记未读消息为已读消息
	 * @param {Object} myId
	 * @param {Object} friendId
	 */
	readUserChatSnapshot:function(myId,friendId){
		var me = this;
		var chatKey = "chat-snapshot" + myId  ;
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList = [];
		if(!me.isNotNull(chatSnapshotListStr)){
			return;
		}
		
		chatSnapshotList = JSON.parse(chatSnapshotListStr);
		for(var i = 0 ; i < chatSnapshotList.length; i++){
			var item = chatSnapshotList[i];
			if(item.friendId == friendId){
				item.isRead = true;
				item.unReadCount = 0;
				//替换
				chatSnapshotList.splice(i,1,item);
				break;
			}
		}
		
		plus.storage.setItem(chatKey,JSON.stringify(chatSnapshotList));
	},
	/**
	 * 获取聊天记录
	 * @param {Object} myId
	 * @param {Object} friendId
	 */
	getUserChatHistory: function(myId,friendId){
		var me = this;
		var chatKey = "chat-" + myId + "-" + friendId ;
		var chatHistoryListStr = plus.storage.getItem(chatKey);
		var chatHistoryList = [];
		if(me.isNotNull(chatHistoryListStr)){
			chatHistoryList = JSON.parse(chatHistoryListStr);
		}
		
		return chatHistoryList;
	},
	
	CONNECT: 1,  //(1,"初始化连接"),
    CHAT: 2,     //(2,"聊天消息"),
    SIGNED: 3,    //(3,"消息签收"),
    KEEPALIVE: 4, //(4,"客户端保持心跳")
	PULL_FRIEND: 5, //(5,"拉去好友列表"),
	
	/**
	 * 构建ChatMsg
	 * @param {Object} sendId
	 * @param {Object} receiverId
	 * @param {Object} msg
	 * @param {Object} msgId
	 */
	ChatMsg: function(sendId,receiverId,msg,msgId){
		this.sendId = sendId;
		this.receiverId = receiverId;
		this.msg = msg;
		this.msgId = msgId;
	},
	/** 构建DataContent
	 * @param {Object} action
	 * @param {Object} chatMsg
	 * @param {Object} extend
	 */
	DataContent: function(action,chatMsg,extend){
		this.action = action;
		this.chatMsg = chatMsg;
		this.extend = extend;
	},
	/**
	 * 聊天对象
	 * @param {Object} myId
	 * @param {Object} friendId
	 * @param {Object} msg
	 * @param {Object} flag
	 */
	ChatHistory: function(myId,friendId,msg,flag){
		this.myId = myId;
		this.friendId = friendId;
		this.msg = msg;
		this.flag = flag;
	},
	/**
	 * 聊天快照
	 * @param {Object} myId
	 * @param {Object} friendId
	 * @param {Object} msg
	 * @param {Object} isRead
	 */
	ChatSnapshot: function(myId,friendId,msg,isRead){
		this.myId = myId;
		this.friendId = friendId;
		this.msg = msg;
		this.isRead = isRead;
		this.unReadCount = isRead ? 0 : 1;
	}
};