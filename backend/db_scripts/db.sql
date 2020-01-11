DROP TABLE IF EXISTS `mobile_pay_visual`;
CREATE TABLE `mobile_pay_visual` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(256) NOT NULL DEFAULT '' COMMENT '交易类型',
  `level_1_pv` int(11) NOT NULL DEFAULT 0 COMMENT '一级访问次数pv',
  `level_2_pv` int(11) NOT NULL DEFAULT 0 COMMENT '二级访问次数pv',
  `level_3_pv` int(11) NOT NULL DEFAULT 0 COMMENT '三级访问次数pv',
  `level_1_uv` int(11) NOT NULL DEFAULT 0 COMMENT '一级独立用户访问数uv',
  `level_2_uv` int(11) NOT NULL DEFAULT 0 COMMENT '二级独立用户访问数uv',
  `level_3_uv` int(11) NOT NULL DEFAULT 0 COMMENT '三级独立用户访问数uv',

  `transaction_count` int(11) NOT NULL DEFAULT 0 COMMENT '交易笔数',
  `transaction_at` float(20,2) NOT NULL DEFAULT 0.00 COMMENT "交易金额",
  `transaction_user_count` int(11) NOT NULL DEFAULT 0 COMMENT '交易用户数量',
  `transaction_new_user_count` int(11) NOT NULL DEFAULT 0.00 COMMENT "当日新交易用户数量",

  `yesterday_remain_user_count` int(11) NOT NULL DEFAULT 0 COMMENT "昨天留存用户数量",
  `seven_days_remain_user_count` int(11) NOT NULL DEFAULT 0 COMMENT '7日留存用户数量',
  `last_month_remain_user_count` int(1) NOT NULL DEFAULT 0 COMMENT "上个月留存用户数量",

  `part_dt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT "当日日期partition_date",

  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL DEFAULT 0,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_uni` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
