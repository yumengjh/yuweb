"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./ExploreMenu.module.scss";

const EXPLORE_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=640&h=480";

type LocaleStrings = {
  tag: string;
  imageTitle: string;
  imageDesc: string;
  creativeLabel: string;
  knowledgeLabel: string;
  viewAll: string;
  links: {
    href: string;
    title: string;
    desc: string;
  }[];
};

const zhStrings: LocaleStrings = {
  tag: "DISCOVER",
  imageTitle: "探索更多可能",
  imageDesc: "创意、知识、工具与社区的交叉入口。",
  creativeLabel: "创意与视觉",
  knowledgeLabel: "知识与社区",
  viewAll: "查看全部探索 →",
  links: [
    { href: "/photography", title: "摄影", desc: "用镜头捕捉世界的各个角落。" },
    { href: "/design", title: "设计", desc: "视觉语言与界面美学的持续探索。" },
    { href: "/tools", title: "工具箱", desc: "日常使用与长期收藏的工具与工作流。" },
    { href: "/reading", title: "阅读", desc: "正在读与反复读的书与长文。" },
    { href: "/music", title: "音乐", desc: "工作与思考时的音乐记录。" },
    { href: "/podcast", title: "播客", desc: "值得收听的播客节目与音频笔记。" },
    { href: "/lab", title: "实验室", desc: "未发布的实验与原型探索。" },
    { href: "/opensource", title: "开源", desc: "参与的开源项目与贡献记录。" },
    { href: "/friends", title: "友链", desc: "志同道合的朋友与值得拜访的站点。" },
    { href: "/guestbook", title: "留言板", desc: "留下一句话，打个招呼。" },
    { href: "/journey", title: "旅程", desc: "经历、阶段与仍在推进的工作。" },
    { href: "/collections", title: "收藏", desc: "书籍、文章与素材的长期留存。" },
  ],
};

const enStrings: LocaleStrings = {
  tag: "DISCOVER",
  imageTitle: "Explore More Possibilities",
  imageDesc: "Crossroads of creativity, knowledge, tools, and community.",
  creativeLabel: "Creative & Visual",
  knowledgeLabel: "Knowledge & Community",
  viewAll: "View All Explorations →",
  links: [
    { href: "/photography", title: "Photography", desc: "Capturing the world through the lens." },
    { href: "/design", title: "Design", desc: "Visual language and interface aesthetics." },
    { href: "/tools", title: "Tools", desc: "Daily tools and long-term workflows." },
    { href: "/reading", title: "Reading", desc: "Books and long reads, in progress and on repeat." },
    { href: "/music", title: "Music", desc: "Music notes for work and thinking." },
    { href: "/podcast", title: "Podcast", desc: "Worth-listening podcasts and audio notes." },
    { href: "/lab", title: "Lab", desc: "Unreleased experiments and prototypes." },
    { href: "/opensource", title: "Open Source", desc: "Open-source projects and contributions." },
    { href: "/friends", title: "Friends", desc: "Like-minded friends and sites worth visiting." },
    { href: "/guestbook", title: "Guestbook", desc: "Leave a note or say hello." },
    { href: "/journey", title: "Journey", desc: "Experience, phases, and work in progress." },
    { href: "/collections", title: "Collections", desc: "A long-term archive of books, articles, and materials." },
  ],
};

function isEnglish(pathname: string): boolean {
  return pathname.startsWith("/en");
}

export function ExploreMenu() {
  const pathname = usePathname();
  const isEn = isEnglish(pathname);
  const s = isEn ? enStrings : zhStrings;
  const prefix = isEn ? "/en" : "";

  const creativeLinks = s.links.slice(0, 6);
  const knowledgeLinks = s.links.slice(6, 12);

  return (
    <div className={styles.root}>
      <div className={styles.imagePanel}>
        <img alt={s.imageTitle} height={480} loading="lazy" src={EXPLORE_IMAGE} width={640} />
        <div className={styles.imageOverlay}>
          <span className={styles.imageOverlayTag}>{s.tag}</span>
          <p className={styles.imageOverlayTitle}>{s.imageTitle}</p>
          <p className={styles.imageOverlayDesc}>{s.imageDesc}</p>
        </div>
      </div>

      <div className={styles.groups}>
        <div className={styles.group}>
          <p className={styles.groupLabel}>{s.creativeLabel}</p>
          <ul className={styles.groupList}>
            {creativeLinks.map((link) => (
              <li key={link.href}>
                <Link className={styles.groupLink} href={`${prefix}${link.href}`}>
                  <span className={styles.groupLinkTitle}>{link.title}</span>
                  <span className={styles.groupLinkDesc}>{link.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.group}>
          <p className={styles.groupLabel}>{s.knowledgeLabel}</p>
          <ul className={styles.groupList}>
            {knowledgeLinks.map((link) => (
              <li key={link.href}>
                <Link className={styles.groupLink} href={`${prefix}${link.href}`}>
                  <span className={styles.groupLinkTitle}>{link.title}</span>
                  <span className={styles.groupLinkDesc}>{link.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
