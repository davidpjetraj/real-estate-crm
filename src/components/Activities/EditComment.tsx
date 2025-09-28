"use client";
import {
  ActivityModel,
  SimpleTeamModel,
  useUpdateCommentMutation,
  ActivitiesDocument,
  ActivitiesQuery,
  ActivitiesQueryVariables,
} from "@/lib/graphql/generated/graphql";
import { styled } from "@mui/material";
import { useState } from "react";
import { CommentEditor, Editor } from "../Editor/CommentEditor";
import { LoadingButton } from "../LoadingButton";

const Wrapper = styled("div")`
  .editor-wrapper {
    border: 1px solid ${({ theme }) => theme.palette.divider};
    border-radius: 12px;
    width: 100%;
    overflow: auto;
    height: 142px;
    position: relative;
    p,
    a {
      color: ${({ theme }) => theme.palette.text.primary};
    }
    .actions-buttons {
      position: absolute;
      bottom: 8px;
      right: 8px;
      z-index: 99;
      display: flex;
      gap: 4px;
      .MuiButton-root {
        @media (max-width: 550px) {
          padding: 4px 12px;
          font-size: 12px;
        }
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
      @media (max-width: 410px) {
        gap: 0px;
      }
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

export default function EditComment({
  activity,
  setEditing,
  created_for_id,
}: {
  activity: ActivityModel;
  setEditing: (value: boolean) => void;
  created_for_id: string;
}) {
  const [editorKey, setEditorKey] = useState(Date.now());

  const [value, setValue] = useState(activity?.message || {});
  const [textValue, setTextValue] = useState(activity?.message_text || "");
  const [canAddComment, setCanAddComment] = useState(false);
  const [mentions, setMentions] = useState([]);

  const [mutate] = useUpdateCommentMutation();

  const createComment = async (
    currentValue: any,
    currentTextValue: string,
    currentMentions: any
  ) => {
    setEditorKey(Date.now());
    setEditing(false);
    setCanAddComment(false);

    await mutate({
      variables: {
        input: {
          id: activity.id,
          message: currentValue,
          message_text: currentTextValue,
          mentions: currentMentions?.map(
            (mention: SimpleTeamModel) => mention?.id
          ),
        },
      },
      refetchQueries: [ActivitiesDocument],
      awaitRefetchQueries: true,
      optimisticResponse: {
        __typename: "Mutation",
        updateComment: {
          ...activity,
          __typename: "ActivityModel",
          message: currentValue,
          message_text: currentTextValue,
          edited: true,
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
              id: created_for_id,
              created_for: activity.created_for,
            },
          },
        });

        const newActivities = existingActivities?.activities.map((activity) => {
          if (activity.id === data?.updateComment?.id) {
            return data?.updateComment;
          }

          return activity;
        });

        cache.writeQuery({
          query: ActivitiesDocument,
          variables: {
            input: {
              id: created_for_id,
              created_for: activity.created_for,
            },
          },
          data: {
            activities: newActivities,
          },
        });
      },
    });
  };

  return (
    <Wrapper>
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
          description="Add Comment"
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
        <div className="actions-buttons">
          <LoadingButton
            variant="outlined"
            size="small"
            color="inherit"
            onClick={() => setEditing(false)}
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            variant="contained"
            size="small"
            color="primary"
            className="add-comment-btn"
            loading={false}
            onClick={() => {
              createComment(value, textValue, mentions);
            }}
            disabled={!canAddComment}
          >
            Save
          </LoadingButton>
        </div>
      </div>
    </Wrapper>
  );
}
