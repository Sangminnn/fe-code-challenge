import { useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

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

const ModalFormPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    experience: '0-3년',
    githubLink: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleOpenModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드의 에러를 제거
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
      newErrors.name = '이름/닉네임을 입력해주세요.';
    }

    // 이메일 필수 및 형식 검증
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    // GitHub 링크 형식 검증 (선택 필드)
    if (formData.githubLink.trim() && !validateUrl(formData.githubLink)) {
      newErrors.githubLink = '올바른 URL 형식을 입력해주세요.';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // 유효성 검증 통과 시
      console.log('폼 제출 데이터:', formData);
      alert('신청이 완료되었습니다!');
      handleCloseModal();
      // 폼 초기화
      setFormData({
        name: '',
        email: '',
        experience: '0-3년',
        githubLink: ''
      });
    }
  };

  return (
    <Container>
      <TriggerButton onClick={handleOpenModal}>
        🚀 신청 폼 작성하기
      </TriggerButton>

      {isModalOpen && (
        <>
          <ModalOverlay onClick={handleCloseModal} />
          <ModalContainer>
            <ModalContent>
              <ModalTitle>신청 폼</ModalTitle>
              <ModalDescription>
                이메일과 FE 경력 연차 등 간단한 정보를 입력해주세요.
              </ModalDescription>
              
              <Form onSubmit={handleSubmit}>
                <FormField>
                  <Label htmlFor="name">이름 / 닉네임</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="TEST"
                    $hasError={!!errors.name}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
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
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="TEST@test.com"
                    $hasError={!!errors.email}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <ErrorMessage id="email-error" role="alert">
                      {errors.email}
                    </ErrorMessage>
                  )}
                </FormField>

                <FormField>
                  <Label htmlFor="experience">FE 경력 연차</Label>
                  <Select
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                  >
                    <option value="0-3년">0-3년</option>
                    <option value="4-7년">4-7년</option>
                    <option value="8년 이상">8년 이상</option>
                  </Select>
                </FormField>

                <FormField>
                  <Label htmlFor="githubLink">GitHub 링크 (선택)</Label>
                  <Input
                    id="githubLink"
                    type="url"
                    value={formData.githubLink}
                    onChange={(e) => handleInputChange('githubLink', e.target.value)}
                    placeholder="https://test.com"
                    $hasError={!!errors.githubLink}
                    aria-invalid={!!errors.githubLink}
                    aria-describedby={errors.githubLink ? 'github-error' : undefined}
                  />
                  {errors.githubLink && (
                    <ErrorMessage id="github-error" role="alert">
                      {errors.githubLink}
                    </ErrorMessage>
                  )}
                </FormField>

                <ButtonGroup>
                  <CancelButton type="button" onClick={handleCloseModal}>취소</CancelButton>
                  <SubmitButton type="submit">제출하기</SubmitButton>
                </ButtonGroup>
              </Form>
            </ModalContent>
          </ModalContainer>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const TriggerButton = styled.button`
  padding: 16px 32px;
  background-color: #4f7cff;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3d66e5;
  }

  &:focus {
    outline: 2px solid #4f7cff;
    outline-offset: 2px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.2s ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 480px;
  max-width: 90vw;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
`;

const ModalDescription = styled.p`
  margin: 0 0 32px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : '#e1e5e9'};
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#4f7cff'};
  }

  &::placeholder {
    color: #999;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: "⚠️";
    font-size: 10px;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #4f7cff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  background-color: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e8e8e8;
  }

  &:focus {
    outline: 2px solid #4f7cff;
    outline-offset: 2px;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background-color: #4f7cff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3d66e5;
  }

  &:focus {
    outline: 2px solid #4f7cff;
    outline-offset: 2px;
  }
`;

export default ModalFormPage;
