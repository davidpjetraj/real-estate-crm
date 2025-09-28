import { ActivityModel, ActivityType } from "@/lib/graphql/generated/graphql";
import { djs } from "../shared/utils";

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
        return payload;
    }
  };

  if (data.type === ActivityType.Create) {
    if (data.activity_key === "create_task") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat diese Aufgabe erstellt
        </span>
      );
    }
    if (data.activity_key === "create_member") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat diesen Mitarbeiter erstellt
        </span>
      );
    }
    if (data.activity_key === "create_client") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat diesen Kunden erstellt
        </span>
      );
    }
    if (data.activity_key === "create_object") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat dieses Objekt erstellt
        </span>
      );
    }
    if (data.activity_key === "create_team") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat dieses Team erstellt
        </span>
      );
    }

    // Fallback for unknown create activities
    return (
      <span style={{ wordBreak: "break-word" }}>
        hat ein neues Element erstellt
      </span>
    );
  }

  if (data.type === ActivityType.Delete) {
    return <span style={{ wordBreak: "break-word" }}>Aufgabe gelöscht</span>;
  }

  if (data.type === ActivityType.Update) {
    if (data.activity_key === "update_member_basic_info") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Grundinformationen aktualisiert
        </span>
      );
    }

    if (data.activity_key === "update_member_emergency_contacts") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Notfallkontakte aktualisiert
        </span>
      );
    }
    if (data.activity_key === "task_overdue") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Aufgabe überfällig gemacht
        </span>
      );
    }

    if (data.activity_key === "update_member_documents") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat Dokumente hochgeladen/aktualisiert
        </span>
      );
    }

    // if (data.activity_key === 'change_team_status') {
    //   const findStatus = userStatuses?.find(
    //     status => status.value === payload?.status,
    //   );
    //   return (
    //     <span style={{ wordBreak: 'break-word' }}>
    //       hat den Mitarbeiterstatus geändert zu{' '}
    //       <strong>&quot;{findStatus?.label || payload?.status}&quot;</strong>
    //     </span>
    //   );
    // }

    if (data.activity_key === "resend_invite_team") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Teameinladung erneut gesendet
        </span>
      );
    }

    if (data.activity_key === "update_member_location") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat den Arbeitsort aktualisiert
        </span>
      );
    }

    if (data.activity_key === "update_member_employment_details") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Beschäftigungsdetails aktualisiert
        </span>
      );
    }

    if (data.activity_key === "update_member_salary_details") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Gehaltsdetails aktualisiert
        </span>
      );
    }
    if (data.activity_key === "update_member_avatar") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat den Avatar aktualisiert
        </span>
      );
    }

    if (data.activity_key === "update_client_personal_info") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Grundinformationen aktualisiert
        </span>
      );
    }

    if (data.activity_key === "update_client_contact_persons") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Kontaktpersonen aktualisiert
        </span>
      );
    }

    // if (data.activity_key === "change_client_status") {
    //   const findStatus = clientStatuses?.find(
    //     (status) => status.value === payload?.status
    //   );

    //   return (
    //     <span style={{ wordBreak: "break-word" }}>
    //       hat den Kundenstatus geändert zu{" "}
    //       <strong>&quot;{findStatus?.label || payload?.status}&quot;</strong>
    //     </span>
    //   );
    // }

    if (data.activity_key === "export_clients") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat Kundendaten exportiert
        </span>
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
    //       hat den Aufgabenstatus geändert zu{" "}
    //       <strong>&quot;{findStatus?.label || payload?.status}&quot;</strong>
    //     </span>
    //   );
    // }

    if (data.activity_key === "update_task_basic_info") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Grundinformationen der Aufgabe aktualisiert
        </span>
      );
    }

    if (data.activity_key === "update_task_invoice_details") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Rechnungsdetails der Aufgabe aktualisiert
        </span>
      );
    }

    if (data.activity_key === "update_task_deleted_state") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat den Löschstatus der Aufgabe geändert
        </span>
      );
    }

    if (data.activity_key === "update_task_assignee") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Zuweisung der Aufgabe geändert
        </span>
      );
    }

    if (data.activity_key === "update_task_recurring_option") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Wiederholungsoptionen der Aufgabe aktualisiert
        </span>
      );
    }

    if (data.activity_key === "update_task_client_assignment") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Kundenzuweisung der Aufgabe geändert
        </span>
      );
    }

    if (data.activity_key === "update_task_documents") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat Dokumente der Aufgabe aktualisiert
        </span>
      );
    }

    if (data?.activity_key === "update_object_basic_info") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Objektinformationen aktualisiert
        </span>
      );
    }

    if (
      data?.activity_key ===
      "update_object_client_assignment_and_service_configuration"
    ) {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Kunden- und Funktionsbereich und Service Konfiguration
          aktualisiert
        </span>
      );
    }

    if (data?.activity_key === "update_object_access_information") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Zugangsinformationen aktualisiert
        </span>
      );
    }

    if (data?.activity_key === "update_object_contact_persons") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat die Kontaktpersonen aktualisiert
        </span>
      );
    }

    if (data?.activity_key === "update_object_documents") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat Dokumente hochgeladen/aktualisiert
        </span>
      );
    }

    if (data?.activity_key === "assign_care_taker") {
      return (
        <span style={{ wordBreak: "break-word" }}>
          hat den Betreuer geändert zu{" "}
          <strong>&quot;{payload?.care_taker?.name}&quot;</strong>
        </span>
      );
    }

    //   if (data?.activity_key === "change_object_status") {
    //     const findStatus = objectTypes?.find(
    //       (status) => status.value === payload?.type
    //     );
    //     return (
    //       <span style={{ wordBreak: "break-word" }}>
    //         hat den Objektstatus geändert zu{" "}
    //         <strong>&quot;{findStatus?.label || payload?.type}&quot;</strong>
    //       </span>
    //     );
    //   }

    //   return (
    //     <span style={{ wordBreak: "break-word" }}>Aufgabe aktualisiert</span>
    //   );
    // }

    if (payload === "" || payload === null || payload === undefined) {
      return <span> {data.activity_key}</span>;
    }

    return (
      <span style={{ wordBreak: "break-word" }}>
        {" "}
        aktualisiert
        {data.activity_key}
        zu <strong>&quot;{formattedPayload()}&quot;</strong>
      </span>
    );
  }
}
