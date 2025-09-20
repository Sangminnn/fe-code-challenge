import { overlay } from "overlay-kit";
import { Container, TriggerButton } from "./ModalFormPage.styled";
import FormModal from "./FormModal";

interface FormData {
  name: string;
  email: string;
  experience: string;
  githubLink: string;
}

const ModalFormPage = () => {
  const handleOpenModal = async () => {
    const result = await overlay.openAsync<FormData | null>(({ isOpen, close }) => {
      return <FormModal isOpen={isOpen} close={close} />;
    });
    
    if (result) {
      console.log("폼 제출 데이터:", result);
      alert("신청이 완료되었습니다!");
    } else {
      console.log("모달이 취소되었습니다.");
    }
  };

  return (
    <Container>
      <TriggerButton onClick={handleOpenModal}>
        🚀 신청 폼 작성하기
      </TriggerButton>
    </Container>
  );
};

export default ModalFormPage;
