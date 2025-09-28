import {
  ActivitiesDocument,
  ActivityModel,
  useRemoveActivityMutation,
} from "@/lib/graphql/generated/graphql";
import { IconButton, List, ListItemButton, ListItemText } from "@mui/material";
import { usePopover, CustomPopover } from "../shared/popover";
import { toast } from "sonner";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";

export default function CommentActions({
  data,
  setEditing,
}: {
  data: ActivityModel;
  setEditing: (value: boolean) => void;
}) {
  const popover = usePopover();

  const [deleteComment] = useRemoveActivityMutation();

  const handleRemoveComment = async (id: string) => {
    popover.onClose();
    try {
      await deleteComment({
        variables: {
          input: {
            id,
          },
        },
        refetchQueries: [ActivitiesDocument],
        awaitRefetchQueries: true,
        optimisticResponse: {
          __typename: "Mutation",
          removeActivity: {
            ...data,
            __typename: "ActivityModel",
            id: id,
          },
        },
        update(cache) {
          cache.modify({
            fields: {
              activities(existingActivities = [], { readField }) {
                return existingActivities.filter(
                  (activityRef: any) => id !== readField("id", activityRef)
                );
              },
            },
          });
        },
      });
      toast.success("Comment successfully deleted");
    } catch (error) {
      console.log(error);
      toast.error(
        "An error occurred while deleting the comment, please try again"
      );
    }
  };

  return (
    <div>
      <IconButton size="small" onClick={popover.onOpen}>
        <ChevronDownIcon width={18} height={18} />
      </IconButton>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{
          padding: 0,
          overflow: "hidden",
        }}
      >
        <List
          disablePadding
          sx={{
            padding: 0,
          }}
        >
          <ListItemButton
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
              popover.onClose();
            }}
          >
            <ListItemText primary="Edit" />
          </ListItemButton>
          <ListItemButton
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveComment(data?.id);
            }}
          >
            <ListItemText primary="Delete" color="error" />
          </ListItemButton>
        </List>
      </CustomPopover>
    </div>
  );
}
