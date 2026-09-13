# Cortex — AI Operations Platform

Cortex is a full-stack AI operations platform that gives businesses a single intelligent layer over their documents, support workflows, and internal tools. It combines Retrieval-Augmented Generation (RAG), agentic tool-use, and workflow automation into one cohesive product — moving beyond simple LLM API wrappers into a system that reasons, retrieves, and acts.

## What It Does

- **Document Intelligence (RAG):** Upload business documents and get accurate, source-cited answers grounded in your own data — not generic LLM hallucinations.
- **Automated Ticket Triage:** Incoming support tickets are automatically classified by urgency/topic and get AI-drafted responses grounded in your knowledge base.
- **Agentic Tool Use:** An AI agent that can check statuses, search the knowledge base, and escalate to a human — using real function-calling, not scripted flows.
- **Workflow Automation:** Integrated with n8n to trigger AI-powered actions across Slack, email, and other business tools via webhooks.
- **Evaluation & Monitoring:** A built-in dashboard tracking response quality, user feedback, latency, and cost per AI interaction.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, TailwindCSS
- **Backend:** FastAPI, Python
- **AI/ML:** OpenAI/Anthropic APIs, LangChain, HuggingFace Transformers, LoRA fine-tuning
- **Data:** PostgreSQL, Chroma (vector database)
- **Automation:** n8n, Webhooks
- **Infra:** Docker, GitHub Actions (CI/CD), deployed on Vercel + Railway

## Why This Project

Cortex was built to demonstrate end-to-end AI engineering — from data ingestion and embeddings, through agentic reasoning and model fine-tuning, to production deployment and monitoring — reflecting the real, applied skill set modern AI/ML engineering roles require, not just isolated ML notebooks.
