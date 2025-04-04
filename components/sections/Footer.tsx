import { motion } from 'framer-motion';
import Link from 'next/link';

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

export const Footer = () => {
  return (
    <motion.footer 
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="bg-card text-card-foreground py-8 sm:py-12"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold">FeedForward</h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">© {new Date().getFullYear()} Alle rettigheter reservert</p>
          </div>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base">Dashboard</Link>
            <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base">Features</Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}; 