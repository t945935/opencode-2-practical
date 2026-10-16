# E11 遷移設定並演練回復

對應第 11 章。屬章末練習，不計入 L01–L12 核心案例。

## 目標與起點

將固定教學設定從 V1 形狀轉成 V2，保留行為並驗證能回復。練習不會讀取或修改真實全域設定。

在配套根目錄：

```sh
node scripts/exercise-workspace.mjs E11 prepare
```

目錄 runs/e11/backup 是原始備份，candidate 是可修改副本，reference 是本題答案。先不看答案，手動修改 candidate/opencode.json：將 permission 的讀取允許、編輯拒絕及 bash 拒絕轉成 permissions 規則，bash 使用 V2 的 shell 名稱；snapshot 轉為 snapshots 並保持 false。

## 檢查轉換

```sh
node scripts/exercise-workspace.mjs E11 check
```

程式驗證固定題目與備份雜湊，不是通用遷移器。檢查通過不表示 OpenCode 已載入或模型行為已測；請將這些狀態另外記入 evidence.json。

## 回復演練

以下複製會覆寫候選練習檔。先另存需要保留的修改差異：

```sh
cp runs/e11/backup/opencode.json runs/e11/candidate/opencode.json
node scripts/exercise-workspace.mjs E11 check-restored
```

交付：轉換檢查、備份未變與回復一致三份結果，以及實際執行檢查的狀態。回復後不應再用 check 要求它符合 V2 答案；應使用 check-restored。

正式設定應另做外掛、API、模型與權限驗證。受支援的舊設定可繼續使用，格式轉換不是採用新版的必要條件。參考：[官方遷移指南](https://opencode.ai/v2/docs/migrate-v1/)。
