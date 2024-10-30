function convertHeightInchToCM(heightInInches) {
    return heightInInches * 2.54;
}

export function calculateIdealWeight(heightAsInch, gender) {
    let idealWeight;

    // Convert height in inches to centimeters if height is 60 inches or less
    if (heightAsInch <= 60) {
        const heightInCM = convertHeightInchToCM(heightAsInch);
        // Ideal weight calculation for heights 60 inches or less
        idealWeight = (heightInCM * heightInCM * 1.65) / 1000;
    } else {
        // Ideal weight calculation for heights above 60 inches
        if (gender === 'Male') {
            idealWeight = 52 + 1.9 * (heightAsInch - 60);
        } else if (gender === 'Female') {
            idealWeight = 49 + 1.7 * (heightAsInch - 60);
        } else {
            // Handle case where gender is not Male or Female
            throw new Error('Gender must be either "Male" or "Female".');
        }
    }

    // Round the ideal weight to 2 decimal places
    return parseFloat(idealWeight.toFixed(2));
}
