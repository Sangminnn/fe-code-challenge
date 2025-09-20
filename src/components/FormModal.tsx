import { useState, useEffect, useRef } from "react";
import {
  ModalOverlay,
  ModalContainer,
  ModalContent,
  ModalTitle,
  ModalDescription,
  Form,
  FormField,
  Label,
  Input,
  ErrorMessage,
  SelectWrapper,
  Select,
  ButtonGroup,
  CancelButton,
  SubmitButton,
} from "./ModalFormPage.styled";

interface FormData {
  name: string;
  email: string;
  experience: string;
  githubLink: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  githubLink?: string;
}

interface FormModalProps {
  isOpen: boolean;
  close: (result: FormData | null) => void;
}

const FormModal = ({ isOpen, close }: FormModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    experience: "0-3년",
    githubLink: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleCloseModal = () => {
    close(null); // 취소 시 null 반환
    // 폼 초기화
    setFormData({
      name: "",
      email: "",
      experience: "0-3년",
      githubLink: "",
    });
    setErrors({});
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드의 에러를 제거
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const isValidEmail = (email: string): boolean => {
    const regex =
      /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return regex.test(email);
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // 선택 필드이므로 빈 값은 유효
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // 이름/닉네임 필수 검증
    if (!formData.name.trim()) {
      newErrors.name = "이름/닉네임을 입력해주세요.";
    }

    // 이메일 필수 및 형식 검증
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    // GitHub 링크 형식 검증 (선택 필드)
    if (formData.githubLink.trim() && !validateUrl(formData.githubLink)) {
      newErrors.githubLink = "올바른 URL 형식을 입력해주세요.";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // 유효성 검증 통과 시
      close(formData); // 제출 데이터 반환
      // 폼 초기화
      setFormData({
        name: "",
        email: "",
        experience: "0-3년",
        githubLink: "",
      });
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalOverlay onClick={handleCloseModal} />
      <ModalContainer>
        <ModalContent>
          <ModalTitle>신청 폼</ModalTitle>
          <ModalDescription>
            이메일과 FE 경력 연차 등 간단한 정보를 입력해주세요.
          </ModalDescription>

          <Form onSubmit={handleSubmit} noValidate>
            <FormField>
              <Label htmlFor="name">이름 / 닉네임</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="TEST"
                $hasError={!!errors.name}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <ErrorMessage id="name-error" role="alert">
                  {errors.name}
                </ErrorMessage>
              )}
            </FormField>

            <FormField>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="text"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="TEST@test.com"
                $hasError={!!errors.email}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                inputMode="email"
                autoComplete="email"
              />
              {errors.email && (
                <ErrorMessage id="email-error" role="alert">
                  {errors.email}
                </ErrorMessage>
              )}
            </FormField>

            <FormField>
              <Label htmlFor="experience">FE 경력 연차</Label>
              <SelectWrapper>
                <Select
                  id="experience"
                  value={formData.experience}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                >
                  <option value="0-3년">0-3년</option>
                  <option value="4-7년">4-7년</option>
                  <option value="8년 이상">8년 이상</option>
                </Select>
              </SelectWrapper>
            </FormField>

            <FormField>
              <Label htmlFor="githubLink">GitHub 링크 (선택)</Label>
              <Input
                id="githubLink"
                type="url"
                value={formData.githubLink}
                onChange={(e) =>
                  handleInputChange("githubLink", e.target.value)
                }
                placeholder="https://test.com"
                $hasError={!!errors.githubLink}
                aria-invalid={!!errors.githubLink}
                aria-describedby={
                  errors.githubLink ? "github-error" : undefined
                }
              />
              {errors.githubLink && (
                <ErrorMessage id="github-error" role="alert">
                  {errors.githubLink}
                </ErrorMessage>
              )}
            </FormField>

            <ButtonGroup>
              <CancelButton type="button" onClick={handleCloseModal}>
                취소
              </CancelButton>
              <SubmitButton type="submit">제출하기</SubmitButton>
            </ButtonGroup>
          </Form>
        </ModalContent>
      </ModalContainer>
    </>
  );
};

export default FormModal;