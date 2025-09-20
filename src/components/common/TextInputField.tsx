import { forwardRef, memo } from "react";
import {
  ErrorMessage,
  FormField,
  Input,
  Label,
} from "../../components/ModalFormPage.styled";

interface TextInputFieldProps {
  id: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: React.InputHTMLAttributes<HTMLInputElement>["autoComplete"];
  error?: string;
  onFirstChangeClearError?: () => void;
}

export const TextInputField = memo(
  forwardRef<HTMLInputElement, TextInputFieldProps>(function TextInputField(
    {
      id,
      label,
      defaultValue,
      placeholder,
      type = "text",
      inputMode,
      autoComplete,
      error,
      onFirstChangeClearError,
    },
    ref
  ) {
    return (
      <FormField>
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          ref={ref}
          type={type}
          defaultValue={defaultValue}
          onChange={() => onFirstChangeClearError?.()}
          placeholder={placeholder}
          $hasError={!!error}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          inputMode={inputMode}
          autoComplete={autoComplete}
        />
        {error && (
          <ErrorMessage id={`${id}-error`} role="alert">
            {error}
          </ErrorMessage>
        )}
      </FormField>
    );
  })
);
