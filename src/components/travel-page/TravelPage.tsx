"use client";

import React from "react";
import { MasonryGrid, type MasonryItem } from "@/components/masonry-grid/MasonryGrid";
import { type SiteLocale } from "@/lib/i18n";
import { Loading } from "@/components/common/loading/Loading";
import styles from "./TravelPage.module.scss";

interface TravelPageProps {
  locale: SiteLocale;
}

export function TravelPage({ locale }: TravelPageProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  // Hardcoded parameters for easy tuning as requested
  const masonryParams = {
    ease: "power3.out",
    duration: 1,
    stagger: 0.05,
    animateFrom: "center" as const,
    scaleOnHover: true,
    hoverScale: 0.95,
    blurToFocus: true,
    colorShiftOnHover: false,
  };

  const travelItems: MasonryItem[] = [
    {
      id: "1",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600&h=900",
      url: "https://unsplash.com/photos/beach-during-daytime-5_S9f9W6S_k",
      height: 400,
      title: "Tropical Paradise",
    },
    {
      id: "2",
      img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600&h=750",
      url: "https://unsplash.com/photos/person-standing-on-top-of-mountain-mountain-during-daytime-O6N9RVgFpqU",
      height: 250,
      title: "Mountain Heights",
    },
    {
      id: "3",
      img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600&h=800",
      url: "https://unsplash.com/photos/brown-mountains-near-sea-during-daytime-h_mE-v-R9G4",
      height: 600,
      title: "Desert Road",
    },
    {
      id: "4",
      img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600&h=1000",
      url: "https://unsplash.com/photos/eiffel-tower-in-paris-france-v9f_o_v_o",
      height: 500,
      title: "Paris Mornings",
    },
    {
      id: "5",
      img: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=600&h=600",
      url: "https://unsplash.com/photos/blue-lake-near-mountain-during-daytime-9_S9f9W6S_k",
      height: 350,
      title: "Emerald Lakes",
    },
    {
      id: "6",
      img: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80&w=600&h=900",
      url: "https://unsplash.com/photos/green-trees-near-lake-during-daytime-h_mE-v-R9G4",
      height: 450,
      title: "Northern Lights",
    },
    {
      id: "7",
      img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=600&h=800",
      url: "https://unsplash.com/photos/santorini-greece-v9f_o_v_o",
      height: 300,
      title: "Santorini Blue",
    },
    {
      id: "8",
      img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=600&h=900",
      url: "https://unsplash.com/photos/green-trees-in-forest-during-daytime-O6N9RVgFpqU",
      height: 480,
      title: "Forest Solitude",
    },
    {
      id: "9",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600&h=700",
      url: "https://unsplash.com/photos/lake-and-mountain-under-white-clouds-O6N9RVgFpqU",
      height: 380,
      title: "Lake Reflection",
    },
    {
      id: "10",
      img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600&h=900",
      url: "https://unsplash.com/photos/brown-wooden-house-on-island-near-mountains-h_mE-v-R9G4",
      height: 520,
      title: "Island Cabin",
    },
    {
      id: "11",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=600&h=800",
      url: "https://unsplash.com/photos/mountain-covered-with-snow-v9f_o_v_o",
      height: 460,
      title: "Snowy Peaks",
    },
    {
      id: "12",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600&h=600",
      url: "https://unsplash.com/photos/landscape-photography-of-forest-and-lake-O6N9RVgFpqU",
      height: 320,
      title: "Yosemite Valley",
    },
    {
      id: "13",
      img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600&h=900",
      url: "https://unsplash.com/photos/green-mountains-under-white-clouds-h_mE-v-R9G4",
      height: 580,
      title: "Alpine Meadows",
    },
    {
      id: "14",
      img: "https://images.unsplash.com/photo-1532274402911-5a3b2b7c933b?auto=format&fit=crop&q=80&w=600&h=750",
      url: "https://unsplash.com/photos/selective-focus-photography-of-green-field-v9f_o_v_o",
      height: 420,
      title: "Golden Hour",
    },
    {
      id: "15",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=600&h=1000",
      url: "https://unsplash.com/photos/person-standing-on-green-grass-field-near-lake-during-daytime-O6N9RVgFpqU",
      height: 550,
      title: "Wanderlust",
    },
    {
      id: "16",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600&h=800",
      url: "https://unsplash.com/photos/yosemite-valley-O6N9RVgFpqU",
      height: 400,
      title: "Mirror Lake",
    },
    {
      id: "17",
      img: "https://images.unsplash.com/photo-1532274402911-5a3b2b7c933b?auto=format&fit=crop&q=80&w=600&h=700",
      url: "https://unsplash.com/photos/sunset-landscape-v9f_o_v_o",
      height: 350,
      title: "Golden Plains",
    },
    {
      id: "18",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600&h=900",
      url: "https://unsplash.com/photos/blue-lake-near-mountain-h_mE-v-R9G4",
      height: 500,
      title: "Glacier Bay",
    },
    {
      id: "19",
      img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600&h=600",
      url: "https://unsplash.com/photos/person-standing-on-top-of-mountain-O6N9RVgFpqU",
      height: 300,
      title: "Mountain Air",
    },
    {
      id: "20",
      img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600&h=800",
      url: "https://unsplash.com/photos/wooden-house-on-island-h_mE-v-R9G4",
      height: 450,
      title: "Dockside",
    },
    {
      id: "21",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=600&h=1000",
      url: "https://unsplash.com/photos/starry-night-v9f_o_v_o",
      height: 600,
      title: "Milky Way",
    },
    {
      id: "22",
      img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600&h=750",
      url: "https://unsplash.com/photos/green-mountains-h_mE-v-R9G4",
      height: 380,
      title: "Evergreen",
    },
    {
      id: "23",
      img: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80&w=600&h=900",
      url: "https://unsplash.com/photos/green-trees-near-lake-O6N9RVgFpqU",
      height: 550,
      title: "Morning Mist",
    },
    {
      id: "24",
      img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=600&h=800",
      url: "https://unsplash.com/photos/santorini-v9f_o_v_o",
      height: 420,
      title: "Oia Sunset",
    },
    {
      id: "25",
      img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=600&h=600",
      url: "https://unsplash.com/photos/forest-O6N9RVgFpqU",
      height: 300,
      title: "Deep Woods",
    },
    {
      id: "26",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600&h=900",
      url: "https://unsplash.com/photos/beach-O6N9RVgFpqU",
      height: 480,
      title: "Summer Breeze",
    },
    {
      id: "27",
      img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600&h=750",
      url: "https://unsplash.com/photos/road-trip-h_mE-v-R9G4",
      height: 370,
      title: "Open Road",
    },
    {
      id: "28",
      img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600&h=800",
      url: "https://unsplash.com/photos/paris-v9f_o_v_o",
      height: 410,
      title: "City of Lights",
    },
    {
      id: "29",
      img: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=600&h=1000",
      url: "https://unsplash.com/photos/mountain-lake-O6N9RVgFpqU",
      height: 520,
      title: "Crystal Waters",
    },
    {
      id: "30",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600&h=600",
      url: "https://unsplash.com/photos/sunset-O6N9RVgFpqU",
      height: 330,
      title: "Quiet Dusk",
    },
    {
      id: "31",
      img: "https://images.unsplash.com/photo-1532274402911-5a3b2b7c933b?auto=format&fit=crop&q=80&w=600&h=900",
      url: "https://unsplash.com/photos/field-v9f_o_v_o",
      height: 460,
      title: "Lavender Fields",
    },
    {
      id: "32",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600&h=800",
      url: "https://unsplash.com/photos/rocks-h_mE-v-R9G4",
      height: 390,
      title: "Coastal Cliffs",
    },
    {
      id: "33",
      img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600&h=750",
      url: "https://unsplash.com/photos/summit-O6N9RVgFpqU",
      height: 440,
      title: "High Peak",
    },
    {
      id: "34",
      img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600&h=900",
      url: "https://unsplash.com/photos/cabin-h_mE-v-R9G4",
      height: 510,
      title: "Cozy Retreat",
    },
    {
      id: "35",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=600&h=800",
      url: "https://unsplash.com/photos/stars-v9f_o_v_o",
      height: 470,
      title: "Starlight",
    },
  ];

  const title = locale === "zh-CN" ? "旅途足迹" : "Travel Journal";
  const eyebrow = locale === "zh-CN" ? "探索世界" : "EXPLORE THE WORLD";

  return (
    <main className={styles.page}>
      {isLoading && (
        <Loading text={locale === "zh-CN" ? "正在开启旅程..." : "STARTING JOURNEY..."} />
      )}

      <div className={`${styles.frame} ${isLoading ? styles.hidden : ""}`}>
        <header className={styles.header}>
          <div className={styles.titleWrap}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h1 className={styles.title}>{title}</h1>
          </div>
        </header>

        <section className={styles.gridContainer}>
          <MasonryGrid items={travelItems} {...masonryParams} onReady={() => setIsLoading(false)} />
        </section>
      </div>
    </main>
  );
}
