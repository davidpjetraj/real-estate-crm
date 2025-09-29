import {
  NotificationModel,
  NotificationType,
} from "@/lib/graphql/generated/graphql";

export default function Description({ data }: { data: NotificationModel }) {
  switch (data.type) {
    case NotificationType.CommentsOnProperties:
      return <NewMessage data={data} />;

    case NotificationType.AtachmentAdded:
      return <AttachmentAdded />;

    case NotificationType.CommentsOnProperties:
    case NotificationType.CommentsOnRequests:
    case NotificationType.PropertyAssignedToClient:
    case NotificationType.PropertyAssignedToUser:
    case NotificationType.PropertyStatusUpdated:
    case NotificationType.MentionedInComment:
    case NotificationType.RequestAssignedToClient:
    case NotificationType.RequestAssignedToUser:
    case NotificationType.RequestStatusUpdated:
    case NotificationType.StatusUpdates:
    case NotificationType.PropertyRemoved:
    case NotificationType.PropertyRestored:
    case NotificationType.RequestRemoved:
    case NotificationType.ClientRemoved:
    case NotificationType.ClientRestored:
    case NotificationType.NewClient:
      return <CommentsOnRequests />;

    case NotificationType.PropertyRemoved:
      return <PropertyRemoved />;

    case NotificationType.PropertyRestored:
      return <PropertyRestored />;

    case NotificationType.RequestRemoved:
      return <RequestRemoved />;

    case NotificationType.PropertyStatusUpdated:
      return <DueDateChanged />;

    case NotificationType.ClientRemoved:
      return <ClientRemoved />;

    case NotificationType.ClientRestored:
      return <ClientRestored />;

    case NotificationType.NewClient:
      return <NewClient />;

    case NotificationType.MentionedInComment:
      return <MentionedInComment />;

    case NotificationType.StatusUpdates:
      return <StatusUpdate />;

    case NotificationType.PropertyAssignedToUser:
      return <RequestAssignedToUser />;

    case NotificationType.RequestStatusUpdated:
      return <RequestCompleted />;

    case NotificationType.RequestAssignedToUser:
      return <RequestDueInSevenDays />;

    case NotificationType.RequestAssignedToClient:
      return <RequestDueToday />;

    case NotificationType.PropertyAssignedToClient:
      return <RequestUnassignedFromUser />;

    case NotificationType.PropertyAssignedToUser:
      return <RequestAssignedToUser />;

    case NotificationType.PropertyStatusUpdated:
      return <CommentsOnRequests />;

    case NotificationType.MentionedInComment:
      return <RequestOverdue />;

    default:
      return null;
  }
}

const RequestDueInSevenDays = () => {
  return <>Request is due in seven days</>;
};

const RequestDueToday = () => {
  return <>Request is due today</>;
};

const MentionedInComment = () => {
  return <>You were mentioned in a comment</>;
};

const DueDateChanged = () => {
  return <>The due date of the request was changed</>;
};

const CommentsOnRequests = () => {
  return <>Comment on request</>;
};

const AttachmentAdded = () => {
  return <>An attachment was added to the request</>;
};

const StatusUpdate = () => {
  return <>Status of the request updated</>;
};

const RequestCompleted = () => {
  return <>Request completed</>;
};

const RequestAssignedToUser = () => {
  return <>Request assigned to you</>;
};
const RequestUnassignedFromUser = () => {
  return <>Request unassigned from you</>;
};
const NewMessage = ({ data }: { data: NotificationModel }) => {
  return <>New message, {data?.author?.name}</>;
};

const RequestOverdue = () => {
  return <>Request overdue</>;
};

const PropertyRemoved = () => {
  return <>Property removed</>;
};

const PropertyRestored = () => {
  return <>Property restored</>;
};

const RequestRemoved = () => {
  return <>Request removed</>;
};

const ClientRemoved = () => {
  return <>Client removed</>;
};

const ClientRestored = () => {
  return <>Client restored</>;
};

const NewClient = () => {
  return <>New client</>;
};
