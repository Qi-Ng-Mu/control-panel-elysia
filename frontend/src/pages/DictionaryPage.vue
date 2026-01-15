<template>
  <n-card>
    <div class="header">
      <n-h2>字典管理</n-h2>
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

type DictionaryGroupItem = {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
};

const { items, loading, fetchList } = useList<DictionaryGroupItem>("/api/dictionary/groups");

const columns: DataTableColumns<DictionaryGroupItem> = [
  { title: "名称", key: "name" },
  { title: "编码", key: "code" },
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
