<template>
  <n-card>
    <div class="header">
      <n-h2>会话管理</n-h2>
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

type SessionItem = {
  id: number;
  userId: number;
  issuedAt: string;
  expiresAt: string;
  revokedAt?: string | null;
};

const { items, loading, fetchList } = useList<SessionItem>("/api/sessions");

const columns: DataTableColumns<SessionItem> = [
  { title: "用户ID", key: "userId" },
  { title: "签发时间", key: "issuedAt" },
  { title: "过期时间", key: "expiresAt" },
  { title: "撤销时间", key: "revokedAt" }
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
