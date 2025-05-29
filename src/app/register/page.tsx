import AuthLayout from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Create your Account"
      description="Join DormNexus and manage your hostel life efficiently."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
