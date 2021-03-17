<template>
  <Modal
    :value="importVisible"
    :title="computedTitle"
    :mask-closable="false"
    class="tagsListImport"
    @on-cancel="cancelFunc"
  >
    <div class="tagsListImport__item">
      <p class="item__common item__left">
        当前标签：
      </p>
      <p class="item__common item__right">
        {{ checkedObj.name }}
      </p>
    </div>
    <div class="tagsListImport__item">
      <template>
        <template v-if="!isWatchImport">
          <p
            v-if="step === 1"
            class="item__common item__left"
          >
            识别方式：
          </p>
          <div
            v-if="step === 1"
            class="item__right"
          >
            <Select
              v-model="checkedWay"
              style="width: 350px;height: 38px;"
            >
              <Option
                v-for="item in wayList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
            <a
              class="right__download"
              :href="checkedWay"
              :download="'模板-' + computedChededWayName"
            >
              <i
                class="icon iconfont iconDownload"
                title="返回"
              />
              <p>下载模板</p>
            </a>
          </div>
        </template>
        <template v-else>
          <p class="item__common item__left">
            文件名称：
          </p>
          <a
            class="right__download"
            :href="labelData.originFileUrl"
            :download="computedChededWayName"
          >
            <p
              class="item__common item__right"
              title="点击下载"
            >
              {{ computedChededWayName }}
            </p>
          </a>
        </template>
      </template>
    </div>
    <div
      v-if="!isWatchImport && step === 2"
      class="tagsListImport__item"
    >
      <p class="item__common item__left">
        上传文件：
      </p>
      <div class="item__right">
        <template>
          <Upload
            v-if="choiceFile === null"
            type="drag"
            action="''"
            :before-upload="handleUpload"
            accept=".xlsx, .csv"
          >
            <div style="padding: 9px 0;text-align: center;">
              <i
                class="icon iconfont iconUpload"
                title="返回"
              />
            </div>
          </Upload>
          <div
            v-else
            class="right__file"
          >
            <Upload
              type="drag"
              action="''"
              :before-upload="handleUpload"
              :show-upload-list="false"
              accept=".xlsx, .csv"
            >
              <p>
                <Icon type="ios-attach" />
                {{ choiceFile.name ? choiceFile.name : '-' }}
              </p>
            </Upload>
            <Icon
              type="md-close"
              style="cursor: pointer;margin-left: 10px;"
              @click="emptyTheFile"
            />
          </div>
        </template>
        <p class="right__toast">
          请使用系统提供的模板导入会员信息。当数据量较大时，可能延长导入时长，您可点击【进程查看】获取导入进度。
        </p>
      </div>
    </div>
    <div
      v-if="isWatchImport"
      class="tagsListImport__item"
    >
      <p class="item__common item__left">
        导入时间：
      </p>
      <p class="item__common item__right">
        {{
          labelData.importTime
            ? $format(labelData.importTime, 'YYYY-MM-DD HH:mm:ss')
            : '-'
        }}
      </p>
    </div>
    <div
      v-if="isWatchImport"
      class="tagsListImport__item"
    >
      <p class="item__common item__left">
        导入结果：
      </p>
      <div class="item__right">
        <div v-if="labelData.fileName">
          <p
            v-if="labelData.successCount === null && labelData.failCount === null"
            class="item__common"
          >
            正在导入中，请稍后…
          </p>
          <div v-else>
            <p class="item__common">
              成功数据
              <span style="color: #31D500;">
                &nbsp;&nbsp;{{ $formatNumber(labelData.successCount, 0) }}条&nbsp;&nbsp;
              </span>
              <Tooltip
                v-if="labelData.successCount"
                placement="top"
              >
                <Icon
                  type="ios-help-circle"
                  style="color: #1890FF;font-size: 19px;cursor: pointer;"
                />
                <div slot="content">
                  <p>导入成功的统计值为可识别数据</p>
                  <p>总和，真实打上标签的人数系统</p>
                  <p>将在此基础上做自动去重处理</p>
                </div>
              </Tooltip>
            </p>
            <p class="item__common">
              失败数据
              <span style="color: #FF3241;">
                &nbsp;&nbsp;{{ $formatNumber(labelData.failCount, 0) }}条&nbsp;&nbsp;
              </span>
              <a
                v-if="labelData.failCount && labelData.failFileUrl"
                :href="labelData.failFileUrl"
                download="错误报告"
              >
                下载错误报告
              </a>
            </p>
          </div>
        </div>
        <p
          v-else
          class="item__common"
        >
          -
        </p>
      </div>
    </div>

    <div slot="footer">
      <template v-if="!isWatchImport">
        <Button
          @click="cancelFunc"
        >
          取 消
        </Button>
        <template>
          <Button
            v-if="step === 1"
            type="primary"
            @click="nextStepFunc"
          >
            下一步
          </Button>
          <template v-else>
            <Button
              style="margin-right: 8px;"
              @click="previousStepFunc"
            >
              上一步
            </Button>
            <Poptip
              trigger="click"
              confirm
              transfer
              title="您是否确认导入？"
              @on-ok="startToLead"
              @on-cancel="() => {}"
            >
              <Button
                type="primary"
                :disabled="!choiceFile"
              >
                导 入
              </Button>
            </Poptip>
          </template>
        </template>
      </template>
      <template v-else>
        <Button
          @click="cancelFunc"
        >
          关 闭
        </Button>
      </template>
    </div>
  </Modal>
</template>

<script>
// import { formatNumber } from "../../../../utils/tools";

export default {
    name: 'TagsListImport',
    components: {},
    props: {
        importVisible: {
            type: Boolean,
            default: false
        },
        isWatchImport: {
            type: Boolean,
            default: false
        },
        checkedObj: {
            type: Object,
            default: () => {
            }
        }
    },
    data() {
        return {
            step: 1,
            wayList: [
                {
                    label: '按会员ID导入.csv',
                    value: 'https://oss-jiebai.oss-cn-hangzhou.aliyuncs.com/26b33f2f05974c73a2dc4e55742c5729.csv'
                },
                {
                    label: '按会员ID导入.xlsx',
                    value: 'https://oss-jiebai.oss-cn-hangzhou.aliyuncs.com/810403bbcf0b4bfb9582afc3001de132.xlsx'
                },
                {
                    label: '按手机号导入.csv',
                    value: 'https://oss-jiebai.oss-cn-hangzhou.aliyuncs.com/9ee641e7a1694379acbab367c89ef047.csv'
                },
                {
                    label: '按手机号导入.xlsx',
                    value: 'https://oss-jiebai.oss-cn-hangzhou.aliyuncs.com/54681f00c11b466ea234835c75086a39.xlsx'
                }
            ],
            checkedWay: 'https://oss-jiebai.oss-cn-hangzhou.aliyuncs.com/810403bbcf0b4bfb9582afc3001de132.xlsx',
            choiceFile: null,
            isUploading: false,
            labelData: {}
        }
    },
    computed: {
        computedTitle() {
            let str = '';
            if (this.isWatchImport) {
                str = '进程查看';
            } else {
                str = '导入会员';
            }
            return str;
        },
        computedChededWayName() {
            let text = '';
            if (this.isWatchImport) {
                text = this.labelData.fileName || '-';
            } else {
                let checkedArr = (this.wayList).filter(item => item.value === this.checkedWay);
                if (checkedArr.length) {
                    let checkedLabel = checkedArr[0].label;
                    text = checkedLabel;
                }
            }
            return text;
        }
    },
    watch: {
        'importVisible'(newValue) {
            if (newValue) {
                if (this.isWatchImport) {
                    this.getImportRecord();
                }
                this.step = 1;
                this.checkedWay = 'https://oss-jiebai.oss-cn-hangzhou.aliyuncs.com/810403bbcf0b4bfb9582afc3001de132.xlsx';
                this.choiceFile = null;
                this.isUploading = false;
            }
        }
    },
    methods: {
        handleUpload(file) {
            this.choiceFile = file;
            return false;
        },
        emptyTheFile() {
            this.choiceFile = null;
        },
        cancelFunc() {
            this.$emit('hideTheImportModal');
        },
        nextStepFunc() {
            this.step = 2;
        },
        previousStepFunc() {
            this.step = 1;
        },
        startToLead() {
            if (this.isUploading) {
                return false;
            }
            this.isUploading = true;
            let formData = new FormData();
            formData.append("labelId", this.checkedObj.id);
            formData.append("file", this.choiceFile);
            formData.append("orgId", localStorage.getItem('orgId'));
            this.$ajaxPost('/label-server/tagLabel/uploadTagMemberFile',
                // {
                //   file: this.choiceFile,
                //   labelId: this.checkedObj.id,
                //   orgId: localStorage.getItem('orgId')
                // },
                formData,
                '', {
                    'Content-type': 'multipart/form-data'
                }).then(res => {
                if (res && res.code === 10000) {
                    this.$Message.success('开始导入...');
                    this.choiceFile = null;
                    this.isUploading = false;
                    this.cancelFunc();
                }
            })
                .catch(err => {
                    this.isUploading = false;
                    console.info(err);
                });
        },
        getImportRecord() {
            this.$ajaxGet('/label-server/tagLabel/getImportRecord', {
                labelId: this.checkedObj.id
            }).then(res => {
                if (res && res.code === 10000) {
                    this.labelData = res.data || {};
                }
            })
                .catch(err => {
                    console.info(err);
                });
        }
    }
}
</script>

<style lang="scss" scoped>
.tagsListImport {
    width: auto;
    height: auto;
}

.tagsListImport__item {
    width: 100%;
    height: auto;
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
}

.item__common {
    font-size: 14px;
    color: #3E4552;
    font-weight: 500;
    line-height: 38px;
}

.item__left {
    flex: 0 0 auto;
    width: 100px;
    height: 38px;
    margin-right: 10px;
    text-align: right;
}

.item__right {
    flex: 1 1 auto;
    width: auto;
    height: auto;
}

.right__download {
    width: auto;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    img {
        width: 20px;
        height: 20px;
    }

    p {
        font-size: 14px;
        color: #756CEA;
        font-weight: 500;
    }
}

.right__file {
    width: 100%;
    height: auto;
    padding: 8px 10px;
    background: rgba(248, 250, 251, 1);
    border-radius: 4px;
    font-size: 14px;
    color: #000000;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
        flex: 1 1 auto;
        margin-right: 20px;
    }
}

.right__toast {
    font-size: 12px;
    color: #9AA8B8;
    font-weight: 300;
    margin-top: 4px;
}
</style>
