# 0.3.0 實作補充

所有命令從配套根目錄執行。先完成 `npm ci`；模型流程使用你自己的登入及可用模型。

## 第三章：原始起點與完成版

```sh
node scripts/prepare-first-task.mjs ../first-task
node scripts/prepare-first-task.mjs ../first-task-complete --completed
```

兩個目錄都必須不存在。分別進入執行 `npm test`：起點 4 項、完成版 5 項。自行建立 Git 基線；完成版供行為比較，不是唯一合法寫法。

## L04：原始資料彙整

`snippets/error-digest.codemode.js` 在 OpenCode 的 execute／Code Mode 中使用。它含頂層 return 與工具目錄呼叫，不能直接 `node` 執行。取得 issues 與 errors 後關聯、加總並排序；預期最高 27、總計 49、兩筆未關聯事件。

## L07：worktree 模型成果

練習 repo 必須已有提交。先在 permissions 加入只允許編輯 `WORKTREE-NOTE.md` 的例外並提交，再使用：

```sh
export ISSUEDESK_MODEL='你的供應商/你的模型'
node examples/worktree.mjs /練習repo --execute
```

不加 `--execute` 只建立及移動工作。每次執行都建立新 worktree。核對返回位置、檔案及原目錄沒有相同新增；保存差異後才清理。

## L08：巡檢

```sh
node examples/daily-review.mjs /練習repo ./runs/manual-review
```

需要 `ISSUEDESK_MODEL`。預設連到本機服務；指定服務可用 `ISSUEDESK_SERVER_URL` 與 `ISSUEDESK_SERVER_PASSWORD`，勿在公開報告列印認證。

先手動驗證，再由自己的排程器觸發。固定 Node 絕對路徑、工作目錄、必要環境與日誌。本書只驗證一次性 systemd 觸發，未提供已安裝的每日排程。檢查報告、退出碼與鎖，再停用練習計時器。

## L09：部署外掛

```sh
node scripts/configure-plugin.mjs ../plugin-practice
```

設定指向 `plugins/deployment` 目錄。進入新目錄以指定版 OpenCode 載入後，實際查詢 api、worker；unknown 應在輸入驗證層失敗。資料全部虛構。函式測試不等於載入驗收。

## L10：終端面板

來源：`plugins/task-panel/tui.tsx`。在自己的專用 `$XDG_CONFIG_HOME/opencode/cli.json` 合併外掛目錄到 plugins；不要覆寫原設定。畫面、切換與重載尚待實測。

## L11／L12：SDK

```sh
export ISSUEDESK_MODEL='你的供應商/你的模型'
export ISSUEDESK_DATABASE='/自己的既有練習資料庫/opencode.db'
bun examples/sdk-maintenance.mjs /練習repo
bun examples/sdk-maintenance.mjs /練習repo --execute --request /自己的任務文字檔
bun examples/sdk-docs.mjs /文件副本 --execute
```

資料庫必須是自己已登入的專用練習資料；不要建立空檔或複製他人登入。未設定資料庫時使用 SDK 預設記憶體資料庫，不會自動取得另一資料庫的登入。

不加 `--execute` 只做結構檢查。維護入口預設只審查；要實際修改，使用明確任務卡。文件入口預設只整理 Markdown，亦接受 `--request` 以虛構資料測試拒絕路徑。取消與強制終止尚待驗收。

## 第十二章：本機整合基線

```sh
node scripts/integration-check.mjs ../integration-output
```

輸出目錄必須不存在。此命令直接驗證本機資料、建單重跑及彙整，不呼叫模型。OpenCode 模型與完整整合流程需要另存證據。
