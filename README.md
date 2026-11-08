# 沉星手册 · Sinking Star Handbook

《沉星之序》(Order of the Sinking Star) 非官方玩家攻略手册。纯静态站点，无构建依赖。

## 在线预览

- **最新发布**：<https://62850f85.pinme.dev>
- 发布方式：pinme（IPFS 静态托管）。每次重新上传会生成新链接，旧链接仍可访问；最新地址以本节为准。

## 页面

| 文件 | 内容 |
| --- | --- |
| `index.html` | 封面 · 手册速览 · 目录 |
| `map.html` | 第一章 · 识图（社区交互地图使用指南） |
| `find.html` | 第二章 · 寻题（四步核对法 + 收录统计） |
| `notation.html` | 第三章 · 读谱（解法记号详解 + F/B 存疑说明） |
| `levels.html` | 第四章 · 关卡索引（946 关可搜索，交互页） |
| `about.html` | 附录 · 关于与致谢 |

## 目录结构

```
assets/
  style.css            全站样式（原创夜航手册风）
  main.js              星空画布 / 导航 / 索引交互
  icon.svg             站点图标
  data/
    levels-index.js    生成的关卡索引（script 包装，支持 file:// 直开）
    levels-index.json  同上（JSON 格式）
    stats.json         聚合统计
    raw/               joric/ootss 原始数据（Unlicense 公共领域）
tools/
  build_index.py       索引生成脚本
```

## 重新生成索引

```bash
python -I tools/build_index.py assets/data/raw assets/data
```

依赖 `assets/data/raw/` 下的 5 个源文件（markers.json、regions.json、
solutions.json、solutions.txt、wt.txt），均来自
https://github.com/joric/ootss （Unlicense），可随时重新下载更新快照。

## 本地预览

```bash
python -m http.server 8737
# 打开 http://127.0.0.1:8737/
```

直接双击 `levels.html` 也可以用（索引有 `.js` 包装，file:// 下同样可用）。

## 版权

- 文案与设计：本手册原创
- 关卡数据：joric/ootss，Unlicense（公共领域）
- 游戏《沉星之序》一切权利归 Thekla、Arc Games、Gamirror Games 及各自权利人
