"use client";

import React from "react";
import { Link, Button } from "@heroui/react";
import styles from "./page.module.css";
import { usePathname, useRouter } from "next/navigation";
import Reference from "../../../assets/icons/reference.svg";
import Earth from "../../../assets/icons/earth.svg";
import MageFilter from "../../../assets/icons/mage-filter.svg";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const placement = [
    { id: 1, icon: Reference, name: "Alerts", path: "/alerts" },
    { id: 2, icon: Earth, name: "Map", path: "/" },
    { id: 3, icon: MageFilter, name: "Report", path: "/add-alert" },
  ];

  const handleNavigation = (path) => {
    if (pathname === path) {
      router.push("/"); 
    } else {
      router.push(path); 
    }
  };

  return (
    <section className={styles.sidebar_section}>
      <article className={styles.sidebar_article_header}>
        <Button className={styles.sidebar_logo} as={Link} href={"/"}>
          <Reference className={styles.logo} />
        </Button>
      </article>
      <hr aria-orientation="horizontal" className={styles.hr_line} />
      <article className={styles.sidebar_article_items}>
        {placement.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Button
              key={item.id}
              className={`${styles.sidebar_btn} ${ isActive ? styles.active : "" }`}
              onPress={() => handleNavigation(item.path)}
            >
              <item.icon className={styles.icons} />
              <p className={styles.text_name_btn}>{item.name}</p>
            </Button>
          );
        })}
      </article>
    </section>
  );
};

export default Sidebar;
