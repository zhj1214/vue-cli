/***********************
 * @name JS
 * @author Jo.gel
 * @date 2019/5/14 0014
 ***********************/
export default {
  data() {
    return {
      TYPE_MAP: {
        //引用规则
        refType: {
          1: '活动公历日期需要一致(年份除外)',
          2: '活动农历日期需要一致(年份除外)',
        },
        //发放规则
        sendType: {
          1: '预设时间触发',
          2: '条件触发',
        },
        firstType: {
          1: {
            name: '公众号互动触发',
            1: '全部互动',
          },
          2: {
            name: '纪念日触发',
            1: '生日',
          },
          3: {
            name: '出入停车场',
            1: '入停车场',
            2: '入停车场',
          },
          4: {
            name: '获取标签触发',
          },
        },
      },
      WEEK_MAP: {
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六',
        7: '周日',
      },
      //根据第一级获取select标签
      SECOND_MAP: {
        //公众号触发类型
        1: [{ value: 1, name: '全部互动' }],
        //纪念日触发类型
        2: [{ value: 1, name: '生日' }],
        //出入停车场
        3: [
          { value: 1, name: '入停车场' },
          { value: 2, name: '出停车场' },
        ],
        //获取标签
        4: [],
      },
    }
  },
}
