import { motion } from 'framer-motion';
import { BarChart2, Shield, Users, Zap } from 'lucide-react';

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

export const FeaturesSection = () => {
  const features = [
    {
      id: 'analytics',
      icon: <BarChart2 size={28} className="text-blue-600" />,
      title: "Analytisk Dashboard",
      description: "Få sanntidsinnsikt med vårt kraftfulle analytiske dashboard. Spor trender i tilbakemeldinger og ta datadrevne beslutninger."
    },
    {
      id: 'team',
      icon: <Users size={28} className="text-blue-600" />,
      title: "Team Samarbeid",
      description: "Samarbeid sømløst med teamet ditt. Del tilbakemeldinger, tildel oppgaver og følg fremgang på ett sted."
    },
    {
      id: 'security',
      icon: <Shield size={28} className="text-blue-600" />,
      title: "Sikker & Privat",
      description: "Dine data er beskyttet med bedriftsgrad sikkerhet. Vi bruker kryptering og følger strenge personvernstandarder."
    },
    {
      id: 'efficiency',
      icon: <Zap size={28} className="text-blue-600" />,
      title: "Rask & Effektiv",
      description: "Rask oppsett og intuitivt grensesnitt. Kom i gang på minutter og se resultater umiddelbart."
    }
  ];

  return (
    <motion.section 
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="container mx-auto px-4 py-12 sm:py-20 bg-white"
    >
      <motion.h2 
        variants={bounceIn}
        whileInView="animate"
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12"
      >
        Kraftfulle Funksjoner
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            variants={bounceIn}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-3 sm:mb-4">{feature.icon}</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}; 