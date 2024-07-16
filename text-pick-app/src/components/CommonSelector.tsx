import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StringSelectorProps {
  onValueChange: (value: string) => void;
  value: string;
  disabled: boolean;
  placeholder: string;
  values: string[];
}

interface NumberSelectorProps {
  onValueChange: (value: string) => void;
  value: string;
  disabled: boolean;
  placeholder: string;
  values: number[];
}

export const StringSelector: React.FC<StringSelectorProps> = ({ 
  onValueChange,
  value,
  disabled,
  placeholder,
  values
}) => {
  return (
    <Select onValueChange={onValueChange} value={value} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {values.map((elem) => (
          <SelectItem key={elem} value={elem}>
            {elem}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export const NumberSelector: React.FC<NumberSelectorProps> = ({ 
  onValueChange,
  value,
  disabled,
  placeholder,
  values
}) => {
  return (
    <Select onValueChange={onValueChange} value={value} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {values.map(num => (
          <SelectItem key={num} value={`注文${num}`}>注文{num}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
