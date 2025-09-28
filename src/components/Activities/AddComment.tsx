"use client";

import { styled, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import {
  AccountModel,
  ActivitiesDocument,
  ActivitiesQuery,
  ActivitiesQueryVariables,
  ActivityCreatedFor,
  CreateActivityInput,
  SimpleTeamModel,
  useAddCommentMutation,
} from "@/lib/graphql/generated/graphql";
import MemberAvatar from "../shared/Avatar";
import { CommentEditor, Editor } from "../Editor/CommentEditor";
import { LoadingButton } from "../LoadingButton";
import useAuth from "../../../store/useAuth";

const Wrapper = styled("div")`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.palette.divider};
  background-color: ${({ theme }) =>
    theme.palette.mode == "light"
      ? theme.palette.action.hover
      : theme.palette.background.paper};
  .editor-wrapper {
    border: 1px solid ${({ theme }) => theme.palette.divider};
    border-radius: 12px;
    width: calc(100% - 32px);
    overflow: auto;
    height: 142px;
    padding: 0px 8px;
    position: relative;
    .add-comment-btn {
      position: absolute;
      bottom: 8px;
      right: 8px;
      z-index: 99;
      @media (max-width: 550px) {
        padding: 4px 12px;
        font-size: 9px;
        max-width: 70px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .editor-content,
    .ProseMirror {
      position: relative;
      overflow: auto;
    }
    .editor-menu {
      position: sticky;
      bottom: 4px;
      left: 0;
      z-index: 999;
      gap: 2px;
      .bubble-button {
        width: 30px;
        height: 30px;
        padding: 6px;
        border-radius: 8px;
        background-color: transparent;
        &:hover {
          background-color: ${({ theme }) => theme.palette.action.hover};
        }
      }
      @media (max-width: 650px) {
        border: none;
        box-shadow: none;
        padding: 0;

        .bubble-button {
          width: 24px;
          height: 24px;
          padding: 4px;
          border-radius: 6px;
          svg {
            width: 14px;
            height: 14px;
          }
        }
      }
    }
    @media (max-width: 320px) {
      .editor-menu {
        display: flex;
        flex-wrap: wrap;
        max-width: 60%;
      }
    }

    .editor-content {
      .tiptap {
        height: calc(140px - 55px);
        @media (max-width: 550px) {
          height: calc(140px - 68px);
        }
      }
    }
    p {
      margin-top: 0;
    }
  }
`;

export default function AddComment({
  scrollToBottom,
  created_for,
  action,
  id,
}: {
  scrollToBottom: () => void;
  created_for: any;
  action: any;
  id: string;
}) {
  const { user } = useAuth((state) => state);
  const [editorKey, setEditorKey] = useState(Date.now());
  const [canAddComment, setCanAddComment] = useState(false);

  const [value, setValue] = useState({});
  const [textValue, setTextValue] = useState("");
  const [mentions, setMentions] = useState([]);

  const [mutate] = useAddCommentMutation();

  const createComment = async (
    currentValue: any,
    currentTextValue: string,
    currentMentions: any
  ) => {
    setValue({});
    setTextValue("");
    setEditorKey(Date.now());
    setCanAddComment(false);

    setTimeout(() => {
      scrollToBottom();
    }, 300);

    const data: CreateActivityInput = {
      type: action,
      message: currentValue,
      message_text: currentTextValue,
      created_for: created_for,
      mentions: currentMentions?.map((mention: SimpleTeamModel) => mention?.id),
    };

    if (created_for === ActivityCreatedFor.Request) {
      data.request_id = id as string;
    }

    if (created_for === ActivityCreatedFor.Property) {
      data.property_id = id as string;
    }

    if (created_for === ActivityCreatedFor.Client) {
      data.client_id = id as string;
    }

    if (created_for === ActivityCreatedFor.User) {
      data.user_id = id as string;
    }

    await mutate({
      variables: {
        input: data,
      },
      refetchQueries: [ActivitiesDocument],
      awaitRefetchQueries: true,
      optimisticResponse: {
        __typename: "Mutation",
        addComment: {
          __typename: "ActivityModel",
          payload: {},
          is_bot: false,
          id: Math.random().toString(),
          type: action,
          message: currentValue,
          message_text: currentTextValue,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          edited: false,
          created_for: created_for,
          activity_key: null,
          format: "none",
          deleted: false,
          old_payload: null,
          property_id: created_for === ActivityCreatedFor.Property ? id : null,
          client_id: created_for === ActivityCreatedFor.Client ? id : null,
          user_id: created_for === ActivityCreatedFor.User ? id : null,
          request_id: created_for === ActivityCreatedFor.Request ? id : null,
          author: {
            __typename: "SimpleTeamModel",
            id: user?.id as string,
            name: user?.name,
            email: user?.email,
            avatar: user?.avatar,
            phone: user?.phone,
            status: user?.status,
            created_at: user?.created_at,
            birthday: user?.birthday,
            first_name: user?.first_name,
            last_name: user?.last_name,
          },
        },
      },
      update(cache, { data }) {
        const existingActivities = cache.readQuery<
          ActivitiesQuery,
          ActivitiesQueryVariables
        >({
          query: ActivitiesDocument,
          variables: {
            input: {
              id: id as string,
              created_for: created_for,
            },
          },
        });

        cache.writeQuery({
          query: ActivitiesDocument,
          variables: {
            input: {
              id: id as string,
              created_for: created_for,
            },
          },
          data: {
            activities: [
              ...(existingActivities?.activities || []),
              data?.addComment,
            ],
          },
        });
      },
    }).then(() => {
      setMentions([]);
    });
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Wrapper>
      <MemberAvatar user={user as AccountModel} size={32} />
      <div className="editor-wrapper">
        <CommentEditor
          key={editorKey}
          initialContent={value}
          onUpdate={(editor: Editor) => {
            const json = editor.getJSON();
            setValue(json);
            setTextValue(editor.getText());
            const mentions: any = [];

            editor.state.doc.descendants((node) => {
              if (node.type.name === "mention") {
                mentions.push({
                  id: node.attrs.id,
                  label: node.attrs.label,
                  avatar: node.attrs.avatar,
                });
              }
            });

            setCanAddComment(
              mentions.length > 0 || editor.getText().length > 0
            );
            setMentions(mentions);
          }}
          description="Kommentar hinzufügen"
          editorProps={{
            handleKeyDown(view: any, event: any) {
              if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();

                const textContent = view.state.doc.textContent.trim();
                const m: any = [];
                view.state.doc.descendants((node: any) => {
                  if (node.type.name === "mention") {
                    m.push({
                      id: node.attrs.id,
                      label: node.attrs.label,
                      avatar: node.attrs.avatar,
                    });
                  }
                });

                if (m.length > 0 || textContent?.length > 0) {
                  createComment(
                    view.state.doc.toJSON(),
                    view.state.doc.textContent,
                    m
                  );
                  return true;
                }

                return false;
              }
              return false;
            },
          }}
        />
        <LoadingButton
          variant="contained"
          size={isMobile ? "small" : "medium"}
          color="primary"
          className="add-comment-btn"
          sx={{
            backgroundColor: (theme) => theme.palette.primary.dark,
            "&:hover": {
              backgroundColor: (theme) => theme.palette.primary.dark,
            },
          }}
          loading={false}
          onClick={() => {
            createComment(value, textValue, mentions);
          }}
          disabled={!canAddComment}
        >
          Kommentieren
        </LoadingButton>
      </div>
    </Wrapper>
  );
}
