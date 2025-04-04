import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const bounceIn = {
  initial: { opacity: 0, scale: 0.8, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { 
    type: "spring",
    stiffness: 200,
    damping: 15,
    duration: 0.3
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export const FAQSection = () => {
  const faqs = [
    {
      id: 'what-is',
      question: "Hva er FeedForward?",
      answer: "FeedForward er en plattform for tilbakemeldingshåndtering som hjelper bedrifter med å samle inn, analysere og handle på brukertilbakemeldinger effektivt."
    },
    {
      id: 'how-it-works',
      question: "Hvordan fungerer det?",
      answer: "Opprett tilbakemeldingsskjemaer, del dem med brukerne dine, samle inn svar og analyser dataene for å ta informerte beslutninger."
    },
    {
      id: 'security-faq',
      question: "Er det sikkert?",
      answer: "Ja, vi bruker bransjestandard kryptering og sikkerhetstiltak for å beskytte dine data."
    }
  ];

  return (
    <motion.section 
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="container mx-auto px-4 py-12 sm:py-20"
    >
      <motion.h2 
        variants={bounceIn}
        whileInView="animate"
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12"
      >
        Ofte Stilte Spørsmål
      </motion.h2>
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
        {faqs.map((faq) => (
          <motion.div
            key={faq.id}
            variants={fadeInUp}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{faq.question}</h3>
            <p className="text-sm sm:text-base text-gray-600">{faq.answer}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}; 