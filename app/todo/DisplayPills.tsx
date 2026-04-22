import { colorMap, type ColorKey, type StatusOption } from './types';

export function Pill({
  children,
  color,
  className,
}: {
  children: React.ReactNode;
  color: ColorKey;
  className?: string;
}) {
  const styles = colorMap[color] || colorMap.gray;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[13px] whitespace-nowrap ${styles.bg} ${styles.text} ${className || ''}`}
    >
      {children}
    </span>
  );
}

export function StatusIcon({
  type,
  color,
}: {
  type: StatusOption['type'];
  color: ColorKey;
}) {
  const c = colorMap[color].dot;

  if (type === 'done') {
    return <div className={`w-2.5 h-2.5 rounded-full ${c}`} />;
  }
  if (type === 'in-progress') {
    return (
      <div className="relative w-2.5 h-2.5 rounded-full border border-current overflow-hidden flex items-center justify-center">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-current opacity-30" />
        <div className="absolute w-1 h-1 rounded-full bg-current" />
      </div>
    );
  }
  return <div className="w-2.5 h-2.5 rounded-full border border-current border-dashed opacity-50" />;
}
