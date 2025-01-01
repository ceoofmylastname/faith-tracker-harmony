import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import GivingCharts from "./GivingCharts";
import GivingForm from "./GivingForm";
import GivingGoals from "./GivingGoals";
import { useGivingAnalytics } from "@/hooks/useGivingAnalytics";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function GivingTab() {
  const { data: analytics, isLoading } = useGivingAnalytics();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tithes & Giving</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Record Giving
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Giving</DialogTitle>
            </DialogHeader>
            <GivingForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Giving (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${isLoading ? "..." : analytics?.totalGivingYTD.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Track your total giving for the year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tithes (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${isLoading ? "..." : analytics?.tithesYTD.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "..." : ((analytics?.tithesYTD || 0) / (analytics?.totalGivingYTD || 1) * 100).toFixed(1)}% of total giving
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${isLoading ? "..." : analytics?.monthlyAverage.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Last 12 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {isLoading ? "..." : analytics?.goalProgress.toFixed(0)}%
            </div>
            <Progress value={analytics?.goalProgress} />
            <p className="text-xs text-muted-foreground">
              ${isLoading ? "..." : analytics?.currentGoalAmount?.toFixed(2) || "0.00"} goal
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Giving History</CardTitle>
            </CardHeader>
            <CardContent>
              <GivingCharts />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <GivingGoals />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}