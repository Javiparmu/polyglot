import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import CommandButton from './command-button';

export interface CommandBarItem {
  key: string;
  text?: string;
  icon?: ReactNode;
  position?: 'left' | 'right';
  onClick?: () => void;
  disabled?: boolean;
  hide?: boolean;
  onRender?: () => JSX.Element;
}

interface CommandBarProps extends HTMLAttributes<HTMLDivElement> {
  items: CommandBarItem[];
}

const CommandBar = ({ items, className, ...props }: CommandBarProps) => {
  return (
    <div className={cn(className, 'flex justify-between items-center')} {...props}>
      <div className="flex gap-2">
        {items
          .filter((item) => !item.position || item.position === 'left')
          .map((item) => (
            <span key={item.key}>
              {item.hide && null}
              {item?.onRender?.() ?? (
                <CommandButton onClick={item.onClick} disabled={item.disabled}>
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.text}</span>
                </CommandButton>
              )}
            </span>
          ))}
      </div>
      <div className="flex gap-2">
        {items
          .filter((item) => item.position === 'right')
          .map((item) => (
            <span key={item.key}>
              {item.hide && null}
              {item?.onRender?.() ?? (
                <CommandButton onClick={item.onClick} disabled={item.disabled}>
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.text}</span>
                </CommandButton>
              )}
            </span>
          ))}
      </div>
    </div>
  );
};

export default CommandBar;
