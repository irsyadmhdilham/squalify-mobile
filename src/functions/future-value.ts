export function futureValue(principal: number, monthlyAddition: number, interestRate: number, duration: number): string {
  const a = Math.pow(1 + ( interestRate / 100 ), duration),
        b = 1 - Math.pow( 1 + ( interestRate / 100 ), duration ),
        c = 1 - ( 1 + ( interestRate / 100 ) );
  const futureValueOne = principal * a,
        futureValueTwo = ( monthlyAddition * 12 ) * ( b / c ),
        totalFutureValue = ( futureValueOne + futureValueTwo ).toString();
  return parseFloat(totalFutureValue).toFixed(2)
}