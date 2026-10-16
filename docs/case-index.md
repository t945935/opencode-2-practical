# 案例索引

配套 0.2.0：已完成部分實作與實測。下表與 [版本狀態](versions.md) 共同描述目前範圍。

| 案例 | 功能 | 標題 | 狀態 |
|---|---|---|---|
| L01 | 共用背景服務 | [在終端與網頁接續同一個修復任務](../cases/l01-service-session/README.md) | 草稿，待完整驗收 |
| L02 | 共用背景服務 | [從另一台電腦接續開發主機工作](../cases/l02-remote-pairing/README.md) | 草稿，待完整驗收 |
| L03 | Code Mode | [批次整理問題並建立待辦](../cases/l03-issue-triage/README.md) | 模型實測通過 |
| L04 | Code Mode | [彙整錯誤與既有問題的關係](../cases/l04-error-digest/README.md) | 模型實測通過 |
| L05 | 背景任務 | [主代理修改、子代理背景審查](../cases/l05-background-review/README.md) | 草稿，待完整驗收 |
| L06 | 背景任務 | [測試與建置在背景進行](../cases/l06-background-tests/README.md) | 草稿，待完整驗收 |
| L07 | API 與 client | [建立隔離 worktree 並移動工作階段](../cases/l07-worktree-task/README.md) | 操作驗證通過 |
| L08 | API 與 client | [用外部排程建立每日巡檢](../cases/l08-scheduled-review/README.md) | 草稿，待完整驗收 |
| L09 | 外掛 | [新增部署狀態查詢工具](../cases/l09-deployment-plugin/README.md) | 函式已測，載入待修 |
| L10 | 外掛 | [新增終端任務資訊面板](../cases/l10-tui-task-panel/README.md) | 來源草稿，待驗收 |
| L11 | SDK | [嵌入維護請求處理器](../cases/l11-sdk-maintenance-app/README.md) | 僅 host 結構已測 |
| L12 | SDK | [嵌入文件維護助理](../cases/l12-sdk-doc-assistant/README.md) | 僅 host 結構已測 |

## 入門、整合與章末練習

| 章 | 單元 | 計數 |
|---|---|---|
| 3 | 第一個可驗收任務 | 1 個入門練習，重用 IssueDesk 資料 |
| 12 | IssueDesk 維護工作台 | 1 個整合專案，串接既有案例 |
| 10、11、13、14 | [權限、遷移、診斷與升級回歸](../exercises/README.md) | 4 個章末練習，獨立於 L01–L12 |

合計 18 個教學單元，對外維持「12 個核心案例＋1 個整合專案」，另附 4 個章末演練。完整書稿仍在製作中。
