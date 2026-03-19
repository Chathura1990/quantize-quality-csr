import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BlogHeader from "@/components/BlogHeader";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <main className="container mx-auto px-6 max-w-3xl">
        <div className="py-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
            <ArrowLeft className="w-4 h-4" />
            Back to posts
          </Link>
        </div>
        <article className="pb-16">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">About</h1>
          <div className="space-y-5 font-body text-foreground leading-relaxed text-[16px]">
            <p>
              Welcome to <strong>Research Notes</strong> — a personal space where I document my explorations in
              artificial intelligence and quality assurance engineering.
            </p>
            <p>
              This blog serves as my digital lab notebook. Here you'll find deep dives into AI architectures,
              practical guides for testing strategies, and cross-disciplinary research where AI meets QA.
            </p>
            <h2 className="font-heading text-2xl font-semibold text-foreground pt-4">Topics I Cover</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>AI & Machine Learning</strong> — Transformers, RAG pipelines, LLM evaluation, prompt engineering</li>
              <li><strong>Quality Assurance</strong> — Test automation, mutation testing, visual regression, CI/CD strategies</li>
              <li><strong>Research</strong> — Where AI and QA intersect: testing AI systems, AI-assisted testing</li>
            </ul>
            <h2 className="font-heading text-2xl font-semibold text-foreground pt-4">Philosophy</h2>
            <p>
              I believe in learning by writing. Every post is a synthesis of research, experimentation, and
              practical experience. If something here helps you in your own work, that's a wonderful bonus.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
};

export default About;
