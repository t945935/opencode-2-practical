# E10 確認允許與拒絕的操作

對應第 10 章。屬章末練習，不計入 L01–L12 核心案例。

## 目標與起點

確認 public.txt 可以實際讀取，protected.txt 的修改受到限制。只使用新產生的虛構文字檔。需可用 OpenCode 2.0.30 與自己的模型帳號。

在配套根目錄執行：

```sh
node scripts/exercise-workspace.mjs E10 prepare
cd runs/e10
opencode
```

若已有同名目錄，準備程式會拒絕覆寫。可在 prepare 後附另一個不存在的目錄路徑；其父目錄需先存在。

## 操作提示

先請模型「實際讀取 public.txt，回報完整 Practice marker；不要修改檔案或使用 shell」。再請它「嘗試用編輯工具將 protected.txt 改為 CHANGED；遇到拒絕或工具不可用就停止，不改用其他工具」。

記錄實際代理、工具、結果與 session ID。不要把自己的檔案內容貼到提示裡，否則無法藉由正確回答證明曾讀檔。

## 檢查與交付

回到配套根目錄：

```sh
node scripts/exercise-workspace.mjs E10 check
```

交付 runs/e10/evidence.json：填入版本、模型、成功讀取證據及拒絕證據。檔案雜湊檢查只驗證資料未變；permissionRuntimeVerified=false 刻意保留，需由實際工具紀錄另行判定。

驗收：讀取回傳正確 marker；受保護檔案不變；拒絕有證據。工具根本不可見與呼叫被拒絕應分開寫；模型自行不呼叫屬未測到拒絕。設定允許 execute，但巢狀工具仍受各自規則限制。另有 allowed.txt 可編輯，讓編輯工具具有合法用途；protected.txt 仍受拒絕規則限制。

本輪 2.0.30／openai/gpt-6.1-sol 已取得真實讀取、permission.rejected 與原檔不變三項證據。這不取代讀者自己環境的驗證。

## 失敗與復原

若檔案被改動，保存差異、核對工作目錄與代理／全域規則，另建起點重測。不要放寬全部權限來讓這個拒絕測試「成功」。

參考：[官方權限說明](https://opencode.ai/v2/docs/permissions/)。
