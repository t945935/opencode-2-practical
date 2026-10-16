# L07 建立隔離 worktree 並移動工作階段

狀態：操作驗證通過。對應書籍第 07 章，主題：API 與 client。

## 前置條件

已提交基線的 Git repo、指定版 client/API。

## 任務提示草案

> 建立 payment-retry worktree，將工作階段移入後才開始修改。

提示只是任務說明，實際流程仍需完成前置設定與章節步驟。

## 預定交付

worktree 列表、session 位置、git diff。

## 完成判準

修改出現在新 worktree；原始工作區未混入該變更。

## 失敗與復原

確認移動生效再執行後續任務；記錄乾淨基線供復原。

## 測試範圍

本機 Git。精確工具版號、模型與目前結果見版本狀態；未列出的延伸尚未驗證。

## 0.2.0 驗證狀態

狀態：`operation_verified`。精確驗證範圍與待修項目見 [版本狀態](../../docs/versions.md)。
