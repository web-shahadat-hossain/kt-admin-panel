import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Edit2, Trash2 } from "lucide-react";
import { Offer } from "@/types/offer";

interface OfferListProps {
  isLoading: boolean;
  offers: Offer[];
  onEdit: (offer: Offer) => void;
  onDelete: (offerId: string) => void;
}

export function OfferList({
  isLoading,
  offers,
  onEdit,
  onDelete,
}: OfferListProps) {
  return (
    <div className="bg-white rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Percentage</TableHead>
            <TableHead>Offer Applied</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : offers.length == 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No Offer Available.
              </TableCell>
            </TableRow>
          ) : (
            offers.map((offer) => (
              <TableRow key={offer._id}>
                <TableCell>{offer.title}</TableCell>
                <TableCell>{offer.offrPer}%</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>
                      {offer.courses.length}{" "}
                      {offer.courses.length > 1 ? "Courses" : "Course"}
                    </span>
                    <span>
                      {offer.quizzes.length}{" "}
                      {offer.quizzes.length > 1 ? "Quizzes" : "Quiz"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(offer.startAt), "PPP")}</TableCell>
                <TableCell>{format(new Date(offer.endAt), "PPP")}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(offer)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => onDelete(offer._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
