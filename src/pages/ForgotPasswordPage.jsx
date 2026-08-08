import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import AuthCard from "../components/auth/AuthCard";
import FormInput from "../components/auth/FormInput";
import Button from "../components/ui/Button";
import { requestPasswordReset } from "../services/authService";

const schema = z.object({
  email: z.string().min(1, "Email institusi wajib diisi.").email("Format email tidak valid."),
});

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ resolver: zodResolver(schema), mode: "onChange", defaultValues: { email: "" } });

  const onSubmit = async () => {
    await requestPasswordReset();
    setSuccess(true);
  };

  return (
    <AuthCard
      title="Lupa Kata Sandi"
      description="Masukkan email institusi Anda. Instruksi pengaturan ulang kata sandi akan dikirim melalui email."
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          id="reset-email"
          label="Email Institusi"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="nama@sekolah.edu"
          disabled={isSubmitting}
          error={errors.email?.message}
          register={register("email", { onChange: () => setSuccess(false) })}
        />

        {success && (
          <div role="status" className="flex items-start gap-2 text-[13px] leading-5 text-emerald-700">
            <CircleCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Jika email terdaftar, instruksi pengaturan ulang kata sandi telah dikirim.</p>
          </div>
        )}

        <Button type="submit" loading={isSubmitting} disabled={!isValid || isSubmitting} className="w-full">
          {isSubmitting ? "Mengirim..." : "Kirim Instruksi"}
        </Button>
        <Link
          to="/login"
          className="block text-center text-sm font-medium text-[#0756D9] hover:underline"
        >
          Kembali ke halaman login
        </Link>
      </form>
    </AuthCard>
  );
}
