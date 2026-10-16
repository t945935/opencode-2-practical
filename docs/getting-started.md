# 開始使用

配套版本 0.3.0，書籍製作中。先在獨立目錄驗證本機資料與 MCP，再進入模型任務。

## 已測環境

Linux、Node 24.21.0、Bun 1.4.3、OpenCode CLI 2.0.30；三個 OpenCode 套件鎖定 2.0.30。Node 可跑資料測試與 MCP；SDK 探測使用 Bun。尚未驗證 Windows 與 macOS。

部分終端相關間接相依套件對 Node 版本有更高要求；安裝警告不能當作所有功能已相容。使用 SDK／終端範例前先確認自己的執行環境。

## 本機驗證，不呼叫模型

在本庫根目錄執行：

```sh
npm ci
npm test
node scripts/mcp-smoke.mjs
npm run demo
```

自動測試涵蓋問題輸入、錯誤彙整、重複建單、損毀檔案拒絕與部署狀態查詢函式。MCP smoke test 會啟動真正 stdio server、列舉及呼叫工具，並清理臨時資料。demo 產物位於 runs/，不會提交到 Git。

## L03／L04：連接 OpenCode

先安裝並確認指定版 OpenCode，完成自己的模型登入。在配套根目錄建立新的練習設定：

```sh
node scripts/configure.mjs ../issuedesk-practice
cd ../issuedesk-practice
opencode
```

設定程式會產生指向本庫 MCP server 的絕對路徑；移動配套後應在新練習目錄重新產生設定。若目標已有 opencode.json，程式會停止，避免覆寫既有設定。

在 OpenCode 選用自己有權使用的模型，輸入：

> 使用 issuedesk MCP 工具，列出問題，為所有 open 問題建立待辦，再取得 error_digest。請實際呼叫工具，不要讀寫其他檔案或使用 shell。回報新增數與最高錯誤次數。

空白起點應新增 5 筆待辦；再輸入同一任務應新增 0 筆。檢查 runs/todos.json 總數仍為 5。最高錯誤次數應是 ISS-102 的 27 次。若已有資料，首輪新增數會不同；使用新的練習目錄可重現空白起點。

本書測試模型為 openai/gpt-6.1-sol，並不保證每個帳號都有該模型。請使用自己可用的模型並記錄差異，模型任務可能產生費用。

## 其他程式的狀態

examples/client-session.mjs 與 worktree.mjs 提供 client 路線。連線預設使用 Service.ensure；可用 ISSUEDESK_SERVER_URL 與 ISSUEDESK_SERVER_PASSWORD 指定服務，勿將密碼提交至 Git。

SDK 的 `bun scripts/sdk-probe.mjs` 只驗證 host 建立、工作階段與關閉，不發送模型請求。SDK examples 的 --execute 會使用模型，須先指定模型與自己的登入資料來源；程式修改、文件修訂與非文件拒絕已有實測。部署外掛的目錄入口已通過實際查詢與錯誤輸入測試；終端面板仍待畫面驗收。操作見[新版實作補充](formal-rewrite-labs.md)。

每項案例的驗證範圍見 [版本狀態](versions.md)。不要把模型回答「做完」單獨當作完成證據。

## 章末演練

前往 [章末練習](../exercises/README.md) 選擇 E10、E11、E13 或 E14。E13 可以直接以 `node scripts/fault-recovery.mjs` 執行；E14 的本機基線可用 `node scripts/regression-report.mjs baseline` 產生。E10 已取得一次真實權限驗證；遷移與跨版本升級仍有未測項目，見版本表。
