import Contact from "../components/Contact";
import ScrollReveal from "../components/ScrollReveal";

function ContactPage() {
  return (
    <main>
      <ScrollReveal direction="up" delay={50}>
        <Contact />
      </ScrollReveal>
    </main>
  );
}

export default ContactPage;
