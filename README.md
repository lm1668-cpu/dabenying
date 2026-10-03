# 裝修師傅互助大本營：搵工請人自助刊登網站

純靜態網站（HTML／CSS／JS），唔使 build，經 GitHub Pages 發布。
營運者：裝修師傅互助大本營。

## 檔案結構
```
index.html        首頁（自行刊登、工種、分區、背景、刊登須知、頁腳）
privacy.html      私隱政策及收集個人資料聲明
terms.html        使用條款及免責聲明
404.html          搵唔到頁面
css/style.css     樣式
js/config.js      字眼、Google 表格網址、WhatsApp 號碼及預填字、頻道連結
js/main.js        工種篩選、睇大圖、內嵌表格、WhatsApp 連結
assets/           圖片（thumbs/ 係縮細版本）
_config.yml       GitHub Pages 設定（排除 README.md、_preview、_excluded，唔發布）
```

## 本機預覽
```bash
mkdir -p /tmp/ghp && ln -sfn "$PWD" /tmp/ghp/dabenying
cd /tmp/ghp && python3 -m http.server 8000
# 首頁：http://localhost:8000/dabenying/
```

## 注意
- 唔好加 `.nojekyll`：GitHub Pages 要經 Jekyll 先會跟 `_config.yml` 排除 README.md，並略過 `_` 開頭嘅資料夾。
- 頁面上「表格會問咩？」清單要同 Google 表格欄位一致；改表格就要同步改 index.html 同 privacy.html。
- 唔好放任何 WhatsApp 群組／社群邀請連結。
