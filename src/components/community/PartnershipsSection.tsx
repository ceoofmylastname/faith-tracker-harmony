import { useAuth } from "@/contexts/AuthContext";
import PartnershipRequestForm from "./partnerships/PartnershipRequestForm";
import PartnershipCard from "./partnerships/PartnershipCard";
import { usePartnerships } from "./partnerships/usePartnerships";

export default function PartnershipsSection() {
  const { user } = useAuth();
  const { users, partnerships, loadPartnerships } = usePartnerships(user?.id);

  return (
    <div className="space-y-4">
      <PartnershipRequestForm
        users={users}
        onRequestSent={loadPartnerships}
        currentUserId={user?.id || ""}
      />

      <div className="space-y-4">
        {partnerships.map((partnership) => {
          const isRequester = partnership.user_id_1 === user?.id;
          const partnerEmail = isRequester
            ? partnership.user2?.email
            : partnership.user1?.email;

          return (
            <PartnershipCard
              key={partnership.id}
              partnership={partnership}
              isRequester={isRequester}
              partnerEmail={partnerEmail}
              onStatusUpdate={loadPartnerships}
            />
          );
        })}
      </div>
    </div>
  );
}