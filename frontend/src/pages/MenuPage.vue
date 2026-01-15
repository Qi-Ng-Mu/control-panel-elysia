<template>
  <n-card>
    <div class="header">
      <n-h2>菜单管理</n-h2>
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

type MenuItem = {
  id: number;
  name: string;
  path: string;
  component: string;
  isActive: boolean;
};

const { items, loading, fetchList } = useList<MenuItem>("/api/menus");

const columns: DataTableColumns<MenuItem> = [
  { title: "名称", key: "name" },
  { title: "路径", key: "path" },
  { title: "组件", key: "component" },
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
