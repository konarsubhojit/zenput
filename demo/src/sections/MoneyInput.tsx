import { MoneyInput } from 'zenput';
import { Section, Scenario } from './_shell';

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
];

export function MoneyInputSection() {
  return (
    <Section
      id="money-input"
      name="MoneyInput"
      description="Currency-aware amount input with a currency selector."
    >
      <Scenario title="Default (USD)">
        <MoneyInput label="Amount" currencies={CURRENCIES} defaultCurrency="USD" defaultValue={1299.99} />
      </Scenario>
      <Scenario title="Bounded">
        <MoneyInput
          label="Donation"
          currencies={CURRENCIES}
          defaultCurrency="EUR"
          min={1}
          max={1000}
          step={1}
          helperText="Between €1 and €1,000"
        />
      </Scenario>
      <Scenario title="Error / disabled">
        <MoneyInput
          label="Invalid"
          currencies={CURRENCIES}
          defaultCurrency="INR"
          validationState="error"
          errorMessage="Amount exceeds daily limit"
          defaultValue={99999}
        />
        <MoneyInput
          label="Locked"
          currencies={CURRENCIES}
          defaultCurrency="JPY"
          defaultValue={5000}
          disabled
        />
      </Scenario>
    </Section>
  );
}
