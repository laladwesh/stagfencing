import Calculator from "../components/Calculator";
import { FENCE_CALCULATOR } from "../data/calculatorCatalog";

function FenceCalculatorPage() {
  return <Calculator config={FENCE_CALCULATOR} serviceType="Colorbond" path="/calculators/fence-calculator" />;
}

export default FenceCalculatorPage;
