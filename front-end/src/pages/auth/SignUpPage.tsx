import ModalGeneric from "@/components/common/ModalGeneric";

function SignUpPage() {
  return (
    <ModalGeneric noClose dialogType="form" title={{ value: "Inscription" }}>
      {/* <LoginForm className="p-16 w-[300px]" /> */}
    </ModalGeneric>
  );
}

export default SignUpPage;
