import { Progress } from "@/components/ui/progress";

const goals = [
  {
    name: "Annual Giving",
    current: 12450,
    target: 15000,
    progress: 83,
  },
  {
    name: "Monthly Tithe",
    current: 950,
    target: 1000,
    progress: 95,
  },
  {
    name: "Special Offering",
    current: 300,
    target: 500,
    progress: 60,
  },
];

export default function GivingGoals() {
  return (
    <div className="space-y-6">
      {goals.map((goal) => (
        <div key={goal.name} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{goal.name}</span>
            <span className="text-muted-foreground">
              ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
            </span>
          </div>
          <Progress value={goal.progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {goal.progress}% Complete
          </p>
        </div>
      ))}
    </div>
  );
}