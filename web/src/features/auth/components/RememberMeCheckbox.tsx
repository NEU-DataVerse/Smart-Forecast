import { Checkbox } from '@/components/ui/checkbox';

interface RememberMeCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function RememberMeCheckbox({
  checked,
  onCheckedChange,
  disabled = false,
}: RememberMeCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="remember"
        checked={checked}
        onCheckedChange={(checked: boolean | 'indeterminate') => onCheckedChange(checked === true)}
        disabled={disabled}
      />
      <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer select-none">
        Remember me for 7 days
      </label>
    </div>
  );
}
