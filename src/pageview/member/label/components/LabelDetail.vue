<!--
1. 规则、手动标签可编辑
2. 规则可编辑，模型，无法编辑
-->
<template>
  <div class="label-detail">
    <h2 class="h2">
      <span @click="goLabelList"><img
        :src="$backIcon"
        alt="←"
      >标签详情</span>
    </h2>

    <div class="base-label">
      <div class="clear">
        <h2 style="float: left">
          {{ labelDetail.name }}
        </h2>
        <i
          v-if="__hasPower('editLabel')"
          style="float: right"
          class="icon iconfont iconSetting"
          title="设置"
          @click="onSetLabelModal"
        />
      </div>
      <p class="p-text">
        {{ labelDetail.remark }}
      </p>

      <div class="item-row">
        <div class="item">
          <p>标签ID</p>
          <span>{{ labelDetail.id }}</span>
        </div>
        <div class="item">
          <p>标签类型</p>
          <span>{{ labelDetail.labelBaseTypeName }}</span>
        </div>
        <div class="item">
          <p>标签分组</p>
          <span>{{ labelDetail.labelGroupTypeName || "-" }}</span>
        </div>
      </div>

      <div class="item-row">
        <div class="item">
          <p>重算周期</p>
          <!-- labelDetail.updatePeriod 目前都是固定文案 -->
          <span>{{ labelDetail.labelBaseTypeName === '手动标签' ? '无' : '自动更新（每日凌晨）' }}</span>
        </div>
        <div class="item">
          <p>最近计算时间</p>
          <span>{{ $format(labelDetail.calculateTime) }}</span>
        </div>
        <div
          class="item"
          :style="'visibility: '+(labelDetail.labelBaseTypeName!=='手动标签'?'visible':'hidden')"
        >
          <p>下次计算时间</p>
          <span>{{
            labelDetail.calculateTime ? ($format(labelDetail.calculateTime + 86400 * 1000, "YYYY-MM-DD") + " 00:00:00") : "明日凌晨"
          }}</span>
        </div>
      </div>

      <p
        class="p-text"
        style="margin-top: 24px;font-size: 12px;"
      >
        由 {{ labelDetail.creatorName }} 在
        {{ $format(labelDetail.createTime) }} 创建
      </p>
    </div>

    <div class="table-label">
      <!-- fix tabPane 出现的次序问题 -->
      <Tabs
        v-if="labelDetail.labelBaseTypeName==='规则标签'"
        v-model="tabName"
        @on-click="tagChange"
      >
        <TabPane
          label="标签定义"
          name="var"
        />
        <TabPane
          v-if="true"
          label="标签人群"
          name="crowd"
        />
      </Tabs>

      <Tabs
        v-if="labelDetail.labelBaseTypeName!=='规则标签'"
        v-model="tabName"
        @on-click="tagChange"
      >
        <TabPane
          v-if="true"
          label="标签人群"
          name="crowd"
        />
      </Tabs>

      <div
        v-if="tabName===&quot;crowd&quot;"
        class="label-count"
      >
        <i class="icon iconfont iconInfo" />
        <span>符合标签的人数：<span class="color-text"> {{ $formatNumber(pageData.count, 0) }}</span></span>
      </div>
      <BaseTable
        v-if="tabName===&quot;crowd&quot;"
        :list="tableList"
        :col="tableCol"
        :page-data="pageData"
        :loading="loading"
        @on-pageChange="onPageChange"
        @on-pageSize="onPageSize"
      />

      <LabelView
        v-if="tabName===&quot;var&quot;&&labelDetail.rule"
        :rule="labelDetail.rule"
      />
    </div>

    <!-- Edit member label -->
    <Modal
      v-model="isEditLabelModal"
      title="标签编辑"
      :mask-closable="false"
      @on-cancel="onCancelLabelModal"
    >
      <Form
        v-if="isEditLabelModal"
        ref="editLabelData"
        :model="editLabelData"
        :rules="editLabelRule"
        :label-width="150"
        onsubmit="return false;"
      >
        <FormItem
          label="标签名称："
          prop="name"
        >
          <!-- 规则可编辑，模型，无法编辑-->
          <div v-if="labelDetail.labelBaseTypeName==='模型标签'&&labelDetail.modelLabelType!=='VIDEO'">
            <span>{{ editLabelData.name }}</span>
            <p class="p-text">
              该标签为根据用户生命周期模型计算获得
            </p>
          </div>
          <!-- 规则、手动标签可编辑-->
          <i-input
            v-else
            v-model="editLabelData.name"
            :maxlength="20"
            placeholder="请输入标签名称"
          />
        </FormItem>
        <FormItem
          label="标签分组："
          prop="labelGroupTypeId"
        >
          <i-select
            v-model="editLabelData.labelGroupTypeId"
            placeholder="请选择标签分组"
          >
            <Option
              v-for="item of labelGroupSelect"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </Option>
          </i-select>
        </FormItem>
        <FormItem label="备注：">
          <i-input
            v-model="editLabelData.remark"
            type="textarea"
            :rows="4"
            :maxlength="800"
            show-word-limit
            placeholder="请输入备注内容"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="onCancelLabelModal">
          取消
        </Button>
        <Button
          type="primary"
          :disabled="isCommitEditLabel"
          :loading="isCommitEditLabel"
          @click="onEditLabelModal"
        >
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import BaseTable from "../../../base/BaseTable";
import {labelCustomCol, labelCrowdCol} from "../../memberTableCol";
import {mapActions} from "vuex";
import LabelView from "./LabelView";
import mixinsGlobal from "@/mixins/mixinsGlobal";

export default {
    name: "LabelDetail",
    components: {BaseTable, LabelView},
    mixins: [mixinsGlobal],
    props: {
        propData: {
            type: Object,
            default() {
                return {
                    labelType: 1,
                    labelId: "",
                    edit: false
                };
            }
        }
    },
    data() {
        return {
            loading: false,
            isEditLabelModal: false,
            editLabelData: {
                name: "",
                labelGroupTypeId: "", // 标签分组
                remark: "",
            },
            labelDetail: {
                rule: {
                    subRules: []
                }
            },
            isCommitEditLabel: false,
            editLabelRule: {
                name: [{required: true, message: "请输入标签名称", trigger: "blur"}],
                labelGroupTypeId: [{required: true, message: "请选择标签分组", trigger: "change"}],
            },
            tabName: "var",
            tableList: [],
            id: this.propData.labelId,
            pageData: {
                page: 1,
                size: 10,
                count: 0
            },
            levelList: [],
            labelGroupSelect: [],
            orgId: localStorage.getItem("orgId")
        };
    },
    computed: {
        tableCol() {
            if (this.tabName === "var") return labelCustomCol.call(this);
            else return labelCrowdCol.call(this);
        },
    },
    created() {
        this.getBaseLabelDetail();
    },
    async mounted() {
        this.levelList = await this.getMemberLevelListSelect(this.orgId);
        this.getLabelCrowdList();
    },
    methods: {
        ...mapActions(["getLabelGroupSelect", "getMemberLevelListSelect"]),
        goLabelList() {
            this.$emit("whatComponent", {type: "LabelList"});
        },
        tagChange(name) {
            if (name === "crowd") this.onSearch();
        },
        onSearch() {
            this.pageData.page = 1;
            this.$nextTick(() => {
                this.getLabelCrowdList();
            });
        },
        onPageChange(val) {
            this.pageData.page = val;
            this.$nextTick(() => {
                this.getLabelCrowdList();
            });
        },
        onPageSize(size) {
            this.pageData.size = size;
            this.onSearch();
        },
        // 获取基础标签信息
        getBaseLabelDetail() {
            this.$ajaxGet("/label-server/label/detail", {id: this.id})
                .then(res => {
                    if (res && res.code === 10000) {
                        this.labelDetail = res.data || {};
                        if (res.data && res.data.labelBaseTypeName !== "规则标签") {
                            this.$nextTick(() => {
                                this.tabName = "crowd";
                            });
                        }
                    }
                });
        },
        getLabelCrowdList() {
            this.loading = true;
            this.$ajaxPost("/label-server/label/members", {ids: this.propData.labelId, ...this.pageData})
                .then(res => {
                    if (res && res.code === 10000) {
                        this.tableList = res.data.list || [];
                        this.pageData.count = res.data.count || 0;
                    }
                    this.loading = false;
                });
        },
        async onSetLabelModal() {
            this.isEditLabelModal = true;
            this.labelGroupSelect = [...await this.getLabelGroupSelect()];
            this.editLabelData.id = this.labelDetail.id;
            this.editLabelData.name = this.labelDetail.name;
            this.editLabelData.labelGroupTypeId = String(this.labelDetail.typeCode) === "0" ? "" : String(this.labelDetail.typeCode ? this.labelDetail.typeCode : "");
            this.editLabelData.remark = this.labelDetail.remark;
        },
        onCancelLabelModal() {
            this.isEditLabelModal = false;
        },
        onEditLabelModal() {
            this.$refs["editLabelData"].validate(valid => {
                if (valid) this.onEditLabel();
            });
        },
        // 编辑标签
        onEditLabel() {
            this.$ajaxPost("/label-server/label/update", this.editLabelData)
                .then(res => {
                    if (res && res.code === 10000) {
                        this.isEditLabelModal = false;
                        this.$Message.success(res.message || "操作成功");
                        this.getBaseLabelDetail();
                    }
                });
        }
    }
};
</script>

<style scoped lang="scss">
.base-label, .table-label {
    border-radius: 16px;
    padding: 24px;
    background: #fff;
}

.table-label {
    margin-top: 24px;
}

.item-row {
    display: flex;
    margin-top: 24px;

    .item {
        flex: 1;

        p {
            color: #92929D;
            font-size: 14px;
        }

        span {
            color: #171725;
        }
    }
}

.label-count {
    margin: 24px 0;
    border: 1px solid #756CEA;
    background: #E9E8FF;
    line-height: 48px;
    border-radius: 4px;
    padding-left: 16px;
    padding-right: 16px;

    .iconInfo {
        color: #756CEA;
        position: relative;
        top: -2px
    }
}
</style>

<style lang="less">

.label-detail {
    .ivu-tabs-ink-bar {
        height: 0;
    }
    .ivu-tabs-nav .ivu-tabs-tab-active {
        border-radius: 8px 8px 0px 0px;
        border-top: 4px solid #756cea;
        border-left: 1px solid #e2e2e9;
        border-right: 1px solid #e2e2e9;
    }
    .ivu-tabs-nav .ivu-tabs-tab-focused {
        border-radius: 8px 8px 0px 0px;
        border-top: 4px solid #756cea;
        border-left: 1px solid #e2e2e9;
        border-right: 1px solid #e2e2e9;
    }
    .ivu-tabs-nav .ivu-tabs-tab {
        padding: 7px 18px 11px 18px;
    }
}
</style>
