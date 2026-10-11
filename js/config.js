/* 網站設定：字眼同連結 */
window.SITE_CONFIG = {
  /* 私隱用途字眼 */
  privacyPurpose: "資料只用嚟做配對及大本營社群服務",

  /* Google 表格網址 */
  forms: {
    job:  { // 搵工帖（師傅）
      view:  "https://docs.google.com/forms/d/e/1FAIpQLSeG13Gx7GkR9XG0fY4UXaYwn72jvsOt3nEDm5N6YC7KPaYRkw/viewform",
      embedHeight: 2600
    },
    hire: { // 請人帖（判頭／公司）
      view:  "https://docs.google.com/forms/d/e/1FAIpQLScOG1ZGGuq9aGty_U54Nu69eXU1f5ogrz2X4lX76DQJmZZEhw/viewform",
      embedHeight: 2700
    }
  },

  /* 大本營主社群邀請（想加入社群 CTA；已批 CH4／CH6／FB7） */
  communityInviteUrl: "https://chat.whatsapp.com/LnsoTrqgQyxF3Uh8mT8bo4",

  /* WhatsApp 管理員查詢（刊登規則及其他；非入群 CTA） */
  whatsappNumber: "85261791102",
  whatsappText: {
    job:     "你好，我想查詢點樣自己刊登搵工帖。",
    hire:    "你好，我想查詢點樣自己刊登請人帖。",
    general: "你好，我想查詢香港裝修師傅大本營。"
  },

  /* 公開 WhatsApp 頻道 */
  channelUrl: "https://whatsapp.com/channel/0029Vb9TRu9HrDZgRprAdf1c",

  /**
   * 最新請人／搵工公開板（Form → Apps Script「公開板」→ doGet JSONP）
   * Kelvin 批准部署 Web App（任何人）後，把兩條 /exec URL 填入 feeds；
   * 未填時用 sample 本地預覽。唔好喺瀏覽器放 Sheet secret。
   */
  board: {
    enabled: true,
    feeds: {
      find_job: "https://script.google.com/macros/s/AKfycby32uCXyRfr7iLTLqJ185pPpkpViuGOpSaRi3U9nSWgBUVWg1A4LrfylW_-abmRjCXcMA/exec",
      hire: "https://script.google.com/macros/s/AKfycbzoq3tvW_3ilooCyhCk9gmdi1KZNRYZevVDVEZMGpX901ANHyMZid6f0Kt27iKh7EOpYQ/exec"
    },
    useSampleWhenEmpty: true,
    sampleUrl: "assets/board/sample_feed.json"
  }
};
