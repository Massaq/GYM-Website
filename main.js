document.addEventListener("DOMContentLoaded", function(){
    const heightInput = document.getElementById("bmi-height");
    const weightInput = document.getElementById("bmi-weight");
    const calcButton = document.getElementById("calculate-bmi");
    const resultDiv = document.getElementById("bmi-result");

    calcButton.addEventListener('click', function(){
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        if(isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            resultDiv.innerHTML = "Будь ласка, введіть коректні зріст та вагу.";
            resultDiv.className = "bmi-overweight";
            resultDiv.style.display = "block";
            return;
        }
        const heightInMeters = height/100;
        const bmi = weight / (heightInMeters * heightInMeters);
        const bmiRounded = bmi.toFixed(1);

        let interpretation = "";
        let resultClass = "";

        if (bmi < 18.5) {
            interpretation = "У вас недостатня вага";
            resultClass = "bmi-underweight";
        } else if (bmi >= 18.5 && bmi < 25) {
            interpretation = "Ваша вага у нормі"
            resultClass = "bmi-normal"
        } else {
            interpretation = "У вас надмірна вага"
            resultClass = "bmi-overweight"
        }

        resultDiv.className = resultClass;
        resultDiv.innerHTML = `${interpretation}
        <span>${bmiRounded}</span>
        Ваш ІМТ
        `;
        resultDiv.style.display = "block"
    })

})