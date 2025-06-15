<!-- src/views/LoginView.vue -->
<template>
  <div id="login">
    <h1 style="text-align: center">登录</h1>
    <el-form :model="loginForm" ref="loginForm" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="button-container">
          <el-button type="primary" @click="handleLogin">Login</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
import {Message} from 'element-ui';

export default {
  name: 'LoginView',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
      },
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          axios.post(`http://${this.$backends_base_url}/userapp/login/`, this.loginForm)
              .then(response => {
                const token = response.data.token;
                // 存储 token 和用户名
                localStorage.setItem('authToken', token);
                localStorage.setItem('username', this.loginForm.username);
                this.$router.push({name: 'Home'});
              })
              .catch(error => {
                if (error.response && error.response.data.non_field_errors) {
                  Message.error(error.response.data.non_field_errors[0]);
                } else {
                  Message.error('发生错误，请重试，或联系管理员：3360976193@qq.com');
                }
              });
        } else {
          console.log('提交失败');
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
#login {
  max-width: 500px;
  margin: 50px auto;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

h1 {
  margin-bottom: 20px;
}
</style>
