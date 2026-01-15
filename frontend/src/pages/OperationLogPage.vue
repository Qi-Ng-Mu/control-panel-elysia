<template>
  <n-card>
    <div class="header">
      <n-h2>操作日志</n-h2>
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

type OperationLogItem = {
  id: number;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  createdAt: string;
};

const { items, loading, fetchList } = useList<OperationLogItem>("/api/operation-logs");

const columns: DataTableColumns<OperationLogItem> = [
  { title: "动作", key: "action" },
  { title: "目标类型", key: "targetType" },
  { title: "目标ID", key: "targetId" },
  { title: "时间", key: "createdAt" }
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
