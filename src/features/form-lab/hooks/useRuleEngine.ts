import type { FieldRule, FormField } from "@/features/form-lab/schema";
import {
  createFieldRule,
  getDefaultRuleValue,
  getCompatibleRules,
} from "@/features/form-lab/utils";

interface UseRuleEngineProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
}

export function useRuleEngine({ field, onUpdate }: UseRuleEngineProps) {
  const addRule = (type: FieldRule["type"]) => {
    const alreadyExists = field.rules.some((r) => r.type === type);
    if (alreadyExists) return;
    const newRule = createFieldRule(type, getDefaultRuleValue(type));
    onUpdate({ ...field, rules: [...field.rules, newRule] });
  };

  const updateRule = (updatedRule: FieldRule) => {
    onUpdate({
      ...field,
      rules: field.rules.map((r) => (r.id === updatedRule.id ? updatedRule : r)),
    });
  };

  const removeRule = (ruleId: string) => {
    onUpdate({ ...field, rules: field.rules.filter((r) => r.id !== ruleId) });
  };

  const compatibleRules = getCompatibleRules(field.type);
  const availableToAdd = compatibleRules.filter(
    (type) => !field.rules.some((r) => r.type === type)
  );

  return { addRule, updateRule, removeRule, availableToAdd };
}