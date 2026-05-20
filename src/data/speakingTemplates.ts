export interface SpeakingTemplate {
  id: string;
  scenario: string;
  scenarioIcon: string;
  expressions: ExpressionTemplate[];
}

export interface ExpressionTemplate {
  id: string;
  english: string;
  chinese: string;
  blanks?: { position: number; placeholder: string }[];
  tips?: string;
}

export const speakingTemplates: SpeakingTemplate[] = [
  {
    id: 'greeting',
    scenario: '问候与介绍',
    scenarioIcon: '👋',
    expressions: [
      { id: 'g1', english: 'Hello, my name is ____.', chinese: '你好，我叫____。', tips: '自我介绍的基本句型' },
      { id: 'g2', english: 'Nice to meet you.', chinese: '很高兴认识你。', tips: '初次见面常用语' },
      { id: 'g3', english: 'How are you doing today?', chinese: '你今天过得怎么样？', tips: '询问近况' },
      { id: 'g4', english: "I'm doing great, thanks for asking.", chinese: '我过得很好，谢谢关心。', tips: '回答近况' },
      { id: 'g5', english: "What do you do for a living?", chinese: '你是做什么工作的？', tips: '询问职业' },
    ],
  },
  {
    id: 'restaurant',
    scenario: '餐厅点餐',
    scenarioIcon: '🍽️',
    expressions: [
      { id: 'r1', english: "I'd like to have ____, please.", chinese: '我想要____，谢谢。', tips: '点餐基本句型' },
      { id: 'r2', english: 'Could I see the menu, please?', chinese: '可以给我看看菜单吗？', tips: '索要菜单' },
      { id: 'r3', english: 'What do you recommend?', chinese: '你有什么推荐的吗？', tips: '询问推荐' },
      { id: 'r4', english: 'Is this dish spicy?', chinese: '这道菜辣吗？', tips: '询问口味' },
      { id: 'r5', english: 'Could I have the bill, please?', chinese: '请给我账单，谢谢。', tips: '结账' },
      { id: 'r6', english: "I'm allergic to ____.", chinese: '我对____过敏。', tips: '告知过敏' },
    ],
  },
  {
    id: 'shopping',
    scenario: '购物',
    scenarioIcon: '🛍️',
    expressions: [
      { id: 's1', english: 'How much is this?', chinese: '这个多少钱？', tips: '询问价格' },
      { id: 's2', english: 'Do you have this in a different size?', chinese: '这个有其他尺码吗？', tips: '询问尺码' },
      { id: 's3', english: 'Can I try this on?', chinese: '我可以试穿吗？', tips: '请求试穿' },
      { id: 's4', english: "I'll take it.", chinese: '我要这个。', tips: '决定购买' },
      { id: 's5', english: 'Do you accept credit cards?', chinese: '你们接受信用卡吗？', tips: '询问支付方式' },
      { id: 's6', english: 'Could you wrap it as a gift?', chinese: '能帮我包装成礼物吗？', tips: '礼品包装' },
    ],
  },
  {
    id: 'directions',
    scenario: '问路与交通',
    scenarioIcon: '🗺️',
    expressions: [
      { id: 'd1', english: 'Excuse me, how do I get to ____?', chinese: '打扰一下，请问怎么去____？', tips: '问路基本句型' },
      { id: 'd2', english: 'Is it within walking distance?', chinese: '步行能到吗？', tips: '询问距离' },
      { id: 'd3', english: 'Which way is the subway station?', chinese: '地铁站在哪个方向？', tips: '询问地铁站' },
      { id: 'd4', english: 'How long does it take to get there?', chinese: '到那里要多久？', tips: '询问时间' },
      { id: 'd5', english: 'Could you show me on the map?', chinese: '能在地图上指给我看吗？', tips: '请求地图指引' },
    ],
  },
  {
    id: 'hotel',
    scenario: '酒店住宿',
    scenarioIcon: '🏨',
    expressions: [
      { id: 'h1', english: "I have a reservation under the name ____.", chinese: '我用____的名字预订了房间。', tips: '告知预订信息' },
      { id: 'h2', english: 'What time is breakfast served?', chinese: '早餐几点供应？', tips: '询问早餐时间' },
      { id: 'h3', english: 'Could I have an extra towel?', chinese: '能再给我一条毛巾吗？', tips: '请求额外物品' },
      { id: 'h4', english: 'Is there a gym in the hotel?', chinese: '酒店有健身房吗？', tips: '询问设施' },
      { id: 'h5', english: "I'd like to check out, please.", chinese: '我想退房，谢谢。', tips: '退房' },
    ],
  },
  {
    id: 'smalltalk',
    scenario: '日常闲聊',
    scenarioIcon: '💬',
    expressions: [
      { id: 't1', english: "What's your hobby?", chinese: '你的爱好是什么？', tips: '询问爱好' },
      { id: 't2', english: 'Have you seen any good movies lately?', chinese: '最近看过什么好电影吗？', tips: '聊电影' },
      { id: 't3', english: 'How was your weekend?', chinese: '你周末过得怎么样？', tips: '聊周末' },
      { id: 't4', english: 'Do you have any plans for the holidays?', chinese: '假期有什么计划吗？', tips: '聊假期计划' },
      { id: 't5', english: "That sounds interesting!", chinese: '听起来很有趣！', tips: '表示兴趣' },
    ],
  },
  {
    id: 'work',
    scenario: '职场沟通',
    scenarioIcon: '💼',
    expressions: [
      { id: 'w1', english: 'Could you send me the report by ____?', chinese: '能在____之前把报告发给我吗？', tips: '设定截止日期' },
      { id: 'w2', english: "I'll follow up with you on this.", chinese: '我会跟进这件事的。', tips: '表示跟进' },
      { id: 'w3', english: 'Let me check and get back to you.', chinese: '让我确认一下再回复你。', tips: '需要时间确认' },
      { id: 'w4', english: 'Could we schedule a meeting?', chinese: '我们可以安排一个会议吗？', tips: '预约会议' },
      { id: 'w5', english: "I'm available at ____.", chinese: '我在____有空。', tips: '告知空闲时间' },
    ],
  },
];

export function getTemplatesByScenario(scenarioId: string): SpeakingTemplate | undefined {
  return speakingTemplates.find(t => t.id === scenarioId);
}
