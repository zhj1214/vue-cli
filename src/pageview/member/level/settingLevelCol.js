// import { log } from "@/utils/tools";
import ConfirmCellBubble from './ConfirmCellBubble'
import ImgCell from './ImgCell'
import NameIdCell from './NameIdCell'

export const settingLevelCol = function () {
  return [
    {
      title: '会员等级',
      key: 'levelId',
      width: 180,
      align: 'center',
      render: (h, params) => {
        const { levelId } = params.row
        const text = this.createLevelName(levelId)

        return h('div', text)
      },
    },
    {
      title: '名称',
      key: 'levelName',
      align: 'center',
      render: (h, params) => {
        return h(NameIdCell, {
          props: {
            item: params.row,
          },
        })
      },
    },
    {
      title: '卡面',
      // width: 100,
      align: 'left',
      render: (h, params) => {
        return h(ImgCell, {
          props: {
            item: params.row,
          },
        })
      },
    },
    {
      title: '升级门槛',
      // width: 100,
      align: 'center',
      render: (h, params) => {
        const { id, upGradeValue } = params.row
        let text = `≥ ${upGradeValue}`
        if (id === '-') {
          text = upGradeValue
        }

        return h('div', text)
      },
    },
    {
      title: '保级门槛',
      // width: 100,
      align: 'center',
      render: (h, params) => {
        const { protectionGradeValue, id } = params.row
        let text = `≥ ${protectionGradeValue}`
        if (id === '-') {
          text = protectionGradeValue
        }

        return h('div', text)
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (h, params) => {
        const isLast = this.isLastLevel(params.row.id)
        return h(ConfirmCellBubble, {
          props: {
            item: params.row,
            isLast: isLast,
            levelCount: this.levelListData.length,
            isActive: this.activeLevelMode,
            isTop: this.isGroup,
          },
          on: {
            actionBubble: this.tableAction,
          },
        })
      },
    },
  ]
}
