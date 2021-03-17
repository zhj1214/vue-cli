<template>
  <div>
    <h2 class="page-title">
      <span @click="backListPage"><i
        class="icon iconfont iconBack"
        title="返回"
      /></span>
      <span @click="backListPage">成长值设置</span>
    </h2>
    <div class="edit-level">
      <Row>
        <i-col
          span="8"
          class="left-col"
        >
          <div class="preview-container">
            <div class="phone-title">
              成长值规则
            </div>
            <div class="level-desc">
              <div
                class="desc-detail"
                v-html="growthForm.description"
              />
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
            :model="growthForm"
            :rules="growthValidate"
          >
            <div class="block-title">
              基础信息
            </div>
            <!--                        <FormItem v-if="firstEdit"-->
            <!--                                  label="成长值模式：" prop="levelName"-->
            <!--                                  class="middle-block-narrow">-->
            <!--                            <RadioGroup v-model="negativeMode">-->
            <!--                                <Radio label="1">-->
            <!--                                    <span>负分模式</span>-->
            <!--                                </Radio>-->
            <!--                                <Radio label="0">-->
            <!--                                    <span>非负分模式</span>-->
            <!--                                </Radio>-->
            <!--                            </RadioGroup>-->
            <!--                            <div class="form-remind">-->
            <!--                                <p>该模式下用户可以存在负成长值</p>-->
            <!--                                <p>注意：成长值模式设置完成后无法修改</p></div>-->
            <!--                        </FormItem>-->

            <!--                        <FormItem v-if="(!firstEdit && growthForm.negative)" label="成长值模式：" prop="levelName" class="middle-block-narrow">-->
            <!--                            <div>负分模式</div>-->
            <!--                            <div class="form-remind">用户可以存在负成长值</div>-->
            <!--                        </FormItem>-->

            <!--                        <FormItem v-if="(!firstEdit && !growthForm.negative)" label="成长值模式：" prop="levelName" class="middle-block-narrow">-->
            <!--                            <div>非负分模式</div>-->
            <!--                            <div class="form-remind">用户成长值扣减至 0 则不再扣减</div>-->
            <!--                        </FormItem>-->


            <FormItem
              label="成长值有效期："
              prop="growthExpirationYear"
              class="middle-block-narrow"
            >
              <div class="input-container">
                <i-input
                  v-model="growthForm.growthExpirationYear"
                  class="w120"
                  @on-keyup="allowInt('growthExpirationYear', 99)"
                >
                  <span slot="append">个</span>
                </i-input>
                <span>自然年</span>
              </div>
            </FormItem>

            <FormItem
              label="消费获得成长值："
              class="middle-block-narrow"
            >
              <i-switch v-model="growthForm.open">
                <span slot="open">开</span>
                <span slot="close">关</span>
              </i-switch>
            </FormItem>

            <div v-if="growthForm.open">
              <FormItem
                label="兑换比例："
                prop="consumeMoney"
                class="middle-block-narrow"
              >
                <div class="input-container">
                  <span>每消费</span>
                  <i-input
                    v-model="growthForm.consumeMoney"
                    class="w120 input-narrow"
                    @on-keyup="allowFloatTwo('consumeMoney')"
                  >
                    <span slot="prepend">￥</span>
                  </i-input>
                  <span>，获得 1 成长值</span>
                </div>
              </FormItem>

              <FormItem
                label="获取上限："
                prop="maxLimit"
                class="middle-block-narrow"
              >
                <RadioGroup v-model="limitType">
                  <div>
                    <Radio label="1">
                      <span>无上限限制</span>
                    </Radio>
                  </div>

                  <div
                    v-if="limitType === '1'"
                    class="max-growth"
                  >
                    <Radio label="2">
                      <span>每人通过消费最多获取定额成长值/天</span>
                    </Radio>
                  </div>
                  <div
                    v-else
                    class="max-growth"
                  >
                    <Radio label="2">
                      <span>每人通过消费最多获取定额成长值  </span>
                      <i-input
                        v-model="growthForm.maxLimit"
                        class="w120 inline-input"
                        @on-keyup="allowInt('maxLimit', 'max')"
                      />
                      <span class="input-narrow">成长值/天</span>
                    </Radio>
                  </div>
                </RadioGroup>
              </FormItem>
            </div>

            <div class="block-title">
              图文详情
            </div>
            <FormItem
              label="成长值说明："
              prop="protectionGradeValue"
              class="middle-block-narrow"
            >
              <RichEditor
                :catch-data="catchData"
                :content="growthForm.description"
                :menus="richEditorMenus"
                :upload-img-server="this.$upload"
                upload-file-name="file"
                :styles="{width:'376px'}"
              />
              <div class="form-remind">
                尺寸：全屏图片宽度建议 ≥ 670 px，1M 以内；支持格式：png、jpg、jpeg
              </div>
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
          @click="submitGrowth"
        >
          提交
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
    import RichEditor from '@/components/wEditor';
    import 'swiper/css/swiper.css'
    import { log } from "@/utils/tools";
    // import defaultPhoto from "@/assets/images/member/default_member_photo.png"

    export default {
        name: "GrowthSetting",
        components: {
            RichEditor,
        },
        data() {
            return {
                id: '',
                orgId: '',
                orgName: '',
                firstEdit: false,

                growthForm: {
                    id: '',
                    consumeMoney: '',
                    growthExpirationYear: '',
                    description: '',
                    isShareData: '',

                    modifier: '',
                    negative: '',
                    open: '',
                    maxLimit: '',
                },
                negativeMode: '',

                limitType: '2',
                richEditorMenus: [
                    'bold','italic','underline','strikeThrough',
                    'foreColor', 'backColor','fontSize',
                    'link','justify','quote','list',
                    'emoticon', 'table','head','image',
                ],
                growthValidate: {
                    levelName: [
                        {
                            required: true,
                            message: "请输入等级名称",
                            trigger: 'blur',
                            type: 'string'
                        },
                    ],
                    growthExpirationYear: [
                        {
                            required: true,
                            message: "请输入成长值有效期",
                            trigger: 'blur',
                            type: 'string'
                        },
                    ],
                    consumeMoney: [
                        {
                            required: true,
                            message: "请输入兑换比例",
                            trigger: 'blur',
                            type: 'string'
                        },
                    ],
                    maxLimit: [
                        {
                            required: true,
                            message: () => {
                                let noLimit = this.limitType === '1'
                                let m = '请输入获取上限'

                                if (noLimit) {
                                    m = ''
                                }
                                return m
                            },
                            trigger: 'blur',
                            type: 'string',
                            asyncValidator: (rule, value) => {
                                let hasLimit = this.limitType === '2'
                                let emptyInput = this.$_.isEmpty(value)

                                return new Promise((resolve, reject) => {
                                    if (hasLimit && emptyInput) {
                                        reject('-')
                                    } else {
                                        resolve();
                                    }
                                });
                            },
                        },
                    ],
                },
            };
        },
        computed: {
            displayNegative() {
                let showText = this.growthForm.isNegative === '0'
                return showText
            }

        },
        created() {
            this.initData()
            this.getGrowthInfo()
        },
        mounted() {

        },
        methods: {
            initData() {
                let orgId = localStorage.orgId || '777777'
                let orgName = localStorage.orgName
                this.orgId = orgId
                this.orgName = orgName
            },
            getGrowthInfo() {
                let server = '/points-server'
                let url = server + '/api/growth/info'
                let data = { orgId: this.orgId}

                this.$ajaxGet(url, data)
                    .then(res => {
                        if (res && res.code === 10000) {
                            let resData = res.data
                            if (resData === undefined) {
                                this.firstEdit = true
                            } else {
                                this.renderPage(resData)
                            }

                        }
                    })
                    .catch(err => {
                        log(err);
                    });
            },
            isConfigLevel() {
                let { id } = this.growthForm
                let isConfig = id === '-'
                return isConfig
            },
            renderPage(data) {
                Object.assign(this.growthForm, {
                    id: data.id,
                    consumeMoney: data.consumeMoney,
                    growthExpirationYear: data.growthExpirationYear,
                    description: data.description,
                    isShareData: data.isShareData,

                    modifier: data.modifier,
                    // negative: data.negative,
                    open:data.open,
                    maxLimit: data.maxLimit,
                })

                let maxLimit = data.maxLimit
                let isEmpty = maxLimit === '' || maxLimit === undefined
                if (isEmpty) {
                    this.limitType = '1'
                }
            },
            backListPage() {
                this.$router.push(`/member/settingLevel`)
            },
            catchData(content){
                this.growthForm.description = content
            },
            initForm() {
                Object.assign(this.growthForm, {
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
                    "levelDescription": ""
                })
            },
            cancelSubmit() {
                this.initForm()
                this.backListPage()
            },
            formatGrowthForm() {
                let data = {
                    ...this.growthForm,
                    orgId: this.orgId,
                }

                // delete data.negative
                // if(this.firstEdit) {
                //     data.negative = this.negativeMode === '1'
                // }
                // 无上限时传给后端空字符串
                if (this.limitType === '1') {
                    data.maxLimit = ''
                }

                return data
            },
            validateForm() {
                let { growthExpirationYear, consumeMoney, open, maxLimit} = this.growthForm

                if (growthExpirationYear === '') {
                    this.$Message.error('保存失败，您还未填写成长值有效期！')
                    return true
                }

                if (open &&  (consumeMoney === '')) {
                    this.$Message.error('保存失败，您还未填写兑换比例！')
                    return true
                }

                if (open && (consumeMoney === '0')) {
                    this.$Message.error('保存失败，兑换比例不能为零！')
                    return true
                }

                let hasLimit = this.limitType === '2'
                let emptyInput = maxLimit === '' || maxLimit === undefined
                if (open && hasLimit && emptyInput) {
                    this.$Message.error('保存失败，获取上限不能为空！')
                    return true
                }

                return false
            },
            sendGrowth() {
                let server = '/points-server'
                let url = server + '/api/growth/edit'
                let notPass = this.validateForm()
                if (notPass) {
                    return
                }
                let data = this.formatGrowthForm()

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
            submitGrowth() {
                // if (this.firstEdit) {
                //     let negativeText = '<p>当前您已选择负分模式，该模式下用户可以存在负成长值。</p><p>成长值模式设置完成后无法修改，是否确认设置该成长值模式？</p>'
                //     let text = '<p>当前您已选择无负分模式，该模式下用户成长值扣减至 0 则不再扣减。</p><p>成长值模式设置完成后无法修改，是否确认设置该成长值模式？</p>'
                //     if (this.growthForm.negative === '1') {
                //         text = negativeText
                //     }
                //
                //     this.$Modal.confirm({
                //         title: '成长值模式提交确认',
                //         content: text,
                //         onOk: () => {
                //             this.sendGrowth()
                //         },
                //         onCancel: () => {
                //
                //         }
                //     });
                // } else {
                //     this.sendGrowth()
                // }
                this.sendGrowth()
            },
            allowInt(key, limit) {
                let currentValue = this.growthForm[key]
                let temp
                if (currentValue.length === 1) {
                    temp = currentValue.replace(/[^1-9]/g, '')
                } else {
                    temp = currentValue.replace(/\D/g, '')
                }

                if (limit === 'max') {
                    limit = Math.pow(10, 7) - 1
                }
                let big = Number(temp) > limit
                if (big) {
                    temp = String(limit)
                }

                this.growthForm[key] = temp
            },
            allowFloatTwo(key) {
                let currentValue = this.growthForm[key]
                let ex = /^\d+\.?\d{0,2}$/
                let temp = currentValue
                if(!ex.test(currentValue)){
                    temp = currentValue.substring(0, currentValue.length - 1);
                }

                let big = Number(temp) >= Math.pow(10, 7)
                if (big) {
                    temp = Math.pow(10, 7) - 1
                }
                this.growthForm[key] = String(temp)
            },
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
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 12px 0px rgba(0,0,0,0.04);
        border-radius:16px;
        padding: 20px 24px;
    }

    .preview-container {
        width:378px;
        height: 812px;
        border-radius:24px;
        box-sizing: border-box;

        border: 1px solid #e8eaec;
        /*overflow: hidden;*/
        background:url('../../../../assets/images/member/phone_preview.png') no-repeat 0 0;
        background-size:100%;
    }

    .phone-title {
        margin-top: 54px;
        text-align: center;
        font-size:19px;
        font-weight:600;
        color:rgba(0,0,0,1);
        line-height:23px;
    }

    .user-info {
        position: relative;
        margin-top: 10px;
        width: 376px;
        height: 254px;

        background:url('../../../../assets/images/member/preview_background.png') no-repeat 0 0;
        background-size:100%;
    }

    .member-name-row {
        padding: 16px 24px 0 24px;
        display: flex;
        justify-content: space-between;
    }

    .growth-record {
        font-size:14px;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:20px;
        vertical-align: middle;

        .iconTips {
            color: white;
        }
    }

    .name-img {
        width: 120px;
        display: flex;
        justify-content: space-between;

        & > img {
            width:39px;
            height:39px;
            border-radius: 50%;
            border: 1px solid white;
        }
    }

    .user-name {
        font-size:14px;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:14px;
    }

    .growth-value {
        margin-top: 6px;
        font-size:12px;
        font-weight:500;
        color:rgba(224,180,107,1);
        line-height:16px;
    }

    .card-list {
        margin-top: 22px;
        text-align: center;
        position: relative;
    }

    .current-text {
        position: absolute;
        top: 0;
        right: 20px;
        width:60px;
        height:20px;
        color: white;
        background:rgba(181,137,50,1);
        border-top-right-radius:6px;
        border-bottom-left-radius: 6px;

        font-size:10px;
        font-weight:400;
        line-height: 20px;
    }

    .unlock-text {
        position: absolute;
        top: 0;
        right: 20px;
        width:60px;
        height:20px;
        color: #b58932;
        background:#1B1B1B;
        border-top-right-radius:6px;
        border-bottom-left-radius: 6px;

        font-size:10px;
        font-weight:400;
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
        width:335px;
        height:135px;
        border-radius:6px;
    }

    .card-container {
        margin: 0 auto;
        width:335px;
        height:135px;
        position: relative;
    }

    .card-text {
        position: absolute;
        top: 0;
        margin-left: 29px;
    }
    .card-title {
        margin-top: 24px;
        font-size:19px;
        font-weight:400;
        color: inherit;
        line-height:26px;
        text-align: left;
    }

    .level-condition {
        margin-top: 10px;
        font-size:10px;
        font-weight:400;
        color:inherit;

        line-height:16px;
        text-align: left;

        & > span {
            color: inherit;
            font-size: 10px;
        }
    }

    .validate-time {
        margin-top:24px;
        font-size:11px;
        font-weight:300;
        color:inherit;

        line-height:16px;
        text-align: left;
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

    .level-desc {
        overflow: auto;
        padding: 24px 40px;
    }

    .desc-title-container {
        margin-bottom: 20px;
        font-size:16px;
        font-weight:600;
        color:rgba(45,45,45,1);
        line-height:22px;

        text-align: center;
    }

    .light-yellow-mark {
        display: inline-block;
        width:3px;
        height:8px;
        background:linear-gradient(129deg,rgba(253,221,104,1) 0%,rgba(254,212,74,1) 100%);
        border-radius:1px;

        opacity:0.5;
        transform: rotate(15deg);
        margin-right: 2px;
    }

    .deep-yellow-mark {
        display: inline-block;
        width:4px;
        height:10px;
        background:linear-gradient(129deg,rgba(253,221,104,1) 0%,rgba(254,212,74,1) 100%);

        border-radius:1px;
        transform: rotate(15deg);
        margin-right: 2px;
    }

    .desc-title {
        display: inline-block;
        margin: 0 10px;
    }

    .desc-detail {
        height: 680px;
        overflow: auto;
    }
    .right-col {
        padding-left: 24px;
    }

    .block-title {
        background: #FAFAFB;
        border-radius:8px;
        padding: 8px 16px;
        font-size:12px;

        font-weight: bold;
        color:rgba(68,68,79,1);
        line-height:22px;
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
                border:1px dashed rgba(117, 108, 234, 1);
            }
        }


        .image-position {
            position: relative;
            width: 72px;
            height: 72px;
            text-align: center;

            border:1px solid rgba(226,226,234,1);
            cursor: pointer;
            background: rgba(0, 0, 0, .2);
            line-height: 72px;

            background-clip: content-box;
            padding: 2px;
            border-radius:4px;
            img {
                height: 66px;
                width: 66px;
            }

            &:hover .demo-upload-list-cover {
                position: absolute;
                background: rgba(23,23,37,0.6);
                color: #fff;
                left: 0;

                top: 0;
                width: 72px;
                height: 72px;
                background-clip: content-box;
                border:1px solid #756CEA;

                padding: 2px;
                border-radius:4px;
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
        border-radius:4px;

        &:hover {
            background:#E9E8FF;

            .pointer {
                color: rgba(117, 108, 234, 1);
            }
        }
    }

    .form-remind {
        margin-top: 4px;
        font-size:12px;
        font-weight:300;
        color:rgba(146,146,157,1);
        line-height:22px;
    }

    .level-change {
        width: 240px;
        border-radius: 8px;
        border: 1px solid #e2e2ea;
        height: 34px;

        & > span:not(:last-child) {
            border-right: 1px solid rgba(226,226,234,1);
        }
    }

    .status-btn {
        cursor: pointer;
        display: inline-block;
        color:rgba(105,105,116,1);
        line-height:32px;
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
        background:#E9E8FF;
        border-radius:8px 0px 0px 8px;
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
        background:#E9E8FF;
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
        background:#E9E8FF;
        border-radius:0 8px 8px 0px;
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
        border-top: 1px solid rgba(226,226,234,1);
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

    .input-container {
        display: flex;
        justify-content: flex-start;

        & > span:last-child {
            margin-left: 8px;
            line-height: 32px;
        }
    }

    .max-growth {
        height: 34px;
    }

    .input-narrow {
        margin-left: 8px;
    }
</style>
