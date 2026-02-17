import { Container } from '@/components/container';

type SectionProps = {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export const Section = ({ id, title, description, children }: SectionProps) => {
  return (
    <section id={id} className="scroll-mt-28 border-t border-[var(--border-soft)] py-16 sm:py-20">
      <Container>
        <div className="mb-8 flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">{title}</h2>
          {description ? <p className="max-w-2xl text-sm text-[var(--text-muted)]">{description}</p> : null}
        </div>
        {children}
      </Container>
    </section>
  );
};
