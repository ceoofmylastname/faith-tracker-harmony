import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, gradientFrom, gradientTo }: StatCardProps) {
  return (
    <Card className="elegant-card">
      <CardHeader className={`bg-gradient-to-br from-${gradientFrom} to-${gradientTo} rounded-t-lg`}>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </CardContent>
    </Card>
  );
}