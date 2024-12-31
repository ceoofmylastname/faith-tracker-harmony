import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import GivingCharts from "./GivingCharts";
import GivingForm from "./GivingForm";
import GivingGoals from "./GivingGoals";

export default function GivingTab() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tithes & Giving</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Record Giving
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Giving (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">+20.1% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tithes (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,320</div>
            <p className="text-xs text-muted-foreground">66.8% of total giving</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,037.50</div>
            <p className="text-xs text-muted-foreground">Last 12 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Annual goal: $15,000</p>
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