import { Button, ButtonProps } from '../ui/button';

const CommandButton = ({ ...props }: ButtonProps) => {
  return (
    <Button
      variant="ghost"
      className="flex items-center justify-center text-sm text-primary-light hover:text-primary-light-hover gap-2 px-3 py-2 rounded-t-sm rounded-b-none"
      {...props}
    />
  );
};

export default CommandButton;
