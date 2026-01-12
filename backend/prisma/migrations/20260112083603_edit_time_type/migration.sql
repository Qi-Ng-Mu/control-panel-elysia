-- AlterTable
ALTER TABLE `file_asset` MODIFY `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    MODIFY `updated_at` TIMESTAMP(3) NOT NULL COMMENT '更新时间',
    MODIFY `deleted_at` TIMESTAMP(3) NULL COMMENT '删除时间(软删除)';

-- AlterTable
ALTER TABLE `menu` MODIFY `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    MODIFY `updated_at` TIMESTAMP(3) NOT NULL COMMENT '更新时间',
    MODIFY `deleted_at` TIMESTAMP(3) NULL COMMENT '删除时间(软删除)';

-- AlterTable
ALTER TABLE `operation_log` MODIFY `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间';

-- AlterTable
ALTER TABLE `permission` MODIFY `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    MODIFY `updated_at` TIMESTAMP(3) NOT NULL COMMENT '更新时间',
    MODIFY `deleted_at` TIMESTAMP(3) NULL COMMENT '删除时间(软删除)';

-- AlterTable
ALTER TABLE `role` MODIFY `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    MODIFY `updated_at` TIMESTAMP(3) NOT NULL COMMENT '更新时间',
    MODIFY `deleted_at` TIMESTAMP(3) NULL COMMENT '删除时间(软删除)';

-- AlterTable
ALTER TABLE `role_permission` MODIFY `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间';

-- AlterTable
ALTER TABLE `session` MODIFY `issued_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '签发时间',
    MODIFY `expires_at` TIMESTAMP(3) NOT NULL COMMENT '过期时间',
    MODIFY `revoked_at` TIMESTAMP(3) NULL COMMENT '撤销时间',
    MODIFY `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间';

-- AlterTable
ALTER TABLE `system_config` MODIFY `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    MODIFY `updated_at` TIMESTAMP(3) NOT NULL COMMENT '更新时间',
    MODIFY `deleted_at` TIMESTAMP(3) NULL COMMENT '删除时间(软删除)';

-- AlterTable
ALTER TABLE `terminal_session` MODIFY `last_active_at` TIMESTAMP(3) NULL COMMENT '最后活跃时间',
    MODIFY `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    MODIFY `updated_at` TIMESTAMP(3) NOT NULL COMMENT '更新时间',
    MODIFY `deleted_at` TIMESTAMP(3) NULL COMMENT '删除时间(软删除)';

-- AlterTable
ALTER TABLE `user` MODIFY `last_login_at` TIMESTAMP(3) NULL COMMENT '最后登录时间',
    MODIFY `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    MODIFY `updated_at` TIMESTAMP(3) NOT NULL COMMENT '更新时间',
    MODIFY `deleted_at` TIMESTAMP(3) NULL COMMENT '删除时间(软删除)';

-- AlterTable
ALTER TABLE `user_role` MODIFY `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间';
