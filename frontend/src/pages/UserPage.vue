<template>
  <n-card>
    <div class="header">
      <n-h2>用户管理</n-h2>
      <n-button @click="fetchList">刷新</n-button>
    </div>
    <n-data-table :columns="columns" :data="items" :loading="loading" />
  </n-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { NButton, NCard, NDataTable, NH2 } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { useList } from "../composables/useList";

type UserItem = {
  id: number;
  username: string;
  displayName?: string | null;
  email?: string | null;
  isActive: boolean;
};

const { items, loading, fetchList } = useList<UserItem>("/api/users");

const columns: DataTableColumns<UserItem> = [
  { title: "账号", key: "username" },
  { title: "名称", key: "displayName" },
  { title: "邮箱", key: "email" },
  { title: "启用", key: "isActive" }
];

onMounted(fetchList);
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
</style>
