import { useCallback, useRef, useState } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { SelectField, TextInputField } from "./common";
import { KeyDownHandler } from "./common/KeyDownHandler";
import { OutsidePointerDownHandler } from "./common/OutsidePointerDownHandler";
import {
  ButtonGroup,
  CancelButton,
  Form,
  ModalContainer,
  ModalContent,
  ModalDescription,
  ModalOverlay,
  ModalTitle,
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
  experience?: string;
  githubLink?: string;
}

interface FormModalProps {
  isOpen: boolean;
  close: (result: FormData | null) => void;
  unmount: () => void;
}

const FormModal = ({ isOpen, close, unmount }: FormModalProps) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const modalTitleRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const experienceRef = useRef<HTMLSelectElement>(null);
  const githubRef = useRef<HTMLInputElement>(null);

  useFocusTrap({
    enabled: isOpen,
    initialFocusRef: nameRef,
    containerRef: modalContentRef,
    lockScroll: true,
    initialFocusDelay: 100,
  });

  const handleCloseModal = useCallback(() => {
    close(null);
    unmount();
  }, [close, unmount]);

  const isValidEmail = (email: string): boolean => {
    const regex =
      /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return regex.test(email);
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true;

    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    const name = nameRef.current?.value ?? "";
    const email = emailRef.current?.value ?? "";
    const experience = experienceRef.current?.value ?? "";
    const githubLink = githubRef.current?.value ?? "";

    if (!name.trim()) {
      newErrors.name = "이름/닉네임을 입력해주세요.";
    }

    if (!email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!isValidEmail(email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    if (!experience.trim()) {
      newErrors.experience = "경력 연차를 선택해주세요.";
    }

    if (githubLink.trim() && !validateUrl(githubLink)) {
      newErrors.githubLink = "올바른 URL 형식을 입력해주세요.";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const payload: FormData = {
        name: nameRef.current?.value ?? "",
        email: emailRef.current?.value ?? "",
        experience: experienceRef.current?.value ?? "0-3년",
        githubLink: githubRef.current?.value ?? "",
      };
      close(payload);
      unmount();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalOverlay />

      <OutsidePointerDownHandler
        onPointerDown={() => {
          handleCloseModal();
        }}
      >
        <KeyDownHandler
          asChild
          when={isOpen}
          keys={["Escape"]}
          onKeyDown={() => {
            handleCloseModal();
          }}
        >
          <ModalContainer
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <ModalContent ref={modalContentRef}>
              <ModalTitle id="modal-title" ref={modalTitleRef} tabIndex={-1}>
                신청 폼
              </ModalTitle>
              <ModalDescription id="modal-description">
                이메일과 FE 경력 연차 등 간단한 정보를 입력해주세요.
              </ModalDescription>

              <Form onSubmit={handleSubmit} noValidate>
                <TextInputField
                  id="name"
                  label="이름 / 닉네임"
                  ref={nameRef}
                  defaultValue=""
                  placeholder="TEST"
                  error={errors.name}
                  onFirstChangeClearError={() =>
                    setErrors((prev) =>
                      prev.name ? { ...prev, name: undefined } : prev
                    )
                  }
                />

                <TextInputField
                  id="email"
                  label="이메일"
                  ref={emailRef}
                  defaultValue=""
                  placeholder="TEST@test.com"
                  error={errors.email}
                  inputMode="email"
                  autoComplete="email"
                  onFirstChangeClearError={() =>
                    setErrors((prev) =>
                      prev.email ? { ...prev, email: undefined } : prev
                    )
                  }
                />

                <SelectField
                  id="experience"
                  label="FE 경력 연차"
                  ref={experienceRef}
                  defaultValue=""
                  options={["0-3년", "4-7년", "8년 이상"]}
                  error={errors.experience}
                  onFirstChangeClearError={() =>
                    setErrors((prev) =>
                      prev.experience
                        ? { ...prev, experience: undefined }
                        : prev
                    )
                  }
                />

                <TextInputField
                  id="githubLink"
                  label="GitHub 링크 (선택)"
                  type="url"
                  ref={githubRef}
                  defaultValue=""
                  placeholder="https://test.com"
                  error={errors.githubLink}
                  onFirstChangeClearError={() =>
                    setErrors((prev) =>
                      prev.githubLink
                        ? { ...prev, githubLink: undefined }
                        : prev
                    )
                  }
                />

                <ButtonGroup>
                  <CancelButton type="button" onClick={handleCloseModal}>
                    취소
                  </CancelButton>
                  <SubmitButton type="submit">제출하기</SubmitButton>
                </ButtonGroup>
              </Form>
            </ModalContent>
          </ModalContainer>
        </KeyDownHandler>
      </OutsidePointerDownHandler>
    </>
  );
};

export default FormModal;
