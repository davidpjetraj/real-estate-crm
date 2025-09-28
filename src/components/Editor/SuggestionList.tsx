import { Avatar, List, ListItem, ListItemButton, Paper } from '@mui/material';
import { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import type { MentionSuggestion } from './mentionSuggestionOptions';

export type SuggestionListRef = {
  onKeyDown: NonNullable<
    ReturnType<
      NonNullable<SuggestionOptions<MentionSuggestion>['render']>
    >['onKeyDown']
  >;
};

interface MentionNodeAttrs {
  id: string | null;
  label?: string | null;
}

export type SuggestionListProps = SuggestionProps<MentionSuggestion>;

const SuggestionList = forwardRef<SuggestionListRef, SuggestionListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      if (index >= props.items.length) {
        return;
      }

      const suggestion = props.items[index] as MentionSuggestion;

      const mentionItem: MentionNodeAttrs = {
        id: suggestion.id,
        label: suggestion.mentionLabel,
      };

      props.command({
        ...mentionItem,
        avatar: suggestion.avatar,
      });
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length,
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          upHandler();
          return true;
        }

        if (event.key === 'ArrowDown') {
          downHandler();
          return true;
        }

        if (event.key === 'Enter') {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return props?.items?.length > 0 ? (
      <Paper elevation={5}>
        <List
          dense
          sx={{
            overflow: 'hidden',
          }}>
          {props?.items.map((item, index) => {
            return (
              <ListItem key={item?.id} disablePadding>
                <ListItemButton
                  selected={index === selectedIndex}
                  onClick={() => selectItem(index)}>
                  <Avatar
                    src={item.avatar}
                    alt={item?.mentionLabel}
                    style={{
                      marginRight: 6,
                      maxWidth: 18,
                      maxHeight: 18,
                      color: '#fff',
                      backgroundColor: '#0BA5EC',
                      fontSize: 12,
                    }}>
                    {item.mentionLabel.charAt(0)}
                  </Avatar>
                  {item.mentionLabel}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    ) : null;
  },
);

SuggestionList.displayName = 'SuggestionList';

export default SuggestionList;
