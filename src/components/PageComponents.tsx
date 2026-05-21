import type { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

export function PageContainer({ title, subtitle, icon, actions, children }: PageContainerProps) {
  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-base font-semibold text-[#0F172A]">{title}</h2>
            <p className="text-xs text-[#64748B]">{subtitle}</p>
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, className = "", style }: CardProps) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  icon?: ReactNode;
  badge?: string | number;
  actions?: ReactNode;
}

export function CardHeader({ title, icon, badge, actions }: CardHeaderProps) {
  return (
    <div className="chart-header">
      <div className="chart-title">
        {icon && <span className="dot" style={{ background: "currentColor" }} />}
        {title}
        {badge !== undefined && <span className="badge">{badge}</span>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

interface SectionTitleProps {
  children: ReactNode;
  icon?: ReactNode;
}

export function SectionTitle({ children, icon }: SectionTitleProps) {
  return (
    <h3 className="chart-title text-sm font-semibold text-[#0F172A] flex items-center gap-2 mb-4">
      {icon && <span className="text-[#64748B]">{icon}</span>}
      {children}
    </h3>
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  message: string;
}

export function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="p-8 text-center">
      <div className="w-10 h-10 text-[#E2E8F0] mx-auto mb-3 flex items-center justify-center">{icon}</div>
      <p className="text-xs text-[#64748B]">{message}</p>
    </div>
  );
}

interface KPIGridProps {
  children: ReactNode;
}

export function KPIGrid({ children }: KPIGridProps) {
  return <div className="charts-row">{children}</div>;
}

interface KPIRowProps {
  children: ReactNode;
}

export function KPIRow({ children }: KPIRowProps) {
  return <div className="chart-card">{children}</div>;
}

interface StatItemProps {
  label: string;
  value: string | number;
  color?: "green" | "orange" | "red" | "default";
  delta?: string;
}

export function StatItem({ label, value, color = "default", delta }: StatItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-[#64748B]">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {delta && <span className="week-stat-delta up">{delta}</span>}
        <span className={`week-stat-value ${color !== "default" ? color : ""}`}>{value}</span>
      </div>
    </div>
  );
}

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
}

export function TableRow({ children, onClick }: TableRowProps) {
  return (
    <tr className="cursor-pointer" onClick={onClick}>
      {children}
    </tr>
  );
}