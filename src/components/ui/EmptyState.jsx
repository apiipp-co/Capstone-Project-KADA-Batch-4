export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <section className="mx-auto flex w-full max-w-[448px] flex-col items-center rounded-2xl bg-white px-8 py-9 text-center shadow-card sm:px-12 sm:py-10">
      {Icon && (
        <div className="mb-7 flex h-32 w-32 items-center justify-center rounded-full bg-[#EDF3FE] sm:h-40 sm:w-40">
          <Icon aria-hidden="true" className="h-12 w-12 text-[#84A8E5]" strokeWidth={1.8} />
        </div>
      )}
      <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#20232D]">{title}</h2>
      <p className="mt-3 max-w-[310px] text-sm leading-5 text-[#545968]">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </section>
  );
}
