<template>
  <div>
    <h2 class="page-title">
      <span @click="backListPage"><i
        class="icon iconfont iconBack"
        title="返回"
      /></span>
      <span @click="backListPage">编辑等级 Lv.{{ pageLevel }}</span>
    </h2>
    <div class="edit-level">
      <Row>
        <i-col
          span="8"
          class="left-col"
        >
          <div class="preview-container">
            <div class="phone-title">
              会员等级
            </div>
            <img
              :src="previewBack"
              class="preview-background"
            >
            <div class="user-info">
              <div class="member-name-row">
                <div class="name-img">
                  <img
                    :src="defaultPhoto"
                    alt="用户头像"
                  >
                  <div class="user-name">
                    {{ userName }}
                  </div>
                </div>
                <div class="growth-value">
                  成长值：****
                </div>
              </div>
              <Swiper
                ref="levelSwiper"
                class="card-list"
                :options="swiperOptions"
              >
                <SwiperSlide>
                  <!--                                    <div class="current-level card-container">-->
                  <!--                                        <img class="card-img" :src="levelForm.cardBackground || cardBackground"/>-->
                  <!--                                        <div class="achieve-mark"-->
                  <!--                                             :style="achieveMarkStyle"-->
                  <!--                                        >-->
                  <!--                                            <i class="icon iconfont iconReach" title="已达成"></i>-->
                  <!--                                        </div>-->
                  <!--                                        <div class="card-text" :style="cardTextStyle">-->
                  <!--                                            <div class="card-title">{{ levelForm.reachedLevelName }}</div>-->
                  <!--                                            <div class="level-condition">升级 {{ levelForm.reachedUpGradeValue }}-->
                  <!--                                                <span>｜保级 </span>-->
                  <!--                                                {{ levelForm.reachedProtectionGradeValue }}-->
                  <!--                                            </div>-->
                  <!--                                            <div class="validate-time">有效期至 2020.12.31</div>-->
                  <!--                                        </div>-->
                  <!--                                    </div>-->
                  <div class="current-level card-container">
                    <img
                      class="change-skin"
                      :src="changeSkinIcon"
                    >
                    <img
                      class="card-img"
                      :src="levelForm.cardBackground || cardBackground"
                    >
                    <div
                      class="card-info"
                      :style="cardTextStyle"
                    >
                      <div class="card-title">
                        {{ levelForm.reachedLevelName }}
                        <div
                          class="current-text"
                          :style="achieveMarkStyle"
                        >
                          已达成
                        </div>
                      </div>
                      <div class="validate-time">
                        有效期至 2020.12.31
                      </div>
                      <div class="level-text">
                        <div>保级{{ levelForm.reachedProtectionGradeValue }}</div>
                        <div>升级 {{ levelForm.reachedUpGradeValue }}</div>
                      </div>
                      <div class="loading-container">
                        <div class="total-loading" />
                        <div class="fill-loading" />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <!--                                    <div class="current-level card-container">-->
                  <!--                                        <img class="card-img" :src="levelForm.cardBackground || cardBackground" />-->

                  <!--                                        <div class="card-text" :style="cardTextStyle">-->
                  <!--                                            <div class="card-title">{{ levelForm.levelName }}</div>-->
                  <!--                                            <div class="level-condition">升级 {{ levelForm.upGradeValue }}-->
                  <!--                                                <span>｜保级 </span>-->
                  <!--                                                {{ levelForm.protectionGradeValue }}</div>-->
                  <!--                                            <div class="validate-time">有效期至 2020.12.31</div>-->
                  <!--                                        </div>-->
                  <!--                                    </div>-->
                  <div class="current-level card-container">
                    <img
                      class="change-skin"
                      :src="changeSkinIcon"
                    >
                    <img
                      class="card-img"
                      :src="levelForm.cardBackground || cardBackground"
                    >
                    <div
                      class="card-info"
                      :style="cardTextStyle"
                    >
                      <div class="card-title">
                        {{ levelForm.levelName }}
                        <div
                          class="current-text"
                          :style="currentSignStyle"
                        >
                          当前等级
                        </div>
                      </div>
                      <div class="validate-time">
                        有效期至 2020.12.31
                      </div>
                      <div class="level-text">
                        <div>保级{{ levelForm.protectionGradeValue }}</div>
                        <div>升级 {{ levelForm.upGradeValue }}</div>
                      </div>
                      <div class="loading-container">
                        <div class="total-loading" />
                        <div class="fill-loading" />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <!--                                    <div class="current-level card-container">-->
                  <!--                                        <img class="card-img" :src="levelForm.cardBackground || cardBackground"/>-->
                  <!--                                        <div class="current-text"-->
                  <!--                                             :style="unlockSignStyle"-->
                  <!--                                        >待解锁-->
                  <!--                                        </div>-->
                  <!--                                        <div class="card-text" :style="cardTextStyle">-->
                  <!--                                            <div class="card-title">{{ levelForm.soonLevelName }}</div>-->
                  <!--                                            <div class="level-condition">升级 {{-->
                  <!--                                                    levelForm.soonUpGradeValue-->
                  <!--                                                }}<span>｜保级 </span>-->
                  <!--                                                {{ levelForm.soonProtectionGradeValue }}-->
                  <!--                                            </div>-->
                  <!--                                        </div>-->
                  <!--                                    </div>-->

                  <div class="current-level card-container">
                    <img
                      class="change-skin"
                      :src="changeSkinIcon"
                    >
                    <img
                      class="card-img"
                      :src="levelForm.cardBackground || cardBackground"
                    >
                    <div
                      class="card-info"
                      :style="cardTextStyle"
                    >
                      <div class="card-title">
                        {{ levelForm.soonLevelName }}
                        <div
                          class="current-text"
                          :style="unlockSignStyle"
                        >
                          待解锁
                        </div>
                      </div>
                      <div class="validate-time">
                        有效期至 2020.12.31
                      </div>
                      <div class="level-text">
                        <div>保级{{ levelForm.soonProtectionGradeValue }}</div>
                        <div>升级 {{ levelForm.soonUpGradeValue }}</div>
                      </div>
                      <div class="loading-container">
                        <div class="total-loading" />
                        <div class="fill-loading" />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>

                <div
                  slot="pagination"
                  class="swiper-pagination"
                />
              </Swiper>

              <!--                            <div class="white-triangle"></div>-->
            </div>

            <div class="right-container">
              <div class="right-title">
                <img
                  :src="rightIconLeft"
                  class="right-icon-left"
                >
                <span>{{ levelForm.levelName }}专属特权</span>
                <img
                  :src="rightIconRight"
                  class="right-icon-right"
                >
              </div>
              <div class="right-list">
                <div
                  v-for="r in rightList"
                  :key="r.equityId"
                  class="each-right"
                >
                  <div>
                    <img
                      :src="r.imgUrl"
                      class="right-img"
                    >
                  </div>
                  <span>{{ r.equityName }}</span>
                </div>
              </div>
              <Row>
                <i-col span="8" />
              </Row>
            </div>
          </div>
        </i-col>

        <i-col
          span="16"
          class="right-col"
        >
          <Form
            ref="memberInfo"
            :label-width="150"
            :model="levelForm"
            :rules="levelValidate"
          >
            <div class="block-title">
              基础信息
            </div>
            <FormItem
              v-if="!isGroup"
              label="等级名称（集团）："
              class="middle-block-narrow"
            >
              <span>{{ levelForm.groupLevelName }}</span>
            </FormItem>
            <FormItem
              label="等级名称："
              prop="levelName"
              class="middle-block-narrow"
            >
              <Input
                v-model="levelForm.levelName"
                class="w280"
                placeholder="请输入等级名称"
                :maxlength="9"
              />
              <span class="input-count">{{ levelForm.levelName.length }}/9</span>
            </FormItem>

            <div class="block-title huge-block-narrow">
              卡面设计
            </div>
            <FormItem
              label="卡面图片："
              prop="levelName"
              class="middle-block-narrow"
            >
              <div class="avatar-item">
                <Fupload
                  v-if="!levelForm.cardBackground"
                  :multiple="true"
                  name="file"
                  :can-cut="true"
                  :show-upload-list="false"
                  :default-file-list="defaultList"
                  :show-upload-text="false"
                  :max="1"
                  :max-size="4120"
                  :img-width="670"
                  :img-height="328"
                  :show-upload-btn="true"
                  @on-change="handleChange"
                  list-type="picture-card"
                  :can-remove="true"
                  :can-preview="true"
                />
                <!-- <Upload :action="upload" ref="cardBackground"
                                        class="upload-class before-upload"
                                        v-show="!levelForm.cardBackground"
                                        :show-upload-list="false"
                                        name="file"
                                        :format="['jpg','jpeg','png','sJPEG','JPG','PNG']"
                                        :max-size="4096"
                                        :on-format-error="handleFormatError"
                                        :on-exceeded-size="handleMaxSize"
                                        :on-success="handleSuccess"
                                        :headers="headers"
                                        :on-error="handlerError">
                                    <div class="upload-button">
                                        <Icon type="ios-log-out" size="18" :color="uploadIcon"
                                              class="pointer"
                                              style="font-weight: bold;transform: rotate(-90deg);"></Icon>
                                    </div>
                                </Upload> -->
                <div
                  v-show="levelForm.cardBackground"
                  class="image-position"
                >
                  <img
                    :src="levelForm.cardBackground || defaultPhoto"
                    alt="avatar"
                  >
                  <div class="demo-upload-list-cover">
                    <Icon
                      type="ios-trash-outline"
                      size="24"
                      @click.native="handleRemove"
                    />
                  </div>
                </div>
              </div>

              <div class="form-remind">
                4MB 以内；建议尺寸：670*328px，支持格式：png、jpg、jpeg
              </div>
            </FormItem>

            <FormItem
              label="状态标志："
              prop=""
              class="middle-block-narrow"
            >
              <div class="level-change">
                <span
                  :class="hasAchieveClass"
                  class="status-btn"
                  @click="chooseStatus('achieveLevel')"
                >已达成</span>
                <span
                  :class="{ 'current-btn': levelStatus === 'currentLevel'}"
                  class="status-btn"
                  @click="chooseStatus('currentLevel')"
                >当前等级</span>
                <span
                  :class="unlockClass"
                  class="status-btn"
                  @click="chooseStatus('unlockLevel')"
                >待解锁</span>
              </div>
              <div class="form-remind">
                切换卡面状态可在左侧手机模具中预览
              </div>

              <div class="mini-block-narrow">
                <span>标签底色：</span>
                <ColorPicker
                  v-if="levelStatus === 'achieveLevel'"
                  v-model="levelForm.reachedSignBackgroundColor"
                />
                <ColorPicker
                  v-if="levelStatus === 'currentLevel'"
                  v-model="levelForm.reachSignBackgroundColor"
                />
                <ColorPicker
                  v-if="levelStatus === 'unlockLevel'"
                  v-model="levelForm.soonSignBackgroundColor"
                />
              </div>

              <div
                v-if="levelStatus !== 'achieveLevel'"
                class="mini-block-narrow"
              >
                <span>标签文字：</span>
                <ColorPicker
                  v-if="levelStatus === 'currentLevel'"
                  v-model="levelForm.reachSignTextColor"
                />
                <ColorPicker
                  v-if="levelStatus === 'unlockLevel'"
                  v-model="levelForm.soonSignTextColor"
                />
              </div>
            </FormItem>

            <FormItem
              label="卡面文字："
              prop=""
              class="middle-block-narrow"
            >
              <ColorPicker v-model="levelForm.textColor" />
            </FormItem>


            <div class="block-title huge-block-narrow">
              升保级规则
            </div>
            <FormItem
              label="升级规则："
              prop="upGradeValue"
              class="middle-block-narrow"
            >
              <div>
                <span class="item-narrow">有效期内成长值 ≥</span>
                <Input
                  v-model="levelForm.upGradeValue"
                  class="w280"
                  placeholder="请输入升级规则"
                  :disabled="editRule()"
                  @on-keyup="allowInt('upGradeValue')"
                />
              </div>
              <div
                v-if="this.pageLevel !== 1"
                class="form-remind"
              >
                请输入大于 {{ levelForm.reachedUpGradeValue }} 的整数
              </div>
            </FormItem>
            <FormItem
              label="保级规则："
              prop="protectionGradeValue"
              class="middle-block-narrow"
            >
              <div>
                <span class="item-narrow">有效期内成长值 ≥</span>
                <Input
                  v-model="levelForm.protectionGradeValue"
                  class="w280"
                  placeholder="请输入升级规则"
                  :disabled="editRule()"
                  @on-keyup="allowInt('protectionGradeValue')"
                />
              </div>
              <div
                v-if="this.pageLevel !== 1"
                class="form-remind"
              >
                请输入大于 {{ levelForm.reachedProtectionGradeValue }} 的整数
              </div>
            </FormItem>


            <div class="block-title huge-block-narrow">
              权益配置
            </div>
            <FormItem
              label="等级权益展示："
              prop="equityIdList"
              class="middle-block-narrow"
            >
              <!--                            <Select v-model="levelForm.equityIdList" multiple-->
              <!--                                    class="w280"-->
              <!--                                    :max-tag-count="9">-->
              <!--                                <Option-->
              <!--                                    v-for="item in rightList"-->
              <!--                                    :value="item.id"-->
              <!--                                    :key="item.id">{{ item.equityName }}</Option>-->
              <!--                            </Select>-->

              <ShowLevelRight
                :list="rightList"
                @delete="deleteCurrentRight"
              />
              <Button
                class="middle-block-narrow"
                type="primary"
                @click="showChooseRight"
              >
                选择等级权益
              </Button>
            </FormItem>
          </Form>
        </i-col>
      </Row>

      <div class="submit-container huge-block-narrow">
        <Button
          class="button-gap w60"
          size="large"
          type="default"
          @click="cancelSubmit"
        >
          取消
        </Button>
        <Button
          class="button-gap w60"
          size="large"
          type="primary"
          @click="submitLevel"
        >
          提交
        </Button>
      </div>
    </div>

    <div v-if="rightPop">
      <ChooseRightPop
        :modal-status="rightPop"
        @updateStatus="rightStatus"
        @selectRight="updateRight"
      />
    </div>
  </div>
</template>

<script>
import {Swiper, SwiperSlide, directive} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import {log, formatNumber} from "@/utils/tools";
import defaultPhoto from "@/assets/images/member/default_member_photo.png"
import previewBack from "@/assets/images/member/preview_background.png"
import rightIconLeft from "@/assets/images/member/right_left.png"
import rightIconRight from "@/assets/images/member/right_right.png"
import changeSkinIcon from "@/assets/images/member/change_skin.png"

import ShowLevelRight from "@/pageview/member/level/editLevel/ShowLevelRight";
import ChooseRightPop from "@/pageview/member/level/editLevel/ChooseRightPop";
import Fupload from "@/components/FileUpload/index.vue";

export default {
    name: "EditLevel",
    components: {
        Swiper,
        SwiperSlide,
        ShowLevelRight,
        ChooseRightPop,
        Fupload
    },
    directives: {
        swiper: directive
    },
    data() {
        return {
            defaultList:[],//上传图片
            orgId: '',
            userName: '',
            // 页面类型，第一个等级 firstLevel, 中间的等级 middleLevel,
            // 最后一个等级和待配置  lastLevel
            pageType: 'middleLevel',
            defaultPhoto: defaultPhoto,
            cardBackground: 'https://eos-wuxi-1.cmecloud.cn/crmoss/0bba78c0-2948-4a7e-b085-b370926dfe91.png',
            levelIdList: [],

            levelInfo: '',
            pageLevel: '',
            // 等级状态标志 已达成 achieveLevel, 当前等级 currentLevel, 待解锁 unlockLevel
            levelStatus: 'currentLevel',
            // 等级状态是否开启
            enableLevel: false,

            levelForm: {
                id: '',
                level: "",
                levelName: "",
                textColor: "#90651C",

                reachedSignBackgroundColor: '#DEB885',
                reachedSignTextColor: "",
                reachedUpGradeValue: 0,
                reachedProtectionGradeValue: 0,
                reachedLevelName: "",
                reachedCardBackground: "",

                reachSignBackgroundColor: "#414242",
                reachSignTextColor: "#ffffff",
                cardBackground: "",
                upGradeValue: 0,
                protectionGradeValue: 0,

                soonSignBackgroundColor: "#1B1B1B",
                soonUpGradeValue: 0,
                soonProtectionGradeValue: 0,
                soonLevelName: '',
                soonCardBackground: '',
                soonSignTextColor: "#E2C99D",

                equityIdList: [],
                groupLevelName: '',
            },

            levelValidate: {
                levelName: [
                    {
                        required: true,
                        message: "请输入等级名称",
                        trigger: 'blur',
                        type: 'string'
                    },
                ],
                equityIdList: [
                    {
                        required: true,
                        message: "请选择等级权益",
                        trigger: 'blur',
                        type: 'string'
                    },
                ],
                upGradeValue: [
                    {
                        required: true,
                        message: "请输入升级规则",
                        trigger: 'blur',
                    },
                    {
                        trigger: 'blur',
                        asyncValidator: (rule, value) => {
                            let {reachedUpGradeValue, soonUpGradeValue} = this.levelForm
                            return new Promise((resolve, reject) => {
                                let num = Number(value.split(',').join(''))

                                let outRange = (num <= reachedUpGradeValue) ||
                                    (num >= soonUpGradeValue)

                                // 待配置等级、唯一等级时，只需要比之前的等级大
                                if (soonUpGradeValue === 0) {
                                    outRange = (num <= reachedUpGradeValue)
                                }

                                if (outRange) {
                                    reject('报错')
                                } else {
                                    resolve();
                                }
                            });
                        },
                        message: () => {
                            let {reachedUpGradeValue, soonUpGradeValue} = this.levelForm
                            let floor = reachedUpGradeValue + 1
                            let ceil = soonUpGradeValue - 1
                            let error = `输入范围 ${floor} ~ ${ceil}`

                            if (this.isLastLevel() || this.isConfigLevel()) {
                                error = `大于上个等级的临界值`
                            }

                            return error
                        },
                    }
                ],
                protectionGradeValue: [
                    {
                        required: true,
                        message: "请输入保级规则",
                        trigger: 'blur',
                        type: 'string'
                    },
                    {
                        trigger: 'blur',
                        asyncValidator: (rule, value) => {
                            let {reachedProtectionGradeValue, soonProtectionGradeValue} = this.levelForm
                            return new Promise((resolve, reject) => {
                                let num = Number(value.split(',').join(''))

                                let outRange = (num <= reachedProtectionGradeValue) ||
                                    (num >= soonProtectionGradeValue)

                                // 待配置等级、唯一等级时，只需要比之前的等级大
                                if (soonProtectionGradeValue === 0) {
                                    outRange = (num <= soonProtectionGradeValue)
                                }
                                if (outRange) {
                                    reject('报错')
                                } else {
                                    resolve();
                                }
                            });
                        },
                        message: () => {
                            let {reachedProtectionGradeValue, soonProtectionGradeValue} = this.levelForm
                            let floor = reachedProtectionGradeValue + 1
                            let ceil = soonProtectionGradeValue - 1
                            let error = `输入范围 ${floor} ~ ${ceil}`

                            if (this.isLastLevel()) {
                                error = `大于上个等级的临界值`
                            }

                            return error
                        },
                    }
                ],
                receiverPhone: [
                    {
                        required: true,
                        message: "请输入收货人联系方式",
                        trigger: 'blur',
                        type: 'string'
                    },
                    {
                        type: "string",
                        trigger: 'blur',
                        asyncValidator: (rule, value) => {
                            return new Promise((resolve, reject) => {
                                let reg = this.phoneReg
                                if (!reg.test(value)) {
                                    reject('证件号')
                                } else {
                                    resolve();
                                }
                            });
                        },
                        message: "请输入正确的联系方式",
                    }
                ],
            },

            // 是否是集团
            isGroup: false,
            allRight: [],
            rightList: [],
            // 选择权益弹窗
            rightPop: false,

            headers: {
                token: localStorage.getItem('token'),
            },
            profileData: {
                areaCode: "+86",
                phone: "",
                name: "",
                sex: "",
                weChat: "",
                qq: '',
                headImg: ""
            },
            upload: '/file-server/api/resources/files/upload',
            uploadIcon: '#939295',

            swiperOptions: {
                initialSlide: 1,
            },
            previewBack: previewBack,
            rightIconLeft,
            rightIconRight,
            changeSkinIcon,
        };
    },
    computed: {
        currentSignStyle() {
            let sign = {
                'color': this.levelForm.reachSignTextColor,
                background: this.levelForm.reachSignBackgroundColor,
            }
            return sign
        },
        unlockSignStyle() {
            let sign = {
                'color': this.levelForm.soonSignTextColor,
                background: this.levelForm.soonSignBackgroundColor,
            }
            return sign
        },
        achieveMarkStyle() {
            let card = {
                'color': this.levelForm.reachedSignBackgroundColor,
            }
            return card
        },
        cardTextStyle() {
            let card = {
                'color': this.levelForm.textColor,
            }
            return card
        },
        swiper() {
            return this.$refs.levelSwiper.$swiper
        },
        hasAchieveClass() {
            let classObj = {
                'achieve-btn': this.levelStatus === 'achieveLevel',
                'disable-achieve': this.pageType === 'firstLevel',
            }

            return classObj
        },
        unlockClass() {
            let classObj = {
                'achieve-btn': this.levelStatus === 'unlockLevel',
                'disable-unlock': this.pageType === 'lastLevel',
            }

            return classObj
        },
    },
    created() {
        this.initData()
        this.isTopOrg()
        this.getFormerLevel()
        this.getLevelRight()
    },
    mounted() {

    },
    methods: {
        initData() {
            let orgId = localStorage.orgId || '777777'
            let name = localStorage.name
            this.orgId = orgId
            this.userName = name

            let levelInfoStr = localStorage.getItem('levelInfo')
            let idListStr = localStorage.getItem('levelIdList')
            let levelInfo = JSON.parse(levelInfoStr)
            let levelIdList = JSON.parse(idListStr)

            this.pageLevel = Number(levelInfo.levelId.slice(2))
            this.levelIdList = levelIdList
            this.levelForm.id = levelInfo.id
            this.enableLevel = JSON.parse(localStorage.getItem('enableLevel'))
            this.adjustPage()
        },
        editRule() {
            // 等级 1，等级开启状态，子公司 不能编辑。
            let disable = this.pageLevel === 1 || this.enableLevel || !this.isGroup
            return disable
        },
        adjustPage() {
            let maxLevel = this.levelIdList.length
            if (this.pageLevel === 1) {
                this.pageType = 'firstLevel'
            } else if (this.pageLevel >= maxLevel) {
                this.pageType = 'lastLevel'
            } else {
                this.pageType = 'middleLevel'
            }
        },
        getFormerLevel() {
            let server = '/grade-server'
            let url = server + '/api/level/info'

            let data = {id: this.levelForm.id}
            // 待配置等级请求最后一个等级的数据
            let isConfig = this.isConfigLevel()
            if (isConfig) {
                data.id = this.levelIdList[this.levelIdList.length - 1]
            }

            this.$ajaxGet(url, data)
                .then(res => {
                    if (res && res.code === 10000) {
                        let resData = res.data
                        this.renderPage(resData)
                    }
                })
                .catch(err => {
                    log(err);
                });
        },
        isLastLevel() {
            let lastId = this.levelIdList[this.levelIdList.length - 1]
            let {id} = this.levelForm

            log('lastId', lastId)
            log('id', id)
            let last = id === lastId
            log('last', last)
            return id === lastId
        },
        isConfigLevel() {
            let {id} = this.levelForm
            let isConfig = id === '-'
            return isConfig
        },
        renderPage(data) {
            let isConfig = this.isConfigLevel()
            // 待配置等级时，用前一个等级的数据渲染

            // 当只有一个等级是，需要判断数据是否为空
            log('data.memberEquityRespList', data.memberEquityRespList)
            if (isConfig && !this.$_.isEmpty(data)) {
                Object.assign(this.levelForm, {
                    reachedSignBackgroundColor: data.reachSignBackgroundColor,
                    reachedSignTextColor: data.reachSignTextColor,
                    reachedUpGradeValue: data.upGradeValue,
                    reachedProtectionGradeValue: data.protectionGradeValue,

                    reachedLevelName: data.levelName,
                    reachedCardBackground: data.cardBackground,
                })
            } else {
                Object.assign(this.levelForm, {
                    ...data,
                })
            }
            this.rightList = data.memberEquityRespList
            log('renderPage this.rightList', this.rightList)
        },
        backListPage() {
            this.$router.push(`/member/settingLevel`)
        },
          //上传图片
        handleChange(file) {
            if (file && file.length > 0) {
                this.$set(this.levelForm, 'cardBackground', file[0].url);
            } else {
                this.$set(this.levelForm,'cardBackground','');
            }
            this.$Message.success('成功');
            this.uploadStatus = true
        },
        handleSuccess(res) {
            if (res && res.code === 10000) {
                this.$Message.success(res.message);
                this.uploadStatus = true
                this.$set(this.levelForm, 'cardBackground', res.data);
            }
        },
        handleFormatError() {
            this.$Message.error('仅支持：JPEG/JPG/PNG 格式');
        },
        handleMaxSize(file) {
            let message = `${file.name} 太大, 不能超过 4MB，请重新选择`
            this.$Message.error(message);
        },
        handlerError() {
            this.$Message.error('上传失败');
            this.uploadStatus = false
        },
        handleRemove() {
            this.$set(this.levelForm, 'cardBackground', '');
            this.uploadStatus = false
        },
        chooseStatus(type) {
            // Lv1 没有已达成
            let notAchieve = (this.pageType === 'firstLevel') &&
                (type === 'achieveLevel')
            if (notAchieve) {
                return
            }

            // 最后一个等级和待配置没有待解锁按钮
            let notLast = ((this.pageType === 'lastLevel') ||
                (this.pageType === 'lastLevel')) &&
                (type === 'unlockLevel')
            if (notLast) {
                return
            }

            this.levelStatus = type
            let slideIndex = {
                achieveLevel: 0,
                currentLevel: 1,
                unlockLevel: 2,

            }
            this.swiper.slideTo(slideIndex[type], 1000)
        },
        initForm() {
            Object.assign(this.levelForm, {
                "level": "",
                "levelName": "",
                "textColor": "#90651C",
                "reachedSignBackgroundColor": '',

                "reachedSignTextColor": "",
                "reachSignBackgroundColor": "#b58932",
                "reachSignTextColor": "#ffffff",
                "soonSignBackgroundColor": "",

                "soonSignTextColor": "",
                "cardBackground": "",
                "upGradeValue": "",
                "protectionGradeValue": "",
            })
        },
        cancelSubmit() {
            this.initForm()
            this.backListPage()
        },
        formatLevelForm() {
            let data = {
                ...this.levelForm,
                orgId: this.orgId,
            }

            let isConfig = this.isConfigLevel()
            if (isConfig) {
                data.levelId = `Lv${this.pageLevel}`
            }
            let {cardBackground} = this.levelForm
            if (cardBackground === '') {
                data.cardBackground = this.cardBackground
            }
            delete data.id

            data.equityIdList = this.rightList.map(i => i.equityId)

            return data
        },
        validateForm() {
            let {
                levelName, reachedUpGradeValue, soonProtectionGradeValue,
                upGradeValue
            } = this.levelForm

            if (levelName === '') {
                this.$Message.error('保存失败，等级名称不能为空！')
                return true
            }

            if (this.rightList.length === 0) {
                this.$Message.error('保存失败，等级权益展示不能为空！')
                return true
            }

            // 表单校验写在这之前
            // 等级为 1 时，不做升保级校验
            if (this.pageLevel === 1) {
                return false
            }

            if (upGradeValue <= reachedUpGradeValue) {
                this.$Message.error('保存失败，升级规则应大于上一等级！')
                return true
            }


            // 升级规则应小于下一等级：只有不是最后的等级，且不是配置等级时才校验。
            let notLast = !this.isLastLevel()
            let notConfig = !this.isConfigLevel()
            let valiUpgrade = notLast && notConfig

            if (valiUpgrade && (upGradeValue >= soonProtectionGradeValue)) {
                this.$Message.error('保存失败，升级规则应小于下一等级！')
                return true
            }

            return false
        },
        submitLevel() {
            let server = '/grade-server'
            let url = server + '/api/level/edit'
            let notPass = this.validateForm()
            if (notPass) {
                return
            }
            let data = this.formatLevelForm()

            this.$ajaxPost(url, data)
                .then(res => {
                    if (res && res.code === 10000) {
                        this.backListPage()
                    }
                })
                .catch(err => {
                    log(err);
                });
        },
        allowInt(key) {
            let currentValue = this.levelForm[key]
            let temp
            if (currentValue.length === 1) {
                temp = currentValue.replace(/[^1-9]/g, '')
            } else {
                temp = currentValue.replace(/\D/g, '')
            }

            let big = Number(temp) >= Math.pow(10, 7)
            if (big) {
                temp = Math.pow(10, 7) - 1
            }

            this.levelForm[key] = formatNumber(String(temp), 0)
        },
        isTopOrg() {
            let server = '/user-server'
            let url = server + '/internal/organization/isRoot'
            let data = {
                orgId: this.orgId
            }

            this.$ajaxGet(url, data)
                .then(res => {
                    if (res && res.code === 10000) {
                        let resData = res.data
                        this.isGroup = resData || false
                    }
                })
                .catch(err => {
                    log(err);
                });
        },
        getLevelRight() {
            let server = '/grade-server'
            let url = server + '/api/grade/equity/getAllGradeEquity'
            let data = {
                orgId: this.orgId
            }

            this.$ajaxGet(url, data)
                .then(res => {
                    if (res && res.code === 10000) {
                        let resData = res.data
                        log('getLevelRight', resData)
                        this.allRight = resData || []
                    }
                })
                .catch(err => {
                    log(err);
                });
        },
        updateRight(list) {
            log('updateRight', list)
            this.rightList = list
        },
        rightStatus(status) {
            this.rightPop = status
        },
        showChooseRight() {
            this.rightPop = true
        },
        deleteCurrentRight(equityId) {
            let updateList = []
            this.rightList.forEach(e => {
                if (e.equityId !== equityId) {
                    updateList.push(e)
                }
            })
            this.rightList = updateList
        }
    }
}
</script>

<style scoped lang="scss">
.page-title {
    margin-bottom: 28px;
    vertical-align: middle;

    & > span {
        cursor: pointer;
        vertical-align: middle;
        font-weight: 600;
        text-align: left;

        color: rgba(62, 69, 82, 1);
        font-size: 24px;
        line-height: 32px;
        /*vertical-align: middle;*/
    }

    .iconBack {
        display: inline-block;
        position: relative;
        padding-right: 12px;
        font-size: 24px;

        vertical-align: middle;
        transform: translateY(-4px);
    }
}

.edit-level {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.04);
    border-radius: 16px;
    padding: 20px 24px;
}

.preview-container {
    width: 378px;
    height: 812px;
    border-radius: 24px;
    box-sizing: border-box;

    border: 1px solid #e8eaec;
    /*overflow: hidden;*/
    background: url('../../../../assets/images/member/phone_preview.png') no-repeat 0 0;
    background-size: 100%;
}

.phone-title {
    margin-top: 54px;
    text-align: center;
    font-size: 19px;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
    line-height: 23px;
}

.preview-background {
    position: absolute;
    top: 0;
    width: 376px;
    z-index: 1;
}

.user-info {
    position: relative;
    z-index: 2;
    margin-top: 10px;
    width: 376px;

    //background: url('../../../../assets/images/member/preview_background.png') no-repeat 0 0;
    //background-size: 100%;
}

.member-name-row {
    padding: 12px 20px 0 20px;
    display: flex;
    justify-content: space-between;
}

.growth-record {
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 20px;
    vertical-align: middle;

    .iconTips {
        color: white;
    }
}

.name-img {
    //width: 120px;
    display: flex;
    justify-content: flex-start;

    img {
        width: 50px;
        height: 50px;
        margin: 4px 4px 4px 24px;
        border-radius: 50%;
        //border: 2px solid white;
    }
}

.user-name {
    font-size: 14px;
    font-weight: 500;
    color: #000000;
    line-height: 54px;
}

.growth-value {
    font-size: 12px;
    font-family: Helvetica;
    color: #000000;
    line-height: 54px;
}

.card-list {
    margin-top: -16px;
    text-align: center;
    position: relative;
    z-index: -1;
}

.current-text {
    //width: 50px;
    padding-left: 8px;
    padding-right: 8px;
    height: 18px;
    margin-top: -5px;
    margin-left: 8px;

    display: inline-block;
    border-radius: 16px;
    font-size: 10px;
    line-height: 18px;
}

.unlock-text {
    position: absolute;
    top: 0;
    right: 20px;
    width: 60px;
    height: 20px;
    color: #b58932;
    background: #1B1B1B;
    border-top-right-radius: 6px;
    border-bottom-left-radius: 6px;

    font-size: 10px;
    font-weight: 400;
    line-height: 20px;
}

.achieve-mark {
    position: absolute;
    right: 34px;
    bottom: 14px;

    .iconReach {
        font-size: 32px;
    }
}

.card-img {
    width: 335px;
    height: 164px;
}

.card-container {
    margin: 0 auto;
    width: 335px;
    height: 164px;
    position: relative;
}

.change-skin {
    position: absolute;
    right: 0;
    top: 0;
    width: 36px;
    height: 34px;
}

.card-text {
    position: absolute;
    top: 0;
    margin-left: 29px;
}

.card-title {
    font-size: 20px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: inherit;
    line-height: 28px;
    text-align: left;
}

.card-info {
    position: absolute;
    top: 26px;
    left: 36px;
}

.level-condition {
    margin-top: 10px;
    font-size: 10px;
    font-weight: 400;
    color: inherit;

    line-height: 16px;
    text-align: left;

    & > span {
        color: inherit;
        font-size: 10px;
    }
}

.validate-time {
    margin-top: 2px;
    font-weight: 300;
    color: inherit;
    text-align: left;

    font-size: 10px;
    font-family: Helvetica;
    line-height: 12px;
}

.level-text {
    margin-top: 48px;
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #333333;
    line-height: 12px;
    width: 294px;
}

.loading-container {
    position: relative;
    margin-top: 8px;
    .total-loading {
        width: 295px;
        height: 12px;
        background: rgba(73, 73, 73, 0.2);
        border-radius: 6px;
    }

    .fill-loading {
        position: relative;
        left: 4px;
        top: -9px;
        width: 156px;
        height: 6px;
        background: linear-gradient(90deg, #6D7C9A 0%, #555E73 100%);
        border-radius: 3px;
    }
}

.white-triangle {
    display: inline-block;
    width: 0;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;

    border-left: 10px solid transparent;
    border-bottom: 14px solid white;
    border-right: 10px solid transparent;
}

.right-container {
    margin-top: 24px;
    margin-left: 20px;
    margin-right: 20px;
    padding: 20px;

    background: #FFFFFF;
    box-shadow: 0px 9px 20px -2px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
}

.right-title {
    text-align: center;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #444444;
    line-height: 22px;

    .right-icon-left {
        width: 11px;
        height: 10px;
        margin-right: 6px;
    }

    .right-icon-right {
        width: 11px;
        height: 10px;
        margin-right: 6px;
    }
}

.right-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    &::after {
        width: 80px;
        content: "";
    }
}

.each-right {
    margin-top: 24px;
    text-align: center;
    width: 80px;
    //margin-right: 18px;
    span {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 500;
        color: #444444;
        line-height: 17px;

    }
    .right-img {
        width: 30px;
        height: 30px;
    }
}

.level-desc {
    overflow: auto;
    padding: 24px 40px;
}

.desc-title-container {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: 600;
    color: rgba(45, 45, 45, 1);
    line-height: 22px;

    text-align: center;
}

.light-yellow-mark {
    display: inline-block;
    width: 3px;
    height: 8px;
    background: linear-gradient(129deg, rgba(253, 221, 104, 1) 0%, rgba(254, 212, 74, 1) 100%);
    border-radius: 1px;

    opacity: 0.5;
    transform: rotate(15deg);
    margin-right: 2px;
}

.deep-yellow-mark {
    display: inline-block;
    width: 4px;
    height: 10px;
    background: linear-gradient(129deg, rgba(253, 221, 104, 1) 0%, rgba(254, 212, 74, 1) 100%);

    border-radius: 1px;
    transform: rotate(15deg);
    margin-right: 2px;
}

.desc-title {
    display: inline-block;
    margin: 0 10px;
}

.desc-detail {
    height: 400px;
    overflow: auto;
}

.right-col {
    padding-left: 24px;
}

.block-title {
    background: #FAFAFB;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 12px;

    font-weight: bold;
    color: rgba(68, 68, 79, 1);
    line-height: 22px;
}

.mini-block-narrow {
    margin-top: 8px;
}

.middle-block-narrow {
    margin-top: 20px;
}

.huge-block-narrow {
    margin-top: 40px;
}

.item-narrow {
    padding-right: 8px;
}

.input-count {
    position: absolute;
    font-size: 12px;
    font-weight: 300;
    color: #b5b5be;

    line-height: 34px;
    left: 246px;
}


.avatar-item {
    width: 80px;
    height: 80px;
    margin: unset;

    border-radius: unset;
    overflow: hidden;

    .before-upload {
        border: 1px dashed #E5E2E5;

        &:hover {
            background-clip: content-box;
            padding: 2px;
            border: 1px dashed rgba(117, 108, 234, 1);
        }
    }


    .image-position {
        position: relative;
        width: 72px;
        height: 72px;
        text-align: center;

        border: 1px solid rgba(226, 226, 234, 1);
        cursor: pointer;
        background: rgba(0, 0, 0, .2);
        line-height: 72px;

        background-clip: content-box;
        padding: 2px;
        border-radius: 4px;

        img {
            height: 66px;
            width: 66px;
        }

        &:hover .demo-upload-list-cover {
            position: absolute;
            background: rgba(23, 23, 37, 0.6);
            color: #fff;
            left: 0;

            top: 0;
            width: 72px;
            height: 72px;
            background-clip: content-box;
            border: 1px solid #756CEA;

            padding: 2px;
            border-radius: 4px;
        }

        .had-upload {

            &:hover {

            }
        }
    }
}

.upload-class {
    background: #FAFAFB;
    background-clip: content-box;
    padding: 2px;
    line-height: 68px;
    border-radius: 4px;

    &:hover {
        background: #E9E8FF;

        .pointer {
            color: rgba(117, 108, 234, 1);
        }
    }
}

.form-remind {
    margin-top: 4px;
    font-size: 12px;
    font-weight: 300;
    color: rgba(146, 146, 157, 1);
    line-height: 22px;
}

.level-change {
    width: 240px;
    border-radius: 8px;
    border: 1px solid #e2e2ea;
    height: 34px;

    & > span:not(:last-child) {
        border-right: 1px solid rgba(226, 226, 234, 1);
    }
}

.status-btn {
    cursor: pointer;
    display: inline-block;
    color: rgba(105, 105, 116, 1);
    line-height: 32px;
    padding: 0 16px;

    &:hover {
        color: rgba(117, 108, 234, 1);
    }
}

.disable-achieve {
    cursor: not-allowed;
    color: white;
    background: #acacae;
    border-radius: 8px 0px 0px 8px;

    &:hover {
        color: white;
    }
}

.disable-unlock {
    cursor: not-allowed;
    color: white;
    background: #acacae;
    border-radius: 0 8px 8px 0;

    &:hover {
        color: white;
    }
}

.achieve-btn {
    background: #E9E8FF;
    border-radius: 8px 0px 0px 8px;
    position: relative;
    color: rgba(117, 108, 234, 1);

    &:after {
        content: '';
        display: block;
        position: absolute;
        top: -1px;
        bottom: -1px;
        left: -1px;
        right: -1px;
        border-radius: 8px 0px 0px 8px;
        border: 1px solid rgba(117, 108, 234, 1);
    }
}

.current-btn {
    background: #E9E8FF;
    position: relative;
    color: rgba(117, 108, 234, 1);

    &:after {
        content: '';
        display: block;
        position: absolute;
        top: -1px;
        bottom: -1px;
        left: -1px;
        right: -1px;
        border: 1px solid rgba(117, 108, 234, 1);
    }
}

.unlock-btn {
    background: #E9E8FF;
    border-radius: 0 8px 8px 0px;
    position: relative;
    color: rgba(117, 108, 234, 1);

    &:after {
        content: '';
        display: block;
        position: absolute;
        top: -1px;
        bottom: -1px;
        left: -1px;
        right: -1px;
        border-radius: 0 8px 8px 0px;
        border: 1px solid rgba(117, 108, 234, 1);
    }
}

.submit-container {
    border-top: 1px solid rgba(226, 226, 234, 1);
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
    padding-bottom: 40px;
}

.button-gap {
    margin-right: 8px;
}

.limit-editor-size {
    max-width: 670px;
    height: auto;
}
</style>
