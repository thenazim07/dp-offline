export function calculateBMI(weight: number, heightInInches: number) {
    // Convert height from inches to meters
    const heightInMeters = heightInInches * 0.0254;

    // Calculate BMI
    let bmi = weight / Math.pow(heightInMeters, 2);

    // Round BMI to two decimal places
    bmi = Math.round(bmi * 100) / 100;

    return bmi;
}
