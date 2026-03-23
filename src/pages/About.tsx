import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BlogHeader from "@/components/BlogHeader";

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <BlogHeader />
      <main className="max-w-[820px] mx-auto px-8">
        <div className="py-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-muted-foreground hover:text-emerald-600 dark:hover:text-primary transition-colors font-body">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
        <article className="pb-16">
          <header className="py-12 border-b border-gray-200 dark:border-border mb-12">
            <p className="text-[11px] uppercase tracking-widest text-emerald-600 dark:text-primary font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-emerald-600 dark:bg-primary inline-block"></span>
              About
            </p>
            <h1 className="font-heading text-4xl md:text-5xl font-black text-gray-900 dark:text-foreground mb-4 leading-tight">
              Quantized Quality
            </h1>
            <p className="text-gray-500 dark:text-muted-foreground font-body text-sm leading-relaxed max-w-lg">
              A personal space for exploring artificial intelligence, quality assurance engineering, 
              and the intersection where they meet.
            </p>
            <p className="text-gray-400 dark:text-gray-500 font-body text-sm mt-4">
              Chathura S. Rajapakse
            </p>
          </header>
          
          <div className="space-y-6 font-body text-gray-900 dark:text-foreground leading-relaxed">
            <p className="text-sm text-gray-500 dark:text-muted-foreground">
              This blog serves as my digital lab notebook. Here you'll find deep dives into AI architectures,
              practical guides for testing strategies, and cross-disciplinary research.
            </p>
            
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-foreground pt-4">Topics</h2>
            <ul className="space-y-3">
              <li className="text-sm text-gray-500 dark:text-muted-foreground">
                <span className="text-emerald-600 dark:text-primary font-semibold">AI & ML</span> — Transformers, RAG pipelines, LLM evaluation, prompt engineering
              </li>
              <li className="text-sm text-gray-500 dark:text-muted-foreground">
                <span className="text-emerald-600 dark:text-primary font-semibold">QA Engineering</span> — Test automation, mutation testing, visual regression, CI/CD
              </li>
              <li className="text-sm text-gray-500 dark:text-muted-foreground">
                <span className="text-emerald-600 dark:text-primary font-semibold">Research</span> — Testing AI systems, AI-assisted testing, emerging methodologies
              </li>
            </ul>
            
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-foreground pt-4">Philosophy</h2>
            <p className="text-sm text-gray-500 dark:text-muted-foreground">
              Learning by writing. Every post is a synthesis of research, experimentation, and
              practical experience.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
};

export default About;
