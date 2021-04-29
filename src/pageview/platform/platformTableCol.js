import { dateParser, renderTime } from '../../utils/tools'

/***********************
 * @name JS
 * @author Jo.gel
 * @date 2019/11/8 0008 下午 4:20
 ***********************/
const timeFn = (h, params) => {
  return h(
    'span',
    dateParser(Number(params.row.operateTime || params.row.createTime), 'YYYY-MM-DD HH:mm:ss')
  )
}

const ORG_TYPE_MAP = {
  1: '商户',
  2: '门店',
  3: '部门',
  4: '区域',
  5: '商场',
  10: '店铺',
}

export function organizationTableCol() {
  return [
    { type: 'selection', width: 80 },
    {
      title: '组织名称/id',
      key: 'name',
      minWidth: 130,
      render: (h, params) => {
        return h('div', [
          h('p', { style: { color: '#171725', fontSize: '14px' } }, params.row.name),
          h('p', { class: 'p-text', style: { fontSize: '12px' } }, params.row.orgId),
        ])
      },
    },
    {
      title: '类型',
      key: 'type',
      minWidth: 200,
      filters: [
        { label: '部门', value: '3' },
        { label: '区域', value: '4' },
        { label: '商场', value: '5' },
        { label: '店铺', value: '10' },
      ],
      filterMultiple: false,
      filterRemote: this.filterOrgType,
      render: (h, params) => {
        return h('span', ORG_TYPE_MAP[params.row.type] || '')
      },
    },
    {
      title: '所属组织',
      key: 'name',
      minWidth: 130,
      render: (h, params) => {
        return h('div', [
          // h('p', params.row.orgName),
          h('p', params.row.name),
          h('p', { class: 'p-text' }, params.row.belongOrg),
        ])
      },
    },
    {
      title: '来源',
      key: 'source',
      minWidth: 130,
      filters: [
        { label: 'ERP系统', value: 'ERP' },
        { label: 'CRM系统', value: 'CRM' },
      ],
      filterMultiple: false,
      filterRemote: this.filterSource,
      render: (h, params) => {
        return h('span', params.row.source + '系统' || '')
      },
    },
    {
      title: '创建人',
      key: 'creatorName',
      minWidth: 130,
      render: (h, params) => {
        return h('div', [
          h('p', { style: { color: '#171725', fontSize: '14px' } }, params.row.creatorName),
          h('p', { class: 'p-text', style: { fontSize: '12px' } }, params.row.creatorPhone),
        ])
      },
    },
    { title: '创建时间', key: '', render: timeFn, width: 180 },
    {
      title: '操作',
      key: '',
      minWidth: 80,
      render: (h, params) => {
        return h('div', [
          this.pageAction.includes('update')
            ? params.row.source !== 'ERP'
              ? h(
                  'span',
                  {
                    class: 'mr-5 span-a',
                    on: {
                      click: () => {
                        this.isEditStatus = true
                        this.modalStatus = !this.modalStatus
                        this.getOrganizationDetail(params.row.id)
                      },
                    },
                  },
                  '编辑'
                )
              : h(
                  'span',
                  {
                    class: 'mr-5',
                    style: { color: '#B5B5BE' },
                  },
                  '编辑'
                )
            : '',
          this.pageAction.includes('delete')
            ? params.row.canBeDelete
              ? h(
                  'Poptip',
                  {
                    props: {
                      confirm: true,
                      wordWrap: true,
                      width: 210,
                      title: '删除后不可恢复，是否确认该操作？',
                      transfer: true,
                    },
                    on: {
                      'on-ok': () => {
                        this.deleteOrg([params.row.id])
                      },
                    },
                  },
                  [
                    h(
                      'span',
                      {
                        class: 'span-a ml-5',
                      },
                      '删除'
                    ),
                  ]
                )
              : h(
                  'span',
                  {
                    class: 'ml-5',
                    style: { color: '#B5B5BE' },
                    attrs: { title: '当前组织存在子组织或用户信息，无法删除' },
                  },
                  '删除'
                )
            : '',
        ])
      },
    },
  ]
}

export function roleTableCol() {
  return [
    { type: 'selection', width: 80 },
    { title: '角色名称', key: 'name' },
    {
      title: '所属组织',
      key: 'belongOrg',
      render: (h, params) => {
        return h('div', [
          h('p', { style: { color: '#171725', fontSize: '14px' } }, params.row.departmentName),
          h('p', { class: 'p-text', style: { fontSize: '12px' } }, params.row.belongOrg),
        ])
      },
    },
    {
      title: '创建人',
      key: 'createName',
      render: (h, params) => {
        return h('div', [
          h('p', { style: { color: '#171725', fontSize: '14px' } }, params.row.createName),
          h('p', { class: 'p-text', style: { fontSize: '12px' } }, params.row.createPhone),
        ])
      },
    },
    { title: '创建时间', key: 'createTime', render: renderTime },
    {
      title: '操作',
      render: (h, params) => {
        return h('div', [
          this.pageAction.includes('update')
            ? h(
                'span',
                {
                  class: 'mr-5 span-a',
                  on: {
                    click: () => {
                      this.isEditStatus = true
                      this.modalStatus = true
                      this.roleData.name = params.row.name
                      this.roleData.id = params.row.id
                      this.getRedisplayRoleTree(params.row.id)
                    },
                  },
                },
                '编辑'
              )
            : '',
          this.pageAction.includes('delete')
            ? h(
                'Poptip',
                {
                  props: {
                    confirm: true,
                    wordWrap: true,
                    width: 210,
                    title: '删除后不可恢复，是否确认该操作？',
                    transfer: true,
                  },
                  on: {
                    'on-ok': () => {
                      this.deleteRole([params.row.id])
                    },
                  },
                },
                [h('span', { class: 'span-a ml-5' }, '删除')]
              )
            : '',
        ])
      },
    },
  ]
}

export function employeeTableCol() {
  return [
    { type: 'selection', width: 80 },
    {
      title: '员工姓名/账号',
      render: (h, params) => {
        return h('div', [
          h('p', { style: { color: '#171725', fontSize: '14px' } }, params.row.name),
          h('p', { class: 'p-text', style: { fontSize: '12px' } }, params.row.phone),
        ])
      },
    },
    {
      title: '匹配角色',
      key: 'roleName',
      render: (h, params) => {
        return h('span', params.row.roleName === 'unKnown' ? '创建者' : params.row.roleName)
      },
    },
    {
      title: '所属组织',
      key: 'belongOrg',
      render: (h, params) => {
        return h('div', [
          h('p', { style: { color: '#171725', fontSize: '14px' } }, params.row.departmentName),
          h('p', { class: 'p-text', style: { fontSize: '12px' } }, params.row.belongOrg),
        ])
      },
    },
    {
      title: '创建人',
      key: 'creatorName',
      render: (h, params) => {
        return h('div', [
          h('p', { style: { color: '#171725', fontSize: '14px' } }, params.row.creatorName),
          h('p', { class: 'p-text', style: { fontSize: '12px' } }, params.row.creatorPhone),
        ])
      },
    },
    { title: '创建时间', key: 'createTime', render: renderTime },
    {
      title: '账号状态',
      filters: [
        { label: '有效', value: true },
        { label: '无效', value: false },
      ],
      filterMultiple: false,
      filterRemote: this.filterEnable,
      render: (h, params) => {
        return h(
          'span',
          { class: params.row.isEnable ? 'is-enable' : 'is-disabled' },
          params.row.isEnable ? '有效' : '无效'
        )
      },
    },
    {
      title: '操作',
      render: (h, params) => {
        return h('div', [
          // (!params.row.isAdmin && this.pageAction.includes('update')) ? h('span', {
          // 	class: 'mr-5 span-a',
          // 	on: {
          // 		click: () => {
          // 			this.isEditStatus = true;
          // 			this.modalStatus = true;
          // 			this.getEmployeeDetail(params.row.phone, params.row.id, params.row.roleId);
          // 		}
          // 	}
          // }, '编辑') : "",
          !params.row.isAdmin && this.pageAction.includes('update')
            ? params.row.source !== 'ERP'
              ? h(
                  'span',
                  {
                    class: 'mr-5 span-a',
                    on: {
                      click: () => {
                        this.isEditStatus = true
                        this.modalStatus = true
                        this.getEmployeeDetail(params.row.phone, params.row.id, params.row.roleId)
                      },
                    },
                  },
                  '编辑'
                )
              : h(
                  'span',
                  {
                    class: 'mr-5',
                    style: { color: '#B5B5BE' },
                  },
                  '编辑'
                )
            : '',

          // !params.row.isAdmin && this.pageAction.includes('delete') ? h('Poptip', {
          // 	props: {
          // 		confirm: true,
          // 		wordWrap: true,
          // 		width: 210,
          // 		title: "删除后不可恢复，是否确认该操作？",
          // 		transfer: true
          // 	},
          // 	on: {
          // 		'on-ok': () => {
          // 			this.deleteEmployee([params.row.id]);
          // 		}
          // 	}
          // }, [h('span', { class: "span-a ml-5" }, '删除')]) : ""

          !params.row.isAdmin && this.pageAction.includes('delete')
            ? params.row.source !== 'ERP'
              ? h(
                  'Poptip',
                  {
                    props: {
                      confirm: true,
                      wordWrap: true,
                      width: 210,
                      title: '删除后不可恢复，是否确认该操作？',
                      transfer: true,
                    },
                    on: {
                      'on-ok': () => {
                        this.deleteEmployee([params.row.id])
                      },
                    },
                  },
                  [
                    h(
                      'span',
                      {
                        class: 'span-a ml-5',
                      },
                      '删除'
                    ),
                  ]
                )
              : h(
                  'span',
                  {
                    class: 'ml-5',
                    style: { color: '#B5B5BE' },
                  },
                  '删除'
                )
            : '',
        ])
      },
    },
  ]
}

export function logsTableCol() {
  return [
    { title: '操作时间', key: 'operateTime', render: renderTime },
    {
      title: '操作对象/所属组织',
      key: 'orgName',
      render: (h, params) => {
        return h('div', [
          // h('p', params.row.orgName),
          h('p', params.row.departmentName),
          h('p', { class: 'p-text' }, params.row.belongOrg),
        ])
      },
    },
    {
      title: '操作模块',
      key: 'operateModule',
      class: 'limit-h500',
      render: (h, params) => {
        return h('div', [
          // h('p', params.row.orgName),
          h('p', params.row.operateModule),
          h('p', { class: 'p-text' }, params.row.belongOperateModule),
        ])
      },
    },
    {
      title: '操作类型/内容',
      key: 'operateType',
      filters: this.operateTypeList,
      filterMultiple: false,
      filterRemote: this.filterLogType,
      render: (h, params) => {
        return h('div', [
          h('p', params.row.operateType),
          h('p', { class: 'p-text' }, params.row.operateContent),
        ])
      },
    },
    {
      title: '操作人/账号',
      key: 'operatorName',
      render: (h, params) => {
        return h('div', [
          h('p', params.row.operatorName),
          h('p', { class: 'p-text' }, params.row.operatePhone),
        ])
      },
    },
  ]
}
const ORG_TYPE_START = {
  1: '已启用',
  '-1': '已停用',
}
export function installTableCol() {
  return [
    // {type: 'selection', width: 80},
    {
      title: '审批流程名称',
      key: 'approveTradeName',
      minWidth: 130,
      render: (h, params) => {
        return h('div', [
          h('p', { style: { color: '#171725', fontSize: '14px' } }, params.row.name),
          h('p', { class: 'p-text', style: { fontSize: '12px' } }, params.row.orgId),
        ])
      },
    },
    {
      title: '状态',
      key: 'type',
      minWidth: 200,
      filters: [
        { label: '已启用', value: '1' },
        { label: '已停用', value: '-1' },
      ],
      filterMultiple: false,
      filterRemote: this.filterOrgType,
      render: (h, params) => {
        return h('span', ORG_TYPE_START[params.row.type] || '')
      },
    },
    { title: '所属组织', key: 'orgName', minWidth: 130 },
    // {title: '最后更新时间', key: 'updateTime', render: timeFn, width: 180},
    { title: '最后更新时间', key: 'updateTime', render: renderTime, width: 180 },
    {
      title: '操作',
      key: 'action',
      minWidth: 80,
      render: (h, params) => {
        return h('div', [
          // this.pageAction.includes('update') ?
          h(
            'span',
            {
              class: 'mr-5 span-a',
              on: {
                click: () => {
                  this.$router.push('/EditApproval')
                  // this.isEditStatus = true;
                  // this.modalStatus = !this.modalStatus;
                  // this.getOrganizationDetail(params.row.id);
                },
              },
            },
            '编辑'
          ),
          // this.pageAction.includes('delete') ?
          params.row.disable
            ? h(
                'Poptip',
                {
                  props: {
                    confirm: true,
                    wordWrap: true,
                    width: 210,
                    title: '删除后不可恢复，是否确认该操作？',
                    transfer: true,
                  },
                  on: {
                    'on-ok': () => {
                      // this.deleteOrg([params.row.id]);
                    },
                  },
                },
                [
                  h(
                    'span',
                    {
                      class: 'span-a ml-5',
                    },
                    '停用'
                  ),
                ]
              )
            : h(
                'span',
                {
                  class: 'span-a ml-5',
                  style: { color: '#B5B5BE' },
                  // attrs: {title: "当前组织存在子组织或用户信息，无法删除"}
                },
                '启用'
              ),
        ])
      },
    },
  ]
}
