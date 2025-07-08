import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { Input } from './input';
import { cn } from '../lib/utils';

const NumberInput = ({ className, ...props }: NumericFormatProps) => {
  return (
    <NumericFormat
      customInput={Input}
      thousandSeparator=","
      decimalScale={6}
      maxLength={25}
      allowNegative={false}
      allowLeadingZeros={false}
      className={cn('w-full', className)}
      {...props}
    />
  );
};

export { NumberInput };
