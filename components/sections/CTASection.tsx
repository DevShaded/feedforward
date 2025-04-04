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

export const CTASection = () => {
  const { data: session } = useSession();

  return (
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
  );
}; 