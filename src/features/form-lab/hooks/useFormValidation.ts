import type { Form } from "../schema";
import {
  buildErrorsSummary,
  checkFormValidity,
  resolveFieldStatus,
  validateFieldRules,
  type FieldState,
} from "../utils";

export type { ActiveErrorSummary, FieldValidationStatus } from "../utils";

interface UseFormValidationOptions {
  values: Record<string, string | undefined>;
  touchedFields: Record<string, boolean | undefined>;
  isValidating: boolean;
}

export function useFormValidation(
  form: Form | null | undefined,
  { values, touchedFields, isValidating }: UseFormValidationOptions
) {
  const fieldsState: Record<string, FieldState> = (() => {
    const next: Record<string, FieldState> = {};
    if (!form) return next;

    for (const field of form.fields) {
      const value = values[field.id] ?? "";
      const isDirty = Boolean(touchedFields[field.id]);

      if (!isDirty && !isValidating) continue;

      const error = validateFieldRules(value, field);
      next[field.id] = {
        value,
        isDirty,
        error,
        status: resolveFieldStatus({
          value,
          isValidating,
          error,
          isDirty,
        }),
      };
    }

    return next;
  })();

  const errorsSummary = buildErrorsSummary(form, fieldsState);
  const isFormValid = checkFormValidity(form, fieldsState);

  return {
    fieldsState,
    errorsSummary,
    isFormValid,
  };
}
