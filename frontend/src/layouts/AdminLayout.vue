<template>
  <n-layout has-sider class="layout">
    <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="220">
      <div class="logo">控制台</div>
      <n-menu :options="menuOptions" :value="activeKey" @update:value="handleSelect" />
    </n-layout-sider>
    <n-layout>
      <n-layout-header class="header" bordered>
        <div class="title">后台管理系统</div>
        <n-button text type="primary" @click="logout">退出登录</n-button>
      </n-layout-header>
      <n-layout-content class="content">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { NLayout, NLayoutContent, NLayoutHeader, NLayoutSider, NMenu, NButton } from "naive-ui";
import { menuItems } from "../router/menus";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const permissions = computed(() => authStore.profile?.permissionCodes ?? []);

const menuOptions = computed(() => {
  const allowAll = permissions.value.includes("*");
  return menuItems
    .filter((item) => !item.permission || allowAll || permissions.value.includes(item.permission))
    .map((item) => ({ label: item.label, key: item.key, path: item.path }));
});

const activeKey = computed(() => {
  const match = menuItems.find((item) => route.path.startsWith(item.path));
  return match?.key;
});

const handleSelect = (key: string) => {
  const target = menuItems.find((item) => item.key === key);
  if (target) {
    router.push(target.path);
  }
};

const logout = async () => {
  await authStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.logo {
  padding: 16px;
  font-size: 18px;
  font-weight: 600;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
}

.title {
  font-weight: 600;
}

.content {
  padding: 24px;
}
</style>
