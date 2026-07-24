import Hero from "../components/Hero";
import ServicesSection from "../components/ServicesSection";
import SkillsSection from "../components/SkillsSection";
import Portfolios from "../layout/Portfolios";
import Articles from "../layout/Articles";
import CTASection from "../components/CTASection";
import Contact from "../components/Contact";
import ScrollReveal from "../components/ScrollReveal";

function HomePage() {
  return (
    <div>
      <ScrollReveal direction="up" delay={50}>
        <Hero />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={100}>
        <ServicesSection />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={100}>
        <SkillsSection />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={100}>
        <Portfolios />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={100}>
        <Articles />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={100}>
        <CTASection />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={100}>
        <Contact />
      </ScrollReveal>
    </div>
  );
}

export default HomePage;
