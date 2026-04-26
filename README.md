# 業務適応ストレスチェック（簡易版）

環境適応評価機構（EAEO）による、業務環境への適応傾向とストレス耐性を評価するWebアプリケーション。

## 🎯 機能

- **8問の5段階評価アンケート** - 実在しそうな診断サイトとして自然な設計
- **3種類の通常結果**
  - 安定適応型（TYPE-A）
  - バランス型（TYPE-B）
  - 負荷感受型（TYPE-C）
- **1種類の異質結果** - 特定条件を満たすと表示される「運用最適型（UNIT-7）」
- **レーダーチャート可視化** - 8つの能力値をグラフ表示
- **レスポンシブデザイン** - スマホ・タブレット対応

## 🔄 異質結果の表示条件

以下の設問で特定の回答パターンを満たす場合、通常結果の代わりに「UNIT-7（運用最適型）」が表示されます：

- Q2（指示受容性）、Q3（単独作業）、Q6（感情安定）、Q7（孤立耐性）、Q8（継続性）中、**4項目以上が「4」以上**
- かつ Q1（集中力）+ Q4（冷静さ）の合計が **7以上**

## 🚀 デプロイ方法

### Cloudflare Pages へのデプロイ

1. このリポジトリが GitHub に推奨されます
2. Cloudflare Pages で「GitHub を接続」を選択
3. リポジトリを選択してデプロイ

### ローカルで確認

```bash
# シンプルな HTTP サーバーを起動
python3 -m http.server 8000

# または
npx http-server
```

## 📁 ファイル構成

```
stress-check-diagnostic/
├── index.html          # メインページ
├── styles.css          # スタイルシート
├── script.js           # フロントエンドロジック
├── data.js             # 質問・結果データ
├── _redirects          # Cloudflare Pages設定
├── assets/             # 画像（SVG）
│   ├── logo.svg
│   ├── char-stable.svg
│   ├── char-balance.svg
│   ├── char-sensitive.svg
│   └── char-unit7.svg
└── README.md
```

## 📌 R2 画像対応

画像は `/r2/` パスから読み込まれるよう設計されています。

```javascript
const R2_BASE = "/r2/";

function resolveAssetPath(path) {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  return R2_BASE + path.replace(/^\/+/, "");
}
```

Cloudflare R2 にアップロードする際は、`/r2/` ディレクトリ配下に画像を配置してください。

## ⚙️ カスタマイズ

### 質問の追加/変更

`data.js` の `QUESTIONS` 配列を編集してください。

### 結果テンプレートの変更

`data.js` の `NORMAL_RESULTS` または `ABNORMAL_RESULT` を編集してください。

### 異質結果の条件変更

`script.js` の `checkAbnormalCondition()` 関数を編集してください。

## 🎨 デザイン

- **配色**: 白基調 + 青・グレー（信頼感・清潔感）
- **フォント**: システムフォント（-apple-system, BlinkMacSystemFont, Segoe UI）
- **イラスト**: シンプルなSVG形式

## ⚠️ 注意事項

- 本プログラムは参考情報として提供されます
- 医学的診断ではございません
- 異質結果は演出的な要素が含まれています

## 📜 ライセンス

MIT License

## 👤 作成者

EAEO（Environmental Adaptation Evaluation Organization）