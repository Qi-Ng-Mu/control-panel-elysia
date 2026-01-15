<template>
  <div class="login">
    <n-card class="card" title="系统登录">
      <n-form ref="formRef" :model="form" :rules="rules" label-width="80">
        <n-form-item label="租户" path="tenantCode">
          <n-input v-model:value="form.tenantCode" placeholder="租户编码(可选)" />
        </n-form-item>
        <n-form-item label="账号" path="username">
          <n-input v-model:value="form.username" placeholder="请输入账号" />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input v-model:value="form.password" type="password" placeholder="请输入密码" />
        </n-form-item>
        <n-button type="primary" block :loading="loading" @click="handleLogin">登录</n-button>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { NButton, NCard, NForm, NFormItem, NInput, useMessage } from "naive-ui";
import type { FormInst, FormRules } from "naive-ui";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const message = useMessage();
const formRef = ref<FormInst | null>(null);
const loading = ref(false);

const form = ref({
  tenantCode: "",
  username: "",
  password: ""
});

const rules: FormRules = {
  username: { required: true, message: "请输入账号", trigger: "blur" },
  password: { required: true, message: "请输入密码", trigger: "blur" }
};

const handleLogin = async () => {
  await formRef.value?.validate();
  loading.value = true;
  try {
    await authStore.login({
      tenantCode: form.value.tenantCode || undefined,
      username: form.value.username,
      password: form.value.password
    });
    message.success("登录成功");
    router.push("/dashboard");
  } catch (error) {
    message.error(error instanceof Error ? error.message : "登录失败");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.card {
  width: 360px;
}
</style>
