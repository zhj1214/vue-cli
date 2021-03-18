<template>
<view class="chatroom">
  <view class="header">
    <!-- display number of people in the room -->
    <view class="left"></view>
    <!-- room name -->
    <view class="middle">{{groupName}}</view>
    <!-- reserved -->
    <view class="right"></view>
  </view>

  <!-- chats -->
  <scroll-view class="body" scroll-y :scroll-with-animation="scrollWithAnimation" :scroll-top="scrollTop" :scroll-into-view="scrollToMessage" @scrolltoupper="onScrollToUpper">
    <view v-for="(item, index) in chats" :key="index" :id="'item-' + index" :class="'message ' + (openId == item._openid ? 'message__self' : '')">
      <image class="avatar" :src="item.avatar" mode="scaleToFill"></image> 
      <view class="main">
        <view class="nickname">{{item.nickName}}</view>
        <block v-if="item.msgType === 'image'">
          <view class="image-wrapper">
            <view class="loading" v-if="item.writeStatus > -1">{{item.writeStatus}}%</view>
            <image :src="item.tempFilePath || item.imgFileID" :data-fileid="item.tempFilePath || item.imgFileID" class="image-content" :style="item.imgStyle" mode="scallToFill" @tap="onMessageImageTap"></image>
          </view>
        </block>
        <block v-else>
          <view class="text-wrapper">
            <view class="loading" v-if="item.writeStatus === 'pending'">···</view>
            <view class="text-content">{{item.textContent}}</view>
          </view>
        </block>
      </view>
    </view>
  </scroll-view>

  <!-- message sender -->
  <view class="footer">
    <view class="message-sender" v-if="userInfo">
      <input class="text-input" type="text" confirm-type="send" @confirm="onConfirmSendText" cursor-spacing="20" :value="textInputValue"></input>

      <image src="/static/com/chatroom/photo.png" class="btn-send-image" mode="scaleToFill" @tap="onChooseImage"></image>
    </view>

    <view class="message-sender" v-if="!userInfo">
      <button open-type="getUserInfo" @getuserinfo="onGetUserInfo" class="userinfo">请先登录后参与聊天</button>
    </view>
  </view>

</view>
</template>

<script>
const FATAL_REBUILD_TOLERANCE = 10;
const SETDATA_SCROLL_TO_BOTTOM = {
  scrollTop: 100000,
  scrollWithAnimation: true
};

export default {
  data() {
    return {
      chats: [],
      textInputValue: '',
      openId: '',
      scrollTop: 0,
      scrollToMessage: '',
      hasKeyboard: false,
      scrollWithAnimation: false
    };
  },

  components: {},
  props: {
    envId: String,
    collection: String,
    groupId: String,
    groupName: String,
    userInfo: Object,
    onGetUserInfo: {
      type: Function
    },
    getOpenID: {
      type: Function
    }
  },

  mounted() {
    global.chatroom = this;
    this.initRoom();
    this.fatalRebuildCount = 0;
  },

  methods: {
    onGetUserInfo(e) {
      this.onGetUserInfo(e);
    },

    getOpenID() {
      return this.getOpenID();
    },

    mergeCommonCriteria(criteria) {
      return {
        groupId: this.groupId,
        ...criteria
      };
    },

    async initRoom() {
      this.tryFun(async () => {
        await this.initOpenID();
        const {
          envId,
          collection
        } = this.properties;
        const db = this.db = uni.cloud.database({
          env: envId
        });
        const _ = db.command;
        const {
          data: initList
        } = await db.collection(collection).where(this.mergeCommonCriteria()).orderBy('sendTimeTS', 'desc').get();
        console.log('init query chats', initList);
        this.setData({
          chats: initList.reverse(),
          scrollTop: 10000
        });
        this.initWatch(initList.length ? {
          sendTimeTS: _.gt(initList[initList.length - 1].sendTimeTS)
        } : {});
      }, '初始化失败');
    },

    async initOpenID() {
      return this.tryFun(async () => {
        const openId = await this.getOpenID();
        this.setData({
          openId
        });
      }, '初始化 openId 失败');
    },

    async initWatch(criteria) {
      this.tryFun(() => {
        const {
          collection
        } = this.properties;
        const db = this.db;
        const _ = db.command;
        console.warn(`开始监听`, criteria);
        this.messageListener = db.collection(collection).where(this.mergeCommonCriteria(criteria)).watch({
          onChange: this.onRealtimeMessageSnapshot.bind(this),
          onError: e => {
            if (!this.inited || this.fatalRebuildCount >= FATAL_REBUILD_TOLERANCE) {
              this.showError(this.inited ? '监听错误，已断开' : '初始化监听失败', e, '重连', () => {
                this.initWatch(this.chats.length ? {
                  sendTimeTS: _.gt(this.chats[this.chats.length - 1].sendTimeTS)
                } : {});
              });
            } else {
              this.initWatch(this.chats.length ? {
                sendTimeTS: _.gt(this.chats[this.chats.length - 1].sendTimeTS)
              } : {});
            }
          }
        });
      }, '初始化监听失败');
    },

    onRealtimeMessageSnapshot(snapshot) {
      console.warn(`收到消息`, snapshot);

      if (snapshot.type === 'init') {
        this.setData({
          chats: [...this.chats, ...[...snapshot.docs].sort((x, y) => x.sendTimeTS - y.sendTimeTS)]
        });
        this.scrollToBottom();
        this.inited = true;
      } else {
        let hasNewMessage = false;
        let hasOthersMessage = false;
        const chats = [...this.chats];

        for (const docChange of snapshot.docChanges) {
          switch (docChange.queueType) {
            case 'enqueue':
              {
                hasOthersMessage = docChange.doc._openid !== this.openId;
                const ind = chats.findIndex(chat => chat._id === docChange.doc._id);

                if (ind > -1) {
                  if (chats[ind].msgType === 'image' && chats[ind].tempFilePath) {
                    chats.splice(ind, 1, { ...docChange.doc,
                      tempFilePath: chats[ind].tempFilePath
                    });
                  } else chats.splice(ind, 1, docChange.doc);
                } else {
                  hasNewMessage = true;
                  chats.push(docChange.doc);
                }

                break;
              }
          }
        }

        this.setData({
          chats: chats.sort((x, y) => x.sendTimeTS - y.sendTimeTS)
        });

        if (hasOthersMessage || hasNewMessage) {
          this.scrollToBottom();
        }
      }
    },

    async onConfirmSendText(e) {
      this.tryFun(async () => {
        if (!e.detail.value) {
          return;
        }

        const {
          collection
        } = this.properties;
        const db = this.db;
        const _ = db.command;
        const doc = {
          _id: `${Math.random()}_${Date.now()}`,
          groupId: this.groupId,
          avatar: this.userInfo.avatarUrl,
          nickName: this.userInfo.nickName,
          msgType: 'text',
          textContent: e.detail.value,
          sendTime: new Date(),
          sendTimeTS: Date.now() // fallback

        };
        this.setData({
          textInputValue: '',
          chats: [...this.chats, { ...doc,
            _openid: this.openId,
            writeStatus: 'pending'
          }]
        });
        this.scrollToBottom(true);
        await db.collection(collection).add({
          data: doc
        });
        this.setData({
          chats: this.chats.map(chat => {
            if (chat._id === doc._id) {
              return { ...chat,
                writeStatus: 'written'
              };
            } else return chat;
          })
        });
      }, '发送文字失败');
    },

    async onChooseImage(e) {
      uni.chooseImage({
        count: 1,
        sourceType: ['album', 'camera'],
        success: async res => {
          const {
            envId,
            collection
          } = this.properties;
          const doc = {
            _id: `${Math.random()}_${Date.now()}`,
            groupId: this.groupId,
            avatar: this.userInfo.avatarUrl,
            nickName: this.userInfo.nickName,
            msgType: 'image',
            sendTime: new Date(),
            sendTimeTS: Date.now() // fallback

          };
          this.setData({
            chats: [...this.chats, { ...doc,
              _openid: this.openId,
              tempFilePath: res.tempFilePaths[0],
              writeStatus: 0
            }]
          });
          this.scrollToBottom(true);
          const uploadTask = uni.cloud.uploadFile({
            cloudPath: `${this.openId}/${Math.random()}_${Date.now()}.${res.tempFilePaths[0].match(/\.(\w+)$/)[1]}`,
            filePath: res.tempFilePaths[0],
            config: {
              env: envId
            },
            success: res => {
              this.tryFun(async () => {
                await this.db.collection(collection).add({
                  data: { ...doc,
                    imgFileID: res.fileID
                  }
                });
              }, '发送图片失败');
            },
            fail: e => {
              this.showError('发送图片失败', e);
            }
          });
          uploadTask.onProgressUpdate(({
            progress
          }) => {
            this.setData({
              chats: this.chats.map(chat => {
                if (chat._id === doc._id) {
                  return { ...chat,
                    writeStatus: progress
                  };
                } else return chat;
              })
            });
          });
        }
      });
    },

    onMessageImageTap(e) {
      uni.previewImage({
        urls: [e.target.dataset.fileid]
      });
    },

    scrollToBottom(force) {
      if (force) {
        console.log('force scroll to bottom');
        this.setData(SETDATA_SCROLL_TO_BOTTOM);
        return;
      }

      this.createSelectorQuery().select('.body').boundingClientRect(bodyRect => {
        this.createSelectorQuery().select(`.body`).scrollOffset(scroll => {
          if (scroll.scrollTop + bodyRect.height * 3 > scroll.scrollHeight) {
            console.log('should scroll to bottom');
            this.setData(SETDATA_SCROLL_TO_BOTTOM);
          }
        }).exec();
      }).exec();
    },

    async onScrollToUpper() {
      if (this.db && this.chats.length) {
        const {
          collection
        } = this.properties;
        const _ = this.db.command;
        const {
          data
        } = await this.db.collection(collection).where(this.mergeCommonCriteria({
          sendTimeTS: _.lt(this.chats[0].sendTimeTS)
        })).orderBy('sendTimeTS', 'desc').get();
        this.chats.unshift(...data.reverse());
        this.setData({
          chats: this.chats,
          scrollToMessage: `item-${data.length}`,
          scrollWithAnimation: false
        });
      }
    },

    async tryFun(fn, title) {
      try {
        await fn();
      } catch (e) {
        this.showError(title, e);
      }
    },

    showError(title, content, confirmText, confirmCallback) {
      console.error(title, content);
      uni.showModal({
        title,
        content: content.toString(),
        showCancel: confirmText ? true : false,
        confirmText,
        success: res => {
          res.confirm && confirmCallback();
        }
      });
    }

  }
};
</script>
<style>
@import "./chatroom.css";
</style>