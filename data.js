const QUESTIONS = [
  { id: 1, text: "長時間の作業でも集中力を維持することができる" },
  { id: 2, text: "上司や指導者からの指示に従うことに抵抗がない" },
  { id: 3, text: "他者と関わらずに独立して作業することを好む" },
  { id: 4, text: "突発的なトラブルが発生しても冷静に対応できる" },
  { id: 5, text: "職場の環境が変わっても比較的早く適応できる" },
  { id: 6, text: "感情の起伏が少なく、常に落ち着いている" },
  { id: 7, text: "他者と関わらない時間が長くても苦にならない" },
  { id: 8, text: "指示が明確であれば、継続的に安定して作業できる" }
];

const NORMAL_RESULTS = {
  stable: {
    type: "stable",
    title: "安定適応型",
    code: "TYPE-A",
    character: "char-stable.svg",
    description: `あなたは業務環境への適応能力が高く、比較的安定した状態で業務を遂行できるタイプです。予測可能な環境下では高いパフォーマンスを発揮し、日々のルーティン業務を着実にこなせる傾向があります。チームの中では信頼できるメンバーとして評価されることが多いでしょう。`,
    features: [
      "継続的な業務に強く、安定した成果を提供できる",
      "既定のルールや手順に従うことが得意",
      "落ち着きがあり、周囲の変化にも柔軟に対応できる"
    ],
    scales: { concentration: 70, obedience: 65, solitude: 60, calmness: 75, adaptability: 70, emotionalStability: 68, independence: 62, consistency: 72 },
    advice: `あなたのような特性を活かすには、責任感を持って継続的な役割を任せられる環境が理想的です。新しいチャレンジへの不安があれば、段階的にステップアップすることで、さらに幅広い業務に対応できるようになるでしょう。`
  },
  balance: {
    type: "balance",
    title: "バランス型",
    code: "TYPE-B",
    character: "char-balance.svg",
    description: `あなたは業務への適応と対人関係の両面でバランスの取れたタイプです。独立した作業と協働作業の双方に対応でき、状況に応じて柔軟に対応できる強みがあります。チームの一員として機能しながら、個人の責任も果たせる貴重なメンバーです。`,
    features: [
      "チームワークと個人作業の両方で適応できる柔軟性がある",
      "適度なストレス耐性を備え、多様な環境に対応できる",
      "対人スキルと自律性のバランスが良い"
    ],
    scales: { concentration: 68, obedience: 62, solitude: 50, calmness: 66, adaptability: 72, emotionalStability: 65, independence: 65, consistency: 68 },
    advice: `あなたのバランス感覚を最大限に活かすには、多様な経験を積むことがお勧めです。リーダーシップの育成やプロジェクトマネジメントなど、新しい領域でのチャレンジに向いています。`
  },
  sensitive: {
    type: "sensitive",
    title: "負荷感受型",
    code: "TYPE-C",
    character: "char-sensitive.svg",
    description: `あなたは環境の変化や対人関係に敏感で、それに応じて対応を調整するタイプです。周囲の状況をよく察知でき、きめ細かい配慮ができる一面がある反面、ストレスに対して反応しやすい傾向があります。`,
    features: [
      "環境や人間関係の微妙な変化に気づきやすく、適応的に対応できる",
      "共感能力が高く、チームの雰囲気に貢献できる",
      "ストレスを感じやすいため、自己ケアと環境調整が大切"
    ],
    scales: { concentration: 55, obedience: 58, solitude: 45, calmness: 52, adaptability: 62, emotionalStability: 50, independence: 48, consistency: 60 },
    advice: `あなたの特性を活かすには、サポート体制が充実した環境が重要です。自分のペースで進められる業務や、興味のある領域での活動を意識的に増やすことで、モチベーションが高まり、より良いパフォーマンスを発揮できるようになるでしょう。`
  }
};

const ABNORMAL_RESULT = {
  type: "unit7",
  title: "UNIT-7",
  subtitle: "運用最適型",
  code: "UNIT-007",
  character: "char-unit7.svg",
  description: `評価対象は極めて高い一貫性と自律的継続能力を示します。指示受容性、孤立作業適性、感情変動の最小化、および外部要因への耐性がすべてにおいて最上位水準に達しています。このプロファイルは、長期継続稼働および一定条件下での最適パフォーマンスに特化した構成を示唆しています。`,
  features: [
    "指示受容性：極めて高い",
    "単独稼働適性：極めて高い",
    "外部要因の影響：最小限"
  ],
  keyMetrics: [
    "継続稼働時間：無制限",
    "感情変動幅：0.2% 以内",
    "指示順守率：99.8%"
  ],
  conclusion: `現在の特性構成は既に最適化されている状態です。追加的な調整やカウンセリングは不要と判定されます。`,
  extra: `<div style="margin-top: 1rem; padding: 1rem; background: #f0f0f0; border-radius: 6px; font-size: 0.85rem; line-height: 1.6; color: #666;"><p>注記：本評価は標準的な人間開発モデルの外に位置しています。</p><p>このプロファイルが示す特性は、限定的な運用環境において非常に高い効率性をもたらします。</p></div>`,
  scales: { concentration: 100, obedience: 98, solitude: 95, calmness: 100, adaptability: 92, emotionalStability: 99, independence: 97, consistency: 100 }
};

const SCALE_LABELS = {
  concentration: "集中継続力",
  obedience: "指示受容性",
  solitude: "単独作業適性",
  calmness: "情動安定性",
  adaptability: "環境適応力",
  emotionalStability: "感情変動",
  independence: "独立作業力",
  consistency: "一貫性"
};