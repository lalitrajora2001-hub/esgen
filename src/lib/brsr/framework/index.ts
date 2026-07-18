import type { FrameworkDef, ModuleDef, QuestionDef } from "@/lib/brsr/types";
import { sectionA } from "./sectionA";
import { sectionB } from "./sectionB";
import { modulesP1P2 } from "./p1-p2";
import { modulesP3P5 } from "./p3-p5";
import { modulesP6 } from "./p6";
import { modulesP7P9 } from "./p7-p9";

/** The complete BRSR framework, assembled from Section A, B and all 9 principles. */
export const BRSR: FrameworkDef = {
  version: "BRSR-2024",
  label: "BRSR (SEBI), 2024 format",
  modules: [
    sectionA,
    sectionB,
    ...modulesP1P2,
    ...modulesP3P5,
    ...modulesP6,
    ...modulesP7P9,
  ],
};

export function getModule(key: string): ModuleDef | undefined {
  return BRSR.modules.find((m) => m.key === key);
}

/** All questions across the framework, flattened. */
export function allQuestions(): QuestionDef[] {
  return BRSR.modules.flatMap((m) => m.subsections.flatMap((s) => s.questions));
}

export function moduleQuestions(mod: ModuleDef): QuestionDef[] {
  return mod.subsections.flatMap((s) => s.questions);
}

/** The module a given question key belongs to. */
export function moduleForQuestion(questionKey: string): ModuleDef | undefined {
  return BRSR.modules.find((m) => m.subsections.some((s) => s.questions.some((q) => q.key === questionKey)));
}
