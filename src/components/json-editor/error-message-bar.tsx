import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { isEmpty } from '@/lib/helpers';
import { cn } from '@/lib/utils';

interface ErrorMessageBarProps {
  errors: string[];
  className?: string;
}

const ErrorMessageBar = ({ errors, className }: ErrorMessageBarProps) => {
  return (
    <ScrollArea className={cn(className, 'w-full')}>
      <h4 className={cn('p-2 text-sm font-medium leading-none align-middle')}>Problems ({errors.length})</h4>
      {!isEmpty(errors) && <Separator className="mb-2" />}
      {errors?.map((error, index) => (
        <div key={error + index} className="px-2">
          <div className="text-sm mb-2">{error}</div>
          {index < errors.length - 1 && <Separator className="mb-2" />}
        </div>
      ))}
    </ScrollArea>
  );
};

export default ErrorMessageBar;
