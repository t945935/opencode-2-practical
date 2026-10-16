# E14 建立升級前後的回歸紀錄

對應第 14 章。屬章末練習，不計入 L01–L12 核心案例。

## 目標與基線

以相同檢查比較基線與候選環境。腳本不安裝或更新任何套件、不呼叫模型。在配套根目錄：

```sh
node scripts/regression-report.mjs baseline
```

輸出 runs/regression/<本次名稱>/report.json 及三份日誌。包含本機函式測試、MCP stdio smoke test、E13 故障復原結果，另記 Node、系統、架構、套件宣告與鎖檔雜湊。

## 候選版本

另建配套副本或 worktree，記錄要更換元件的精確舊版／新版，只更改選定變因，安裝後執行：

```sh
node scripts/regression-report.mjs candidate
```

兩個名稱只是標籤；相同環境重跑只算可重現性檢查。請使用各命令輸出的實際檔案路徑，不要假設有固定 baseline.json。

## 必須補記的結果

腳本的 modelTested、opencodeRuntimeTested、actualUpgradeVerified 都是 false。要宣稱升級通過，另記兩個 OpenCode 執行檔的 --version，重做 L03 建單／重跑，再驗證自己需要的外掛、SDK 或背景任務。純本機測試全綠不能代替這些步驟。

## 交付與回復

交付基線及候選報告、版本差異表、模型任務證據及採用／暫緩決定。使用 [共用紀錄](../evidence-template.md)。如果候選失敗，保留日誌，切回先前保留的基線副本；不要直接在唯一工作區降版或覆寫歷史資料。
