<template>
  <div>
    <div>
      <el-card>
        <h2>用户详情</h2>
        <el-skeleton :loading="!userData" animated>
          <template #default>
            <el-row>
              <el-col :span=24>
                <div class="grid-content bg-purple">
                  <span><strong>用户名：</strong> {{ userData.username }}</span>
                  <span class="field-separator"></span>
                  <span><strong>昵称：</strong> {{ userData.first_name }}{{ userData.last_name }}</span>
                  <span class="field-separator"></span>
                  <span><strong>邮箱：</strong> {{ userData.email }}</span>
                  <span class="field-separator"></span>
                  <span><strong>出生日期：</strong> {{ userData.birth_date }}</span>
                  <span class="field-separator"></span>
                  <span><strong>完成任务：</strong> {{ userData.completed_tasks }}</span>
                  <span class="field-separator"></span>
                  <span><strong>编码年龄：</strong> {{ userData.code_age }}</span>
                  <span class="field-separator"></span>
                  <span v-if="userData.phone_number"><strong>密保手机：</strong> {{ userData.phone_number }}</span>
                  <span v-if="userData.phone_number" class="field-separator"></span>
                  <span v-if="userData.balance !== null && userData.balance !== undefined"><strong>账户余额：</strong> {{
                      userData.balance
                    }}</span>
                  <span v-if="userData.balance !== null && userData.balance !== undefined"
                        class="field-separator"></span>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="grid-content bg-purple">
                  <strong>简介：</strong> {{ userData.bio }}
                </div>
              </el-col>
            </el-row>
          </template>
        </el-skeleton>
      </el-card>
    </div>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="已发布悬赏" name="pub_reward">
          <div v-if="activeName === 'pub_reward'">
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
              <el-table-column
                  prop="status"
                  label="状态">
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已完成悬赏" name="fin_reward">

        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      activeName: 'pub_reward',
      userData: null,
      rewards: [],
    };

  },
  created() {
    this.fetchUserData();
  },
  methods: {
    handleTabsClick(tab, event) {
      if (tab.name === 'pub_reward') {
        this.fetchPublishedRewards();
      }
    },
    fetchUserData() {
      const username = this.$route.params.username;
      const authToken = localStorage.getItem('authToken');
      axios.get(`http://127.0.0.1:8000/userapp/detail/${username}/`, {
        headers: {
          'Authorization': `Token ${authToken}`,
        }
      })
          .then(response => {
            this.userData = response.data;
            this.fetchPublishedRewards();
          })
          .catch(error => {
            console.error('获取用户数据失败:', error);
            this.$message.error('获取用户数据失败');
          });
    },
    fetchPublishedRewards() {
      if (!this.userData) return;
      const username = this.userData.username;
      const authToken = localStorage.getItem('authToken');
      axios.get(`http://127.0.0.1:8000/rewardapp/public-rewards/?creator_username=${username}`, {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
        params: {"is_filter": 1},
      })
          .then(response => {
            this.rewards = response.data;
          })
          .catch(error => {
            console.error('获取悬赏数据失败:', error);
            this.$message.error('获取悬赏数据失败');
          });
    },
  },
};
</script>

<style scoped>
.bg-purple {
  background: #a6c2e3;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  padding: 5px;
  margin-bottom: 20px;
}

.reward-table-container {
  width: 100%;
}

.reward-card {
  margin-bottom: 20px;
}
</style>
