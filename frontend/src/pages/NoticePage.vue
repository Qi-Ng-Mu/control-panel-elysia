<template>
  <n-card>
    <div class="header">
      <n-h2>通知管理</n-h2>
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

type NoticeItem = {
  id: number;
  title: string;
  status: string;
  publishedAt?: string | null;
};

const { items, loading, fetchList } = useList<NoticeItem>("/api/notices");

const columns: DataTableColumns<NoticeItem> = [
  { title: "标题", key: "title" },
  { title: "状态", key: "status" },
  { title: "发布时间", key: "publishedAt" }
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
