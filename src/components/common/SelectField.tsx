import { forwardRef, memo } from "react";
import {
  ErrorMessage,
  FormField,
  Label,
  Select,
  SelectWrapper,
} from "../ModalFormPage.styled";

interface SelectFieldProps {
  id: string;
  label: string;
  defaultValue?: string;
  onFirstChangeClearError?: () => void;
  options: string[];
  placeholder?: string;
  error?: string;
}

export const SelectField = memo(
  forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
    { id, label, defaultValue, onFirstChangeClearError, options, placeholder = "선택해주세요", error },
    ref
  ) {
    return (
      <FormField>
        <Label htmlFor={id}>{label}</Label>
        <SelectWrapper>
          <Select
            id={id}
            ref={ref}
            defaultValue={defaultValue || ""}
            onChange={() => onFirstChangeClearError?.()}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </SelectWrapper>
        {error && (
          <ErrorMessage id={`${id}-error`} role="alert">
            {error}
          </ErrorMessage>
        )}
      </FormField>
    );
  })
);
