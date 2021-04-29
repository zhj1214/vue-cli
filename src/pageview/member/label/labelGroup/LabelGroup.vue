<!------------------------
 *@name Vue.js
 *@author Jo.gel
 *@date 2020/6/22 0022
 -------------------------->
<template>
  <div class="label-types">
    <div class="query-row">
      <Button v-if="__hasPower('addGroup')" type="primary" @click="onCreateLabel">
        添加分组
      </Button>
    </div>
    <BaseTable
      :list="tableList"
      :col="tableCol"
      :page-data="pageData"
      :loading="loading"
      @on-pageChange="onPageChange"
      @on-pageSize="onPageSize"
    />

    <Modal
      v-model="editLabelStatus"
      :title="isEdit ? '编辑分组' : '添加分组'"
      :mask-closable="false"
      @on-cancel="onCancelLabel"
    >
      <Form
        ref="labelForm"
        :model="labelObj"
        :rules="labelValid"
        :label-width="100"
        onsubmit="return false;"
      >
        <FormItem label="名称" prop="name">
          <i-input
            v-model="labelObj.name"
            placeholder="请输入分组名称"
            :maxlength="15"
            show-word-limit
          />
        </FormItem>
      </Form>
      <div slot="footer" class="v-footer">
        <Button type="primary" ghost @click="onCancelLabel"> 取消 </Button>
        <Button type="primary" :disabled="commitLoading" @click="onConfirm"> 确定 </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import BaseTable from '@/pageview/base/BaseTable'
  import { labelTypesCol } from './labelTypesCol'
  import mixinsGlobal from '@/mixins/mixinsGlobal'
  import { log } from '@/utils/tools'

  export default {
    name: 'LabelGroup',
    components: {
      BaseTable,
    },
    mixins: [mixinsGlobal],
    data() {
      const checkName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入名称'))
        } else {
          if (!/^[a-zA-z0-9\u4e00-\u9fa5]+$/g.test(value)) {
            callback(new Error('仅支持中英文数字'))
          }
          callback()
        }
      }
      return {
        tableList: [],
        tableCol: labelTypesCol.call(this),
        pageData: {
          count: 0,
          page: 1,
          size: 10,
        },
        labelObj: {
          name: '',
        },
        labelValid: {
          name: [{ required: true, validator: checkName, trigger: 'blur' }],
        },
        loading: false,
        editLabelStatus: false,
        isEdit: false,
        commitLoading: false,
      }
    },
    mounted() {
      this.getLabelTypesList()
    },
    methods: {
      onSearch() {
        this.pageData.page = 1
        this.$nextTick(() => {
          this.getLabelTypesList()
        })
      },
      onCreateLabel() {
        this.editLabelStatus = true
        this.isEdit = false
        this.labelObj = {
          name: '',
        }
      },
      onPageSize(size) {
        this.pageData.size = size
        this.onSearch()
      },
      onPageChange(page) {
        this.pageData.page = page
        this.$nextTick(() => {
          this.getLabelTypesList()
        })
      },
      onCancelLabel() {
        this.editLabelStatus = false
        this.$refs['labelForm'].resetFields()
      },
      onConfirm() {
        this.$refs['labelForm'].validate((valid) => {
          if (valid) {
            if (this.isEdit) {
              this.updateLabelType()
            } else {
              this.createLabelType()
            }
          }
        })
      },
      createLabelType() {
        this.commitLoading = true
        this.$ajaxPost('/label-server/labelType/add', { name: this.labelObj.name }).then((res) => {
          if (res.code === 10000) {
            this.$Message.success(res.message || '操作成功')
            this.editLabelStatus = false
            this.getLabelTypesList()
          }
          this.commitLoading = false
        })
      },
      updateLabelType() {
        this.commitLoading = true
        this.$ajaxPost('/label-server/labelType/update', this.labelObj).then((res) => {
          if (res.code === 10000) {
            this.$Message.success(res.message || '操作成功')
            this.editLabelStatus = false
            this.getLabelTypesList()
          }
          this.commitLoading = false
        })
      },
      deleteLabelType(id) {
        this.$ajaxPost('/label-server/labelType/delete', { id }).then((res) => {
          if (res.code === 10000) {
            this.$Message.success(res.message || '操作成功')
            this.onSearch()
          }
        })
      },
      onEditLabel(row) {
        this.labelObj.name = row.name
        this.labelObj.id = row.id
        this.isEdit = true
        this.editLabelStatus = true
      },
      getLabelTypesList() {
        this.loading = true
        this.$ajaxGet('/label-server/labelType/list', this.pageData)
          .then((res) => {
            if (res && res.code === 10000) {
              this.tableList = res.data.list || []
              this.pageData.count = res.data.count || 0
            }
            this.loading = false
          })
          .catch((err) => {
            log('err', err)
          })
      },
    },
  }
</script>

<style scoped lang="scss">
  .label-types {
    padding: 24px;
    background: #fff;
    border-radius: 16px;
  }

  .query-row {
    margin-bottom: 24px;
  }
</style>
