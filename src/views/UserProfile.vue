<template>
  <div>
    <div>
      <el-card>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2>用户详情</h2>
          <el-button
              v-if="userData.is_auth_user"
              type="primary"
              @click="goToPublishReward"
          >
            发布悬赏
          </el-button>
        </div>
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
        <el-tab-pane label="已发布" name="waiting">
          <div>
            <reward-table :rewards="rewards"></reward-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="被申请" name="applied">
          <div>
            <reward-table :rewards="rewards"></reward-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已结款" name="payed">
          <div>
            <reward-table :rewards="rewards"></reward-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="申请中" name="apl_reward">
          <div>
            <reward-table :rewards="rewards"></reward-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="开发中" name="in_progress">
          <div>
            <reward-table :rewards="rewards"></reward-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="completed">
          <div>
            <reward-table :rewards="rewards"></reward-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="被打回" name="callback">
          <div>
            <reward-table :rewards="rewards"></reward-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import RewardTable from "../components/RewardTableView.vue"

export default {
  components: {
    RewardTable
  },
  data() {
    return {
      activeName: 'waiting',
      userData: null,
      rewards: [],
    };
  },
  created() {
    this.fetchUserData();
  },
  methods: {
    handleTabsClick(tab, event) {
      this.fetchPublishedRewards(tab.name);
    },
    goToPublishReward() {
      this.$router.push({name: 'Publish'});
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
            this.fetchPublishedRewards("waiting");
          })
          .catch(error => {
            console.error('获取用户数据失败:', error);
            this.$message.error('获取用户数据失败');
          });
    },
    fetchPublishedRewards(status) {
      if (!this.userData) return;
      const username = this.userData.username;
      const authToken = localStorage.getItem('authToken');
      axios.get(`http://127.0.0.1:8000/rewardapp/public-rewards/?creator_username=${username}`, {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
        params: {"status": status},
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

.field-separator {
  margin: 0 5px;
}
</style>
