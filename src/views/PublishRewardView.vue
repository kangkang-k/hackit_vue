<template>
  <el-form @submit.prevent="submitForm">
    <el-form-item label="Title" required>
      <el-input v-model="title" placeholder="Enter reward title"></el-input>
    </el-form-item>
    <el-form-item label="Description" required>
      <el-input type="textarea" v-model="description" placeholder="Enter reward description"></el-input>
    </el-form-item>
    <el-form-item label="Category" required>
      <el-select v-model="selectedCategoryId" placeholder="Select category">
        <el-option
          v-for="cat in categories"
          :key="cat.id"
          :label="cat.name"
          :value="cat.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Reward Amount" required>
      <el-input-number v-model="rewardAmount" :min="0" placeholder="Enter reward amount"></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">Publish Reward</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from 'axios';
import { Message } from 'element-ui';

export default {
  data() {
    return {
      title: '',
      description: '',
      selectedCategoryId: null,
      rewardAmount: null,
      categories: [],
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(`http://${this.$backends_base_url}/rewardapp/categories/`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
          }
        });
        this.categories = response.data;
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        Message.error('Failed to fetch categories');
      }
    },
    async submitForm() {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          Message.error('You must be logged in to submit a reward');
          return;
        }

        await axios.post(`http://${this.$backends_base_url}/rewardapp/rewards/`, {
          title: this.title,
          description: this.description,
          category: this.selectedCategoryId,
          reward_amount: this.rewardAmount,
        }, {
          headers: {
            'Authorization': `Token ${authToken}`,
          }
        });

        Message.success('Reward published successfully');
      } catch (error) {
        console.error('Failed to publish reward:', error);
        Message.error('Failed to publish reward');
      }
    },
  },
};
</script>

<style scoped>
</style>
