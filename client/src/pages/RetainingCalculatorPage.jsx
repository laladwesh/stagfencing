import Calculator from "../components/Calculator";
import { RETAINING_CALCULATOR } from "../data/calculatorCatalog";

function RetainingCalculatorPage() {
  return (
    <Calculator config={RETAINING_CALCULATOR} serviceType="Retaining walls" path="/calculators/retaining-calculator" />
  );
}

export default RetainingCalculatorPage;
