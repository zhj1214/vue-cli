<template>
  <Form
    ref="formValidate"
    :model="formData"
    :rules="ruleValidate"
    :label-width="150"
    label-colon
  >
    <FormItem
      label="机构类型"
      prop="type"
    >
      <RadioGroup v-model="formData.type">
        <Radio
          v-for="item in ENUM_TYPES"
          :key="item.value"
          :label="item.value"
        >
          {{ item.name }}
        </Radio>
      </RadioGroup>
    </FormItem>

    <FormItem
      v-if="formData.type === 1"
      label="机构名称"
      prop="orgArr"
      :rules="[{ required: true, message: '机构名称不能为空' }]"
    >
      <Cascader
        v-model="formData.orgArr"
        change-on-select
        :data="orgs"
        @on-change="selectOrg"
      />
    </FormItem>

    <FormItem
      v-if="formData.type === 2"
      label="机构名称"
      prop="orgName"
    >
      <i-input
        v-model="formData.orgName"
        placeholder="请输入机构名称"
        @on-blur="validateOrgName"
      />
    </FormItem>
    <FormItem
      v-if="formData.type === 2"
      label="机构编码"
      prop="orgId"
    >
      <i-input
        v-model="formData.orgId"
        placeholder="企业统一社会信用代码，长度为18位"
        @on-blur="validateOrgId"
      />
    </FormItem>
    <FormItem
      label="注册渠道归属方"
      prop="affiliationOrganizationId"
      filterable
    >
      <Select
        v-model="formData.affiliationOrganizationId"
        clearable
        filterable
      >
        <Option
          v-for="item in ENUM_BELONGS"
          :key="item.value"
          :value="item.value"
        >
          {{ item.name }}
        </Option>
      </Select>
    </FormItem>
    <FormItem
      v-if="formData.type === 2"
      label="小程序注册二维码"
      prop="paramName"
      :rules="{
        required: true,
        message: '请输入参数名',
        trigger: 'blur',
      }"
    >
      <Row>
        <i-col span="18">
          <i-input
            v-model="formData.paramName"
            type="text"
            placeholder="请输入数字或字母"
          >
            <span slot="prepend">参数名</span>
          </i-input>
        </i-col>
      </Row>
    </FormItem>
    <FormItem
      v-for="(item, index) in formData.linkList"
      :key="index"
      :label="formData.type === 2 ? '' : index > 0 ? '' : '小程序注册二维码'"
      :prop="'linkList.' + index + '.linkName'"
      :rules="{
        required: true,
        message: '请填写渠道名',
        trigger: 'blur',
      }"
    >
      <Row>
        <i-col span="18">
          <i-input
            v-model="item.linkName"
            type="text"
            placeholder="请输入..."
          >
            <span slot="prepend">渠道名称</span>
          </i-input>
        </i-col>
        <i-col
          v-if="index > 0"
          span="4"
          offset="1"
        >
          <Button
            class="no-border"
            ghost
            type="primary"
            icon="ios-trash-outline"
            @click="handleRemove(index)"
          />
        </i-col>
      </Row>
    </FormItem>
    <FormItem>
      <Row>
        <i-col span="12">
          <Button
            class="no-border tl"
            ghost
            type="primary"
            icon="ios-add-circle-outline"
            @click="handleAdd"
          >
            {{ formData.type === 1 ? '添加' : '添加渠道名' }}
          </Button>
        </i-col>
      </Row>
    </FormItem>
  </Form>
</template>

<script>
import { LINK, transformTree } from '../common';

export default {
  components: {},
  data() {
    return {
      ENUM_TYPES: [
        {
          name: '内部系统',
          value: 1,
        },
        {
          name: '外部公司',
          value: 2,
        },
      ],
      ENUM_BELONGS: [
        // {
        //   name: 'New York',
        //   value: 555555,
        // },
        // {
        //   name: 'London',
        //   value: 66666,
        // },
      ],
      orgs: [
        // {
        //   value: 'jiangsu',
        //   label: '江苏',
        //   title: '123',
        //   orgId: '1345',
        //   children: [
        //     {
        //       value: 'nanjing',
        //       label: '南京',
        //       title: '1234',
        //       orgId: '13455',
        //       children: [
        //         {
        //           value: 'fuzimiao',
        //           label: '夫子庙',
        //           title: '1235',
        //           orgId: '134564',
        //         },
        //       ],
        //     },
        //   ],
        // },
      ],
      selectedOrg: {}, // type 1 时的机构信息
      formData: {
        type: 1,
        orgArr: [],
        orgName: '',
        affiliationOrganizationId: '',
        orgId: '',
        paramName: '',

        linkList: [
          {
            linkName: '渠道1',
            link: LINK,
          },
        ],
      },
      ruleValidate: {
        type: [{ required: true, message: '机构类型不能为空' }],
        orgName: [{ required: true, message: '机构名称不能为空' }],
        affiliationOrganizationId: [
          { required: true, message: '注册渠道归属方不能为空' },
        ],
        orgId: [{ required: false }, { max: 18, message: '长度不能超过18位' }],
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.fetchOrgs();
      this.fetchBelongs();
    },
    async fetchOrgs() {
      const departmentId = localStorage.getItem('departmentId');
      // const departmentId = 1;
      const res = await this.$ajaxGet(
        `/user-server/platform/department/entityTree`,
        { departmentId }
      );
      if (res && res.code === 10000) {
        const { data } = res;
        const newTree = transformTree(data || []);
        this.orgs = newTree;
      }
    },
    async fetchBelongs() {
      const res = await this.$ajaxPost(
        `/user-server/platform/department/pageDepartment`,
        { page: 1, size: 100000, type: 5 }
      );
      if (res && res.code === 10000) {
        const { data } = res;
        this.ENUM_BELONGS =
          data.list &&
          data.list.map((v) => ({
            name: v.name,
            value: v.orgId,
          }));
      }
    },
    handleSubmit(name = 'formValidate', options = {}) {
      this.$refs[name].validate(async (valid) => {
        console.log(valid);
        if (valid) {
          const params =
            this.formData.type === 1
              ? {
                  type: this.formData.type,
                  orgName: this.selectedOrg.title,
                  orgId: this.selectedOrg.orgId,
                  affiliationOrganizationId: this.formData
                    .affiliationOrganizationId,
                  linkList: this.formData.linkList,
                  number: this.formData.linkList.length,
                }
              : {
                  type: this.formData.type,
                  orgName: this.formData.orgName,
                  orgId: this.formData.orgId,
                  affiliationOrganizationId: this.formData
                    .affiliationOrganizationId,
                  linkList: this.formData.linkList.map((it) => ({
                    ...it,
                    parameter: this.formData.paramName,
                  })),
                  number: this.formData.linkList.length,
                };

          if (this.formData.type === 2) {
            const isOkOrgName = await this.validateOrgName();
            if (!isOkOrgName) {
              options.complete && options.complete();
              return;
            }
            const isOkOrgId = await this.validateOrgId();
            if (!isOkOrgId){
               options.complete && options.complete();
              return;
            } 
          }
          const res = await this.$ajaxPost(
            '/member-server/api/channel/insert',
            params
          );
          if (res && res.code === 10000) {
            this.$Message.success('新建成功!');
            options.success && options.success();
            options.complete && options.complete();
          }
          options.complete && options.complete();
        } else {
          options.complete && options.complete();
          return;
        }
      });
    },
    // 验证重复
    async validatRepeat(params) {
      const res = await this.$ajaxGet(
        '/member-server/api/channel/check',
        params
      );
      if (res && res.code === 10000) {
        return res.data;
      }
      return false;
    },

    async validateOrgName() {
      if (!this.formData.orgName) return;
      const isRepeat = await this.validatRepeat({
        orgName: this.formData.orgName,
      });
      if (isRepeat) {
        this.$Message.error('机构名称重复');
        return false;
      }
      return true;
    },
    async validateOrgId() {
      if (!this.formData.orgId) return true;
      const isRepeat = await this.validatRepeat({
        orgId: this.formData.orgId,
      });
      if (isRepeat) {
        this.$Message.error('机构编码重复');
        return false;
      }
      return true;
    },
    handleAdd() {
      this.formData.linkList.push({
        linkName: `渠道${this.formData.linkList.length + 1}`,
        link: LINK,
      });
    },

    handleRemove(index) {
      if (this.formData.linkList.length <= 1) return;
      this.formData.linkList.splice(index, 1);
    },
    selectOrg(value, selectedData) {
      const lastItem = selectedData[selectedData.length - 1];
      this.selectedOrg = lastItem || {};
    },
  },
};
</script>

<style lang="scss" scoped>
.no-border {
  outline: none;
  border: none;
}
.tl {
  text-align: left;
  padding-left: 0;
}
</style>
