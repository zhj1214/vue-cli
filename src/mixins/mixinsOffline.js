/***********************
 * @desc 活动管理offline
 * @name JS
 * @author Jo.gel
 * @date 2019/7/24 0024
 ***********************/
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['pageActions']),
    thisAction() {
      return this.pageActions[this.$route.name] || []
    },
  },
  data() {
    return {
      // 状态颜色MAP
      STATUS_COLOR_MAP: {
        '-1': 'bg-gray',
        1: 'bg-violet',
        2: 'bg-green',
        3: 'bg-gray',
      },
      // 活动状态macp
      STATUS_MAP: {
        '-1': '删除',
        1: '未开始',
        2: '进行中',
        3: '已结束',
        4: '已满额',
      },
      // 报名MAP
      SIGN_UP_MAP: {
        1: '需要报名',
        2: '不需要报名',
      },
      // 上下架
      UP_STATUS_MAP: {
        0: '待上架', // 暂无用
        1: '已上架', // 1 上架
        2: '已下架', // 2 下架
        // "2": "已结束", // 2 下架
      },
      // 支付类型
      PAY_TYPE_MAP: {
        1: '积分支付',
        2: '现金支付',
      },
      // 可见性
      VISIBLE_MAP: {
        0: '部分可见',
        1: '全部可见',
      },
      // 有无券
      HAS_COUPON_MAP: {
        0: '没券',
        1: '有券',
      },
      // 活动状态
      ACTIVITY_STATUS_MAP: {
        2: '驳回',
        3: '已超时',
        9: '草稿',
        10: '待审核',
        11: '未开始',
        12: '进行中',
        13: '已结束',
      },
      // 活动状态颜色
      ACTIVITY_STATUS_COLOR_MAP: {
        2: 'bg-gray',
        3: 'bg-gray',
        9: 'bg-gray',
        10: 'bg-gray',
        11: 'bg-blue',
        12: 'bg-green',
        13: 'bg-gray',
      },
      // 活动发送状态
      SEND_TYPE_MAP: {
        1: '直接发放',
        2: '手动发放',
        3: '条件触发',
      },
      GAME_STATUS_MAP: {
        WAIT_START: '未开始',
        RUNNING: '进行中',
        ENDED: '已结束',
      },
      GAME_COLOR_MAP: {
        WAIT_START: 'bg-yellow',
        RUNNING: 'bg-green',
        ENDED: 'bg-gray',
      },
      GAME_TEMPLATE_MAP: {
        CONSUME_POINT: '积分消耗',
        FREE: '独立活动游戏',
      },
      statusList: [
        {
          status: 'error',
          value: '删除',
        },
        {
          status: 'warning',
          value: '未开始',
        },
        {
          status: 'success',
          value: '进行中',
        },
        {
          status: 'default',
          value: '已结束',
        },
      ], // 活动状态列表
      participateTypeList: {
        1: '全部会员',
        2: '根据标签选择',
        3: '根据客群选择',
      }, // 参与客群列表
    }
  },
}
