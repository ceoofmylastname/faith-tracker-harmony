import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Shield, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PartnershipCardProps {
  partnership: {
    id: string;
    status: string;
    user1?: { email: string };
    user2?: { email: string };
  };
  isRequester: boolean;
  partnerEmail: string;
  onStatusUpdate: () => void;
}

export default function PartnershipCard({
  partnership,
  isRequester,
  partnerEmail,
  onStatusUpdate,
}: PartnershipCardProps) {
  const { toast } = useToast();

  const updatePartnershipStatus = async (status: string) => {
    try {
      const { error } = await supabase
        .from("accountability_partnerships")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", partnership.id);

      if (error) throw error;

      onStatusUpdate();
      toast({
        title: "Partnership updated",
        description: `Partnership ${status === "accepted" ? "accepted" : "declined"}.`,
      });
    } catch (error: any) {
      console.error("Error updating partnership:", error);
      toast({
        variant: "destructive",
        title: "Error updating partnership",
        description: error.message,
      });
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold">{partnerEmail}</div>
          <div className="text-sm text-gray-500">
            Status: {partnership.status}
          </div>
        </div>
        {!isRequester && partnership.status === "pending" && (
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={() => updatePartnershipStatus("accepted")}
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              Accept
            </Button>
            <Button
              variant="destructive"
              onClick={() => updatePartnershipStatus("declined")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Decline
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}