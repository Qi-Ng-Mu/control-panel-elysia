-- 表: 用户表
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `username` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL COMMENT '用户名',
    `email` VARCHAR(191) NULL COMMENT '邮箱',
    `password_hash` VARCHAR(191) NOT NULL COMMENT '密码哈希',
    `display_name` VARCHAR(191) NULL COMMENT '显示名称',
    `avatar_file_id` INTEGER NULL COMMENT '头像文件ID',
    `is_active` BOOLEAN NOT NULL DEFAULT true COMMENT '是否启用',
    `is_super` BOOLEAN NOT NULL DEFAULT false COMMENT '是否超级管理员',
    `last_login_at` DATETIME(3) NULL COMMENT '最后登录时间',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `updated_at` DATETIME(3) NOT NULL COMMENT '更新时间',
    `created_by` INTEGER NULL COMMENT '创建人',
    `updated_by` INTEGER NULL COMMENT '更新人',
    `deleted_at` DATETIME(3) NULL COMMENT '删除时间(软删除)',
    `deleted_by` INTEGER NULL COMMENT '删除人',

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT='用户表';

-- 表: 角色表
CREATE TABLE `role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '角色ID',
    `name` VARCHAR(191) NOT NULL COMMENT '角色名称',
    `code` VARCHAR(191) NOT NULL COMMENT '角色编码',
    `description` VARCHAR(191) NULL COMMENT '角色描述',
    `is_active` BOOLEAN NOT NULL DEFAULT true COMMENT '是否启用',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `updated_at` DATETIME(3) NOT NULL COMMENT '更新时间',
    `created_by` INTEGER NULL COMMENT '创建人',
    `updated_by` INTEGER NULL COMMENT '更新人',
    `deleted_at` DATETIME(3) NULL COMMENT '删除时间(软删除)',
    `deleted_by` INTEGER NULL COMMENT '删除人',

    UNIQUE INDEX `role_code_key`(`code`),
    UNIQUE INDEX `role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT='角色表';

-- 表: 权限表
CREATE TABLE `permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '权限ID',
    `name` VARCHAR(191) NOT NULL COMMENT '权限名称',
    `code` VARCHAR(191) NOT NULL COMMENT '权限编码',
    `description` VARCHAR(191) NULL COMMENT '权限描述',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `updated_at` DATETIME(3) NOT NULL COMMENT '更新时间',
    `created_by` INTEGER NULL COMMENT '创建人',
    `updated_by` INTEGER NULL COMMENT '更新人',
    `deleted_at` DATETIME(3) NULL COMMENT '删除时间(软删除)',
    `deleted_by` INTEGER NULL COMMENT '删除人',

    UNIQUE INDEX `permission_code_key`(`code`),
    UNIQUE INDEX `permission_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT='权限表';

-- 表: 用户-角色关联表
CREATE TABLE `user_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '关联ID',
    `user_id` INTEGER NOT NULL COMMENT '用户ID',
    `role_id` INTEGER NOT NULL COMMENT '角色ID',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `created_by` INTEGER NULL COMMENT '创建人',

    UNIQUE INDEX `user_role_user_id_role_id_key`(`user_id`, `role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT='用户-角色关联表';

-- 表: 角色-权限关联表
CREATE TABLE `role_permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '关联ID',
    `role_id` INTEGER NOT NULL COMMENT '角色ID',
    `permission_id` INTEGER NOT NULL COMMENT '权限ID',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `created_by` INTEGER NULL COMMENT '创建人',

    UNIQUE INDEX `role_permission_role_id_permission_id_key`(`role_id`, `permission_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT='角色-权限关联表';

-- 表: 菜单表
CREATE TABLE `menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
    `name` VARCHAR(191) NOT NULL COMMENT '菜单名称',
    `path` VARCHAR(191) NOT NULL COMMENT '路由路径',
    `component` VARCHAR(191) NOT NULL COMMENT '前端组件',
    `icon` VARCHAR(191) NULL COMMENT '菜单图标',
    `order` INTEGER NOT NULL DEFAULT 0 COMMENT '排序',
    `is_hidden` BOOLEAN NOT NULL DEFAULT false COMMENT '是否隐藏',
    `is_active` BOOLEAN NOT NULL DEFAULT true COMMENT '是否启用',
    `is_directory` BOOLEAN NOT NULL DEFAULT false COMMENT '是否目录',
    `parent_id` INTEGER NULL COMMENT '父级菜单ID',
    `permission_id` INTEGER NULL COMMENT '权限ID',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `updated_at` DATETIME(3) NOT NULL COMMENT '更新时间',
    `created_by` INTEGER NULL COMMENT '创建人',
    `updated_by` INTEGER NULL COMMENT '更新人',
    `deleted_at` DATETIME(3) NULL COMMENT '删除时间(软删除)',
    `deleted_by` INTEGER NULL COMMENT '删除人',

    INDEX `menu_parent_id_idx`(`parent_id`),
    INDEX `menu_permission_id_idx`(`permission_id`),
    UNIQUE INDEX `menu_path_key`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT='菜单表';

-- 表: 文件表
CREATE TABLE `file_asset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '文件ID',
    `storage_type` VARCHAR(191) NOT NULL COMMENT '存储类型(local/oss)',
    `original_name` VARCHAR(191) NOT NULL COMMENT '原始文件名',
    `mime_type` VARCHAR(191) NOT NULL COMMENT '文件类型',
    `hash` VARCHAR(191) NOT NULL COMMENT '文件哈希',
    `path` VARCHAR(191) NOT NULL COMMENT '文件路径',
    `size` INTEGER NOT NULL COMMENT '文件大小(字节)',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `updated_at` DATETIME(3) NOT NULL COMMENT '更新时间',
    `created_by` INTEGER NULL COMMENT '创建人',
    `updated_by` INTEGER NULL COMMENT '更新人',
    `deleted_at` DATETIME(3) NULL COMMENT '删除时间(软删除)',
    `deleted_by` INTEGER NULL COMMENT '删除人',

    UNIQUE INDEX `file_asset_hash_key`(`hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT='文件表';

-- 表: 系统配置表
CREATE TABLE `system_config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '配置ID',
    `key` VARCHAR(191) NOT NULL COMMENT '配置键',
    `value` JSON NOT NULL COMMENT '配置值',
    `description` VARCHAR(191) NULL COMMENT '配置说明',
    `is_public` BOOLEAN NOT NULL DEFAULT false COMMENT '是否前端可见',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `updated_at` DATETIME(3) NOT NULL COMMENT '更新时间',
    `created_by` INTEGER NULL COMMENT '创建人',
    `updated_by` INTEGER NULL COMMENT '更新人',
    `deleted_at` DATETIME(3) NULL COMMENT '删除时间(软删除)',
    `deleted_by` INTEGER NULL COMMENT '删除人',

    UNIQUE INDEX `system_config_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT='系统配置表';

-- 表: 登录会话表(Refresh Token)
CREATE TABLE `session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '会话ID',
    `user_id` INTEGER NOT NULL COMMENT '用户ID',
    `refresh_token_hash` VARCHAR(191) NULL COMMENT 'Refresh Token 哈希',
    `device_id` VARCHAR(191) NULL COMMENT '设备ID',
    `ip` VARCHAR(191) NULL COMMENT 'IP',
    `user_agent` VARCHAR(191) NULL COMMENT 'User-Agent',
    `issued_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '签发时间',
    `expires_at` DATETIME(3) NOT NULL COMMENT '过期时间',
    `revoked_at` DATETIME(3) NULL COMMENT '撤销时间',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT='登录会话表(Refresh Token)';

-- 表: 终端会话表
CREATE TABLE `terminal_session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '记录ID',
    `user_id` INTEGER NOT NULL COMMENT '用户ID',
    `name` VARCHAR(191) NULL COMMENT '会话名称',
    `session_id` VARCHAR(191) NOT NULL COMMENT '终端会话ID',
    `is_active` BOOLEAN NOT NULL DEFAULT true COMMENT '是否激活',
    `last_active_at` DATETIME(3) NULL COMMENT '最后活跃时间',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `updated_at` DATETIME(3) NOT NULL COMMENT '更新时间',
    `created_by` INTEGER NULL COMMENT '创建人',
    `updated_by` INTEGER NULL COMMENT '更新人',
    `deleted_at` DATETIME(3) NULL COMMENT '删除时间(软删除)',
    `deleted_by` INTEGER NULL COMMENT '删除人',

    UNIQUE INDEX `terminal_session_session_id_key`(`session_id`),
    INDEX `terminal_session_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT='终端会话表';

-- 表: 操作日志表
CREATE TABLE `operation_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '日志ID',
    `user_id` INTEGER NULL COMMENT '用户ID',
    `action` VARCHAR(191) NOT NULL COMMENT '操作名称',
    `target_type` VARCHAR(191) NULL COMMENT '目标类型',
    `target_id` VARCHAR(191) NULL COMMENT '目标ID',
    `payload` JSON NULL COMMENT '操作内容',
    `ip` VARCHAR(191) NULL COMMENT 'IP',
    `user_agent` VARCHAR(191) NULL COMMENT 'User-Agent',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT='操作日志表';

-- 外键: user.avatar_file_id -> file_asset.id
ALTER TABLE `user` ADD CONSTRAINT `user_avatar_file_id_fkey` FOREIGN KEY (`avatar_file_id`) REFERENCES `file_asset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- 外键: user_role.user_id -> user.id
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- 外键: user_role.role_id -> role.id
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- 外键: role_permission.role_id -> role.id
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- 外键: role_permission.permission_id -> permission.id
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- 外键: menu.parent_id -> menu.id
ALTER TABLE `menu` ADD CONSTRAINT `menu_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `menu`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- 外键: menu.permission_id -> permission.id
ALTER TABLE `menu` ADD CONSTRAINT `menu_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- 外键: session.user_id -> user.id
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- 外键: terminal_session.user_id -> user.id
ALTER TABLE `terminal_session` ADD CONSTRAINT `terminal_session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- 外键: operation_log.user_id -> user.id
ALTER TABLE `operation_log` ADD CONSTRAINT `operation_log_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
