import { useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";

import PromptRelated from "./PromptRelated";
import PromptContent from "./PromptContent";
import promptsData from "../data/prompts.json";
import styles from "./PromptDetailsPage.module.css";
import Breadcrumb from "../components/Breadcrumb";
import SEOConfig from "../components/SEOConfig";

function PromptDetailsPage() {
  const { slug } = useParams();
  const contentRef = useRef(null);

  // پیدا کردن پرامپت فعلی بر اساس slug یا id
  const prompt = useMemo(() => {
    return (promptsData || []).find(
      (item) => item.slug === slug || String(item.id) === String(slug),
    );
  }, [slug]);

  // پرامپت‌های مرتبط (بر اساس niche یا tool یکسان)
  const relatedPrompts = useMemo(() => {
    if (!prompt) return [];

    return (promptsData || [])
      .filter((item) => {
        if (item.id === prompt.id) return false;
        const isSameNiche = item.niche && item.niche === prompt.niche;
        const isSameTool = item.tool && item.tool.toLowerCase() === prompt.tool?.toLowerCase();
        return isSameNiche || isSameTool;
      })
      .slice(0, 4);
  }, [prompt]);

  if (!prompt) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.notFound}>
          <h2>پرامپت یافت نشد</h2>
          <p>متاسفانه پرامپت مورد نظر شما پیدا نشد یا حذف شده است.</p>
          <Link to="/prompts" className={styles.backBtn}>
            بازگشت به بانک پرامپت‌ها
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "خانه", link: "/" },
    { label: "بانک پرامپت‌ها", link: "/prompts" },
    ...(prompt.niche
      ? [
          {
            label: prompt.niche,
            link: `/prompts?niche=${encodeURIComponent(prompt.niche)}`,
          },
        ]
      : []),
    { label: prompt.title },
  ];

  return (
    <div className={styles.pageWrapper}>
      <SEOConfig
        title={`${prompt.title} | بانک پرامپت بهراد`}
        description={
          prompt.prompt
            ? prompt.prompt.slice(0, 160)
            : "پرامپت تخصصی و تست‌شده هوش مصنوعی در پورتفولیو بهراد هاشمی"
        }
        ogImage={prompt.image || "/banner.png"}
      />

      <Breadcrumb items={breadcrumbItems} />

      <div className={styles.layout}>
        <main className={styles.mainContent}>
          <PromptContent
            key={prompt.id || prompt.slug}
            prompt={prompt}
            styles={styles}
            contentRef={contentRef}
          />
        </main>

        <aside className={styles.sidebarContent}>
          <PromptRelated
            relatedPrompts={relatedPrompts}
            currentTool={prompt.tool}
            styles={styles}
          />
        </aside>
      </div>
    </div>
  );
}

export default PromptDetailsPage;
