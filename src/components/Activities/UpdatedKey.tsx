import { ActivityModel, ActivityType } from "@/lib/graphql/generated/graphql";
import { djs } from "../shared/utils";
import { teamStatuses } from "../utils/constants";

export default function UpdatedKey({ data }: { data: ActivityModel }) {
  const format = data.format || "";
  const activity_key = data.activity_key || "";
  const payload = activity_key ? data?.payload : null;

  const formattedPayload = () => {
    switch (format) {
      case "date":
        return djs(payload).format("DD.MM.YYYY");
      case "number":
        return payload;

      default:
        // If payload is an object, convert it to a string representation
        if (typeof payload === "object" && payload !== null) {
          return JSON.stringify(payload);
        }
        return payload;
    }
  };

  if (data.type === ActivityType.Create) {
    if (data.activity_key === "create_task") {
      return <span style={{ wordBreak: "break-word" }}>created this task</span>;
    }
    if (data.activity_key === "create_member") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          created this team member
        </span>
      );
    }
    if (data.activity_key === "create_client") {
      return (
        <span style={{ wordBreak: "break-word" }}>created this client</span>
      );
    }
    if (data.activity_key === "create_object") {
      return (
        <span style={{ wordBreak: "break-word" }}>created this object</span>
      );
    }
    if (data.activity_key === "create_team") {
      return <span style={{ wordBreak: "break-word" }}>created this team</span>;
    }

    // Fallback for unknown create activities
    return (
      <span style={{ wordBreak: "break-word" }}>created a new element</span>
    );
  }

  if (data.type === ActivityType.Delete) {
    return <span style={{ wordBreak: "break-word" }}>Task deleted</span>;
  }

  if (data.type === ActivityType.Update) {
    if (data.activity_key === "update_member_basic_info") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          updated the basic information
        </span>
      );
    }

    if (data.activity_key === "update_member_emergency_contacts") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          updated the emergency contacts
        </span>
      );
    }
    if (data.activity_key === "task_overdue") {
      return (
        <span style={{ wordBreak: "break-word" }}>made the task overdue</span>
      );
    }

    if (data.activity_key === "update_member_documents") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          uploaded/updated documents
        </span>
      );
    }

    if (data.activity_key === "change_team_status") {
      const findStatus = teamStatuses?.find(
        (status) => status.value === payload?.status
      );
      return (
        <span style={{ wordBreak: "break-word" }}>
          changed the team member status to{" "}
          <strong>&quot;{findStatus?.label || payload?.status}&quot;</strong>
        </span>
      );
    }

    if (data.activity_key === "resend_invite_team") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          resent the team invitation
        </span>
      );
    }

    if (data.activity_key === "update_member_location") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          updated the work location
        </span>
      );
    }

    if (data.activity_key === "update_member_employment_details") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          updated the employment details
        </span>
      );
    }

    if (data.activity_key === "update_member_salary_details") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          updated the salary details
        </span>
      );
    }
    if (data.activity_key === "update_member_avatar") {
      return (
        <span style={{ wordBreak: "break-word" }}>updated the avatar</span>
      );
    }

    if (data.activity_key === "update_client_personal_info") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          updated the basic information
        </span>
      );
    }

    if (data.activity_key === "update_client_contact_persons") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          updated the contact persons
        </span>
      );
    }

    // if (data.activity_key === "change_client_status") {
    //   const findStatus = clientStatuses?.find(
    //     (status) => status.value === payload?.status
    //   );

    //   return (
    //     <span style={{ wordBreak: "break-word" }}>
    //       changed the client status to{" "}
    //       <strong>&quot;{findStatus?.label || payload?.status}&quot;</strong>
    //     </span>
    //   );
    // }

    if (data.activity_key === "export_clients") {
      return (
        <span style={{ wordBreak: "break-word" }}>exported client data</span>
      );
    }

    // if (
    //   data.activity_key === "update_task_status" ||
    //   data.activity_key === "update_task_recurring_and_status"
    // ) {
    //   const findStatus = taskStatuses?.find(
    //     (status) => status.value === payload?.status
    //   );
    //   return (
    //     <span style={{ wordBreak: "break-word" }}>
    //       changed the task status to{" "}
    //       <strong>&quot;{findStatus?.label || payload?.status}&quot;</strong>
    //     </span>
    //   );
    // }

    if (data.activity_key === "update_task_basic_info") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          updated the task basic information
        </span>
      );
    }

    if (data.activity_key === "update_task_invoice_details") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          updated the task invoice details
        </span>
      );
    }

    if (data.activity_key === "update_task_deleted_state") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          changed the task deletion status
        </span>
      );
    }

    if (data.activity_key === "update_task_assignee") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          changed the task assignment
        </span>
      );
    }

    if (data.activity_key === "update_task_recurring_option") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          updated the task recurring options
        </span>
      );
    }

    if (data.activity_key === "update_task_client_assignment") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          changed the task client assignment
        </span>
      );
    }

    if (data.activity_key === "update_task_documents") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          updated the task documents
        </span>
      );
    }

    if (data?.activity_key === "update_object_basic_info") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          updated the object information
        </span>
      );
    }

    if (
      data?.activity_key ===
      "update_object_client_assignment_and_service_configuration"
    ) {
      return (
        <span style={{ wordBreak: "break-word" }}>
          updated the client and functional area and service configuration
        </span>
      );
    }

    if (data?.activity_key === "update_object_access_information") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          updated the access information
        </span>
      );
    }

    if (data?.activity_key === "update_object_contact_persons") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          updated the contact persons
        </span>
      );
    }

    if (data?.activity_key === "update_object_documents") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          uploaded/updated documents
        </span>
      );
    }

    if (data?.activity_key === "assign_care_taker") {
      const careTakerName = payload?.care_taker?.name;
      const displayName =
        typeof careTakerName === "object" && careTakerName !== null
          ? JSON.stringify(careTakerName)
          : careTakerName;
      return (
        <span style={{ wordBreak: "break-word" }}>
          changed the caretaker to <strong>&quot;{displayName}&quot;</strong>
        </span>
      );
    }

    //   if (data?.activity_key === "change_object_status") {
    //     const findStatus = objectTypes?.find(
    //       (status) => status.value === payload?.type
    //     );
    //     return (
    //       <span style={{ wordBreak: "break-word" }}>
    //         changed the object status to{" "}
    //         <strong>&quot;{findStatus?.label || payload?.type}&quot;</strong>
    //       </span>
    //     );
    //   }

    //   return (
    //     <span style={{ wordBreak: "break-word" }}>Task updated</span>
    //   );
    // }

    if (payload === "" || payload === null || payload === undefined) {
      return <span> {data.activity_key}</span>;
    }

    return (
      <span style={{ wordBreak: "break-word" }}>
        {" "}
        updated
        {data.activity_key}
        zu <strong>&quot;{formattedPayload()}&quot;</strong>
      </span>
    );
  }
}
