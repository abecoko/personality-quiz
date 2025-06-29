# 3分でわかる！"わたし診断" 

直感式7問クイズで「あなたは今どれだけプロファイリングを必要としているか？」を判定し、結果に基づいて適切なアドバイスを提供するWebアプリケーションです。

## 🚀 セットアップ

### 基本セットアップ（すぐに始められます）

1. **ファイルをダウンロード**
   - `index.html`
   - `style.css` 
   - `script.js`
   - `README.md`

2. **ブラウザで開く**
   - `index.html` をダブルクリック、またはブラウザにドラッグ&ドロップ
   - **それだけです！** 追加のインストールは不要

### 推奨環境
- Chrome 80+
- Safari 13+
- Firefox 75+
- Edge 80+
- モバイル対応（iOS Safari, Android Chrome）

## ⚙️ カスタマイズ

### 1. LINE URL の変更

`script.js` の 2行目を編集：

```javascript
const LINE_URL = 'https://lin.ee/your-line-url'; // ← ここを変更
```

### 2. 質問内容の変更

`script.js` の `QUESTIONS` 配列を編集：

```javascript
const QUESTIONS = [
    {
        id: 1,
        text: "あなたの質問文",
        type: "likert", // likert, multiple, yesno, emoji
        options: [
            { text: "選択肢1", value: 0 },
            { text: "選択肢2", value: 1 },
            // ...
        ]
    },
    // 他の質問...
];
```

**質問タイプ：**
- `likert`: 5段階評価（😄〜😫）
- `multiple`: 複数選択肢
- `yesno`: はい/いいえ
- `emoji`: 絵文字選択

### 3. スコアリングの調整

`script.js` の `displayResult()` 関数を編集：

```javascript
if (totalScore >= 22) {
    // Rank A の設定
} else if (totalScore >= 12) {
    // Rank B の設定  
} else {
    // Rank C の設定
}
```

### 4. デザインの変更

`style.css` のカラー変数を編集：

```css
/* メインカラー（オレンジ系） */
background: linear-gradient(45deg, #FF8B72, #FFB74D);

/* セカンダリカラー（紫系） */
background: linear-gradient(45deg, #9C27B0, #BA68C8);

/* アクセントカラー（緑系） */
background: linear-gradient(45deg, #00C300, #00E600);
```

### 5. Pexels API の設定（オプション）

ヒーロー画像を動的に取得したい場合：

1. [Pexels](https://www.pexels.com/api/) でAPIキーを取得
2. `script.js` の 3行目を編集：

```javascript
const PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY'; // ← APIキーを入力
```

## 🌐 デプロイ方法

### GitHub Pages

1. **GitHubリポジトリを作成**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **GitHub Pages を有効化**
   - リポジトリの Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - URL: `https://yourusername.github.io/your-repo/`

### Netlify

1. **Netlifyにサインアップ**
2. **新しいサイトを作成**
   - "Deploy manually" を選択
   - ファイルをドラッグ&ドロップ
   - 自動でURLが生成されます

### Vercel

1. **Vercelにサインアップ** 
2. **新しいプロジェクトを作成**
   - GitHubリポジトリを接続
   - 自動デプロイが設定されます

## 📱 PWA対応（オプション）

より本格的なアプリ体験を提供したい場合：

1. **manifest.json を作成**：
```json
{
  "name": "わたし診断",
  "short_name": "わたし診断",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FF8B72",
  "theme_color": "#FF8B72",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

2. **Service Worker を有効化**：
`script.js` の最下部にコードが含まれています。

## 🎨 デザインガイド

### カラーテーマ
- **Primary**: #FF8B72 (コーラルオレンジ)
- **Secondary**: #FFB74D (ゴールデンイエロー)
- **Accent**: #9C27B0 (ディープパープル)
- **Success**: #00C300 (LINE グリーン)

### フォント
- **メイン**: Nunito (Google Fonts)
- **ウェイト**: 400, 600, 700, 800

### レスポンシブブレークポイント
- **Mobile**: 320px〜480px
- **Tablet**: 481px〜768px
- **Desktop**: 769px以上

## 🔧 高度なカスタマイズ

### アニメーション効果

CSS アニメーションを追加：

```css
@keyframes customBounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-10px);
    }
    60% {
        transform: translateY(-5px);
    }
}

.custom-animation {
    animation: customBounce 2s infinite;
}
```

### 多言語対応

`script.js` に言語設定を追加：

```javascript
const LANGUAGES = {
    ja: {
        title: "3分でわかる！\"わたし診断\"",
        start: "スタート ▶︎"
    },
    en: {
        title: "3-Minute Personality Quiz",
        start: "Start ▶︎"
    }
};
```

### Google Analytics

HTMLの `<head>` に追加：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 📊 パフォーマンス最適化

### 画像最適化
- WebP形式を使用
- 適切なサイズにリサイズ
- lazy loading を実装

### CSS最適化
- 不要なスタイルを削除
- CSSファイルを圧縮
- Critical CSS をインライン化

### JavaScript最適化
- 不要な機能を削除
- ファイルを圧縮
- async/defer を使用

## 🛠️ トラブルシューティング

### よくある問題

**Q: 画像が表示されない**
A: Pexels API キーが正しく設定されているか確認してください。

**Q: スワイプが動作しない**
A: モバイルデバイスでテストしてください。デスクトップでは動作しません。

**Q: LINEボタンが機能しない**
A: `LINE_URL` が正しく設定されているか確認してください。

**Q: 進捗が保存されない**
A: ブラウザの localStorage が有効になっているか確認してください。

### デバッグ方法

ブラウザの開発者ツールを開いて：

1. **Console** タブでエラーを確認
2. **Network** タブでリソースの読み込み状況を確認
3. **Application** タブで localStorage の内容を確認

## 📄 ライセンス

この項目は **CC BY-SA (Creative Commons Attribution-ShareAlike)** ライセンスの下で提供されています。

- ✅ 商用利用可
- ✅ 改変可
- ✅ 再配布可
- ⚠️ 同一ライセンス継承必須
- ⚠️ 著作者表示必須

## 🤝 コントリビューション

改善案やバグ報告は Issue または Pull Request でお願いします。

## 📞 サポート

技術的な質問やサポートが必要な場合は、以下の方法でお問い合わせください：

- **GitHub Issues**: バグ報告・機能リクエスト
- **Email**: support@example.com
- **LINE**: @your-line-account

---

**免責事項**: この診断ツールは娯楽目的で作成されており、医療・心理学的な診断には使用できません。