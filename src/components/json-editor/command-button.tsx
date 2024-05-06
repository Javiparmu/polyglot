import { Button, ButtonProps } from '../ui/button';

const CommandButton = ({ ...props }: ButtonProps) => {
  return (
    <Button
      variant="ghost"
      className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-700 gap-2 px-3 py-2 rounded-t-sm rounded-b-none"
      {...props}
    />
  );
};

export default CommandButton;
