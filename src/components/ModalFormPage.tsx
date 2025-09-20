import { overlay } from "overlay-kit";
import { useRef } from "react";
import FormModal from "./FormModal";
import { Container, TriggerButton } from "./ModalFormPage.styled";

interface FormData {
  name: string;
  email: string;
  experience: string;
  githubLink: string;
}

const ModalFormPage = () => {
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpenModal = async () => {
    const result = await overlay.openAsync<FormData | null>(
      ({ isOpen, close, unmount }) => {
        return <FormModal isOpen={isOpen} close={close} unmount={unmount} />;
      }
    );

    setTimeout(() => {
      triggerButtonRef.current?.focus();
    }, 0);

    if (result) {
      console.log("폼 제출 데이터:", result);
      alert("신청이 완료되었습니다!");
    } else {
      console.log("모달이 취소되었습니다.");
    }
  };

  return (
    <Container>
      <TriggerButton ref={triggerButtonRef} onClick={handleOpenModal}>
        🚀 신청 폼 작성하기
      </TriggerButton>
    </Container>
  );
};

export default ModalFormPage;
