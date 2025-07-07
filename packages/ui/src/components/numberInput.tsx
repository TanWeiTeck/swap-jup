import React from 'react';
import { NumericFormat } from 'react-number-format';
import { Input } from './input';
import { cn } from '../lib/utils';

const NumberInput = ({
  value,
  onValueChange,
  className,
  onChange,
  placeholder,
}: {
  value?: string | number;
  onValueChange: (value: string) => void;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => {
  return (
    <NumericFormat
      placeholder={placeholder}
      customInput={Input}
      value={value}
      onValueChange={(values) => {
        onValueChange(values.value || '');
      }}
      onChange={onChange}
      thousandSeparator=","
      decimalScale={6}
      maxLength={25}
      allowNegative={false}
      allowLeadingZeros={false}
      className={cn('w-full', className)}
    />
  );
};

export { NumberInput };
