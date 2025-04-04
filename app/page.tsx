import LandingPage from '@/components/LandingPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FeedForward',
  description: 'FeedForward hjelper deg med å samle inn, analysere og handle på tilbakemeldinger effektivt. Skap bedre produkter og tjenester gjennom meningsfulle brukerinnsikter.',
}

export default function Home() {
  return <LandingPage />;
}
