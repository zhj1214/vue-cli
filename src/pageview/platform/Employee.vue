<template>
  <div class="employee-page">
    <LeftTreeLayout>
      <orgTree slot="left" @select-change="treeChange" />
      <!-- <BaseTree
        :treeData="treeData"
        slot="left"
        :isSearch="true"
        style="height: 100%"
        :searchPlaceholder="'组织名称检索'"
        ref="theTree"
        :render="renderContent"
      ></BaseTree> -->
      <div slot="right" class="content">
        <h3>
          {{ treeItem.title }}
          <!-- <div class="select-role">
            <span style="color: #92929d">展示范围：</span>
            <Dropdown @on-click="onDropdownEmployee">
              <span href="javascript:void(0)" style="color: #44444f">
                {{
                  this.pageData.isSearch === "1"
                    ? "当前组织员工"
                    : "包含所有级组织员工"
                }}
                <Icon type="ios-arrow-down"></Icon>
              </span>
              <DropdownMenu slot="list" style="text-align: left">
                <DropdownItem name="1">当前组织员工</DropdownItem>
                <DropdownItem name="2">包含所有级组织员工</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div> -->
        </h3>
        <div class="query clear">
          <Button
            v-if="pageAction.includes('create')"
            type="primary"
            :disabled="isCanCreate"
            @click="onCreateUpdateEmployee"
          >
            新增员工
          </Button>
          <Button
            v-if="pageAction.includes('delete')"
            class="ml-10"
            :disabled="isSelection"
            :loading="isDeleteLoading"
            type="primary"
            ghost
            @click="onDeleteEmployee"
          >
            批量删除
          </Button>
          <div
            style="
              display: inline-block;
              width: 192px;
              height: 32px;
              margin-left: 12px;
              background: #f1f1f5;
              border-radius: 16px;
            "
          >
            <a :class="pageData.isSearch === '2' ? 'tab curTab' : 'tab'" @click="tabChange('2')"
              >全量组织</a
            >
            <a :class="pageData.isSearch === '1' ? 'tab curTab' : 'tab'" @click="tabChange('1')"
              >当前组织</a
            >
          </div>
          <!-- <DatePicker
            v-model="dateQuery"
            type="daterange"
            placeholder="开始时间 → 结束时间"
            split-panels
            class="ml-10"
            style="width: 220px"
            @on-change="onChangeDate"
          ></DatePicker> -->
          <i-input
            v-model="pageData.searchContent"
            placeholder=""
            search
            class="w250 fix-iview-icon"
            style="float: right;"
            icon="ios-search"
            @on-enter="onSearch"
            @on-click="onSearch"
          >
            <Select slot="prepend" v-model="pageData.searchType" style="width: 110px;">
              <Option value="name"> 员工姓名 </Option>
              <Option value="phone"> 员工账号 </Option>
              <Option value="createPhone"> 创建人姓名 </Option>
              <Option value="createPhone"> 创建人账号 </Option>
            </Select>
          </i-input>
        </div>
        <div v-show="selection.length" class="delete-alert clear">
          <Icon color="#756CEA" type="ios-alert-outline" />
          当前已选择 {{ selection.length }}项
          <span class="pointer is-active" style="float: right;" @click="onClearSelect">清空</span>
        </div>
        <BaseTable
          ref="baseTable"
          :list="tableList"
          :col="tableCol"
          :page-data="pageData"
          :loading="isTableLoading"
          @on-selectTable="onSelectTable"
          @on-pageChange="onPageChange"
          @on-pageSize="onPageSize"
        />
      </div>
    </LeftTreeLayout>

    <Modal
      v-model="modalStatus"
      width="600"
      :title="isEditStatus ? '编辑员工' : '新增员工'"
      :mask-closable="false"
      @on-cancel="onCancelModal"
    >
      <div class="ivu-modal-body">
        <Form
          v-if="modalStatus"
          ref="formData"
          onsubmit="return false"
          :model="employeeData"
          :label-width="150"
          :rules="validEmployee"
        >
          <FormItem v-if="!isEditStatus" label="员工账号：" prop="phone">
            <i-input
              v-model="employeeData.phone"
              :maxlength="11"
              placeholder="请填写手机号"
              @on-change="onBlurCheckPhone"
            />
            <!-- <p style="color: red" v-if="legalType.isPhoneExit">该账号已注册</p> -->
          </FormItem>
          <FormItem v-if="isEditStatus" label="员工账号：">
            <span>{{ employeeData.phone }}</span>
          </FormItem>
          <FormItem label="员工姓名：" prop="name">
            <i-input
              v-model="employeeData.name"
              placeholder="请输入姓名/昵称，10字符内"
              autocomplete="off"
              :maxlength="10"
            />
          </FormItem>
          <FormItem
            v-if="(!legalType.isPhoneExit && !isEditStatus) || isEditStatus"
            label="密码："
            :prop="!isEditStatus ? 'password' : ''"
          >
            <i-input
              v-model="employeeData.password"
              autocomplete="new-password"
              type="password"
              placeholder="请输入密码，8-16位字符，包含字母和数字"
              :maxlength="16"
            />
          </FormItem>
          <FormItem
            v-if="(!legalType.isPhoneExit && !isEditStatus) || isEditStatus"
            label="确认密码："
            :prop="!isEditStatus ? 'passwordCheck' : ''"
          >
            <i-input
              v-model="employeeData.passwordCheck"
              type="password"
              placeholder="请确认您的密码"
              :maxlength="16"
            />
          </FormItem>
          <FormItem label="匹配角色：" prop="orgRoleList">
            <div v-for="(item, oindex) in employeeData.orgRoleList" :key="oindex">
              <div v-show="item.type != 2">
                <div
                  v-if="item.isEditable"
                  style="display: flex; align-items: center; margin-bottom: 15px;"
                >
                  <FormItem :prop="'orgRoleList.' + oindex + '.departmentIdStr'">
                    <!-- :rules="{ required: true, message: '请选择组织' ,trigger: 'change'}" -->
                    <div style="display: flex; align-items: center;">
                      <span
                        v-if="
                          item.departmentId[item.departmentId.length - 1] == treeItem.id &&
                          !isChangeOrg
                        "
                        style="
                          display: inline-block;
                          width: 60px;
                          height: 22px;
                          padding: 0 5px;
                          margin-right: 5px;
                          font-size: 12px;
                          line-height: 22px;
                          color: #fff;
                          text-align: center;
                          background: #756cea;
                          border-radius: 4px;
                        "
                        >当前组织</span
                      >
                      <belong
                        v-if="!item.isHX"
                        :current-node-list="getCurrentNodeList()"
                        :show-current="true"
                        @selectOrg="(value, arr) => casChange(value, arr, oindex)"
                      />
                      <div v-else>
                        <orgSelect
                          :obj="item"
                          :org-id="item.orgId"
                          :orgs="typeof item.departmentId == 'object' ? item.departmentId : []"
                          :index="oindex"
                          @change="onOrgSelect"
                        />
                      </div>
                    </div>
                  </FormItem>
                  <!-- <Tooltip
                    :content="textList[oindex] || item.completeDepartmentName"
                    max-width="auto"
                    placement="top"
                    v-if="textList[oindex] || item.completeDepartmentName"
                  >
                    <Icon type="ios-information-circle-outline" :size="20" />
                  </Tooltip> -->
                  <!-- v-else
                  <Icon
                    
                    type="ios-information-circle-outline"
                    :size="20"
                  /> -->
                  <FormItem
                    :prop="'orgRoleList.' + oindex + '.roleId'"
                    :rules="{ required: true, message: '请选择角色' }"
                  >
                    <i-select
                      key="select"
                      v-model="item.roleId"
                      placeholder="请选择"
                      style="width: 131px; margin: 0 5px;"
                      @on-change="(e) => roleChange(e, oindex)"
                    >
                      <!-- [item.departmentId[item.departmentId.length - 1]] -->
                      <Option
                        v-for="ritem in roleTreeList[treeTempList[oindex]]"
                        v-show="ritem.id"
                        :key="ritem.id"
                        :value="ritem.id"
                      >
                        {{ ritem.name }}
                      </Option>
                    </i-select>
                  </FormItem>
                  <a
                    v-show="oindex"
                    style="position: relative; left: 15px; margin-left: -20px;"
                    @click="handleRemove(oindex)"
                    ><Icon type="ios-trash-outline" :size="20" color="#92929C"
                  /></a>
                </div>
                <div v-else style="display: flex; align-items: center;">
                  <span
                    v-if="item.departmentId[item.departmentId.length - 1] == treeItem.id"
                    style="
                      display: inline-block;
                      width: 60px;
                      height: 22px;
                      padding: 0 5px;
                      margin-right: 5px;
                      font-size: 12px;
                      line-height: 22px;
                      color: #fff;
                      text-align: center;
                      background: #756cea;
                      border-radius: 4px;
                    "
                    >当前组织</span
                  >
                  <p>{{ item.departmentName }}</p>
                  <Tooltip
                    v-if="item.completeDepartmentName"
                    :content="item.completeDepartmentName"
                    max-width="auto"
                    placement="top"
                  >
                    <Icon type="ios-information-circle-outline" :size="20" />
                  </Tooltip>
                  <div v-else style="margin: 0 6px;"> / </div>
                  <!-- <Icon
                    v-else
                    type="ios-information-circle-outline"
                    :size="20"
                  /> -->
                  <p>{{ item.roleName }}</p>
                </div>
              </div>
            </div>
          </FormItem>
          <FormItem>
            <Row>
              <i-col span="24">
                <Button type="dashed" long icon="md-add" @click="handleAdd"> 添加 </Button>
              </i-col>
            </Row>
          </FormItem>
          <FormItem v-if="isEditStatus" label="状态：">
            <RadioGroup v-model="employeeData.isEnable">
              <Radio label="1">
                <span>有效</span>
              </Radio>
              <Radio label="2">
                <span>无效</span>
              </Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button size="large" style="margin-right: 10px;" @click="onCancelModal"> 取消 </Button>
        <Button
          size="large"
          :disabled="disabledLoading"
          :loading="disabledLoading"
          type="primary"
          @click="onConfirm"
        >
          提交
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import belong from '../../components/BelongOrgCascade'
  import _ from 'lodash'
  import md5 from 'js-md5'
  import orgTree from '../../components/orgTree/orgTree'
  import orgSelect from '../../components/orgTree/orgSelect'
  import BaseTable from '../base/BaseTable'
  import LeftTreeLayout from '../../layout/LeftTreeLayout'
  import { employeeTableCol } from './platformTableCol'
  import mixinsPlatform from '../../mixins/mixinsPlatform'
  import { isPhone, isPassword } from '../../utils/tools'
  import mixinsGlobal from '../../mixins/mixinsGlobal'

  export default {
    name: 'Employee',
    components: {
      belong,
      orgTree,
      orgSelect,
      BaseTable,
      LeftTreeLayout,
    },
    mixins: [mixinsPlatform, mixinsGlobal],
    data() {
      /*
       * @desc 校验员工账号
       * */
      const checkPhone = (rule, value, callback) => {
        if (isPhone(value)) {
          callback()
        } else callback('请输入手机号')
      }
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback('请输入密码')
        } else if (isPassword(value)) {
          if (this.employeeData.passwordCheck !== '') {
            // 对第二个密码框单独验证
            this.$refs['formData'].validateField('passwordCheck')
          }
          callback()
        } else {
          callback('8-16位，包含字母和数字')
        }
        callback()
      }
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback('请输入确认密码')
        } else if (value !== this.employeeData.password) {
          callback('两次输入密码不一致!')
        } else {
          callback()
        }
        callback()
      }
      const validateBaseData = (rule, value, callback) => {
        if (!value.length) {
          callback('您还未填写天数')
        } else {
          callback()
        }
      }
      return {
        treeTempList: [],
        index: 1,
        updateLoading: false,
        disabledLoading: false,
        isEditStatus: false,
        isDeleteLoading: false,
        modalStatus: false,
        isTableLoading: false,
        legalType: {}, //-1，未注册过，1已绑定过，0正常
        dateQuery: [],
        departmentId: '',
        isChangeOrg: false,
        employeeData: {
          isEnable: '1', //1=>true有效,2=>false 无效
          password: '',
          passwordCheck: '',
          orgRoleList: [
            {
              departmentId: [],
              departmentIdStr: localStorage.getItem('departmentId'),
              orgId: '',
              roleId: '',
              isEditable: true,
              type: 1,
            },
          ],
        },
        validEmployee: {
          phone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
          name: [{ required: true, message: '请输入员工姓名', trigger: 'change' }],
          orgRoleList: [{ required: true, validator: validateBaseData }],
          password: [{ required: true, validator: validatePass, trigger: 'blur' }],
          passwordCheck: [{ required: true, validator: validatePassCheck, trigger: 'blur' }],
        },
        tableList: [],
        selection: [],
        tableCol: employeeTableCol.call(this),
        pageData: {
          page: 1,
          size: 10,
          count: 0,
          departmentId: '',
          searchType: 'name',
          searchContent: '',
          beginTime: '',
          endTime: '',
          isEnable: null, //false 无效、true有效,null
          isSearch: '2', //1 当前false ,2 所有true
        },
        treeItem: {},
        roleTreeList: {}, //左侧组织可最多添加的下拉列表
        textList: {},
        oldRoleList: [], //已有角色
        orgRoleListHX: [], // 回显的时候显示用的 组织数组
      }
    },
    computed: {
      isSelection() {
        return !this.selection.length
      },
      isCanCreate() {
        return !this.treeItem.id
      },
      casTreeData() {
        let data = [].concat(this.treeData)
        let deep = (item) => {
          item.children.map((cItem) => {
            cItem.value = cItem.id
            cItem.label = cItem.title
            deep(cItem)
          })
        }
        data.map((item) => {
          item.value = item.id
          item.label = item.title
          deep(item)
        })
        return data
      },
    },
    methods: {
      roleChange(e, num) {
        if (
          this.oldRoleList[num] &&
          this.oldRoleList[num].roleId &&
          this.oldRoleList[num].roleId != e
        ) {
          this.employeeData.orgRoleList[num].type = 3
        }
      },
      formatsss(labels, selectedData, num) {
        const index = labels.length - 1
        if (selectedData.length) {
          this.employeeData.orgRoleList[num].orgId = selectedData[selectedData.length - 1].orgId
        }
        return labels[index]
      },
      casChange: _.debounce(function (value, arr, idx) {
        // let arr = [];
        // selectedData.map((o, i) => {
        //   if (i < selectedData.length - 1) {
        //     arr.push(o.label);
        //   }
        // });
        // this.textList = Object.assign({}, this.textList, {
        //   [num]: arr.join(">"),
        // });
        this.treeTempList.splice(idx, 1, arr[arr.length - 1].id)
        this.employeeData.orgRoleList[idx].roleId = ''
        this.employeeData.orgRoleList[idx].orgId = arr[arr.length - 1].orgId
        this.employeeData.orgRoleList[idx].departmentIdStr = arr[arr.length - 1].id
        this.employeeData.orgRoleList[idx].departmentId = [arr[arr.length - 1].value] || [
          arr[arr.length - 1].id,
        ]

        this.getOrganizationRole(arr[arr.length - 1].id, false)
      }, 200),
      handleAdd() {
        this.index++
        this.employeeData.orgRoleList.push({
          departmentId: [],
          departmentIdStr: localStorage.getItem('departmentId'),
          orgId: '',
          roleId: '',
          isEditable: true,
          type: 1,
          isAdd: true,
        })
      },
      handleRemove(index) {
        console.log(index, 'index')
        this.employeeData.orgRoleList[index].type = 2
        if (this.employeeData.orgRoleList[index].isAdd) {
          this.employeeData.orgRoleList.splice(index, 1)
          this.$set(this.employeeData.orgRoleList)
        } else {
          this.$set(this.employeeData.orgRoleList, index, {
            ...this.employeeData.orgRoleList[index],
            type: 2,
          })
        }
        // let orgRoleList = this.employeeData.orgRoleList;
        // orgRoleList.map((item, num) => {
        // 	if(num == index) {
        // 		item.status = 0;
        // 	}
        // })
        // this.$set(this.employeeData, 'orgRoleList', orgRoleList);
      },
      tabChange(tab) {
        this.pageData.isSearch = tab
        this.$nextTick(() => {
          this.getEmployeeTable()
        })
      },
      onDropdownEmployee(name) {
        this.pageData.isSearch = name
        this.onSearch()
      },
      onChangeDate(date) {
        this.pageData.beginTime = date[0]
        this.pageData.endTime = date[1]
        this.onSearch()
      },
      filterEnable(list) {
        const [isEnable] = list
        this.pageData.isEnable = isEnable
        this.onSearch()
      },
      onCancelModal() {
        this.modalStatus = false
        this.isEditStatus = false
        this.legalType = {}
        this.oldRoleList = []
        this.employeeData = this.$options.data().employeeData
      },
      onConfirm() {
        this.$refs['formData'].validate((valid) => {
          if (valid) this.createUpdateEmployee()
        })
      },
      /**
       * @desc 创建员工
       * */
      createUpdateEmployee() {
        this.disabledLoading = true
        const { name, phone, orgRoleList, password, roleId, id, isEnable } = this.employeeData
        let url = '/user-server/platform/employee/create'
        let postData = {}
        if (this.isEditStatus) {
          postData = {
            name,
            phone,
            roleId,
            orgRoleList,
            password: password ? md5(password) : '',
            id,
            isEnable: isEnable === '1',
          }
          url = '/user-server/platform/employee/update'
          // 1.先判断有没有相同的店铺 有的话就提示
          var orgIds = []
          orgRoleList.forEach((element) => {
            if (element.type != 2) orgIds.push(element.orgId)
          })
          let orgIdsTemp = this.$_.uniq(orgIds)
          // console.log(orgIdsTemp,'orgIdsTemporgIdsTemporgIdsTemp')
          if (orgIdsTemp.length != orgIds.length) {
            this.disabledLoading = false
            return this.$Message.error('同一个组织内，同一个员工不可添加多个角色')
          }
        } else {
          postData = {
            name,
            phone,
            password: password ? md5(password) : '',
            orgRoleList,
          }
        }
        let roleList = JSON.parse(JSON.stringify(orgRoleList))

        roleList.map((item) => {
          if (typeof item.departmentId == 'object')
            item.departmentId = item.departmentId[item.departmentId.length - 1]
          // item.departmentId = item.departmentIdStr;
        })
        postData.orgRoleList = roleList
        this.$ajaxPost(url, postData).then((res) => {
          if (res && res.code === 10000) {
            this.$Message.success(res.message || '操作成功')
            // 更新左边树 和 右边的表
            this.$eventEmitter.trigger('orgTreelist', {
              ...this.treeItem,
              ...{
                departmentId: this.treeItem.id,
                page: 1,
                size: 100,
              },
            })
            // this.getEmployeeTable();
            this.onCancelModal()
          }
          this.disabledLoading = false
        })
      },
      /**
       * @desc 检查MOS用户
       * */
      onBlurCheckPhone() {
        if (!this.employeeData.phone) {
          return
        }
        if (!isPhone(this.employeeData.phone)) {
          return
        }
        this.$ajaxPost('/user-server/platform/employee/checkPhoneExist', {
          phone: this.employeeData.phone,
          departmentId: this.treeItem.id,
        }).then((res) => {
          console.log(
            'orgRoleList.lengthorgRoleList.lengthorgRoleList.lengthorgRoleList.lengthorgRoleList.length'
          )
          if (res && res.code === 10000) {
            this.legalType = res.data
            if (res.data.isPhoneExit) {
              this.employeeData.name = res.data.employeeName
              if (res.data.orgRoleList.length) {
                res.data.orgRoleList.map((item, idx) => {
                  this.getOrganizationRole(item.departmentId || this.treeItem.id, false)
                  item.departmentId = item.parentDepartmentIds
                  item.departmentIdStr =
                    item.parentDepartmentIds[item.parentDepartmentIds.length - 1]
                  item.isHX = true
                  this.treeTempList.splice(
                    idx,
                    0,
                    item.parentDepartmentIds[item.parentDepartmentIds.length - 1]
                  )
                })

                this.employeeData.orgRoleList = res.data.orgRoleList
                this.oldRoleList = JSON.parse(JSON.stringify(res.data.orgRoleList))
              } else {
                if (!this.employeeData.orgRoleList.length) {
                  this.employeeData.orgRoleList = [
                    {
                      departmentId: [],
                      departmentIdStr: localStorage.getItem('departmentId'),
                      orgId: '',
                      roleId: '',
                      type: 1,
                    },
                  ]
                }
              }
            } else {
              this.employeeData = {
                phone: this.employeeData.phone,
                isEnable: '1', //1=>true有效,2=>false 无效
                password: '',
                passwordCheck: '',
                orgRoleList: this.employeeData.orgRoleList.length
                  ? this.employeeData.orgRoleList
                  : [
                      {
                        departmentId: [],
                        departmentIdStr: localStorage.getItem('departmentId'),
                        orgId: '',
                        roleId: '',
                        isEditable: true,
                        type: 1,
                      },
                    ],
              }
              this.oldRoleList = []
            }
          }
        })
      },
      onCreateUpdateEmployee() {
        this.employeeData = this.$options.data().employeeData
        this.modalStatus = true
      },
      onSelectTable(selection) {
        this.selection = selection
      },
      onPageChange(page) {
        this.pageData.page = page
        this.$nextTick(() => {
          this.getEmployeeTable()
        })
      },
      onPageSize(size) {
        this.pageData.size = size
        this.pageData.page = 1
        this.$nextTick(() => {
          this.getEmployeeTable()
        })
      },
      onSearch() {
        console.log('chaxun')
        this.pageData.page = 1
        this.$nextTick(() => {
          this.getEmployeeTable()
        })
      },
      onDeleteEmployee() {
        this.$Modal.confirm({
          title: '确认删除',
          content: '<p>删除后不可恢复，是否确认该操作</p>',
          onOk: () => {
            let ids = this.selection.map((item) => item.id)
            this.deleteEmployee(ids)
          },
        })
      },
      deleteEmployee(ids) {
        this.isDeleteLoading = true
        this.$ajaxPost('/user-server/platform/employee/delete', ids).then((res) => {
          if (res && res.code === 10000) {
            // 更新左边树 和 右边的表
            this.$eventEmitter.trigger('orgTreelist', {
              ...this.treeItem,
              ...{
                departmentId: this.treeItem.id,
                page: 1,
                size: 100,
              },
            })
            this.$Message.success(res.message || '操作成功')
            this.onSearch()
            this.$refs.baseTable.$refs['ivu-table'].selectAll(false)
          }
          this.isDeleteLoading = false
        })
      },

      treeChange(item) {
        const data = JSON.parse(JSON.stringify(item))
        delete data.children
        this.treeItem = data
        this.$nextTick(() => {
          this.getEmployeeTable()
        })
      },
      getEmployeeDetail(phone, id, roleId) {
        this.departmentId = this.treeItem.id
        this.$ajaxPost('/user-server/platform/employee/checkPhoneExist', {
          phone: phone,
          departmentId: localStorage.getItem('departmentId'),
        }).then((res) => {
          if (res && res.code === 10000) {
            this.legalType = res.data
            let { employeeName, orgRoleList } = res.data
            let name = employeeName
            console.log('进来了么么么么么么')
            if (orgRoleList.length) {
              orgRoleList.map((item, idx) => {
                if (item.isEditable) {
                  this.getOrganizationRole(item.departmentId, false)
                }
                item.departmentId = item.parentDepartmentIds
                item.departmentIdStr = item.parentDepartmentIds[item.parentDepartmentIds.length - 1]
                item.isHX = true
                this.treeTempList.splice(
                  idx,
                  0,
                  item.parentDepartmentIds[item.parentDepartmentIds.length - 1]
                )
              })
            } else {
              orgRoleList = [
                {
                  departmentId: [],
                  departmentIdStr: localStorage.getItem('departmentId'),
                  orgId: '',
                  roleId: '',
                  type: 1,
                },
              ]
            }
            this.employeeData = {
              phone,
              name,
              id,
              orgRoleList,
              roleId,
              isEnable: res.data.isEnable ? '1' : '2',
            }
            this.oldRoleList = JSON.parse(JSON.stringify(orgRoleList))
          }
        })
      },
      getEmployeeTable(id) {
        this.isTableLoading = true
        this.$ajaxPost('/user-server/platform/employee/list', {
          ...this.pageData,
          isSearch: this.pageData.isSearch !== '1',
          departmentId: id || this.treeItem.id || localStorage.getItem('departmentId'),
        }).then((res) => {
          if (res && res.code === 10000) {
            this.tableList = res.data.list || []
            this.pageData.count = res.data.count || 0
          }
          this.isTableLoading = false
        })
      },
      /**
       * @desc 不分页获取左侧组织绑定的角色
       * */
      getOrganizationRole(departmentId, type) {
        console.info('拉取组织的角色==>', departmentId)
        var self = this
        this.$ajaxPost('/user-server/platform/role/list', {
          departmentId: departmentId || this.treeItem.id,
          isSearch: type,
        }).then((res) => {
          if (res && res.code === 10000) {
            self.$set(self.roleTreeList, departmentId, res.data.list)
            console.info(
              'self.roleTreeListself.roleTreeListself.roleTreeList==>',
              self.roleTreeList
            )
          }
        })
      },
      /**
       * 组织列表选择组件
       * */

      onOrgSelect(val, index) {
        console.log(
          val,
          '___',
          index,
          '______',
          this.departmentId,
          '__this.treeTempList__',
          this.treeTempList
        )
        if (val.value !== this.departmentId) {
          this.isChangeOrg = true
        } else {
          this.isChangeOrg = false
        }
        // 更改
        this.employeeData.orgRoleList[index].departmentId = val.id
        this.employeeData.orgRoleList[index].departmentIdStr = val.id
        this.employeeData.orgRoleList[index].departmentName = val.name
        this.employeeData.orgRoleList[index].completeDepartmentName = val.belongOrg
        this.employeeData.orgRoleList[index].orgId = val.orgId
        this.employeeData.orgRoleList[index].roleId = ''
        console.log('this.employeeData.orgRoleList____', this.employeeData.orgRoleList[index])
        //
        this.treeTempList.splice(index, 1, val.value)
        // 请求角色列表
        this.getOrganizationRole(val.value)
      },
      getCurrentNodeList() {
        const { id, label, value } = this.treeItem
        return [
          {
            orgId: value,
            label,
            value: id,
            loading: false,
            children: [],
          },
        ]
      },
    },
  }
</script>

<style scoped lang="scss">
  .employee-page {
    background: #fff;
    border-radius: 16px;
  }

  .select-role {
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    font-size: 14px;
    font-weight: normal;
    text-align: right;
  }

  .tab {
    display: inline-block;
    width: 96px;
    height: 32px;
    font-size: 14px;
    line-height: 32px;
    color: #44444f;
    text-align: center;
    border-radius: 16px;
  }

  .curTab {
    color: #fff;
    background: #756cea;
  }
</style>
