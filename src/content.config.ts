import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const list = z.array(text).min(1);
const prompt = z.object({ title: text, text });

const lessons = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/lessons' }),
  schema: z.object({
    number: z.number().int().positive(),
    title: text,
    topic: text,
    description: text,
    duration: text,
    skills: list,
    introduction: text,
    schedule: z.array(z.object({ label: text, minutes: z.number().positive(), description: text })).min(1),
    overview: z.object({ headline: text, context: text, objective: text, studentRole: text, teacherRole: text, outcome: text }),
    student: z.object({
      brief: text, knownFacts: list, goals: list, closing: text,
      phrases: z.object({
        introduction: text,
        practice: text,
        groups: z.array(z.object({
          title: text, phrase: text, purpose: text,
          alternatives: z.array(z.object({ phrase: text, note: text })).min(1),
        })).min(1),
      }),
    }),
    teacher: z.object({
      role: text,
      quickStart: list,
      principles: list,
      pacing: z.array(prompt).min(1),
      disclosure: text,
      information: z.array(z.object({ topic: text, cue: text, response: text })).min(1),
      stalled: text,
      unknown: text,
    }),
    discussion: z.object({
      opening: text,
      questions: list,
      objections: z.array(prompt).min(1),
      developments: z.array(prompt).min(1),
      outcomes: z.array(prompt).min(1),
      closing: text,
    }),
    review: z.object({ focus: text, introduction: text, questions: list, teacherPrompts: list, observations: z.array(prompt).min(1) }),
    summary: z.object({ focus: text, introduction: text, structure: z.array(prompt).length(4), steps: list, checks: list }),
    wrapUp: text,
  }),
});

export const collections = { lessons };
