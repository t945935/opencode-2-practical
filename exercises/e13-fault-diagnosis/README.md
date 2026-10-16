# E13 診斷損毀資料並保留現場

對應第 13 章。屬章末練習，不計入 L01–L12 核心案例。

## 目標與操作

練習分辨資料層錯誤、保留損毀現場、從備份恢復與重新驗證。無需模型帳號，在配套根目錄執行：

```sh
node scripts/fault-recovery.mjs
```

程式在專用臨時目錄建立一筆 ISS-102 待辦並備份，注入不合法 JSON，再嘗試建立 ISS-101。它使用 lib/issuedesk.mjs 的真正資料函式，捕捉解析錯誤並檢查損毀內容未被覆寫，接著恢復備份與驗證去重。結束清理的範圍僅限它自行建立的臨時目錄。

## 驗收

- observedError 為 SyntaxError，damagedDataPreserved 為 true。
- restoredTodos 為 1；duplicateCreatedAfterRestore 為 false。
- 任一斷言失敗即以非零退出，不會宣稱 passed。

這是本機儲存層的實測，不代表模型／MCP／OpenCode 權限已通過。對照 scripts/fault-recovery.mjs 與 lib/issuedesk.mjs，說明為何損毀檔不能當成空清單。

## 交付與延伸

依 [共用紀錄](../evidence-template.md) 填寫症狀、假設、證據、根因、恢復方式與重測結果。延伸題是在自己的副本改用合法 JSON 物件，觀察結構不符與語法錯誤的差別。

本例有可信備份；真實資料沒有備份時先保存原檔，不把清空檔案當成通用修復。
