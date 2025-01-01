import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event } from "./types";

interface EventDialogProps {
  event: Event | null;
  onClose: () => void;
}

export default function EventDialog({ event, onClose }: EventDialogProps) {
  if (!event) return null;

  return (
    <Dialog open={!!event} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {format(event.start, 'MMMM d, yyyy h:mm a')}
          </div>
          {event.content && (
            <p className="text-gray-700 dark:text-gray-300">
              {event.content}
            </p>
          )}
          {event.type === 'task' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Status:
              </span>
              <span className={event.completed ? 'text-green-600' : 'text-yellow-600'}>
                {event.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}