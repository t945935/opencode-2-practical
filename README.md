# OpenCode 2.0 新功能實戰｜讀者配套

**掌握六大升級，從第一個任務到多代理協作**

作者：Happy eBook Authors  
出版者：Happy eBook

這裡是本書的讀者資料下載與勘誤入口。這是獨立教材專案，非 OpenCode 官方資料庫。

## 目前提供什麼

目前為 **製作中配套 0.3.0**：提供 IssueDesk 資料處理、真正的 MCP server、自動測試、API／SDK 範例及外掛草稿。OpenCode 2.0.30 的 Code Mode／MCP、worktree 修改、部署工具及兩個 SDK 正向流程已完成模型驗證；唯讀巡檢另通過手動與一次性排程。**跨介面、第二主機、背景調度、終端面板及取消等仍有未驗收項目，這不是完整書籍第一版配套。**

可先執行 `npm ci`、`npm test`、`node scripts/mcp-smoke.mjs`。模型任務需要另行設定 OpenCode 與可用帳號；詳見 [開始使用](docs/getting-started.md)。

| 主題 | 案例 | 規劃內容 |
|---|---|---|
| 共用背景服務 | L01–02 | 跨介面接續、遠端主機工作 |
| Code Mode | L03–04 | 問題轉待辦、錯誤彙整 |
| 背景任務 | L05–06 | 背景審查、測試期間繼續工作 |
| API 與 client | L07–08 | worktree 任務、外部排程巡檢 |
| 外掛 | L09–10 | 部署狀態工具、終端資訊面板 |
| SDK | L11–12 | 維護請求應用、文件助理 |

新增第 10、11、13、14 章的 [四個章末練習](exercises/README.md)：權限拒絕、設定遷移與回復、損毀資料診斷、升級回歸。另有第 3 章入門與第 12 章整合專案；核心案例仍為 12 個。

完整目錄見 [案例索引](docs/case-index.md)，目前進度見 [版本狀態](docs/versions.md)。

## 下載

- 不使用 Git：點選本頁 **Code → Download ZIP**，或[下載目前主分支 ZIP](https://github.com/t945935/opencode-2-practical/archive/refs/heads/main.zip)。
- 使用 Git：

```sh
git clone https://github.com/t945935/opencode-2-practical.git
cd opencode-2-practical
```

主分支內容會更新。正式書籍完成後將提供 `book-v1.0.0` 對應版本，目前尚未發布該版本。書籍版本與 OpenCode 軟體版本分開記錄。

## 從哪裡開始

1. 閱讀 [開始使用](docs/getting-started.md)。
2. 複製 [任務卡](templates/task-card.md)及[驗證紀錄](templates/verification-record.md)到自己的練習目錄。
3. 查看 [虛構問題資料](fixtures/issues.json)與[錯誤資料](fixtures/errors.json)。
4. 依[案例索引](docs/case-index.md)確認材料狀態；尚未完成的案例不能只貼提示就視為跑通。

## 問題回報

請至 [Issues](https://github.com/t945935/opencode-2-practical/issues) 提供章節／案例 ID、配套版本、OpenCode 版本、作業系統、重現步驟與去除私人資訊的錯誤片段。不要附模型金鑰、認證檔或完整環境變數。

閱讀 [使用說明](USAGE.md) 與 [變更紀錄](CHANGELOG.md)。本庫提供配套資料；完整付費書稿、正式書籍檔案與出版內部資料不包含在內。
