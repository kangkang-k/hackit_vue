<template>
  <div id="app">
    <el-header>
      <el-row type="flex" justify="end">
        <template v-if="isLoggedIn">

          <span> 当前用户：<el-link type="primary" @click="goToUserProfile(currentUser)">{{
              currentUser
            }}</el-link></span>

          <el-button type="danger" @click="logout">登出</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="goToLogin">登录</el-button>
          <el-button type="success" @click="goToRegister">注册</el-button>
        </template>
      </el-row>
    </el-header>
    <el-main>
      <el-table :data="rewards" style="width: 100%">
        <el-table-column prop="title" label="Title"></el-table-column>
        <el-table-column prop="description" label="Description"></el-table-column>
        <el-table-column label="Category">
          <template #header>
            <span>Category</span>
            <el-button v-if="selectedCategory" type="warning" size="mini" @click="resetCategoryFilter">取消筛选
            </el-button>
          </template>
          <template #default="scope">
            <el-link type="primary" @click="fetchRewardsByCategory(scope.row.category_name)">
              {{ scope.row.category_name }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="Creator">
          <template #header>
            <span>Creator</span>
            <el-button v-if="selectedCreator" type="warning" size="mini" @click="resetCreatorFilter">取消筛选
            </el-button>
          </template>
          <template #default="scope">
            <el-dropdown @command="(command) => handleCreatorCommand(scope.row.creator_username, command)">
          <span class="el-dropdown-link">
            <el-link type="primary">
              {{ scope.row.creator_username }}
            </el-link>
          </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="profile">用户主页</el-dropdown-item>
                <el-dropdown-item command="filter">筛选</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column prop="reward_amount" label="Reward Amount"></el-table-column>
        <el-table-column prop="created_at" label="Created At"></el-table-column>
        <el-table-column label="Actions">
          <template #default="scope">
            <el-button type="primary" @click="showDialog = true">接单</el-button>
            <el-dialog
                title="确认"
                :visible.sync="showDialog"
                width="30%"
                @close="handleClose"
            >
              <span>确认接单？</span>
              <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">否</el-button>
        <el-button type="primary" @click="confirmAccept(scope.row)">是</el-button>
      </span>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      showDialog: false,
      rewards: [],
      currentUser: localStorage.getItem('username') || '',
      selectedCategory: null,
      selectedCreator: null,
      status: "waiting"
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('authToken');
    },
  },
  created() {
    this.fetchRewards();
  },
  methods: {
    confirmAccept(reward) {
      this.showDialog = false;
      this.acceptReward(reward);
    },
    fetchRewards() {
      axios.get('http://123.249.90.144:8000/rewardapp/public-rewards/?status=waiting')
          .then(response => {
            this.rewards = response.data;
            this.selectedCategory = null;
            this.selectedCreator = null;
          })
          .catch(error => {
            console.error('请求错误，请联系管理员,3360976193@qq.com:', error);
          });
    },
    fetchRewardsByCategory(categoryName) {
      this.selectedCategory = categoryName;
      this.applyFilters();
    },
    fetchRewardsByCreator(creatorUsername) {
      this.selectedCreator = creatorUsername;
      this.applyFilters();
    },
    goToUserProfile(creatorUsername) {
      this.$router.push({name: 'Profile', params: {username: creatorUsername}});
    },
    handleCreatorCommand(creatorUsername, command) {
      if (command === 'profile') {
        if (localStorage.getItem('authToken')) {
          this.goToUserProfile(creatorUsername);
        } else {
          this.$message({
            message: '请先登录再查看',
            type: 'error'
          });
        }

      } else if (command === 'filter') {
        this.fetchRewardsByCreator(creatorUsername);
      }
    },
    applyFilters() {
      const params = {
        status: this.status,
      };
      if (this.selectedCategory) {
        params.category_name = this.selectedCategory;
      }
      if (this.selectedCreator) {
        params.creator_username = this.selectedCreator;
      }
      axios.get('http://123.249.90.144:8000/rewardapp/public-rewards/', {params})
          .then(response => {
            this.rewards = response.data;
          })
          .catch(error => {
            console.error('筛选错误:', error);
          });
    },
    resetCategoryFilter() {
      this.selectedCategory = null;
      this.applyFilters();
    },
    resetCreatorFilter() {
      this.selectedCreator = null;
      this.applyFilters();
    },
    goToLogin() {
      this.$router.push({name: 'Login'});
    },
    goToRegister() {
      this.$router.push({name: 'Register'});
    },
    acceptReward(reward) {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        this.$message.error('请先登录再接单');
        return;
      }

      axios.post('http://123.249.90.144:8000/rewardapp/applications/', {
        reward: reward.id
      }, {
        headers: {
          'Authorization': `Token ${authToken}`
        }
      })
          .then(response => {
            this.$message.success('接单成功');
            this.fetchRewards();
          })
          .catch(error => {
            if (error.response && error.response.data) {
              this.$message.error('不可接收自己发布的订单');
            } else {
              console.error('Error accepting reward:', error);
              this.$message.error('An error occurred while accepting the reward.');
            }
          });
    },
    logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      this.currentUser = '';

      window.location.reload();
    },
  }
};
</script>

<style scoped>
.el-header {
  background-color: #f8f9fa;
  padding: 10px;
}

.el-button {
  margin-left: 10px;
}

.el-table {
  margin-top: 20px;
}
</style>
