const otpParent = document.getElementById("otp-wrapper");

const otpSection = otpParent.querySelector("#otp-section");
const validateButton = otpParent.querySelector("#validate-button");

const num_arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const otpInputLength = parseInt(otpParent.dataset.inputLength) || 6; //default length of otp inputs
const noButton = otpParent.dataset.noButton === "true"; //whether to show the button or not
let otp = "";

const otpCharArr = new Array(otpInputLength).fill("");

if (noButton) {
  validateButton.style.display = "none";
}

for (let i = 0; i < otpInputLength; i++) {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "otp-input";
  input.maxLength = 1;
  otpSection.appendChild(input);
}

const otp_inputs = otpParent.querySelectorAll(".otp-input");

console.log(otp_inputs);
otp_inputs.forEach((input, index) => {
  input.addEventListener("keydown", (e) => {
    if (num_arr.includes(parseInt(e.key))) {
      e.preventDefault();
      if (!input.value) {
        input.value = parseInt(e.key).toString();
        otpCharArr[index] = input.value;
        if (input.nextElementSibling) {
          input.nextElementSibling.focus();
        }
      }

      handleButtonDisabledState();
      handleButtonStateChange();

      if (noButton) {
        handleValidation();
      }
    } else if (e.key === "Backspace") {
      e.preventDefault();

      if (input.previousElementSibling && input.value === "") {
        input.previousElementSibling.focus();
      } else {
        input.value = "";
        otpCharArr[index] = "";
      }
      handleButtonDisabledState();
      handleButtonStateChange();
    } else if (e.key === "Tab") {
      if (input.nextElementSibling) {
        e.preventDefault();
        input.nextElementSibling.focus();
      }
      handleButtonDisabledState();
      handleButtonStateChange();
    } else if (e.ctrlKey && e.key === "v") {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        let pastedText = text.trim();
        console.log(pastedText);
        if (containsNonNumeric(pastedText)) {
          alert("Non Numeric present");
          alert("pasting sequence with non-numeric characters not allowed");
        } else {
          let pastedTextArr = pastedText.split("");

          if (pastedTextArr.length > otpInputLength) {
            pastedTextArr = pastedTextArr.slice(0, otpInputLength);
            // alert("Value is higher than expected.")
            // return;
          }
          for (let i = 0; i < pastedTextArr.length; i++) {
            otpCharArr[i] = pastedTextArr[i];
          }

          console.log(otpCharArr);

          otp_inputs.forEach((input, index) => {
            input.value = otpCharArr[index] || "";
          });

          if (allInputsFilled() && noButton) {
            handleValidation();
          } else if (allInputsFilled() && !noButton) {
            otp_inputs[otpInputLength - 1].focus();
            handleButtonDisabledState();
            handleButtonStateChange();
          }
        }
      });
      // alert("Pasting is not allowed");
    } else if (
      e.key === "Enter" &&
      !input.nextElementSibling &&
      allInputsFilled()
    ) {
      e.preventDefault();
      handleValidation();
    } else {
      e.preventDefault();
      // input.value = "";
      handleButtonDisabledState();
      handleButtonStateChange();
    }
  });
});

function allInputsFilled() {
  return Array.from(otp_inputs).every((input) => input.value !== "");
}

function handleButtonStateChange() {
  if (allInputsFilled()) {
    validateButton.style.color = "darkblue";
    validateButton.style.backgroundColor = "lightblue";
  } else {
    validateButton.style.color = "grey";
    validateButton.style.backgroundColor = "whitesmoke";
  }
}

function handleButtonDisabledState() {
  if (allInputsFilled()) {
    validateButton.disabled = false;
  } else {
    validateButton.disabled = true;
  }
}

function checkOTP() {
  return otp === "290234";
}

validateButton.addEventListener("click", () => {
  if (allInputsFilled()) {
    handleValidation();
    console.log("Button clicked");
  }
});

otpParent.addEventListener("submit", (e) => {
  e.preventDefault();
  handleValidation();
});

function handleValidation() {
  if (allInputsFilled()) {
    otp = otpCharArr.join("");
    if (checkOTP()) {
      alert("OTP validated!");

      console.log(otp);
      otp = "";
    } else {
      alert("Invalid OTP. Please try again.");
      otp_inputs.forEach((input) => {
        input.value = "";
        otp_inputs[0].focus();
      });
      console.log(otp);
      otp = "";
    }
  }
}

function containsNonNumeric(str) {
  return /[^0-9]/.test(str);
}

//Leveraging dynamicity

//Automatically generate the user's required number of input fields

//encapsulating the otp functionalities inside an object called otp

