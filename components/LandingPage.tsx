'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Shield, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useSession } from 'next-auth/react';
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

const rotateIn = {
  initial: { opacity: 0, rotate: -10 },
  animate: { opacity: 1, rotate: 0 },
  transition: { 
    type: "spring",
    stiffness: 200,
    damping: 15,
    duration: 0.3
  }
};

const slideIn = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { 
    type: "spring",
    stiffness: 200,
    damping: 15,
    duration: 0.3
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
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

const LandingPage = () => {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <motion.section 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="container mx-auto px-4 py-12 sm:py-20 text-center"
      >
        <motion.h2 
          variants={bounceIn}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6"
        >
          Transformer Tilbakemeldingsprosessen Din
        </motion.h2>
        <motion.p 
          variants={slideIn}
          className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
        >
          FeedForward hjelper deg med å samle inn, analysere og handle på tilbakemeldinger effektivt. 
          Skap bedre produkter og tjenester gjennom meningsfulle brukerinnsikter.
        </motion.p>
        <motion.div variants={rotateIn} className="px-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={session?.user ? "/dashboard" : "/register"} className="mx-auto">
              <Button className=" cursor-pointer">
                Kom i gang <ArrowRight size={20} />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
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
          {[
            {
              icon: <BarChart2 size={28} className="text-blue-600" />,
              title: "Analytisk Dashboard",
              description: "Få sanntidsinnsikt med vårt kraftfulle analytiske dashboard. Spor trender i tilbakemeldinger og ta datadrevne beslutninger."
            },
            {
              icon: <Users size={28} className="text-blue-600" />,
              title: "Team Samarbeid",
              description: "Samarbeid sømløst med teamet ditt. Del tilbakemeldinger, tildel oppgaver og følg fremgang på ett sted."
            },
            {
              icon: <Shield size={28} className="text-blue-600" />,
              title: "Sikker & Privat",
              description: "Dine data er beskyttet med bedriftsgrad sikkerhet. Vi bruker kryptering og følger strenge personvernstandarder."
            },
            {
              icon: <Zap size={28} className="text-blue-600" />,
              title: "Rask & Effektiv",
              description: "Rask oppsett og intuitivt grensesnitt. Kom i gang på minutter og se resultater umiddelbart."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
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

      {/* FAQ Section */}
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
          {[
            {
              question: "Hva er FeedForward?",
              answer: "FeedForward er en plattform for tilbakemeldingshåndtering som hjelper bedrifter med å samle inn, analysere og handle på brukertilbakemeldinger effektivt."
            },
            {
              question: "Hvordan fungerer det?",
              answer: "Opprett tilbakemeldingsskjemaer, del dem med brukerne dine, samle inn svar og analyser dataene for å ta informerte beslutninger."
            },
            {
              question: "Er det sikkert?",
              answer: "Ja, vi bruker bransjestandard kryptering og sikkerhetstiltak for å beskytte dine data."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              variants={bounceIn}
              className="bg-white p-4 sm:p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-sm sm:text-base text-gray-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="container mx-auto px-4 py-12 sm:py-20 text-center"
      >
        <motion.div
          variants={bounceIn}
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <motion.h2 
            variants={bounceIn}
            whileInView="animate"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Hva er det du venter på?
          </motion.h2>
          <motion.p 
            variants={slideIn}
            whileInView="animate"
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-gray-600 mb-8"
          >
            Kom i gang med FeedForward i dag og transformér måten du håndterer tilbakemeldinger på.
          </motion.p>
          <motion.div 
            variants={rotateIn}
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={session?.user ? "/dashboard" : "/register"} className="mx-auto">
                <Button className="cursor-pointer">
                  Kom i gang <ArrowRight size={20} />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="bg-gray-900 text-white py-8 sm:py-12"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold">FeedForward</h2>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">© {new Date().getFullYear()} Alle rettigheter reservert</p>
            </div>
            <div className="flex gap-4 sm:gap-6">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Dashboard</Link>
              <Link href="/features" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Features</Link>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage; 