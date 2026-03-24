import './OverviewCard.css';

interface OverviewCardProps {
  title: string;
  value: string;
  supportingText: string;
}

export function OverviewCard({ title, value, supportingText }: OverviewCardProps) {
  return (
    <article className="overview-card">
      <p className="overview-card__title">{title}</p>
      <h3>{value}</h3>
      <p className="overview-card__supporting-text">{supportingText}</p>
    </article>
  );
}

