import type { ChangeEvent } from "react";

export type SetState<T> = (
  updater: Partial<T> | ((prev: Partial<T>) => Partial<T>)
) => void;

type TextInputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

/** Binds a text/textarea input directly to a top-level field. */
export function bindField<T, K extends keyof T>(setState: SetState<T>, key: K) {
  return (e: TextInputEvent) =>
    setState((s) => ({ ...s, [key]: e.target.value as T[K] }));
}

/** Binds a number input directly to a top-level field. */
export function bindNumberField<T, K extends keyof T>(setState: SetState<T>, key: K) {
  return (e: TextInputEvent) =>
    setState((s) => ({ ...s, [key]: Number(e.target.value) as T[K] }));
}

/** Binds a Switch's onCheckedChange to a top-level boolean field. */
export function bindChecked<T, K extends keyof T>(setState: SetState<T>, key: K) {
  return (checked: boolean) =>
    setState((s) => ({ ...s, [key]: !!checked as T[K] }));
}

/** Binds a comma- or newline-separated text input to a top-level string[] field. */
export function bindListField<T, K extends keyof T>(
  setState: SetState<T>,
  key: K,
  separator: "," | "\n" = ","
) {
  return (e: TextInputEvent) =>
    setState((s) => ({
      ...s,
      [key]: e.target.value
        .split(separator)
        .map((t) => t.trim())
        .filter(Boolean) as T[K],
    }));
}

/** Inverse of bindListField, for populating the input's value prop. */
export function joinList(value: string[] | undefined, separator: "," | "\n" = ","): string {
  return (value || []).join(separator === "," ? ", " : separator);
}

type TranslationBag = Record<string, Record<string, unknown>> | undefined;

function readIdTranslations<T>(state: Partial<T>): Record<string, unknown> | undefined {
  return (state as { translations?: TranslationBag }).translations?.id;
}

/** Binds a text/textarea input to `translations.id.<key>` (the only translated locale overlay). */
export function bindIdTranslation<T>(setState: SetState<T>, key: string) {
  return (e: TextInputEvent) =>
    setState((s) => {
      const translations = (s as { translations?: TranslationBag }).translations;
      return {
        ...s,
        translations: { ...translations, id: { ...translations?.id, [key]: e.target.value } },
      } as Partial<T>;
    });
}

/** Same as bindIdTranslation but for value-callback inputs (e.g. MarkdownEditor). */
export function bindIdTranslationValue<T>(setState: SetState<T>, key: string) {
  return (value: string) =>
    setState((s) => {
      const translations = (s as { translations?: TranslationBag }).translations;
      return {
        ...s,
        translations: { ...translations, id: { ...translations?.id, [key]: value } },
      } as Partial<T>;
    });
}

/** Reads `translations.id.<key>` as a string, defaulting to "". */
export function idTranslation<T>(state: Partial<T>, key: string): string {
  return (readIdTranslations(state)?.[key] as string) || "";
}
