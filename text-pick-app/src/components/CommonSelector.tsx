import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

interface CommonSelectorProps {
  onValueChange: (value: string) => void;
  value: string;
  disabled: boolean;
  placeholder: string;
  values: string[];
}

export const CommonSelector: React.FC<CommonSelectorProps> = ({ 
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
        {values.map((elem) => (<SelectItem key={elem} value={elem}>{elem}</SelectItem>))}
      </SelectContent>
    </Select>
  )
}
