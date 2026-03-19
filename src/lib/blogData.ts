export type Category = "AI" | "QA" | "Research" | "All";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  date: string;
  readTime: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "transformer-attention-mechanisms",
    title: "Understanding Transformer Attention Mechanisms in Modern LLMs",
    excerpt: "A deep dive into how self-attention, multi-head attention, and positional encoding work together to power today's large language models.",
    content: `## Introduction

Transformers have revolutionized natural language processing since the landmark "Attention Is All You Need" paper. In this post, we'll explore the core mechanics that make transformers so powerful.

## Self-Attention

Self-attention allows every token in a sequence to attend to every other token. The mechanism computes Query, Key, and Value matrices from the input embeddings:

**Attention(Q, K, V) = softmax(QK^T / √d_k)V**

This simple formula enables the model to capture long-range dependencies that RNNs and LSTMs struggled with.

## Multi-Head Attention

Rather than computing a single attention function, transformers use multiple "heads" that each learn different types of relationships. Some heads might learn syntactic dependencies, while others capture semantic similarity.

## Practical Implications

Understanding these mechanisms helps us:
- Design better prompts for LLMs
- Debug unexpected model behaviors
- Build more efficient architectures

## Conclusion

The elegance of the transformer architecture lies in its simplicity. By replacing recurrence with attention, we gained parallelizability and the ability to model truly global dependencies.`,
    category: "AI",
    date: "2026-03-15",
    readTime: "8 min read",
    tags: ["Transformers", "NLP", "Deep Learning"],
  },
  {
    id: "mutation-testing-beyond-coverage",
    title: "Mutation Testing: Going Beyond Code Coverage Metrics",
    excerpt: "Why 100% code coverage doesn't guarantee quality tests, and how mutation testing reveals the true strength of your test suite.",
    content: `## The Coverage Illusion

Code coverage metrics tell you which lines your tests execute — but not whether your tests actually verify correct behavior. A test that calls a function without asserting anything achieves coverage without providing value.

## What is Mutation Testing?

Mutation testing introduces small changes (mutations) to your code:
- Replacing \`>\` with \`>=\`
- Changing \`true\` to \`false\`
- Removing method calls

If your tests still pass after a mutation, that's a **surviving mutant** — a gap in your test suite.

## Tools of the Trade

- **Stryker** (JavaScript/TypeScript)
- **PITest** (Java)
- **mutmut** (Python)

## Integrating into CI/CD

Start with incremental mutation testing — only test mutations in changed files. This keeps pipeline times reasonable while gradually improving test quality.

## Results from Real Projects

In a recent project, we had 94% code coverage but only a 67% mutation score. The gap revealed entire categories of untested edge cases.`,
    category: "QA",
    date: "2026-03-10",
    readTime: "6 min read",
    tags: ["Testing", "Mutation Testing", "CI/CD"],
  },
  {
    id: "rag-retrieval-augmented-generation",
    title: "Building Effective RAG Pipelines for Domain-Specific Knowledge",
    excerpt: "Practical strategies for chunking, embedding, and retrieving documents to build retrieval-augmented generation systems that actually work.",
    content: `## Why RAG?

Large language models have impressive general knowledge but struggle with domain-specific, up-to-date, or proprietary information. RAG bridges this gap by grounding generation in retrieved documents.

## The RAG Pipeline

1. **Document Ingestion** — Parse and clean your source documents
2. **Chunking** — Split documents into meaningful segments
3. **Embedding** — Convert chunks to vector representations
4. **Indexing** — Store vectors in a vector database
5. **Retrieval** — Find relevant chunks for a given query
6. **Generation** — Feed context + query to the LLM

## Chunking Strategies

The most overlooked step. Options include:
- Fixed-size chunks (simple but loses context)
- Semantic chunking (preserves meaning)
- Hierarchical chunking (parent-child relationships)

## Evaluation

Measure both retrieval quality (recall@k, MRR) and generation quality (faithfulness, relevancy). Tools like RAGAS provide automated evaluation frameworks.

## Lessons Learned

After building several RAG systems, the biggest impact comes from better chunking and re-ranking — not from switching embedding models.`,
    category: "AI",
    date: "2026-03-05",
    readTime: "10 min read",
    tags: ["RAG", "LLM", "Vector Databases"],
  },
  {
    id: "visual-regression-testing",
    title: "Visual Regression Testing at Scale with Playwright",
    excerpt: "How to implement pixel-perfect visual regression testing across multiple browsers and viewports without drowning in false positives.",
    content: `## The Visual Testing Challenge

Functional tests verify behavior, but visual regressions — broken layouts, overlapping elements, font changes — slip through traditional test suites.

## Playwright's Screenshot API

Playwright provides built-in screenshot comparison:

\`\`\`typescript
await expect(page).toHaveScreenshot('homepage.png', {
  maxDiffPixelRatio: 0.01,
});
\`\`\`

## Reducing False Positives

The biggest challenge is flaky visual tests. Strategies:
- Mask dynamic content (timestamps, avatars)
- Use consistent fonts via font loading waits
- Disable animations during tests
- Set fixed viewport sizes

## Multi-Browser Strategy

Test Chrome for pixel-perfect accuracy, then Firefox and Safari for layout correctness with higher thresholds.

## CI Integration

Store baseline screenshots in git. Use a review workflow where visual changes require explicit approval before updating baselines.`,
    category: "QA",
    date: "2026-02-28",
    readTime: "7 min read",
    tags: ["Playwright", "Visual Testing", "E2E Testing"],
  },
  {
    id: "ai-testing-strategies",
    title: "Testing AI-Powered Features: A QA Engineer's Framework",
    excerpt: "Traditional testing approaches break down with non-deterministic AI outputs. Here's a practical framework for testing AI features effectively.",
    content: `## The Non-Determinism Problem

AI features don't produce identical outputs for identical inputs. This fundamentally breaks the assert-exact-match paradigm.

## A Layered Testing Approach

### Layer 1: Deterministic Tests
Test everything around the AI: input validation, API contracts, error handling, UI rendering.

### Layer 2: Property-Based Tests
Instead of exact matches, verify properties:
- Response is valid JSON
- Sentiment score is between -1 and 1
- Summary is shorter than the input

### Layer 3: Evaluation Metrics
Use LLM-as-judge or human evaluation for quality:
- Relevancy scoring
- Factual accuracy checks
- Toxicity detection

### Layer 4: Monitoring
Production monitoring catches what tests miss:
- Response latency percentiles
- Token usage anomalies
- User feedback signals

## Practical Example

For an AI chatbot, we combine all four layers: unit tests for the chat UI, property tests for response format, automated evaluation for helpfulness, and production dashboards for user satisfaction.`,
    category: "Research",
    date: "2026-02-20",
    readTime: "9 min read",
    tags: ["AI Testing", "QA Strategy", "LLM"],
  },
];
