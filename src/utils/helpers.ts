export function getRiskTolerance (risk?:number) {
    if(!risk || isNaN(risk))return null;
    switch(true){
      case risk <= 0.33 * 100:
        return 'Low risk';
      case risk <= 0.66 * 100 && risk > 0.33 * 100:
        return 'Med risk';
      case risk > 0.66 * 100:
        return 'High risk';
      default:
        return 'Risk';
    }
  }