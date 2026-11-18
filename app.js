const app = document.querySelector('#app');
const viewer = document.querySelector('#viewer');
const imageLightbox = document.querySelector('#image-lightbox');
const imageLightboxStage = imageLightbox.querySelector('.image-lightbox-stage');
const imageLightboxImage = document.querySelector('#image-lightbox-image');
let lightboxPanX = 0, lightboxPanY = 0, lightboxDrag = null;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const names = ['Branding', 'Packaging', 'Book', 'Poster', 'Illustration', 'Video', 'Play'];
const counts = [4, 7, 9, 6, 3, 5, 8];
const colors = ['#ef6b35', '#f19bac', '#ef6b35', '#279bd1', '#91b342', '#16683d', '#c98b45'];
const pieces = Object.fromEntries(names.map(name => [name.toLowerCase(), `assets/pieces/${name.toLowerCase()}.png`]));
pieces.video = 'assets/pieces/cone.png';
const projects = Object.fromEntries(names.map((name, index) => [
  name.toLowerCase(),
  Array.from({ length: counts[index] }, (_, projectIndex) => ({
    id: projectIndex,
    title: `${name} Study ${String(projectIndex + 1).padStart(2, '0')}`,
    year: projectIndex > 2 ? '2025' : '2026',
    frames: projectIndex % 2 ? 1 : 3
  }))
]));
const playImageExtensions = [
  Array(4).fill('jpg'),
  Array(35).fill('jpg'),
  Array(4).fill('jpg'),
  Array(21).fill('jpg'),
  ['jpg', 'jpg', 'png', 'jpg', 'jpg', 'jpg', 'png', 'png', 'png', 'png', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg'],
  ['jpg', 'jpg', 'png', 'png'],
  Array(3).fill('jpg'),
  Array(4).fill('png')
];
projects.play = ['Business Card Design', 'Photography', 'Keychain Design', 'INIKO Studio Redesign', 'KCONE Brand Collateral', 'Year of the Horse Red Packets', 'Menu Design', 'T-Shirt Design'].map((title, id) => {
  const folder = `assets/play/project-${String(id + 1).padStart(2, '0')}`;
  const images = playImageExtensions[id].map((extension, index) => `${folder}/${String(index + 1).padStart(2, '0')}.${extension}`);
  return { id, title, cover: `${folder}/cover.jpg`, images, frames: images.length };
});
const bookImageExtensions = [
  Array(4).fill('jpg'),
  Array(4).fill('jpg'),
  Array(4).fill('jpg'),
  Array(2).fill('jpg'),
  Array(3).fill('png'),
  Array(4).fill('jpg'),
  ['jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'png'],
  Array(5).fill('jpg'),
  Array(4).fill('png')
];
projects.book = ['Anhui Easy °C Equipment', 'Jurong Group', 'Jiaqiang Mechanics', 'Autolink', 'Saipuri Separation Technology', 'Zhongdan Group', 'KCONE Product Manual', 'KCONE Instrument Archive Collection', 'KCONE REFORMER H02 Installation Instructions'].map((title, id) => {
  const folder = `assets/book/project-${String(id + 1).padStart(2, '0')}`;
  const images = bookImageExtensions[id].map((extension, index) => `${folder}/${String(index + 1).padStart(2, '0')}.${extension}`);
  return { id, title, cover: `${folder}/cover.jpg`, images, frames: images.length };
});
projects.packaging = ['Cookies', 'Yoga Mat', 'Sparkling Wine', 'Chocolate', 'Yunnan Coffee', 'Honey', 'Toothpaste'].map((title, id) => {
  const folder = `assets/packaging/project-${String(id + 1).padStart(2, '0')}`;
  const imageCount = [4, 18, 4, 4, 3, 3, 3][id];
  const images = Array.from({ length: imageCount }, (_, index) => `${folder}/${String(index + 1).padStart(2, '0')}.jpg`);
  return { id, title, cover: `${folder}/cover.jpg`, images, frames: images.length };
});
projects.branding = [
  { id: 0, title: 'KCONE Brand Identity', name: 'KCONE 品牌视觉设计', year: '2024–2026', client: 'KCONE', role: '品牌视觉体系设计与延展、产品视觉设计、宣传物料设计、产品图册与说明书设计、包装设计、社交媒体视觉设计及制作落地。', description: 'KCONE 是一个以设计、品质、服务为核心的运动医疗领域康复器械品牌。以网格与秩序构建视觉系统，强调留白与控制，将功能逻辑转译为克制而稳定的视觉表达。围绕品牌理念「To be Undefined」，将视觉语言延展至产品图册、包装、宣传物料及数字传播，在持续迭代中形成统一且富有辨识度的品牌形象。', imageCount: 13 },
  { id: 1, title: 'Qi Wu Hotpot Brand Identity', name: '栖雾火锅品牌视觉设计', year: '2025', client: '栖雾 QI WU HOTPOT', role: '品牌视觉识别设计、Logo 与辅助图形设计、品牌色彩规划、菜单设计、包装及周边物料设计、品牌海报与空间视觉延展。', description: '栖雾是一家新式水派火锅品牌。向「雾」而行，循「味」而聚。以古法底料与山野食材为基础，在沸腾之间控制节奏与风味，让食物回归本味。视觉设计提取山野、雾气与水的意象，以深绿、米白和克制的字体编排构建品牌识别，并延展至菜单、包装、海报及空间应用，传递慢火、慢食与相聚的饮食理念。', imageCount: 12 },
  { id: 2, title: 'Lansea Brand Identity', name: '兰息普拉提品牌视觉设计', year: '2025', client: 'Lansea 兰息', role: '品牌定位与视觉概念构思、Logo 及辅助图形设计、品牌色彩规划、海报设计、名片设计、品牌物料及空间视觉延展。', description: 'Lansea 兰息是一个以呼吸节律为核心的瑜伽普拉提空间。从呼吸出发，引导身体在有序的起伏中建立感知与控制，让训练在流动与稳定之间自然发生。视觉设计以潮汐与呼吸为灵感，通过连续的圆弧构建起伏节奏，结合柔和的蓝色、流动的字体与留白，传递平静、舒展且富有生命力的品牌气质。', imageCount: 13 },
  { id: 3, title: 'Fresh Cells Brand Identity', name: '鲜活单元品牌视觉设计', year: '2026', client: 'Fresh Cells 鲜活单元', role: '品牌定位与概念策划、Logo 及视觉识别系统设计、品牌色彩规划、食材插画设计、系列包装设计、产品视觉及品牌应用延展。', description: 'Fresh Cells 鲜活单元是一个以新鲜食材与均衡营养为核心的轻食品牌。从「细胞」与「生长」概念出发，将自然能量转化为鲜明、有生命力的视觉语言。通过细胞形态的标志、清新的绿色体系与几何食材插画，构建覆盖品牌识别、系列包装及产品视觉的一体化设计系统，传递「每日鲜作、均衡搭配、原型食材」的品牌理念。', imageCount: 12 }
].map(project => {
  const folder = `assets/branding/project-${String(project.id + 1).padStart(2, '0')}`;
  return { ...project, cover: `${folder}/cover.jpg`, images: Array.from({ length: project.imageCount }, (_, index) => `${folder}/${String(index + 1).padStart(2, '0')}.jpg`) };
});
projects.illustration = [
  { id: 0, title: 'Little Knifee & Friends', name: '小砍刀和它的朋友们｜原创 IP 插画设计', year: '2026', client: '创作主题：原创 IP 角色设计、童趣插画创作与周边应用探索', role: '使用媒介／软件：数字手绘 / Photoshop、Illustrator', description: '以原创 IP「小砍刀和它的朋友们」为核心，通过圆润可爱的角色造型、童趣手绘线条与明快柔和的色彩，构建充满想象力的插画世界。围绕角色的日常生活、旅行与奇幻想象展开系列创作，并将插画延展至徽章、丝巾及拼图等周边应用，探索角色叙事与视觉表达的多样可能。', imageCount: 6 },
  { id: 1, title: 'Little Wonder Pals', name: '奇趣伙伴｜原创 IP 角色设计', year: '2024', client: '创作主题：萌趣动物 IP 设计、角色表情探索与创意周边应用', role: '使用媒介／软件：数字手绘 / Photoshop、Illustrator', description: '以不同动物形象为原型，创作一组性格各异的原创萌趣 IP 角色。通过圆润夸张的造型、鲜明的色彩搭配与丰富的表情动作，赋予每个角色独特的个性与情绪表达，并将角色延展至贴纸、手机支架等周边产品，探索插画在日常生活用品中的应用可能。', imageCount: 5 },
  { id: 2, title: "Koyi & Miko's Little Theater", name: '柯一米可小剧场｜KCONE 品牌 IP 形象设计', year: '2025', client: '创作主题：品牌 IP 形象设计、角色性格塑造、表情包设计与品牌传播应用', role: '使用媒介／软件：数字手绘 / Photoshop、Illustrator', description: '围绕 KCONE「To be Undefined」的品牌理念，创作小刺猬「柯一」与小蜗牛「米可」两位原创 IP 角色。柯一活泼大胆，象征探索与突破；米可温和从容，代表耐心与持续成长。通过鲜明的性格反差与趣味互动，将品牌精神转化为更具亲和力的视觉表达，并延展至微信表情包及品牌传播场景。', imageCount: 5 }
].map(project => {
  const folder = `assets/illustration/project-${String(project.id + 1).padStart(2, '0')}`;
  return { ...project, cover: `${folder}/cover.jpg`, images: Array.from({ length: project.imageCount }, (_, index) => `${folder}/${String(index + 1).padStart(2, '0')}.jpg`) };
});
const posterStudies = [
  { title: '520 Heartbeat Campaign', name: '520心动入篮活动海报', cover: 'assets/poster/01-01.png' },
  { title: 'Christmas Holiday', name: '圣诞节日海报海报', cover: 'assets/poster/01-02.png' },
  { title: 'New Year', name: '元旦节日海报', cover: 'assets/poster/01-03.png' },
  { title: 'Vessel Event', name: '“器”活动海报', cover: 'assets/poster/01-04.png' },
  { title: 'Art Exhibition', name: '艺术展活动海报', cover: 'assets/poster/01-05.png' },
  { title: 'Design Competition', name: '设计大赛海报', cover: 'assets/poster/01-06.png' },
  { title: 'Parfait Product', name: '巴菲产品海报', cover: 'assets/poster/02-01.png' },
  { title: 'Matcha Launch', name: '抹茶新品海报', cover: 'assets/poster/02-02.png' },
  { title: 'Tea Shop Opening', name: '茶点开业海报', cover: 'assets/poster/02-03.png' },
  { title: 'QIWU Concept 1', name: '栖雾火锅概念海报_1', cover: 'assets/poster/03-01.png' },
  { title: 'QIWU Concept 2', name: '栖雾火锅概念海报_2', cover: 'assets/poster/03-02.png' },
  { title: 'QIWU Concept 3', name: '栖雾火锅概念海报_3', cover: 'assets/poster/03-03.png' },
  { title: 'Lanse New Year 1', name: '兰息春节海报_1', cover: 'assets/poster/04-01.png' },
  { title: 'Lanse New Year 2', name: '兰息春节海报_2', cover: 'assets/poster/04-02.png' },
  { title: 'Lanse New Year 3', name: '兰息春节海报_3', cover: 'assets/poster/04-03.png' },
  { title: 'Lanse Pilates 1', name: '兰息普拉提海报_1', cover: 'assets/poster/04-04.jpg' },
  { title: 'Lanse Pilates 2', name: '兰息普拉提海报_2', cover: 'assets/poster/04-05.jpg' },
  { title: 'INIKO Book Exchange Poster', name: 'INIKO以书换课活动海报', cover: 'assets/poster/05-01.png' },
  { title: "KCONE Women's Day", name: 'KCONE妇女节海报', cover: 'assets/poster/06-01.png' },
  { title: 'KCONE Brand Concept 1', name: 'KCONE品牌概念海报_1', cover: 'assets/poster/06-02.png' },
  { title: 'KCONE Service', name: 'KCONE专业服务海报', cover: 'assets/poster/06-03.png' },
  { title: 'M01 Reformer', name: 'M01核心床产品海报', cover: 'assets/poster/06-04.png' },
  { title: 'Push Rod Detail', name: '推拉杆结构海报', cover: 'assets/poster/06-05.png' },
  { title: 'Cadillac Fitting', name: '凯迪拉克连接件海报', cover: 'assets/poster/06-06.png' },
  { title: 'K21 Cadillac 1', name: 'K21凯迪拉克床产品海报_1', cover: 'assets/poster/06-07.png' },
  { title: 'M01 Reformer Detail 1', name: 'M01核心床细节海报_1', cover: 'assets/poster/06-08.png' },
  { title: 'KCONE Structure', name: 'KCONE结构概念海报', cover: 'assets/poster/06-09.png' },
  { title: 'W01 Wunda Chair', name: 'W01稳踏椅产品海报', cover: 'assets/poster/06-10.png' },
  { title: 'KCONE Warehouse Service', name: 'KCONE仓储服务海报', cover: 'assets/poster/06-11.png' },
  { title: 'KCONE Brand Concept 2', name: 'KCONE品牌概念海报_2', cover: 'assets/poster/06-12.png' },
  { title: 'M01 Reformer Detail 2', name: 'M01核心床细节海报_2', cover: 'assets/poster/06-13.png' },
  { title: 'KCONE Equipment Space', name: 'KCONE器械空间海报', cover: 'assets/poster/06-14.png' },
  { title: 'MW01 Wunda Chair', name: 'MW01稳踏椅产品海报', cover: 'assets/poster/06-15.png' },
  { title: 'Pilates Spring Launch', name: '普拉提弹簧新品海报', cover: 'assets/poster/06-16.png' },
  { title: 'W01 Wunda Detail', name: 'W01稳踏椅细节海报', cover: 'assets/poster/06-17.png' },
  { title: 'K21 Cadillac 2', name: 'K21凯迪拉克产品海报_2', cover: 'assets/poster/06-18.png' }
];
const videoStudies = [
  { title: 'Beyond the Form', year: '2026', name: '形态之外｜普拉提器械三维视觉', category: '产品三维动画', description: '以普拉提梯桶为主体，通过透明结构与实体外观的动态转换，探索产品内部构造与外部形态之间的视觉关系。结合克制的镜头语言与极简排版，突出器械的结构美感与产品质感。', ratio: '2250 / 3181', ratioNumber: .707, cover: 'assets/video/covers/01.jpg', video: 'assets/video/files/01.mp4' },
  { title: 'Crafted for Motion', year: '2025', name: '为运动而造｜KCONE 普拉提核心床产品视觉', category: '产品宣传短片 / 视频拍摄与剪辑', description: '以 KCONE 普拉提核心床为主体，通过产品全景、结构特写与多角度镜头切换，展现器械的机械结构、材质工艺与功能细节。结合黑白蓝的品牌视觉语言与富有节奏感的剪辑，呈现产品的专业性能、精密质感与现代设计美感。', ratio: '4000 / 2250', ratioNumber: 1.778, cover: 'assets/video/covers/02.jpg', video: 'assets/video/files/02.mp4' },
  { title: 'Form in Motion', year: '2025', name: '形态流转｜MW01 稳踏椅三维视觉', category: '产品三维动画 / 动态视觉设计', description: '以 KCONE MW01 普拉提稳踏椅为主体，通过连续旋转的镜头展示产品的整体造型、结构细节与不同视角。结合暖色调场景、简洁的展台设计与现代字体排版，突出器械的材质质感和产品设计美感。', ratio: '2250 / 3000', ratioNumber: .75, cover: 'assets/video/covers/03.jpg', video: 'assets/video/files/03.mp4' },
  { title: 'Reformer Exchange', year: '2025', name: '焕新计划｜KCONE 核心床换购活动', category: '品牌营销视频 / 动态视觉设计', description: '围绕 KCONE INIKO 系列普拉提核心床换购活动，以产品动态展示为核心，结合黑白极简视觉、大胆的字体编排与品牌信息，突出产品特征和活动主题，呈现简洁有力的商业营销视觉。', ratio: '4000 / 2831', ratioNumber: 1.413, cover: 'assets/video/covers/04.jpg', video: 'assets/video/files/04.mp4' },
  { title: 'Details in Motion', year: '2025', name: '细节之间｜KCONE M01 核心床产品视觉', category: '产品动态视觉 / 视频剪辑', description: '以 KCONE M01 普拉提核心床为主体，通过多画面卡片的动态组合，展示器械的弹簧、支架及连接结构等产品细节。采用黑白灰极简配色与模块化排版，结合画面切换和节奏变化，呈现产品的结构美感与专业品牌形象。', ratio: '2250 / 2250', ratioNumber: 1, cover: 'assets/video/covers/05.jpg', video: 'assets/video/files/05.mp4' },
  { title: 'Words in Orbit', year: '2026', name: '文字环绕｜KCONE 稳踏椅动态视觉', category: '产品动态视觉 / 动态字体设计', description: '以 KCONE INIKO 系列稳踏椅为视觉主体，通过蓝色文字环绕产品的动态效果，建立文字与器械之间的空间关系。结合黑白极简的产品画面、信息编排与品牌标识，突出产品的结构轮廓与现代视觉气质。', ratio: '2250 / 3107', ratioNumber: .724, cover: 'assets/video/covers/06.jpg', video: 'assets/video/files/06.mp4' },
  { title: 'Essence of Nature', year: '2026', name: '自然之萃｜MOLECULE-X 护肤品牌视觉短片', category: '品牌视觉短片 / 动态视觉设计', description: '以 MOLECULE-X 护肤品牌为主体，通过产品包装展示、自然植物意象与人物特写，构建自然与精致感交融的品牌视觉氛围。结合低饱和色调、光影变化与动态转场，呈现品牌的视觉识别系统及系列产品的整体形象。', ratio: '4000 / 2250', ratioNumber: 1.778, cover: 'assets/video/covers/07.jpg', video: 'assets/video/files/07.mp4' },
  { title: 'Typography in Flux', year: '2025', name: '似水｜动态字体视觉实验', category: '动态字体设计 / 品牌视觉短片', description: '以流动的水面为视觉载体，将字体变形与水波动态相结合，探索文字在流动状态下的视觉表现。通过青绿色水面、白色衬线字体与动态扭曲效果，营造富有节奏感的视觉体验，并融入 KCONE 品牌理念，呈现流动与变化的设计语言。', ratio: '2250 / 3000', ratioNumber: .75, cover: 'assets/video/covers/08.jpg', video: 'assets/video/files/08.mp4' },
  { title: 'Precision in Place', year: '2025', name: '精准就位｜KCONE 跳板安装视觉短片', category: '产品实拍 / 视频拍摄与剪辑', description: '以 KCONE 普拉提器械跳板的安装过程为主体，通过黑白影调、局部特写与细节镜头，呈现配件的连接方式与安装操作。结合简洁的品牌文字编排和富有节奏感的画面切换，突出产品的结构细节与专业质感。', ratio: '4000 / 2250', ratioNumber: 1.778, cover: 'assets/video/covers/09.jpg', video: 'assets/video/files/09.mp4' },
  { title: 'Quiet by Design', year: '2025', name: '静谧之境｜KCONE M01 核心床产品视觉', category: '产品动态视觉 / 视频剪辑', description: '以 KCONE M01 普拉提核心床的局部结构为视觉主体，通过简洁的产品特写、柔和的织物光影与克制的画面编排，营造安静、细腻的视觉氛围。结合黑白产品造型与暖色背景，突出器械的结构细节和精致质感。', ratio: '2250 / 3179', ratioNumber: .708, cover: 'assets/video/covers/10.jpg', video: 'assets/video/files/10.mp4' },
  { title: 'Crafted with Precision', year: '2026', name: '精工细作｜KCONE 普拉提器械工艺短片', category: '产品工艺短片 / 视频拍摄与剪辑', description: '聚焦 KCONE 普拉提器械的精细工艺，通过弹簧组件、连接结构与人工装配过程的特写镜头，呈现产品制作中的细节与严谨态度。结合浅景深摄影、细腻的光影与简洁的品牌视觉，传递产品对工艺品质与细节把控的重视。', ratio: '4000 / 2250', ratioNumber: 1.778, cover: 'assets/video/covers/11.jpg', video: 'assets/video/files/11.mp4' },
  { title: 'Undefined Possibilities', year: '2026', name: '未定义的可能｜抽象字体动态实验', category: '动态字体设计 / 实验性视觉动效', description: '以抽象字体与几何运动为核心，通过文字环绕、旋转、变形及故障艺术效果，探索字体在动态空间中的多样表现。结合黑白灰极简配色、强烈的明暗对比与节奏变化，呈现富有实验性和视觉张力的动态设计语言。', ratio: '2250 / 4000', ratioNumber: .563, cover: 'assets/video/covers/12.jpg', video: 'assets/video/files/12.mp4' },
  { title: 'A Continuous Perspective', year: '2025', name: '连续视界｜KCONE 凯迪拉克床产品视觉', category: '产品宣传短片 / 视频拍摄与剪辑', description: '以 KCONE 普拉提凯迪拉克床为主体，采用一镜到底的连续运镜方式，串联器械框架、弹簧组件与连接结构等细节。结合黑白极简的视觉风格、局部特写与品牌信息排版，突出产品的结构美感与精密质感，呈现流畅且具有设计感的产品视觉体验。', ratio: '4000 / 3000', ratioNumber: 1.333, cover: 'assets/video/covers/13.jpg', video: 'assets/video/files/13.mp4' },
  { title: 'Never Miss a Screw', year: '2025', name: '不放过每一颗螺丝｜KCONE 产品系列动态视觉', category: '产品动态视觉 / 动态排版设计', description: '以“不放过每一颗螺丝”为创意主题，通过多款 KCONE 普拉提器械的动态展示，呈现不同产品的结构形态与细节。结合黑白极简排版、网点图形与字体层级变化，构建具有节奏感和视觉识别度的系列化产品展示，传递品牌对设计细节与产品品质的关注。', ratio: '2250 / 3179', ratioNumber: .708, cover: 'assets/video/covers/14.jpg', video: 'assets/video/files/14.mp4' },
  { title: 'Fresh Pet Joy', year: '2026', name: '鲜宠趣｜宠物零食品牌视觉展示', category: '品牌视觉短片 / 动态排版设计', description: '以宠物冻干零食品牌「鲜宠趣」为主题，通过品牌标志、字体设计、包装样机与视觉应用的动态展示，呈现完整的品牌视觉概念。采用黑金配色与复古装饰图形，结合字体编排、画面切换和产品展示，突出品牌的视觉识别与包装设计特色。', ratio: '4000 / 2252', ratioNumber: 1.776, cover: 'assets/video/covers/15.jpg', video: 'assets/video/files/15.mp4' },
  { title: 'Balance in Motion', year: '2024', name: '平衡之美｜KCONE 稳踏椅产品视觉', category: '产品宣传短片 / 动态视觉设计', description: '以 KCONE 普拉提稳踏椅为视觉主体，通过双产品展示、细节说明与简洁的动态排版，呈现器械的结构特点与设计细节。结合木质器械的自然质感、黑白极简的画面语言和品牌信息，突出产品的专业性与视觉美感。', ratio: '2250 / 2250', ratioNumber: 1, cover: 'assets/video/covers/16.jpg', video: 'assets/video/files/16.mp4' },
  { title: 'Brewed for Freedom', year: '2026', name: '自由酿造｜LIBERTY 精酿啤酒品牌视觉', category: '品牌视觉短片 / 包装动态展示', description: '以 LIBERTY 精酿啤酒为主题，通过酒标设计、罐装包装、品牌周边与场景化视觉的动态组合，呈现具有复古美式风格的品牌形象。运用黑红金配色、复古装饰图形与富有冲击力的产品特写，结合动态排版和节奏化转场，传递自由、大胆且充满个性的品牌气质。', ratio: '4000 / 2250', ratioNumber: 1.778, cover: 'assets/video/covers/17.jpg', video: 'assets/video/files/17.mp4' },
  { title: 'Form Meets Function', year: '2025', name: '形随功能｜KCONE 稳踏椅产品动态视觉', category: '产品三维动画 / 动态视觉设计', description: '以 KCONE INIKO 系列稳踏椅为视觉主体，通过产品旋转与多角度动态展示，呈现器械的整体造型、踏板结构及功能细节。结合黑白极简的视觉风格、现代字体编排与品牌信息，突出产品的结构美感、功能特点与专业质感。', ratio: '2250 / 3181', ratioNumber: .707, cover: 'assets/video/covers/18.jpg', video: 'assets/video/files/18.mp4' },
  { title: '360° Silence', year: '2025', name: '静谧之间｜普拉提静音滑轮视觉短片', category: '产品创意短片 / 视频拍摄与剪辑', description: '以普拉提器械的静音滑轮系统为视觉主体，通过黑白影调、局部特写与虚实焦点切换，突出产品的结构细节与静音特性。搭配醒目的蓝色字体与极简排版，营造安静、克制且富有科技质感的产品视觉体验。', ratio: '4000 / 2250', ratioNumber: 1.778, cover: 'assets/video/covers/19.jpg', video: 'assets/video/files/19.mp4' },
  { title: 'Forms in Harmony', year: '2024', name: '形态共序｜KCONE 普拉提器械系列动态视觉', category: '产品系列展示 / 动态视觉设计', description: '以 KCONE 多款普拉提器械为视觉主体，通过不同产品的组合排版、黑白配色切换与连续动态展示，呈现系列产品的造型差异与结构特点。结合极简的网格布局、几何构成和品牌信息，建立统一且富有节奏感的产品视觉语言，突出器械系列的整体设计美感。', ratio: '2250 / 4000', ratioNumber: .563, cover: 'assets/video/covers/20.jpg', video: 'assets/video/files/20.mp4' },
  { title: 'Reformer Collection', year: '2025', name: '器械序列｜KCONE 核心床系列动态视觉', category: '产品系列展示 / 动态视觉设计', description: '以 KCONE 多款普拉提核心床为主体，通过卡片式横向切换与产品多角度展示，呈现不同型号的造型特征和结构差异。采用黑白灰极简配色、模块化布局与连续切换动效，建立清晰有序的产品展示节奏，突出系列产品的统一性与设计美感。', ratio: '3012 / 2250', ratioNumber: 1.339, cover: 'assets/video/covers/21.jpg', video: 'assets/video/files/21.mp4' }
];

const webImage = path => path?.replace(/\.(?:jpe?g|png)$/i, '.webp');
[...Object.values(projects).flat(), ...posterStudies, ...videoStudies].forEach(project => {
  if (project.cover) project.cover = webImage(project.cover);
  if (project.images) project.images = project.images.map(webImage);
});
videoStudies.forEach(project => project.video = project.video.replace('/files/', '/files-web/'));

const categoryDescriptions = {
  branding: '品牌视觉识别、品牌系统与商业应用设计作品。',
  packaging: '包装设计、产品视觉与商业包装展示作品。',
  book: '品牌画册、产品手册与编辑设计作品。',
  poster: '活动、品牌与产品主题海报设计作品。',
  illustration: '原创 IP、角色与商业插画设计作品。',
  video: '品牌短片、产品视频与动态视觉设计作品。',
  play: '摄影、周边、空间与趣味视觉创作。'
};
const defaultDescription = 'Leah Knifee 品牌视觉设计师作品集，涵盖品牌设计、包装设计、画册、插画、海报与动态视觉。';

function setSeo({ title = 'Leah Knifee — Brand & Graphic Designer', description = defaultDescription, image = 'assets/branding/project-01/cover.webp', type = 'website', schema = null, noindex = false } = {}) {
  const fullTitle = title.includes('Leah Knifee') ? title : `${title} — Leah Knifee`;
  const absoluteImage = new URL(image, document.baseURI).href;
  document.title = fullTitle;
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[name="robots"]').content = noindex ? 'noindex,nofollow' : 'index,follow';
  document.querySelector('meta[property="og:type"]').content = type;
  document.querySelector('meta[property="og:title"]').content = fullTitle;
  document.querySelector('meta[property="og:description"]').content = description;
  document.querySelector('meta[property="og:image"]').content = absoluteImage;
  document.querySelector('meta[property="og:url"]').content = location.href;
  document.querySelector('meta[name="twitter:title"]').content = fullTitle;
  document.querySelector('meta[name="twitter:description"]').content = description;
  document.querySelector('meta[name="twitter:image"]').content = absoluteImage;
  document.querySelector('#seo-json').textContent = JSON.stringify(schema || {
    '@context': 'https://schema.org', '@type': 'WebSite', name: 'Leah Knifee Portfolio', description
  });
}

function categoryItems(categoryName) {
  if (categoryName === 'poster') return posterStudies;
  if (categoryName === 'video') return videoStudies;
  return projects[categoryName];
}

function setCategorySeo(categoryName) {
  const label = names.find(name => name.toLowerCase() === categoryName) || categoryName;
  const description = categoryDescriptions[categoryName] || defaultDescription;
  setSeo({
    title: `${label} Design Portfolio`, description, image: categoryItems(categoryName)?.[0]?.cover,
    schema: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `${label} Design Portfolio`, description }
  });
}

function setProjectSeo(project, categoryName) {
  const description = project.description || project.name || `${project.title}，Leah Knifee ${categoryDescriptions[categoryName] || '设计作品'}。`;
  setSeo({
    title: project.title, description, image: project.cover || project.images?.[0] || categoryItems(categoryName)?.[0]?.cover,
    type: 'article', schema: { '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.title, description, creator: { '@type': 'Person', name: 'Leah Knifee' } }
  });
}

let cleanup = () => {};
let viewerProject = null;
let viewerFrame = 0;
let viewerCategory = '';
let viewerWheelAt = 0;
let returnFocus = null;
let lightboxItems = [];
let lightboxIndex = 0;
let lightboxReturnFocus = null;
let lightboxZoom = 1;

const piece = (category, className = 'title-piece free-piece') => `<img class="${className}" src="${pieces[category]}" alt="" aria-hidden="true">`;
const art = (project, frame = 0, category = '') => project.images?.[frame - 1]
  ? `<div class="art art--image"><img src="${project.images[frame - 1]}" alt="${project.title}" decoding="async"></div>`
  : project.cover && !frame
  ? `<div class="art art--image"><img src="${project.cover}" alt="${project.title}" width="4" height="3" loading="lazy" decoding="async"></div>`
  : category === 'branding'
  ? `<div class="art art--branding"><small>BRAND IDENTITY / ${project.year}</small><span>${project.title}</span></div>`
  : `<div class="art"><span>${String(project.id + 1).padStart(2, '0')}${frame ? `.${frame}` : ''}</span></div>`;
const card = (project, category) => `<a class="project-card" href="#/work/${category}/${project.id}">${art(project, 0, category)}<div class="meta"><span>${project.title}</span><span>${project.year}</span></div></a>`;

function home() {
  document.body.className = 'home-page';
  app.innerHTML = `
    <section class="home-hero" id="about">
      <div class="hero-copy">
        <h1>Leah Knifee</h1>
        <p>Hi, I’m Leah! I’m a Brand &amp; Graphic Designer who loves turning ideas into thoughtful and playful visual experiences. I work across branding, packaging, and digital design, exploring how creativity, strategy, and AI can come together to make design both meaningful and engaging.</p>
        <span class="hero-location">Based in Wuxi</span>
      </div>
      <div class="block-stage" aria-label="可拖拽的作品分类积木">
        ${names.map((name, index) => `<button class="block-piece block-piece--${name.toLowerCase()}" type="button" data-category="${name.toLowerCase()}" data-index="${index}" aria-label="${name}"><img src="${pieces[name.toLowerCase()]}" alt=""><span><b>↗</b>${name}</span></button>`).join('')}
      </div>
      <div class="hero-controls">
        <button id="scatter-blocks" type="button" title="撞散积木"><img src="assets/icons/collision.svg" alt=""><span>SCATTER</span></button>
        <button id="restore-blocks" type="button" title="恢复积木"><img src="assets/icons/restore.svg" alt=""><span>RESTORE</span></button>
      </div>
    </section>
    <section class="selected section-screen" id="selected">
      <div class="section-heading"><h2>Selected works</h2><img class="free-piece" src="assets/models/toy-wagon-transparent.png" alt="积木小车"></div>
      <div class="work-grid work-grid--two">${projects.branding.map(project => card(project, 'branding')).join('')}</div>
    </section>
    <section class="all-projects section-screen" id="all">
      <div class="section-heading section-heading--stacked"><h2>ALL<br>PROJECTS</h2><img class="free-piece" src="assets/models/arch-gateway-transparent.png" alt="积木城门"></div>
      <div class="category-links">${names.map(name => `<a href="#/work/${name.toLowerCase()}">${name}</a>`).join('<span>, </span>')}</div>
    </section>
    <section class="contact-section section-screen" id="contact">
      <p class="contact-kicker">Have a job opportunity<br>or a creative project in mind?</p>
      <div class="contact-title">Let’s Build<br>Something Together.</div>
      ${['poster', 'video', 'play', 'packaging', 'book', 'illustration', 'branding'].map(category => `<img class="contact-piece contact-piece--${category} free-piece" src="${pieces[category]}" alt="">`).join('')}
      <footer class="contact-footer">
        <div class="contact-details">
          <div class="wechat-row"><strong>VX: _19816293221Leah</strong><button class="copy-button" type="button" data-copy="_19816293221Leah" aria-label="复制微信号" data-tip="copy"><img src="assets/icons/copy.svg" alt=""><span class="sr-only copy-status" aria-live="polite"></span></button><span class="qr-popover" aria-hidden="true"><img class="qr-image" src="assets/contact/微信二维码.jpg" alt="微信二维码"><small>_19816293221Leah</small></span></div>
          <div><strong>fengkuangxiaokandao@gmail.com</strong><button class="copy-button" type="button" data-copy="fengkuangxiaokandao@gmail.com" aria-label="复制邮箱" data-tip="copy"><img src="assets/icons/copy.svg" alt=""><span class="sr-only copy-status" aria-live="polite"></span></button></div>
        </div>
        <a class="xiaohongshu" href="https://www.xiaohongshu.com/user/profile/63b0404e0000000026007f4e" target="_blank" rel="noreferrer">xiaohongshu ↗</a>
        <div class="copyright">Leah Knifee © 2026<br>ALL RIGHTS RESERVED</div>
      </footer>
    </section>`;
  initBlockPhysics();
  initContact();
  initFreeDrag();
}

function initBlockPhysics() {
  const stage = app.querySelector('.block-stage');
  const blocks = [...stage.querySelectorAll('.block-piece')];
  const scatterButton = app.querySelector('#scatter-blocks');
  const restoreButton = app.querySelector('#restore-blocks');
  let animation = 0, last = performance.now(), stageWidth = stage.clientWidth;
  function render(block) {
    block.style.left = `${block._x}px`;
    block.style.top = `${block._y}px`;
    block.style.rotate = `${block._angle}deg`;
  }

  function reset() {
    cancelAnimationFrame(animation);
    const [branding, packaging, book, poster, illustration, video, play] = blocks;
    const baseline = stage.clientHeight * .94;
    const houseX = stage.clientWidth * .14;
    const houseY = baseline - branding.offsetHeight * .9;
    const houseTop = houseY + branding.offsetHeight * .1;
    const houseRight = houseX + branding.offsetWidth * .9;
    const packagingX = houseRight - packaging.offsetWidth * .9;
    const packagingY = houseTop - packaging.offsetHeight * .9;
    const illustrationY = baseline - illustration.offsetHeight * .9;
    const videoX = stage.clientWidth * .61;
    const videoY = illustrationY + illustration.offsetHeight * .1 - stage.clientHeight * .05 - video.offsetHeight * .9 - play.offsetHeight * .8;
    const initial = [
      { x:houseX, y:houseY },
      { x:packagingX, y:packagingY },
      { x:houseX + branding.offsetWidth * .1 - book.offsetWidth * .1, y:houseTop - book.offsetHeight * .9 },
      { x:packagingX + (packaging.offsetWidth - poster.offsetWidth) / 2, y:packagingY + packaging.offsetHeight * .1 - poster.offsetHeight * .9 },
      { x:stage.clientWidth * .76, y:illustrationY },
      { x:videoX, y:videoY },
      { x:videoX + (video.offsetWidth - play.offsetWidth) / 2, y:videoY + video.offsetHeight * .9 - play.offsetHeight * .1 }
    ];
    blocks.forEach((block, index) => {
      block._x = initial[index].x;
      block._y = initial[index].y;
      block._vx = block._vy = block._va = block._angle = 0;
      block._active = block._dragging = false;
      render(block);
    });
  }

  function impact(block, force) {
    const now = performance.now();
    if (force > 2.5 && now - Number(block.dataset.hit || 0) > 100) {
      block.dataset.hit = now;
      playBlockSound('impact', Math.min(1, force / 20));
    }
  }

  function separate(block, other, bounce) {
    const overlapX = Math.min(block._x + block.offsetWidth, other._x + other.offsetWidth) - Math.max(block._x, other._x);
    const overlapY = Math.min(block._y + block.offsetHeight, other._y + other.offsetHeight) - Math.max(block._y, other._y);
    if (overlapX <= 0 || overlapY <= 0) return false;
    if (overlapX < overlapY) {
      const direction = block._x + block.offsetWidth / 2 < other._x + other.offsetWidth / 2 ? -1 : 1;
      block._x += direction * (overlapX + 1);
      if (bounce) {
        block._vx = direction * Math.max(.4, Math.abs(block._vx) * .38);
        block._va += direction * .28;
      }
    } else {
      const direction = block._y + block.offsetHeight / 2 < other._y + other.offsetHeight / 2 ? -1 : 1;
      const force = Math.abs(block._vy);
      block._y += direction * (overlapY + 1);
      if (bounce) {
        block._vy = direction * Math.max(.15, force * .2);
        block._vx *= .84;
        block._va += ((block._x + block.offsetWidth / 2) - (other._x + other.offsetWidth / 2)) / Math.max(80, other.offsetWidth) * .55;
        impact(block, force);
      }
    }
    return true;
  }

  function resolveCollisions(block, bounce) {
    return blocks.some(other => other !== block && separate(block, other, bounce));
  }

  function tick(now) {
    if (reduceMotion.matches) {
      animation = 0;
      blocks.forEach(block => { block._active = false; block._vx = block._vy = block._va = 0; });
      return;
    }
    const step = Math.min(1.8, (now - last) / 16.67 || 1);
    last = now;
    let activeCount = 0;
    blocks.forEach(block => {
      if (!block._active || block._dragging) return;
      activeCount++;
      block._vy += .9 * step;
      block._x += block._vx * step;
      block._y += block._vy * step;
      block._angle = Math.max(-22, Math.min(22, block._angle + block._va * step));
      const floor = stage.clientHeight - block.offsetHeight;
      const right = stage.clientWidth - block.offsetWidth;
      if (block._x < 0 || block._x > right) {
        block._x = Math.max(0, Math.min(right, block._x));
        block._vx *= -.38;
        block._va += block._vx * .05;
      }
      const collided = resolveCollisions(block, true);
      if (block._y >= floor) {
        const force = block._vy;
        block._y = floor;
        block._vy *= -.26;
        block._vx *= .82;
        block._va = block._va * .78 + block._vx * .035;
        impact(block, force);
        if (Math.abs(block._vy) < .65 && Math.abs(block._vx) < .3 && Math.abs(block._va) < .15) {
          block._vy = block._vx = block._va = 0;
          block._active = false;
        }
      } else if (collided && Math.abs(block._vy) < .65 && Math.abs(block._vx) < .3 && Math.abs(block._va) < .15) {
        block._vy = block._vx = block._va = 0;
        block._active = false;
      }
      render(block);
    });
    if (activeCount) animation = requestAnimationFrame(tick);
  }

  function wake() {
    cancelAnimationFrame(animation);
    last = performance.now();
    animation = requestAnimationFrame(tick);
  }

  blocks.forEach(block => {
    let drag = null;
    block.addEventListener('pointerdown', event => {
      playBlockSound('pickup');
      drag = { x: event.clientX, y: event.clientY, left: block._x, top: block._y, moved: false, time: performance.now(), lastX: event.clientX, lastY: event.clientY, grabX: event.clientX - block.getBoundingClientRect().left };
      block._active = false;
      block._dragging = true;
      block._vx = block._vy = 0;
      block.classList.add('is-dragging');
      block.setPointerCapture(event.pointerId);
    });
    block.addEventListener('pointermove', event => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (Math.hypot(dx, dy) > 6) drag.moved = true;
      const elapsed = Math.max(16, performance.now() - drag.time);
      block._vx = (event.clientX - drag.lastX) / elapsed * 16;
      block._vy = (event.clientY - drag.lastY) / elapsed * 16;
      drag.time = performance.now(); drag.lastX = event.clientX; drag.lastY = event.clientY;
      block._x = Math.max(0, Math.min(stage.clientWidth - block.offsetWidth, drag.left + dx));
      block._y = Math.max(0, Math.min(stage.clientHeight - block.offsetHeight, drag.top + dy));
      resolveCollisions(block, false);
      render(block);
    });
    block.addEventListener('pointerup', event => {
      if (!drag) return;
      const moved = drag.moved;
      const torque = (drag.grabX / block.offsetWidth - .5) * 1.4;
      drag = null;
      block._dragging = false;
      block.classList.remove('is-dragging');
      block.releasePointerCapture(event.pointerId);
      if (!moved) {
        const touchTap = event.pointerType !== 'mouse' && matchMedia('(hover: none)').matches;
        if (touchTap && !block.classList.contains('is-tap-active')) {
          blocks.forEach(item => item.classList.toggle('is-tap-active', item === block));
        } else {
          location.hash = `#/work/${block.dataset.category}`;
        }
      }
      else if (!reduceMotion.matches) {
        block._active = true;
        block._va = Math.max(-3, Math.min(3, block._vx * .18 + torque));
        wake();
      }
    });
    block.addEventListener('pointercancel', () => {
      drag = null;
      block._dragging = false;
      block.classList.remove('is-dragging');
    });
  });

  scatterButton.addEventListener('click', () => {
    playBlockSound('scatter');
    if (reduceMotion.matches) {
      blocks.forEach((block, index) => {
        block._x = Math.min(stage.clientWidth - block.offsetWidth, index % 4 * stage.clientWidth / 3);
        block._y = Math.min(stage.clientHeight - block.offsetHeight, stage.clientHeight * (.42 + Math.floor(index / 4) * .4));
        block._vx = block._vy = block._va = block._angle = 0;
        block._active = false;
        render(block);
      });
      return;
    }
    blocks.forEach((block, index) => {
      const direction = index < 4 ? -1 : 1;
      block._vx = direction * (3.5 + index % 3 * 1.2);
      block._vy = -8 - index % 4 * 1.4;
      block._va = direction * (.8 + index % 3 * .55);
      block._active = true;
    });
    wake();
  });
  restoreButton.addEventListener('click', () => { playBlockSound('restore'); reset(); });
  function resetForWidthChange() {
    if (Math.abs(stage.clientWidth - stageWidth) < 2) return;
    stageWidth = stage.clientWidth;
    reset();
  }
  window.addEventListener('resize', resetForWidthChange);
  Promise.all(blocks.map(block => {
    const image = block.querySelector('img');
    if (image.complete && image.naturalWidth) return Promise.resolve();
    return new Promise(resolve => {
      image.addEventListener('load', resolve, { once:true });
      image.addEventListener('error', resolve, { once:true });
    });
  })).then(() => requestAnimationFrame(() => requestAnimationFrame(reset)));
  cleanup = () => { cancelAnimationFrame(animation); window.removeEventListener('resize', resetForWidthChange); };
}

let blockAudio;
const SOUND_VOLUME = 2.5;
function playBlockSound(type, amount = 1) {
  blockAudio ||= new (window.AudioContext || window.webkitAudioContext)();
  if (blockAudio.state === 'suspended') blockAudio.resume();
  const now = blockAudio.currentTime;
  function tone(start, end, volume, duration, wave = 'sine', delay = 0) {
    const oscillator = blockAudio.createOscillator();
    const gain = blockAudio.createGain();
    const startTime = now + delay;
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(start, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(end, startTime + duration);
    gain.gain.setValueAtTime(Math.min(.22, volume * SOUND_VOLUME), startTime);
    gain.gain.exponentialRampToValueAtTime(.0001, startTime + duration);
    oscillator.connect(gain).connect(blockAudio.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }
  if (type === 'scatter') {
    tone(190, 45, .06, .28, 'triangle');
    tone(720, 120, .035, .14, 'sawtooth', .015);
  } else if (type === 'restore') {
    tone(260, 520, .05, .18, 'sine');
    tone(520, 860, .035, .2, 'sine', .09);
  } else if (type === 'rocket') {
    tone(220, 1450, .045, .3, 'sine');
    tone(360, 1100, .02, .22, 'triangle', .025);
  } else if (type === 'impact') {
    tone(105, 48, .08 * amount, .13, 'triangle');
  } else {
    tone(420, 260, .025, .06);
  }
}

function initFreeDrag() {
  app.querySelectorAll('.free-piece').forEach(element => {
    element.draggable = false;
    let drag;
    element.addEventListener('pointerdown', event => {
      drag = { x: event.clientX, y: event.clientY, tx: Number(element.dataset.tx || 0), ty: Number(element.dataset.ty || 0) };
      element.classList.add('is-free-dragging');
      element.setPointerCapture(event.pointerId);
      playBlockSound('pickup');
    });
    element.addEventListener('pointermove', event => {
      if (!drag) return;
      const bounds = element.getBoundingClientRect();
      let tx = drag.tx + event.clientX - drag.x;
      let ty = drag.ty + event.clientY - drag.y;
      tx += Math.max(0, -bounds.left) - Math.max(0, bounds.right - innerWidth);
      ty += Math.max(64 - bounds.top, 0) - Math.max(0, bounds.bottom - innerHeight);
      element.dataset.tx = tx; element.dataset.ty = ty;
      element.style.translate = `${tx}px ${ty}px`;
    });
    element.addEventListener('pointerup', event => {
      drag = null;
      element.classList.remove('is-free-dragging');
      element.releasePointerCapture(event.pointerId);
    });
    element.addEventListener('pointercancel', () => { drag = null; element.classList.remove('is-free-dragging'); });
  });
}

function initContact() {
  app.querySelectorAll('.copy-button').forEach(button => button.addEventListener('click', async () => {
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(button.dataset.copy);
        copied = true;
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = button.dataset.copy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.append(textarea);
        try {
          textarea.select();
          copied = document.execCommand('copy');
        } finally {
          textarea.remove();
        }
      }
    } catch {
      copied = false;
    }
    button.classList.add(copied ? 'is-copied' : 'is-error');
    button.dataset.tip = copied ? 'copied' : 'copy failed';
    button.querySelector('.copy-status').textContent = copied ? '复制成功' : '复制失败，请手动复制';
    setTimeout(() => {
      button.classList.remove('is-copied', 'is-error');
      button.dataset.tip = 'copy';
      button.querySelector('.copy-status').textContent = '';
    }, 1400);
  }));
}

function category(categoryName) {
  document.body.className = `category-page category-${categoryName}`;
  const title = names.find(name => name.toLowerCase() === categoryName);
  app.innerHTML = `<section class="category-shell">
    <div class="category-heading"><h1>${title}</h1>${piece(categoryName)}<a class="all-projects-link" href="#/?section=all">← All projects</a></div>
    <div id="category-content"></div>
  </section>`;
  const content = app.querySelector('#category-content');
  initFreeDrag();
  if (categoryName === 'poster') return posters(content);
  if (categoryName === 'video') return videos(content);
  if (['branding', 'illustration'].includes(categoryName)) {
    content.innerHTML = `<div class="work-grid ${categoryName === 'illustration' ? 'work-grid--three' : 'work-grid--two'}">${projects[categoryName].map(project => card(project, categoryName)).join('')}</div>`;
  } else {
    content.innerHTML = `<div class="object-gallery">${projects[categoryName].map(project => `<button class="object-card" type="button" data-id="${project.id}">${art(project)}</button>`).join('')}</div>`;
    content.querySelectorAll('.object-card').forEach(button => button.addEventListener('click', () => openViewer(projects[categoryName][Number(button.dataset.id)], categoryName)));
  }
}

function detail(categoryName, id) {
  document.body.className = 'detail-page';
  const project = projects[categoryName]?.[id];
  if (!project) return missing();
  const hasImages = Boolean(project.images?.length);
  const heading = hasImages
    ? `<div class="detail-title"><strong>${project.name}</strong><span>${project.title}</span></div><span>${project.client}<br>${project.year}</span><div class="detail-copy"><p>${project.description}</p><small>${project.role}</small></div>`
    : `<strong>${project.title}</strong><span>Design / Art Direction<br>${project.year}</span><p>项目说明占位。这里将展示项目背景、设计思路与承担的工作。</p>`;
  const sequence = hasImages
    ? project.images.map((image, index) => `<figure class="reveal-frame reveal-frame--image"><img class="project-detail-image" src="${image}" alt="${project.title} — ${String(index + 1).padStart(2, '0')}" aria-label="放大查看：${project.title} — ${String(index + 1).padStart(2, '0')}" role="button" tabindex="0" width="16" height="9" loading="lazy" decoding="async"></figure>`).join('')
    : [1, 2, 3].map(frame => `<figure class="reveal-frame">${art(project, frame)}</figure>`).join('');
  app.innerHTML = `<section class="detail-shell">
    <a class="all-projects-link" href="#/work/${categoryName}">← ${categoryName}</a>
    <div class="detail-head">${heading}</div>
    <div class="detail-sequence">${sequence}</div>
    <footer class="detail-foot"><a href="#/work/${categoryName}/${(id + projects[categoryName].length - 1) % projects[categoryName].length}">← Previous</a><a href="#/?section=contact">Contact</a><a href="#/work/${categoryName}/${(id + 1) % projects[categoryName].length}">Next →</a></footer>
  </section>`;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  }), { threshold: .18 });
  app.querySelectorAll('.reveal-frame').forEach(frame => observer.observe(frame));
  cleanup = () => observer.disconnect();
}

function renderImageLightbox() {
  const item = lightboxItems[lightboxIndex];
  lightboxZoom = 1;
  lightboxPanX = lightboxPanY = 0;
  imageLightboxStage.classList.remove('is-panning');
  imageLightboxImage.style.transform = '';
  imageLightboxImage.style.transformOrigin = 'center';
  imageLightboxImage.src = item.src;
  imageLightboxImage.alt = item.alt;
  imageLightbox.querySelector('.image-lightbox-prev').disabled = lightboxIndex === 0;
  imageLightbox.querySelector('.image-lightbox-next').disabled = lightboxIndex === lightboxItems.length - 1;
}

function openImageLightbox(items, index) {
  lightboxItems = items;
  lightboxIndex = index;
  lightboxReturnFocus = document.activeElement;
  renderImageLightbox();
  imageLightbox.showModal();
}

function stepImageLightbox(step) {
  const next = lightboxIndex + step;
  if (next < 0 || next >= lightboxItems.length) return;
  lightboxIndex = next;
  renderImageLightbox();
}

function openViewer(project, categoryName) {
  viewer.classList.remove('viewer--poster');
  viewerProject = project;
  viewerFrame = 0;
  viewerCategory = categoryName;
  viewerWheelAt = 0;
  returnFocus = document.activeElement;
  setProjectSeo(project, categoryName);
  renderViewer();
  viewer.showModal();
  document.body.style.overflow = 'hidden';
}

function openPosterViewer(project, index) {
  viewerProject = { ...project, frames: 1 };
  viewerFrame = 0;
  viewerCategory = 'poster';
  returnFocus = document.activeElement;
  setProjectSeo(project, 'poster');
  viewer.classList.add('viewer--poster');
  document.querySelector('#viewer-slide').innerHTML = project.cover
    ? `<button class="poster-preview-close" type="button" aria-label="关闭海报预览"><img class="poster-preview-image" src="${project.cover}" alt="${project.title}"></button>`
    : `<div class="poster-preview poster-card--${index + 1}"><span>${String(index + 1).padStart(2, '0')}</span></div>`;
  document.querySelector('.poster-preview-close')?.addEventListener('click', () => viewer.close());
  document.querySelector('#viewer-caption').textContent = project.title;
  viewer.querySelector('.viewer-prev').hidden = true;
  viewer.querySelector('.viewer-next').hidden = true;
  viewer.showModal();
  document.body.style.overflow = 'hidden';
}

function renderViewer() {
  document.querySelector('#viewer-slide').innerHTML = art(viewerProject, viewerFrame + 1);
  const image = document.querySelector('#viewer-slide .art--image img');
  if (image) {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `放大查看：${viewerProject.title} — ${viewerFrame + 1}`);
  }
  document.querySelector('#viewer-caption').textContent = viewerProject.title;
  const prev = viewer.querySelector('.viewer-prev');
  const next = viewer.querySelector('.viewer-next');
  const multiple = viewerProject.frames > 1;
  prev.hidden = next.hidden = !multiple;
  prev.disabled = viewerFrame === 0;
  next.disabled = viewerFrame === viewerProject.frames - 1;
  document.querySelector('#viewer-project-nav').hidden = !['book', 'packaging', 'play'].includes(viewerCategory);
}

function stepViewerProject(step) {
  const list = projects[viewerCategory];
  const index = list.findIndex(project => project.id === viewerProject.id);
  viewerProject = list[(index + step + list.length) % list.length];
  viewerFrame = 0;
  viewerWheelAt = 0;
  renderViewer();
}

viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
viewer.querySelector('.viewer-prev').addEventListener('click', () => { viewerFrame--; renderViewer(); });
viewer.querySelector('.viewer-next').addEventListener('click', () => { viewerFrame++; renderViewer(); });
viewer.querySelectorAll('[data-project-step]').forEach(button => button.addEventListener('click', () => stepViewerProject(Number(button.dataset.projectStep))));
viewer.addEventListener('close', () => { viewer.classList.remove('viewer--poster'); document.body.style.overflow = ''; if (viewerCategory) setCategorySeo(viewerCategory); returnFocus?.focus(); });
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' && viewerFrame < viewerProject.frames - 1) { viewerFrame++; renderViewer(); }
  if (event.key === 'ArrowLeft' && viewerFrame > 0) { viewerFrame--; renderViewer(); }
});
viewer.addEventListener('wheel', event => {
  if (!['book', 'packaging', 'play'].includes(viewerCategory)) return;
  event.preventDefault();
  const now = performance.now();
  if (now - viewerWheelAt < 280) return;
  const step = Math.sign(event.deltaY || event.deltaX);
  const nextFrame = viewerFrame + step;
  if (!step || nextFrame < 0 || nextFrame >= viewerProject.frames) return;
  viewerWheelAt = now;
  viewerFrame = nextFrame;
  renderViewer();
}, { passive: false });

document.addEventListener('click', event => {
  const image = event.target.closest('.project-detail-image, #viewer-slide .art--image img');
  if (!image) return;
  const images = image.matches('.project-detail-image')
    ? [...document.querySelectorAll('.project-detail-image')]
    : viewerProject.images.map((src, index) => ({ src, alt: `${viewerProject.title} — ${index + 1}` }));
  const items = images.map(item => item instanceof HTMLImageElement ? { src: item.currentSrc || item.src, alt: item.alt } : item);
  const index = image.matches('.project-detail-image') ? images.indexOf(image) : viewerFrame;
  openImageLightbox(items, index);
});
document.addEventListener('keydown', event => {
  if (!['Enter', ' '].includes(event.key)) return;
  const image = event.target.closest('.project-detail-image, #viewer-slide .art--image img');
  if (!image) return;
  event.preventDefault();
  image.click();
});
imageLightbox.querySelector('.image-lightbox-close').addEventListener('click', () => imageLightbox.close());
imageLightbox.querySelector('.image-lightbox-prev').addEventListener('click', () => stepImageLightbox(-1));
imageLightbox.querySelector('.image-lightbox-next').addEventListener('click', () => stepImageLightbox(1));
imageLightboxImage.addEventListener('load', () => {
  const ratio = imageLightboxImage.naturalWidth / imageLightboxImage.naturalHeight;
  const width = Math.min(innerWidth * .88, innerHeight * .88 * ratio);
  imageLightboxStage.style.width = `${width}px`;
  imageLightboxStage.style.height = `${width / ratio}px`;
});
function zoomLightbox(clientX, clientY) {
  const bounds = imageLightboxStage.getBoundingClientRect();
  const previousScale = lightboxZoom === 1 ? 1 : lightboxZoom === 2 ? 1.8 : 2.8;
  lightboxZoom = Math.min(3, lightboxZoom + 1);
  const scale = lightboxZoom === 2 ? 1.8 : 2.8;
  lightboxPanX -= (clientX - bounds.left - bounds.width / 2) * (scale / previousScale - 1);
  lightboxPanY -= (clientY - bounds.top - bounds.height / 2) * (scale / previousScale - 1);
  updateLightboxTransform();
}
function updateLightboxTransform() {
  const bounds = imageLightboxStage.getBoundingClientRect();
  const scale = lightboxZoom === 1 ? 1 : lightboxZoom === 2 ? 1.8 : 2.8;
  const limitX = bounds.width * (scale - 1) / 2;
  const limitY = bounds.height * (scale - 1) / 2;
  lightboxPanX = Math.max(-limitX, Math.min(limitX, lightboxPanX));
  lightboxPanY = Math.max(-limitY, Math.min(limitY, lightboxPanY));
  imageLightboxImage.style.transform = `translate3d(${lightboxPanX}px,${lightboxPanY}px,0) scale(${scale})`;
}
imageLightboxStage.addEventListener('pointerdown', event => {
  lightboxDrag = { x:event.clientX, y:event.clientY, panX:lightboxPanX, panY:lightboxPanY, moved:false };
  imageLightboxStage.setPointerCapture(event.pointerId);
  if (lightboxZoom > 1) imageLightboxStage.classList.add('is-panning');
});
imageLightboxStage.addEventListener('pointermove', event => {
  if (!lightboxDrag || lightboxZoom === 1) return;
  const dx = event.clientX - lightboxDrag.x;
  const dy = event.clientY - lightboxDrag.y;
  lightboxDrag.moved ||= Math.hypot(dx, dy) > 5;
  lightboxPanX = lightboxDrag.panX + dx;
  lightboxPanY = lightboxDrag.panY + dy;
  updateLightboxTransform();
});
imageLightboxStage.addEventListener('pointerup', event => {
  if (!lightboxDrag) return;
  const moved = lightboxDrag.moved;
  lightboxDrag = null;
  imageLightboxStage.classList.remove('is-panning');
  imageLightboxStage.releasePointerCapture(event.pointerId);
  if (!moved) zoomLightbox(event.clientX, event.clientY);
});
imageLightboxStage.addEventListener('pointercancel', () => {
  lightboxDrag = null;
  imageLightboxStage.classList.remove('is-panning');
});
imageLightboxStage.addEventListener('keydown', event => {
  if (!['Enter', ' '].includes(event.key)) return;
  event.preventDefault();
  const bounds = imageLightboxStage.getBoundingClientRect();
  zoomLightbox(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
});
imageLightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') stepImageLightbox(-1);
  if (event.key === 'ArrowRight') stepImageLightbox(1);
});
imageLightbox.addEventListener('wheel', event => { event.preventDefault(); imageLightbox.close(); }, { passive: false });
imageLightbox.addEventListener('close', () => lightboxReturnFocus?.focus());

function posters(content) {
  document.body.classList.add('poster-page');
  content.innerHTML = `<section class="poster-stage" style="height:${100 + posterStudies.length * 18}svh"><div class="poster-sticky">
    <div class="poster-deck">${posterStudies.map((project, index) => `<button class="poster-card" data-index="${index}" type="button" aria-label="${project.title}"><img data-src="${project.cover}" alt="${project.name}" decoding="async"></button>`).join('')}</div>
    <div class="poster-gesture" role="img" aria-label="Scroll"><img src="assets/icons/scroll-gesture.svg" alt=""><span>Scroll</span></div>
    <div class="poster-pagination">${posterStudies.map((_, index) => `<button class="poster-dot" data-index="${index}" type="button" aria-label="海报 ${index + 1}"></button>`).join('')}</div>
    <div class="poster-info"><div><h2></h2><p></p></div></div>
  </div></section>`;
  const stage = content.querySelector('.poster-stage');
  const sticky = content.querySelector('.poster-sticky');
  const deck = content.querySelector('.poster-deck');
  const cards = [...content.querySelectorAll('.poster-card')];
  const dots = [...content.querySelectorAll('.poster-dot')];
  const info = content.querySelector('.poster-info');
  let active = 0;
  let raf = 0;
  let swipe = null;
  let morph = 0;

  function render() {
    cards.forEach((card, index) => {
      const offset = index - active;
      const distance = Math.abs(offset);
      card.style.setProperty('--offset', offset);
      card.style.setProperty('--distance', distance);
      card.style.opacity = distance > 2 ? 0 : 1;
      card.style.zIndex = String(10 - distance);
      const image = card.querySelector('img');
      if (distance <= 2 && !image.src) image.src = image.dataset.src;
    });
    dots.forEach((dot, index) => dot.classList.toggle('is-active', index === active));
    info.querySelector('h2').textContent = posterStudies[active].title;
    info.querySelector('p').textContent = posterStudies[active].name;
  }

  function update() {
    raf = 0;
    const available = Math.max(1, stage.offsetHeight - innerHeight);
    const progress = Math.max(0, Math.min(1, -stage.getBoundingClientRect().top / available));
    morph = reduceMotion.matches ? 1 : Math.min(1, progress / .22);
    sticky.style.setProperty('--morph', morph.toFixed(3));
    const inset = innerWidth < 768 ? [5, 4] : innerWidth < 1200 ? [8, 5] : [18, 11];
    deck.style.transform = reduceMotion.matches ? 'none' : `translate(${(1 - morph) * inset[0]}vw, ${(1 - morph) * inset[1]}vh) scale(${.62 + morph * .38})`;
    const next = Math.round(Math.max(0, (progress - .22) / .78) * (cards.length - 1));
    if (next !== active) { active = next; render(); }
  }
  function requestUpdate() { if (!raf) raf = requestAnimationFrame(update); }
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  function scrollToPoster(index) {
    const available = stage.offsetHeight - innerHeight;
    scrollTo({ top: scrollY + stage.getBoundingClientRect().top + available * (.22 + index / (cards.length - 1) * .78), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  }
  cards.forEach((card, index) => card.addEventListener('click', () => index === active && morph >= .98 ? openPosterViewer(posterStudies[index], index) : scrollToPoster(index)));
  dots.forEach((dot, index) => dot.addEventListener('click', () => scrollToPoster(index)));
  sticky.addEventListener('pointerdown', event => { swipe = { x:event.clientX, y:event.clientY }; });
  sticky.addEventListener('pointerup', event => {
    if (!swipe) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) scrollToPoster(Math.max(0, Math.min(cards.length - 1, active + (dx < 0 ? 1 : -1))));
  });
  sticky.addEventListener('pointercancel', () => { swipe = null; });
  render(); update();
  cleanup = () => {
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener('scroll', requestUpdate);
    window.removeEventListener('resize', requestUpdate);
  };
}

function videoCard(project, projectIndex, copyIndex) {
  const height = project.ratioNumber > 1.5 ? '29vh' : project.ratioNumber > 1.1 ? '34vh' : project.ratioNumber > .85 ? '38vh' : project.ratioNumber > .65 ? '43vh' : '45vh';
  return `<button class="video-card" type="button" data-project="${projectIndex}" ${copyIndex === 1 ? '' : 'aria-hidden="true" tabindex="-1"'}><span class="video-card-caption"><span>${project.title}</span><span>${project.year}</span></span><span class="video-thumb" style="--ratio:${project.ratio};--height:${height}"><img src="${project.cover}" alt="" loading="eager" decoding="async"></span></button>`;
}

function videos(content) {
  document.body.classList.add('video-page');
  content.innerHTML = `<section class="video-showcase"><p>DRAG · SCROLL · HOVER</p><div class="video-carousel" tabindex="0"><div class="video-track">${[0, 1, 2].flatMap(copy => videoStudies.map((project, index) => videoCard(project, index, copy))).join('')}</div></div></section>`;
  const carousel = content.querySelector('.video-carousel');
  const track = content.querySelector('.video-track');
  const cards = [...content.querySelectorAll('.video-card')];
  const controller = new AbortController();
  const signal = controller.signal;
  let position = 0, setWidth = 1, raf = 0, last = performance.now(), dragging = false, hovering = false, moved = false, startX = 0, startPosition = 0, pressed = null;
  function draw() { if (position >= setWidth * 2) position -= setWidth; if (position < 0) position += setWidth; track.style.transform = `translate3d(${-position}px,0,0)`; }
  function measure() { setWidth = cards[videoStudies.length].offsetLeft - cards[0].offsetLeft; position = setWidth; draw(); }
  function animate(now) { if (reduceMotion.matches) { raf = 0; return; } const delta = Math.min(32, now - last); last = now; if (!dragging && !hovering) { position += delta * .025; draw(); } raf = requestAnimationFrame(animate); }
  carousel.addEventListener('pointerdown', event => { dragging = true; moved = false; startX = event.clientX; startPosition = position; pressed = Number(event.target.closest('.video-card')?.dataset.project ?? NaN); carousel.setPointerCapture(event.pointerId); }, { signal });
  carousel.addEventListener('pointermove', event => { if (!dragging) return; const distance = event.clientX - startX; moved ||= Math.abs(distance) > 6; position = startPosition - distance; draw(); }, { signal });
  carousel.addEventListener('pointerup', event => { dragging = false; carousel.releasePointerCapture(event.pointerId); if (!moved && Number.isFinite(pressed)) openVideoPlayer(pressed, content); pressed = null; }, { signal });
  window.addEventListener('wheel', event => {
    if (event.target instanceof Element && event.target.closest('.video-card')) return;
    event.preventDefault();
    position += (event.deltaX || event.deltaY) * .65;
    draw();
  }, { passive: false, signal });
  cards.forEach(card => {
    card.addEventListener('pointerenter', () => hovering = true, { signal });
    card.addEventListener('pointerleave', () => hovering = false, { signal });
    const thumb = card.querySelector('.video-thumb');
    thumb.addEventListener('pointermove', event => { if (reduceMotion.matches) return; const bounds = thumb.getBoundingClientRect(); const x = (event.clientX - bounds.left) / bounds.width - .5; const y = (event.clientY - bounds.top) / bounds.height - .5; thumb.style.transform = `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 13}deg) translateY(-8px)`; }, { signal });
    thumb.addEventListener('pointerleave', () => thumb.style.transform = '', { signal });
  });
  requestAnimationFrame(measure); raf = requestAnimationFrame(animate);
  cleanup = () => { cancelAnimationFrame(raf); controller.abort(); };
}

function openVideoPlayer(projectIndex, content) {
  cleanup();
  const project = videoStudies[projectIndex];
  const previousIndex = (projectIndex + videoStudies.length - 1) % videoStudies.length;
  const nextIndex = (projectIndex + 1) % videoStudies.length;
  setProjectSeo(project, 'video');
  content.innerHTML = `<section class="video-player-view"><button class="video-player-back" type="button">← Back to videos</button><div class="video-player-layout"><div class="video-player-media" style="--ratio:${project.ratio};--ratio-number:${project.ratioNumber}"><video controls playsinline preload="metadata" poster="${project.cover}"><source src="${project.video}" type="video/mp4">当前浏览器无法播放此视频。</video></div><div class="video-player-side"><div class="video-player-meta"><strong>${project.name}</strong><span>${project.category}</span><span>${project.year}</span><p>${project.description}</p></div><nav class="video-player-nav" aria-label="视频项目切换"><button type="button" data-video-project="${previousIndex}">← Previous</button><button type="button" data-video-project="${nextIndex}">Next →</button></nav></div></div></section>`;
  const video = content.querySelector('video');
  const controller = new AbortController();
  const signal = controller.signal;
  content.querySelectorAll('[data-video-project]').forEach(button => button.addEventListener('click', () => openVideoPlayer(Number(button.dataset.videoProject), content), { signal }));
  window.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target instanceof Element && event.target.closest('video, input, textarea, select')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      openVideoPlayer(event.key === 'ArrowLeft' ? previousIndex : nextIndex, content);
    }
  }, { signal });
  content.querySelector('.video-player-back').addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    cleanup();
    setCategorySeo('video');
    category('video');
    scrollTo(0, 0);
    mountBackTop();
  }, { signal });
  cleanup = () => { video.pause(); controller.abort(); };
}

function mountBackTop() {
  if (!app.querySelector('.back-top')) app.insertAdjacentHTML('beforeend', `<button class="back-top" type="button" aria-label="返回页面顶部"><img src="assets/models/back-to-top.png" alt=""><span>↑</span></button>`);
  const button = app.querySelector('.back-top');
  button.addEventListener('click', () => { playBlockSound('rocket'); scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' }); });
  if (document.body.classList.contains('home-page')) {
    const controller = new AbortController();
    const update = () => button.hidden = scrollY < app.querySelector('.home-hero').offsetHeight - 1;
    window.addEventListener('scroll', update, { passive:true, signal:controller.signal });
    update();
    const previousCleanup = cleanup;
    cleanup = () => { previousCleanup(); controller.abort(); };
  }
}

function missing() {
  app.innerHTML = '<section class="empty"><h1>Page not found.</h1><a href="#/">← Back home</a></section>';
}

function route() {
  cleanup(); cleanup = () => {};
  if (imageLightbox.open) imageLightbox.close();
  if (viewer.open) viewer.close();
  const [path, query] = (location.hash.slice(1) || '/').split('?');
  const parts = path.split('/').filter(Boolean);
  const section = new URLSearchParams(query).get('section');
  if (!parts.length) {
    const homeSeo = {
      all: ['Selected Works', 'Leah Knifee 精选品牌、包装、画册、海报、插画与动态视觉设计作品。'],
      about: ['About Leah Knifee', 'Leah Knifee，专注品牌视觉、包装与平面设计的视觉设计师。'],
      contact: ['Contact Leah Knifee', '联系 Leah Knifee，洽谈品牌视觉、包装及平面设计合作。']
    }[section];
    setSeo(homeSeo ? { title: homeSeo[0], description: homeSeo[1] } : {});
    home();
  }
  else if (parts[0] === 'work' && projects[parts[1]]) {
    if (parts.length === 3 && ['branding', 'illustration'].includes(parts[1])) {
      const project = projects[parts[1]][Number(parts[2])];
      if (project) { setProjectSeo(project, parts[1]); detail(parts[1], Number(parts[2])); }
      else { setSeo({ title: 'Page not found', noindex: true }); missing(); }
    } else if (parts.length === 2) { setCategorySeo(parts[1]); category(parts[1]); }
    else { setSeo({ title: 'Page not found', noindex: true }); missing(); }
  } else { setSeo({ title: 'Page not found', noindex: true }); missing(); }
  scrollTo(0, 0);
  if (section) requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView());
  mountBackTop();
}

window.addEventListener('hashchange', route);
const worksLink = document.querySelector('.site-header nav a[href="#/?section=all"]');
worksLink.addEventListener('click', event => {
  if (location.hash !== worksLink.hash) return;
  event.preventDefault();
  route();
});
route();
