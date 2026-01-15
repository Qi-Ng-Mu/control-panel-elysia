-- CreateTable
CREATE TABLE `tenant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `expires_at` TIMESTAMP(3) NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    UNIQUE INDEX `tenant_code_deleted_at_key`(`code`, `deleted_at`),
    UNIQUE INDEX `tenant_name_deleted_at_key`(`name`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `department` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `parent_id` INTEGER NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `department_tenant_id_idx`(`tenant_id`),
    INDEX `department_parent_id_idx`(`parent_id`),
    UNIQUE INDEX `department_tenant_id_code_deleted_at_key`(`tenant_id`, `code`, `deleted_at`),
    UNIQUE INDEX `department_tenant_id_name_deleted_at_key`(`tenant_id`, `name`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `position` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `position_tenant_id_idx`(`tenant_id`),
    UNIQUE INDEX `position_tenant_id_code_deleted_at_key`(`tenant_id`, `code`, `deleted_at`),
    UNIQUE INDEX `position_tenant_id_name_deleted_at_key`(`tenant_id`, `name`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_position` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `position_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NULL,

    INDEX `user_position_tenant_id_idx`(`tenant_id`),
    INDEX `user_position_user_id_idx`(`user_id`),
    INDEX `user_position_position_id_idx`(`position_id`),
    UNIQUE INDEX `user_position_tenant_id_user_id_position_id_key`(`tenant_id`, `user_id`, `position_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `display_name` VARCHAR(191) NULL,
    `avatar_file_id` INTEGER NULL,
    `department_id` INTEGER NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `last_login_at` TIMESTAMP(3) NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `user_tenant_id_idx`(`tenant_id`),
    INDEX `user_department_id_idx`(`department_id`),
    UNIQUE INDEX `user_tenant_id_username_deleted_at_key`(`tenant_id`, `username`, `deleted_at`),
    UNIQUE INDEX `user_tenant_id_email_deleted_at_key`(`tenant_id`, `email`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `data_scope_type` VARCHAR(191) NOT NULL DEFAULT 'ALL',
    `data_scope_department_ids` JSON NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `role_tenant_id_idx`(`tenant_id`),
    UNIQUE INDEX `role_tenant_id_code_deleted_at_key`(`tenant_id`, `code`, `deleted_at`),
    UNIQUE INDEX `role_tenant_id_name_deleted_at_key`(`tenant_id`, `name`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `permission_tenant_id_idx`(`tenant_id`),
    UNIQUE INDEX `permission_tenant_id_code_deleted_at_key`(`tenant_id`, `code`, `deleted_at`),
    UNIQUE INDEX `permission_tenant_id_name_deleted_at_key`(`tenant_id`, `name`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NULL,

    INDEX `user_role_tenant_id_idx`(`tenant_id`),
    UNIQUE INDEX `user_role_tenant_id_user_id_role_id_key`(`tenant_id`, `user_id`, `role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,
    `permission_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NULL,

    INDEX `role_permission_tenant_id_idx`(`tenant_id`),
    UNIQUE INDEX `role_permission_tenant_id_role_id_permission_id_key`(`tenant_id`, `role_id`, `permission_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `component` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `is_hidden` BOOLEAN NOT NULL DEFAULT false,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_directory` BOOLEAN NOT NULL DEFAULT false,
    `parent_id` INTEGER NULL,
    `permission_id` INTEGER NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `menu_tenant_id_idx`(`tenant_id`),
    INDEX `menu_parent_id_idx`(`parent_id`),
    INDEX `menu_permission_id_idx`(`permission_id`),
    UNIQUE INDEX `menu_tenant_id_path_deleted_at_key`(`tenant_id`, `path`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `file_asset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `storage_type` VARCHAR(191) NOT NULL,
    `original_name` VARCHAR(191) NOT NULL,
    `mime_type` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `file_asset_tenant_id_idx`(`tenant_id`),
    UNIQUE INDEX `file_asset_tenant_id_hash_deleted_at_key`(`tenant_id`, `hash`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,
    `description` VARCHAR(191) NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `system_config_tenant_id_idx`(`tenant_id`),
    UNIQUE INDEX `system_config_tenant_id_key_deleted_at_key`(`tenant_id`, `key`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `refresh_token_hash` VARCHAR(191) NULL,
    `device_id` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NULL,
    `user_agent` VARCHAR(191) NULL,
    `issued_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires_at` TIMESTAMP(3) NOT NULL,
    `revoked_at` TIMESTAMP(3) NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `session_tenant_id_idx`(`tenant_id`),
    INDEX `session_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `terminal_session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `last_active_at` TIMESTAMP(3) NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `terminal_session_tenant_id_idx`(`tenant_id`),
    INDEX `terminal_session_user_id_idx`(`user_id`),
    UNIQUE INDEX `terminal_session_tenant_id_session_id_deleted_at_key`(`tenant_id`, `session_id`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `operation_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `user_id` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `target_type` VARCHAR(191) NULL,
    `target_id` VARCHAR(191) NULL,
    `payload` JSON NULL,
    `ip` VARCHAR(191) NULL,
    `user_agent` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `operation_log_tenant_id_idx`(`tenant_id`),
    INDEX `operation_log_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dictionary_group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `dictionary_group_tenant_id_idx`(`tenant_id`),
    UNIQUE INDEX `dictionary_group_tenant_id_code_deleted_at_key`(`tenant_id`, `code`, `deleted_at`),
    UNIQUE INDEX `dictionary_group_tenant_id_name_deleted_at_key`(`tenant_id`, `name`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dictionary_item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `group_id` INTEGER NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `description` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `dictionary_item_tenant_id_idx`(`tenant_id`),
    INDEX `dictionary_item_group_id_idx`(`group_id`),
    UNIQUE INDEX `dictionary_item_tenant_id_group_id_value_deleted_at_key`(`tenant_id`, `group_id`, `value`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notice_template` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `description` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `notice_template_tenant_id_idx`(`tenant_id`),
    UNIQUE INDEX `notice_template_tenant_id_code_deleted_at_key`(`tenant_id`, `code`, `deleted_at`),
    UNIQUE INDEX `notice_template_tenant_id_name_deleted_at_key`(`tenant_id`, `name`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `template_id` INTEGER NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
    `published_at` TIMESTAMP(3) NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `notice_tenant_id_idx`(`tenant_id`),
    INDEX `notice_template_id_idx`(`template_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'OPEN',
    `flow_id` INTEGER NULL,
    `current_node_id` INTEGER NULL,
    `requester_id` INTEGER NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `ticket_tenant_id_idx`(`tenant_id`),
    INDEX `ticket_flow_id_idx`(`flow_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_flow` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `ticket_flow_tenant_id_idx`(`tenant_id`),
    UNIQUE INDEX `ticket_flow_tenant_id_name_deleted_at_key`(`tenant_id`, `name`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_flow_node` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `flow_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `is_start` BOOLEAN NOT NULL DEFAULT false,
    `is_end` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(3) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `ticket_flow_node_tenant_id_idx`(`tenant_id`),
    INDEX `ticket_flow_node_flow_id_idx`(`flow_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_flow_condition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `flow_id` INTEGER NOT NULL,
    `source_node_id` INTEGER NOT NULL,
    `target_node_id` INTEGER NOT NULL,
    `expression` JSON NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NULL,

    INDEX `ticket_flow_condition_tenant_id_idx`(`tenant_id`),
    INDEX `ticket_flow_condition_flow_id_idx`(`flow_id`),
    INDEX `ticket_flow_condition_source_node_id_idx`(`source_node_id`),
    INDEX `ticket_flow_condition_target_node_id_idx`(`target_node_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_flow_instance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `ticket_id` INTEGER NOT NULL,
    `flow_id` INTEGER NOT NULL,
    `current_node_id` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'RUNNING',
    `started_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ended_at` TIMESTAMP(3) NULL,

    UNIQUE INDEX `ticket_flow_instance_ticket_id_key`(`ticket_id`),
    INDEX `ticket_flow_instance_tenant_id_idx`(`tenant_id`),
    INDEX `ticket_flow_instance_flow_id_idx`(`flow_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_flow_instance_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `instance_id` INTEGER NOT NULL,
    `from_node_id` INTEGER NULL,
    `to_node_id` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `payload` JSON NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NULL,

    INDEX `ticket_flow_instance_history_tenant_id_idx`(`tenant_id`),
    INDEX `ticket_flow_instance_history_instance_id_idx`(`instance_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `department` ADD CONSTRAINT `department_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department` ADD CONSTRAINT `department_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `position` ADD CONSTRAINT `position_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_position` ADD CONSTRAINT `user_position_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_position` ADD CONSTRAINT `user_position_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_avatar_file_id_fkey` FOREIGN KEY (`avatar_file_id`) REFERENCES `file_asset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role` ADD CONSTRAINT `role_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permission` ADD CONSTRAINT `permission_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu` ADD CONSTRAINT `menu_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu` ADD CONSTRAINT `menu_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `menu`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu` ADD CONSTRAINT `menu_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `terminal_session` ADD CONSTRAINT `terminal_session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operation_log` ADD CONSTRAINT `operation_log_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dictionary_group` ADD CONSTRAINT `dictionary_group_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dictionary_item` ADD CONSTRAINT `dictionary_item_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `dictionary_group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notice_template` ADD CONSTRAINT `notice_template_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notice` ADD CONSTRAINT `notice_template_id_fkey` FOREIGN KEY (`template_id`) REFERENCES `notice_template`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notice` ADD CONSTRAINT `notice_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_flow_id_fkey` FOREIGN KEY (`flow_id`) REFERENCES `ticket_flow`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_flow` ADD CONSTRAINT `ticket_flow_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_flow_node` ADD CONSTRAINT `ticket_flow_node_flow_id_fkey` FOREIGN KEY (`flow_id`) REFERENCES `ticket_flow`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_flow_condition` ADD CONSTRAINT `ticket_flow_condition_flow_id_fkey` FOREIGN KEY (`flow_id`) REFERENCES `ticket_flow`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_flow_instance` ADD CONSTRAINT `ticket_flow_instance_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `ticket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_flow_instance` ADD CONSTRAINT `ticket_flow_instance_flow_id_fkey` FOREIGN KEY (`flow_id`) REFERENCES `ticket_flow`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_flow_instance` ADD CONSTRAINT `ticket_flow_instance_current_node_id_fkey` FOREIGN KEY (`current_node_id`) REFERENCES `ticket_flow_node`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_flow_instance_history` ADD CONSTRAINT `ticket_flow_instance_history_instance_id_fkey` FOREIGN KEY (`instance_id`) REFERENCES `ticket_flow_instance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
