"use client";

import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface PasswordRule {
  key: string;
  label: string;
  validator: (password: string) => boolean;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { t } = useLanguage();

  const rules: PasswordRule[] = useMemo(
    () => [
      {
        key: "length",
        label: t("passwordMinLength"),
        validator: (p: string) => p.length >= 8,
      },
      {
        key: "uppercase",
        label: t("passwordUppercase"),
        validator: (p: string) => /[A-Z]/.test(p),
      },
      {
        key: "special",
        label: t("passwordSpecial"),
        validator: (p: string) => /[!@#$%^&*]/.test(p),
      },
    ],
    [t]
  );

  const validCount = rules.filter((rule) => rule.validator(password)).length;
  const strengthPercentage = (validCount / rules.length) * 100;

  const strengthColor = useMemo(() => {
    if (strengthPercentage === 100) return "bg-green-500";
    if (strengthPercentage >= 66) return "bg-yellow-500";
    if (strengthPercentage >= 33) return "bg-orange-500";
    return "bg-red-500";
  }, [strengthPercentage]);

  const strengthText = useMemo(() => {
    if (strengthPercentage === 100) return t("passwordStrong");
    if (strengthPercentage >= 66) return t("passwordMedium");
    if (strengthPercentage >= 33) return t("passwordWeak");
    return t("passwordVeryWeak");
  }, [strengthPercentage, t]);

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{t("passwordStrength")}</span>
          <span
            className={cn(
              "font-medium",
              strengthPercentage === 100
                ? "text-green-600"
                : strengthPercentage >= 66
                ? "text-yellow-600"
                : strengthPercentage >= 33
                ? "text-orange-600"
                : "text-red-600"
            )}
          >
            {strengthText}
          </span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-300 rounded-full", strengthColor)}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>

      {/* Rules checklist */}
      <ul className="space-y-1.5">
        {rules.map((rule) => {
          const isValid = rule.validator(password);
          return (
            <li
              key={rule.key}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors",
                isValid ? "text-green-600" : "text-muted-foreground"
              )}
            >
              {isValid ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
