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
  </el-table>
</template>

<script>
export default {
  name: 'RewardTable',
  props: {
    rewards: {
      type: Array,
      required: true
    }
  }
}
</script>