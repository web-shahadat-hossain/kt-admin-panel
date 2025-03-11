import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Course, Offer, Quiz } from "@/types/offer";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OfferForm } from "@/components/offers/OfferForm";
import { OfferList } from "@/components/offers/OfferList";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { MyPagination } from "@/components/ui/my-pagination";
import {
  createOffer,
  deleteOffer,
  fetchOffers,
  updateOffer,
} from "@/store/slices/offer-slice";
import { OfferFormSchema } from "@/lib/validations/offer-schema";
import { Input } from "@/components/ui/input";

export const OfferPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const { toast } = useToast();
  const { currentPage, totalPages, isLoading, offers } = useSelector(
    (state: RootState) => state.offer
  );
  const [searchTerm, setSearchTerm] = useState("");
  const dispath = useDispatch<AppDispatch>();

  useEffect(() => {
    handlePageChange(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    dispath(fetchOffers({ page: page, search: searchTerm }));
  };

  const handleSubmit = (data: OfferFormSchema) => {
    if (editingOffer) {
      dispath(updateOffer({ id: editingOffer._id, updatedData: data })).then(
        (res) => {
          if (res.type == "updateOffer/fulfilled") {
            toast({
              title: "Offer updated",
              description: "The offer has been successfully updated.",
            });
            setIsFormOpen(false);
            setEditingOffer(null);
          }
        }
      );
    } else {
      dispath(createOffer(data)).then((res) => {
        if (res.type == "createOffer/fulfilled") {
          toast({
            title: "Offer created",
            description: "The new offer has been successfully created.",
          });
          setIsFormOpen(false);
          setEditingOffer(null);
        }
      });
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setIsFormOpen(true);
  };

  const handleDelete = (offerId: string) => {
    dispath(deleteOffer(offerId)).then((res) => {
      if (res.type == "deleteOffer/fulfilled") {
        toast({
          title: "Offer deleted",
          description: "The offer has been successfully deleted.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="space-y-6 page-transition">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Offers Management</h1>
        <Button
          onClick={() => {
            setEditingOffer(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Offer
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Search offer by title"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="max-w-sm"
        />
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingOffer ? "Edit Offer" : "Create New Offer"}
            </DialogTitle>
          </DialogHeader>
          <OfferForm
            initialData={editingOffer || undefined}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      <OfferList
        isLoading={isLoading}
        offers={offers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {totalPages >= 1 && (
        <MyPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
