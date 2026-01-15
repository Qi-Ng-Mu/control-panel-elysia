import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import AdminLayout from "../layouts/AdminLayout.vue";
import LoginPage from "../pages/LoginPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import TenantPage from "../pages/TenantPage.vue";
import UserPage from "../pages/UserPage.vue";
import RolePage from "../pages/RolePage.vue";
import PermissionPage from "../pages/PermissionPage.vue";
import MenuPage from "../pages/MenuPage.vue";
import DepartmentPage from "../pages/DepartmentPage.vue";
import PositionPage from "../pages/PositionPage.vue";
import DictionaryPage from "../pages/DictionaryPage.vue";
import NoticeTemplatePage from "../pages/NoticeTemplatePage.vue";
import NoticePage from "../pages/NoticePage.vue";
import TicketFlowPage from "../pages/TicketFlowPage.vue";
import TicketPage from "../pages/TicketPage.vue";
import OperationLogPage from "../pages/OperationLogPage.vue";
import SessionPage from "../pages/SessionPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginPage,
      meta: { public: true }
    },
    {
      path: "/",
      component: AdminLayout,
      meta: { requiresAuth: true },
      redirect: "/dashboard",
      children: [
        { path: "dashboard", name: "dashboard", component: DashboardPage },
        { path: "tenants", name: "tenants", component: TenantPage },
        { path: "users", name: "users", component: UserPage },
        { path: "roles", name: "roles", component: RolePage },
        { path: "permissions", name: "permissions", component: PermissionPage },
        { path: "menus", name: "menus", component: MenuPage },
        { path: "departments", name: "departments", component: DepartmentPage },
        { path: "positions", name: "positions", component: PositionPage },
        { path: "dictionary", name: "dictionary", component: DictionaryPage },
        { path: "notice-templates", name: "notice-templates", component: NoticeTemplatePage },
        { path: "notices", name: "notices", component: NoticePage },
        { path: "ticket-flows", name: "ticket-flows", component: TicketFlowPage },
        { path: "tickets", name: "tickets", component: TicketPage },
        { path: "operation-logs", name: "operation-logs", component: OperationLogPage },
        { path: "sessions", name: "sessions", component: SessionPage }
      ]
    }
  ]
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  if (authStore.accessToken && !authStore.profile) {
    await authStore.fetchProfile();
  }

  if (to.meta.requiresAuth && !authStore.accessToken) {
    return "/login";
  }

  if (to.meta.public && authStore.accessToken) {
    return "/dashboard";
  }

  return true;
});

export default router;

