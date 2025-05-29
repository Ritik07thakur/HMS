
import AuthLayout from "@/components/auth/AuthLayout";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export default function AdminHmsLoginPage() {
  return (
    <AuthLayout
      title="Admin Login"
      description="Access the Hostel Management System admin panel."
    >
      <AdminLoginForm />
    </AuthLayout>
  );
}
