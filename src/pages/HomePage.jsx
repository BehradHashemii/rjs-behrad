import Banner from "../layout/Banner";
import Carts from "../layout/Carts";
import Articles from "../layout/Articles";
import Portfolios from "../layout/Portfolios";
import Prompts from "../layout/Prompts";
import Hero from "../layout/Hero";
import SkillsSection from "../layout/SkillsSection";
import CTASection from "../layout/CTASection";
import Contact from "../components/Contact";
import SEOConfig from "../components/SEOConfig";

function HomePage() {
  return (
    <div>
      <SEOConfig
        title="پورتفولیو و نمونه کارهای برنامه نویسی | بهراد هاشمی"
        description="وبسایت شخصی بهراد هاشمی - توسعه‌دهنده فرانت‌اند و وب، ارائه دهنده نمونه کارها، مقالات تخصصی و پرامپت‌های هوش مصنوعی."
      />
      <Banner />
      <Hero />
      <SkillsSection />
      <Carts />
      <Portfolios />
      <Articles />
      <Prompts />
      <CTASection />
      <Contact />
    </div>
  );
}

export default HomePage;
