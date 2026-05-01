---
title: "设计系统笔记"
date: "2026-04-28"
tags: ["设计", "UI"]
excerpt: "关于 Design Token 与组件化设计的一些思考。"
---

# 设计系统笔记

## Design Token

Design Token 是设计系统的基础原子，包括颜色、字体、间距等。

| Token   | 用途 | 示例     |
| ------- | ---- | -------- |
| color   | 颜色 | `--c-bg` |
| spacing | 间距 | `--s-4`  |
| radius  | 圆角 | `--r-sm` |

## 组件层级

1. **原子组件** — Button、Input、Icon
2. **分子组件** — SearchBar、Card
3. **有机体组件** — Navigation、Footer

## 个人项目实践

在本项目中，使用 CSS 自定义属性实现主题切换：

```css
:root {
  --c-bg: #ffffff;
  --c-text: #111111;
}

[data-theme="dark"] {
  --c-bg: #111111;
  --c-text: #ffffff;
}
```

> 好的设计系统不是约束，而是让创意有章可循。
