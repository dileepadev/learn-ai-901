import type { Module } from '../types';

export const textAnalysis: Module = {
  id: 'text-analysis',
  order: 9,
  title: 'Text analysis with Azure Language',
  summary:
    'The prebuilt NLP features, what each one returns, and when a generative model is the better tool instead.',
  topic: 'foundry-text-speech',
  alsoCovers: ['ai-workloads'],
  minutes: 18,
  priority: 'high',
  icon: '📝',
  outcomes: [
    'Match a required output to the right text analysis technique',
    'Tell extractive from abstractive summarization, and sentiment from opinion mining',
    'Know which Language features need training data and which do not',
  ],
  quiz: ['ts-008', 'ts-012', 'wl-011', 'sc-wl-07', 'sc-ts-01', 'sc-ts-04', 'sc-ts-05', 'sc-ts-07', 'yn-ts-01', 'dd-wl-02', 'code-ta-01'],
  sections: [
    {
      id: 'techniques',
      title: 'The techniques, by output shape',
      blocks: [
        {
          t: 'p',
          md: 'Every one of these questions is really asking: **what shape of output does the requirement need?** Learn the outputs and the routing is automatic.',
        },
        {
          t: 'table',
          headers: ['Technique', 'Output', 'Give it to me when…'],
          rows: [
            ['**Key phrase extraction**', 'An unordered list of topic phrases', '"What is this about?" / recurring themes'],
            ['**Named entity recognition**', 'Typed entities: Person, Location, Organization, DateTime, Quantity', '"Find the people and places"'],
            ['**PII detection**', 'Sensitive identifiers located, and a redacted copy', '"Mask national IDs, cards, emails"'],
            ['**Sentiment analysis**', 'Positive / neutral / negative + confidence scores, per document and per sentence', '"Is this review good or bad?"'],
            ['**Opinion mining**', 'Target → assessment → sentiment triples', '"Which *aspect* did they dislike?"'],
            ['**Summarization**', 'A shorter version - extractive or abstractive', '"Condense this"'],
            ['**Language detection**', 'ISO language code + confidence', '"What language is this?"'],
            ['**Entity linking**', 'Entity disambiguated and linked to a knowledge base entry', '"Which *Mars* is this?"'],
            ['**Text analytics for health**', 'Medical entities, relations and assertions', 'Clinical notes'],
          ],
        },
        { t: 'check', qid: 'wl-010' },
        {
          t: 'changed',
          title: 'Eight of these features retire on 31 March 2029',
          body: 'Microsoft has announced end of support for **key phrase extraction**, **sentiment analysis and opinion mining**, **summarization** (extractive and abstractive), **entity linking**, **custom text classification**, **conversational language understanding (CLU)**, **custom question answering (CQA)** and **orchestration workflow**. New projects are directed to **Foundry models** instead. Still fully supported: **language detection**, **PII detection**, **text analytics for health**, **prebuilt NER** and **custom NER**. The techniques themselves are still examinable - the skills-measured list names keyword extraction, entity detection, sentiment analysis and summarization - but a scenario that asks what to *build on today* increasingly answers "a generative model in Foundry".',
        },
      ],
    },
    {
      id: 'confusions',
      title: 'The two distinctions that get tested',
      blocks: [
        {
          t: 'trap',
          title: 'Extractive vs. abstractive summarization',
          body: '**Extractive** selects the most important sentences **verbatim** from the source. **Abstractive** generates **new wording** that captures the meaning. Legal, medical or compliance, where fidelity matters ⇒ extractive. Meeting notes, call recaps, readability ⇒ abstractive.',
        },
        {
          t: 'trap',
          title: 'Sentiment vs. opinion mining',
          body: 'Sentiment gives a label for the **document or sentence**. Opinion mining links each **target** (the wifi, the room) to its **assessment** (unusable, spotless) and a sentiment. If the question says "which specific aspect", it is opinion mining.',
        },
        { t: 'check', qid: 'wl-013' },
        { t: 'check', qid: 'wl-012' },
      ],
    },
    {
      id: 'prebuilt-custom',
      title: 'Prebuilt vs. custom',
      blocks: [
        {
          t: 'key',
          title: 'The dividing line',
          body: '**Prebuilt** features work immediately - send text, get a result, no training data. **Custom** features need you to label examples and train. If a scenario mentions categories or entities *specific to that business*, it is custom.',
          priority: 'high',
        },
        {
          t: 'table',
          headers: ['Prebuilt (no training)', 'Custom (needs labelled data)'],
          rows: [
            ['Sentiment analysis & opinion mining', 'Custom text classification'],
            ['Key phrase extraction', 'Custom named entity recognition'],
            ['Named entity recognition, PII detection', 'Conversational language understanding (CLU)'],
            ['Language detection', 'Question answering'],
            ['Summarization (extractive & abstractive)', 'Orchestration workflow'],
            ['Text analytics for health, entity linking', '-'],
          ],
        },
        { t: 'check', qid: 'wl-014' },
        { t: 'check', qid: 'ts-010' },
      ],
    },
    {
      id: 'vs-generative',
      title: 'Prebuilt feature or generative model?',
      blocks: [
        {
          t: 'table',
          headers: ['Reach for a prebuilt Language feature when…', 'Reach for a generative model when…'],
          rows: [
            ['Output must be a predictable, typed structure', 'Output is free-form or the format varies'],
            ['Volume is high and per-document cost matters', 'Volume is modest'],
            ['The task is exactly one of the standard ones', 'The task is bespoke or combines several steps'],
            ['You want no prompt engineering to maintain', 'You want flexibility and can iterate on a prompt'],
          ],
        },
        { t: 'check', qid: 'ts-003' },
      ],
    },
    {
      id: 'client',
      title: 'A lightweight text analysis client',
      blocks: [
        {
          t: 'p',
          md: 'The pattern is the same for every feature: authenticate, send documents, read the typed result.',
        },
        {
          t: 'code',
          lang: 'python',
          caption: 'Sentiment, key phrases and entities from the same document',
          code: `import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient

# A key keeps the sample short; prefer DefaultAzureCredential in real apps.
client = TextAnalyticsClient(
    endpoint=os.environ["LANGUAGE_ENDPOINT"],
    credential=AzureKeyCredential(os.environ["LANGUAGE_KEY"]),
)

docs = ["Response times improved by 40%, but the documentation is still incomplete."]

sentiment = client.analyze_sentiment(documents=docs)[0]
print(sentiment.sentiment, sentiment.confidence_scores)

phrases = client.extract_key_phrases(documents=docs)[0]
print(phrases.key_phrases)

entities = client.recognize_entities(documents=docs)[0]
for e in entities.entities:
    print(e.text, "->", e.category)`,
        },
        {
          t: 'p',
          md: 'Azure Language is also reachable from Foundry as a tool, through the Azure Language **MCP server** (preview) - which is how an **agent** can call these capabilities as tools rather than your code calling them directly.',
        },
        { t: 'check', qid: 'ts-001' },
      ],
    },
  ],
};
