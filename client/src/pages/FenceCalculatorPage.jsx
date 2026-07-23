import Calculator from "../components/Calculator";
import { FENCE_CALCULATOR } from "../data/calculatorCatalog";

function FenceCalculatorPage() {
  return <Calculator config={FENCE_CALCULATOR} serviceType="Colorbond" />;
}

export default FenceCalculatorPage;
