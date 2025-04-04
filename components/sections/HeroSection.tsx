import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useSession } from 'next-auth/react';

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

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const HeroSection = () => {
  const { data: session } = useSession();

  return (
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
        Transformer din tilbakemeldingsprosess
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
            <Button className="cursor-pointer">
              Kom i gang <ArrowRight size={20} />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}; 