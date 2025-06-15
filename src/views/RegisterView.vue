<template>
  <div id="register">
    <el-form :model="form" ref="form" :rules="rules" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
import {Message} from 'element-ui';

export default {
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
      },
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'},
        ],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
      },
    };
  },
  methods: {
    async submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            await axios.post(`http://${this.$backends_base_url}/userapp/register/`, this.form);
            if (confirm('注册成功！是否直接登录？')) {
              const loginResponse = await axios.post(`http://${this.$backends_base_url}/userapp/login/`, {
                username: this.form.username,
                password: this.form.password,
              });
              const token = loginResponse.data.token;
              localStorage.setItem('authToken', token);
              localStorage.setItem('username', this.form.username);
            }
            this.$router.push({name: 'home'});
            window.location.reload();
          } catch (registerError) {
            if (registerError.response && registerError.response.data.username) {
              Message.error(registerError.response.data.username[0]);
            } else {
              Message.error('注册时发生错误，请重试。');
            }
          }
        }
      });
    },
  },
};
</script>

<style scoped>
#register {
  max-width: 500px;
  margin: 50px auto;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>
