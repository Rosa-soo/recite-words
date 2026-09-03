/* =========================================================
 * 内置词库数据（可自行增删）
 * 字段说明：
 *   word     : 单词
 *   phonetic : 音标（可选）
 *   meaning  : 中文释义
 *   example  : 例句（可选）
 *   category : 分类
 * 你可以把整段列表换成任意你需要的词书（四六级、考研、雅思等）。
 * ========================================================= */
const BUILTIN_WORDS = [
  // ---- 核心动词 ----
  { word: "abandon",    phonetic: "/əˈbændən/",   meaning: "v. 放弃；抛弃", example: "Never abandon your dreams.", category: "核心动词" },
  { word: "achieve",    phonetic: "/əˈtʃiːv/",    meaning: "v. 达到；实现", example: "She achieved her goal at last.", category: "核心动词" },
  { word: "acquire",    phonetic: "/əˈkwaɪər/",   meaning: "v. 获得；习得", example: "It takes time to acquire a new skill.", category: "核心动词" },
  { word: "adapt",      phonetic: "/əˈdæpt/",     meaning: "v. 适应；改编", example: "He adapted quickly to the new school.", category: "核心动词" },
  { word: "anticipate", phonetic: "/ænˈtɪsɪpeɪt/", meaning: "v. 预期；预料", example: "We anticipate a rise in prices.", category: "核心动词" },
  { word: "avoid",      phonetic: "/əˈvɔɪd/",     meaning: "v. 避免；回避", example: "Avoid making the same mistake.", category: "核心动词" },
  { word: "concentrate",phonetic: "/ˈkɒnsntreɪt/", meaning: "v. 集中；专心", example: "Please concentrate on your study.", category: "核心动词" },
  { word: "decline",    phonetic: "/dɪˈklaɪn/",    meaning: "v. 下降；婉拒 n. 衰退", example: "Sales declined sharply last month.", category: "核心动词" },
  { word: "distinguish",phonetic: "/dɪˈstɪŋɡwɪʃ/", meaning: "v. 区分；辨别", example: "Can you distinguish the twins?", category: "核心动词" },
  { word: "encounter",  phonetic: "/ɪnˈkaʊntər/",  meaning: "v./n. 遭遇；邂逅", example: "We encountered many difficulties.", category: "核心动词" },
  { word: "enhance",    phonetic: "/ɪnˈhɑːns/",    meaning: "v. 提高；增强", example: "Reading enhances your vocabulary.", category: "核心动词" },
  { word: "estimate",   phonetic: "/ˈestɪmeɪt/",   meaning: "v./n. 估计；评估", example: "We estimate the cost at 500 yuan.", category: "核心动词" },
  { word: "facilitate", phonetic: "/fəˈsɪlɪteɪt/", meaning: "v. 促进；使便利", example: "Technology facilitates learning.", category: "核心动词" },
  { word: "maintain",   phonetic: "/meɪnˈteɪn/",   meaning: "v. 维持；保养；坚持", example: "Maintain a healthy lifestyle.", category: "核心动词" },
  { word: "obtain",     phonetic: "/əbˈteɪn/",     meaning: "v. 获得；得到", example: "You must work hard to obtain it.", category: "核心动词" },
  { word: "persuade",   phonetic: "/pəˈsweɪd/",    meaning: "v. 说服；劝说", example: "He persuaded me to join the team.", category: "核心动词" },
  { word: "recommend",  phonetic: "/ˌrekəˈmend/",  meaning: "v. 推荐；建议", example: "I recommend this book to you.", category: "核心动词" },
  { word: "sacrifice",  phonetic: "/ˈsækrɪfaɪs/",  meaning: "v./n. 牺牲", example: "Don't sacrifice health for work.", category: "核心动词" },
  { word: "transform",  phonetic: "/trænsˈfɔːm/",  meaning: "v. 转变；改造", example: "The city has been transformed.", category: "核心动词" },
  { word: "undertake",  phonetic: "/ˌʌndəˈteɪk/",  meaning: "v. 承担；着手做", example: "She undertook the task bravely.", category: "核心动词" },

  // ---- 常用名词 ----
  { word: "advantage",  phonetic: "/ədˈvɑːntɪdʒ/", meaning: "n. 优势；好处", example: "Practice gives you an advantage.", category: "常用名词" },
  { word: "attitude",   phonetic: "/ˈætɪtjuːd/",   meaning: "n. 态度；看法", example: "A positive attitude matters.", category: "常用名词" },
  { word: "challenge",  phonetic: "/ˈtʃælɪndʒ/",  meaning: "n./v. 挑战", example: "It is a big challenge for me.", category: "常用名词" },
  { word: "confidence", phonetic: "/ˈkɒnfɪdəns/",  meaning: "n. 信心；信任", example: "Speak with confidence.", category: "常用名词" },
  { word: "consequence",phonetic: "/ˈkɒnsɪkwəns/", meaning: "n. 结果；后果", example: "Think about the consequences.", category: "常用名词" },
  { word: "environment",phonetic: "/ɪnˈvaɪrənmənt/", meaning: "n. 环境", example: "Protect our environment.", category: "常用名词" },
  { word: "experience", phonetic: "/ɪkˈspɪəriəns/", meaning: "n./v. 经验；经历", example: "Experience is the best teacher.", category: "常用名词" },
  { word: "habit",      phonetic: "/ˈhæbɪt/",     meaning: "n. 习惯", example: "Reading is a good habit.", category: "常用名词" },
  { word: "opportunity",phonetic: "/ˌɒpəˈtjuːnəti/", meaning: "n. 机会", example: "Seize the opportunity.", category: "常用名词" },
  { word: "progress",   phonetic: "/ˈprəʊɡres/",   meaning: "n./v. 进步；进展", example: "You are making great progress.", category: "常用名词" },
  { word: "purpose",    phonetic: "/ˈpɜːpəs/",     meaning: "n. 目的；意图", example: "What is the purpose of the plan?", category: "常用名词" },
  { word: "strategy",   phonetic: "/ˈstrætədʒi/",  meaning: "n. 策略；战略", example: "We need a new strategy.", category: "常用名词" },
  { word: "tendency",   phonetic: "/ˈtendənsi/",   meaning: "n. 趋势；倾向", example: "There is a tendency to give up.", category: "常用名词" },
  { word: "value",      phonetic: "/ˈvæljuː/",     meaning: "n. 价值 v. 重视", example: "We value every minute.", category: "常用名词" },

  // ---- 形容词 ----
  { word: "ambitious",  phonetic: "/æmˈbɪʃəs/",    meaning: "adj. 有雄心的；野心勃勃的", example: "She is an ambitious student.", category: "形容词" },
  { word: "curious",    phonetic: "/ˈkjʊəriəs/",   meaning: "adj. 好奇的", example: "Children are curious about everything.", category: "形容词" },
  { word: "efficient",  phonetic: "/ɪˈfɪʃnt/",     meaning: "adj. 高效的", example: "This is an efficient method.", category: "形容词" },
  { word: "essential",  phonetic: "/ɪˈsenʃl/",     meaning: "adj. 必要的；本质的", example: "Sleep is essential to health.", category: "形容词" },
  { word: "flexible",   phonetic: "/ˈfleksəbl/",   meaning: "adj. 灵活的", example: "Keep a flexible schedule.", category: "形容词" },
  { word: "fortunate",  phonetic: "/ˈfɔːtʃənət/",  meaning: "adj. 幸运的", example: "We are fortunate to meet you.", category: "形容词" },
  { word: "independent",phonetic: "/ˌɪndɪˈpendənt/", meaning: "adj. 独立的", example: "She is quite independent.", category: "形容词" },
  { word: "obvious",    phonetic: "/ˈɒbviəs/",     meaning: "adj. 明显的", example: "The answer is obvious.", category: "形容词" },
  { word: "reliable",   phonetic: "/rɪˈlaɪəbl/",    meaning: "adj. 可靠的", example: "He is a reliable friend.", category: "形容词" },
  { word: "significant",phonetic: "/sɪɡˈnɪfɪkənt/", meaning: "adj. 重要的；显著的", example: "It was a significant change.", category: "形容词" },
  { word: "unique",     phonetic: "/juˈniːk/",     meaning: "adj. 独特的", example: "Everyone is unique.", category: "形容词" },
  { word: "various",    phonetic: "/ˈveəriəs/",    meaning: "adj. 各种各样的", example: "The store sells various goods.", category: "形容词" },

  // ---- 学习 & 考试 ----
  { word: "academic",   phonetic: "/ˌækəˈdemɪk/",  meaning: "adj. 学术的 n. 学者", example: "Academic writing needs practice.", category: "学习&考试" },
  { word: "assignment", phonetic: "/əˈsaɪnmənt/",  meaning: "n. 作业；任务", example: "Finish your assignment on time.", category: "学习&考试" },
  { word: "criterion",  phonetic: "/kraɪˈtɪəriən/", meaning: "n. 标准；准则", example: "What is the criterion for success?", category: "学习&考试" },
  { word: "curriculum", phonetic: "/kəˈrɪkjələm/",  meaning: "n. 课程；课程体系", example: "The curriculum covers many subjects.", category: "学习&考试" },
  { word: "essay",      phonetic: "/ˈeseɪ/",       meaning: "n. 文章；论文", example: "Write an essay about your dream.", category: "学习&考试" },
  { word: "evaluate",   phonetic: "/ɪˈvæljueɪt/",   meaning: "v. 评价；评估", example: "Evaluate your progress weekly.", category: "学习&考试" },
  { word: "graduate",   phonetic: "/ˈɡrædʒuət/",   meaning: "v. 毕业 n. 毕业生", example: "He will graduate next year.", category: "学习&考试" },
  { word: "knowledge",  phonetic: "/ˈnɒlɪdʒ/",     meaning: "n. 知识", example: "Knowledge is power.", category: "学习&考试" },
  { word: "memorize",   phonetic: "/ˈmeməraɪz/",   meaning: "v. 记住；背熟", example: "Memorize ten words a day.", category: "学习&考试" },
  { word: "review",     phonetic: "/rɪˈvjuː/",     meaning: "v./n. 复习；回顾", example: "Review the notes before the exam.", category: "学习&考试" },
  { word: "schedule",   phonetic: "/ˈʃedjuːl/",    meaning: "n. 时间表 v. 安排", example: "Plan a study schedule.", category: "学习&考试" },
  { word: "summary",    phonetic: "/ˈsʌməri/",     meaning: "n. 总结；概要", example: "Write a summary of the article.", category: "学习&考试" },

  // ---- 生活 & 科技 ----
  { word: "community",  phonetic: "/kəˈmjuːnəti/", meaning: "n. 社区；群体", example: "Our community is friendly.", category: "生活&科技" },
  { word: "device",     phonetic: "/dɪˈvaɪs/",     meaning: "n. 设备；装置", example: "Turn off your electronic devices.", category: "生活&科技" },
  { word: "digital",    phonetic: "/ˈdɪdʒɪtl/",    meaning: "adj. 数字的；数码的", example: "We live in a digital age.", category: "生活&科技" },
  { word: "platform",   phonetic: "/ˈplætfɔːm/",   meaning: "n. 平台；站台", example: "This is a learning platform.", category: "生活&科技" },
  { word: "network",    phonetic: "/ˈnetwɜːk/",    meaning: "n. 网络", example: "The network is unstable today.", category: "生活&科技" },
  { word: "resource",   phonetic: "/rɪˈsɔːs/",     meaning: "n. 资源", example: "Use your time as a resource.", category: "生活&科技" },
  { word: "software",   phonetic: "/ˈsɒftweər/",   meaning: "n. 软件", example: "Install the software first.", category: "生活&科技" },
  { word: "system",     phonetic: "/ˈsɪstəm/",     meaning: "n. 系统；体系", example: "The system runs smoothly.", category: "生活&科技" },
  { word: "transport",  phonetic: "/ˈtrænspɔːt/",  meaning: "n./v. 运输；交通", example: "Public transport is convenient.", category: "生活&科技" },
];
