import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import AuthCard from "../components/auth/AuthCard";
import FormInput from "../components/auth/FormInput";
import LoginErrorMessage from "../components/auth/LoginErrorMessage";
import Button from "../components/ui/Button";
import { login } from "../services/authService";
import { setAuthSession } from "../stores/authStore";

const loginSchema = z.object({
  email: z.string().min(1, "Email institusi wajib diisi.").email("Format email tidak valid."),
  password: z
    .string()
    .min(1, "Kata sandi wajib diisi.")
    .min(8, "Kata sandi minimal terdiri dari 8 karakter."),
});

const AUTH_ERROR_MESSAGE =
  "Email atau kata sandi salah. Silakan periksa kembali atau hubungi admin IT sekolah.";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const clearAuthError = () => {
    if (authError) setAuthError("");
  };

  const passwordRegistration = register("password", { onChange: clearAuthError });

  const onSubmit = async (values) => {
    setAuthError("");
    try {
      const session = await login(values);
      setAuthSession(session.user, session.token);
      const fallback = session.user.role === "teacher" ? "/teacher/dashboard" : "/dashboard";
      const requestedPath = location.state?.from;
      navigate(requestedPath || fallback, { replace: true });
    } catch {
      setAuthError(AUTH_ERROR_MESSAGE);
      requestAnimationFrame(() => passwordRef.current?.focus());
    }
  };

  return (
    <AuthCard
      title="Selamat Datang"
      description="Silakan login dengan menggunakan akses yang telah diberikan oleh tim IT sekolah"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-[18px]">
        <FormInput
          id="email"
          label="Email Institusi"
          icon={Mail}
          type="email"
          autoComplete="username"
          placeholder="nama@sekolah.edu"
          disabled={isSubmitting}
          error={errors.email?.message}
          register={register("email", { onChange: clearAuthError })}
        />

        <FormInput
          id="password"
          label="Kata Sandi"
          labelAction={
            <Link to="/forgot-password" className="text-[13px] font-medium text-[#0756D9] hover:underline">
              Lupa Password?
            </Link>
          }
          icon={LockKeyhole}
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Masukkan kata sandi"
          disabled={isSubmitting}
          error={errors.password?.message}
          register={{
            ...passwordRegistration,
            ref: (element) => {
              passwordRegistration.ref(element);
              passwordRef.current = element;
            },
          }}
          endAction={
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="rounded-md p-2 text-[#555B6B] transition hover:bg-slate-100 hover:text-[#20232D]"
              disabled={isSubmitting}
            >
              {showPassword ? (
                <Eye aria-hidden="true" className="h-[18px] w-[18px]" />
              ) : (
                <EyeOff aria-hidden="true" className="h-[18px] w-[18px]" />
              )}
            </button>
          }
        />

        <LoginErrorMessage message={authError} />

        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          className={authError ? "!mt-6 w-full" : "!mt-[26px] w-full"}
        >
          {isSubmitting ? "Memproses..." : "Masuk ke Dashboard"}
        </Button>
      </form>
    </AuthCard>
  );
}
