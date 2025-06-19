<template>
  <el-table :data="rewards" stripe style="width: 100%">
    <!-- 基本信息列 -->
    <el-table-column prop="title" label="标题"></el-table-column>
    <el-table-column prop="description" label="描述"></el-table-column>
    <el-table-column prop="category_name" label="类别"></el-table-column>
    <el-table-column prop="reward_amount" label="悬赏金额"></el-table-column>
    <el-table-column prop="created_at" label="创建时间"></el-table-column>

    <!-- 条件性显示操作按钮 -->
    <!-- 下架按钮 -->
    <el-table-column v-if="showRemoveButton" label="操作">
      <template slot-scope="scope">
        <el-button type="danger" @click="emitRemove(scope.row.id)">下架</el-button>
      </template>
    </el-table-column>

    <!-- 审核按钮 -->
    <el-table-column v-if="showApprovalButtons" label="操作">
      <template slot-scope="scope">
        <el-button type="success" @click="emitApprove(scope.row.id)">同意</el-button>
        <el-button type="warning" @click="emitReject(scope.row.id)">拒绝</el-button>
      </template>
    </el-table-column>

    <!-- 重新上架按钮 -->
    <el-table-column v-if="showRepostButton" label="操作">
      <template slot-scope="scope">
        <el-button type="primary" @click="emitRepost(scope.row.id)">重新上架</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'RewardTable',

  // 组件接收的属性
  props: {
    // 悬赏任务数据
    rewards: {
      type: Array,
      required: true
    },
    // 是否显示下架按钮
    showRemoveButton: {
      type: Boolean,
      default: false
    },
    // 是否显示审核按钮（同意/拒绝）
    showApprovalButtons: {
      type: Boolean,
      default: false
    },
    // 是否显示重新上架按钮
    showRepostButton: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    // 触发下架事件
    emitRemove(rewardId) {
      this.$emit('remove-reward', rewardId);
    },

    // 触发同意事件
    emitApprove(rewardId) {
      this.$emit('approve-reward', rewardId);
    },

    // 触发拒绝事件
    emitReject(rewardId) {
      this.$emit('reject-reward', rewardId);
    },

    // 触发重新上架事件
    emitRepost(rewardId) {
      this.$emit('repost-reward', rewardId);
    }
  }
}
</script>
