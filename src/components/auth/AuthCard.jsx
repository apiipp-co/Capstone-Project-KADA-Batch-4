import logo from "../../assets/logo-edutrack.svg";

export default function AuthCard({ title, description, children }) {
  return (
    <main className="auth-page flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <section className="auth-card-enter w-full max-w-[448px] rounded-2xl bg-white px-6 py-8 shadow-card sm:px-8 sm:py-8">
        <header className="text-center">
          <img src={logo} alt="EduTrack" className="mx-auto h-12 w-12" />
          <h1 className="mt-5 text-[26px] font-bold leading-8 tracking-[-0.035em] text-[#20232D]">{title}</h1>
          <p className="mx-auto mt-2 max-w-[350px] text-sm leading-[22px] text-[#555B6B]">{description}</p>
        </header>
        <div className="mt-9">{children}</div>
      </section>
    </main>
  );
}
