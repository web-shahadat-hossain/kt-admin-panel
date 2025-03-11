import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { MentorFormData } from "@/lib/validations/mentore-schema";
import { MentorData } from "@/types/mentore";
import { Mentoreform } from "./Mentoreform";

interface MentorModalProps {
  open: boolean;
  onClose: () => void;
  mentore?: MentorData;
  onSubmit: (data: MentorFormData) => void;
}

export function MentoreModal({
  open,
  onClose,
  mentore,
  onSubmit,
}: MentorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {mentore ? "Edit Mentore" : "Add New Mentore"}
          </DialogTitle>
        </DialogHeader>

        <Mentoreform
          initialData={mentore}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
