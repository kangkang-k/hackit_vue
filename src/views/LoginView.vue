<!-- src/views/LoginView.vue -->
<template>
  <div id="login">
    <h1>Login</h1>
    <el-form :model="loginForm" ref="loginForm" :rules="rules" label-width="80px">
      <el-form-item label="Username" prop="username">
        <el-input v-model="loginForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">Login</el-button>
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
          axios.post('http://127.0.0.1:8000/userapp/login/', this.loginForm)
              .then(response => {
                const token = response.data.token;
                // 存储 token 和用户名
                localStorage.setItem('authToken', token);
                localStorage.setItem('username', this.loginForm.username);
                this.$router.push({name: 'home'});
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

h1 {
  margin-bottom: 20px;
}
</style>
