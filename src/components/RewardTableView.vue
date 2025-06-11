<template>
  <el-table
      :data="rewards"
      stripe
      style="width: 100%">
    <el-table-column
        prop="title"
        label="标题">
    </el-table-column>
    <el-table-column
        prop="description"
        label="描述">
    </el-table-column>
    <el-table-column
        prop="category_name"
        label="类别">
    </el-table-column>
    <el-table-column
        prop="reward_amount"
        label="悬赏金额">
    </el-table-column>
    <el-table-column
        prop="created_at"
        label="创建时间">
    </el-table-column>
    <!-- 下架按钮 -->
    <el-table-column
        v-if="showRemoveButton"
        label="操作">
      <template slot-scope="scope">
        <el-button type="danger" @click="emitRemove(scope.row.id)">下架</el-button>
      </template>
    </el-table-column>
    <!-- 同意和拒绝按钮 -->
    <el-table-column
        v-if="showApprovalButtons"
        label="操作">
      <template slot-scope="scope">
        <el-button type="success" @click="emitApprove(scope.row.id)">同意</el-button>
        <el-button type="warning" @click="emitReject(scope.row.id)">拒绝</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'RewardTable',
  props: {
    rewards: {
      type: Array,
      required: true
    },
    showRemoveButton: {
      type: Boolean,
      default: false
    },
    showApprovalButtons: {
      type: Boolean,
      default: false
    },
    showRevokeButton: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emitRemove(rewardId) {
      this.$emit('remove-reward', rewardId);
    },
    emitApprove(rewardId) {
      this.$emit('approve-reward', rewardId);
    },
    emitReject(rewardId) {
      this.$emit('reject-reward', rewardId);
    },
    emitRevoke(rewardId) {
      this.$emit('revoke-reward', rewardId);
    }
  }
}
</script>
