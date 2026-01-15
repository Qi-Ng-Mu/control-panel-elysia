import { ref } from "vue";
import { request } from "../services/http";

export const useList = <T>(path: string) => {
  const loading = ref(false);
  const items = ref<T[]>([]);
  const total = ref(0);

  const fetchList = async () => {
    loading.value = true;
    try {
      const response = await request<{ total: number; items: T[] }>(path);
      items.value = response.data.items;
      total.value = response.data.total;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    items,
    total,
    fetchList
  };
};
