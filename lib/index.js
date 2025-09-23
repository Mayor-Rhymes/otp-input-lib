export class OTPInput {
  constructor(config) {
    this.config = {};
    this.config.target = config.target;
    this.config.target.addEventListener("submit", (e) => {
      e.preventDefault();
    });
    this.config.inputLength = config.inputLength || 6;
    this.config.noButton = config.noButton || false;
    this.config.onValidate = config.onValidate;
    this.config.autoValidate = config.autoValidate || false;
    this.otpCharArr = new Array(this.config.inputLength).fill("");
  }

  render() {
    const otpSection = document.createElement("section");
    otpSection.classList.add("otp-section");
    this.#addInputs(otpSection);
    this.config.target.appendChild(otpSection);
    this.config.target.querySelectorAll(".otp-input");
    if (!this.config.noButton) {
      this.#addButton();
      if (!this.#allInputsFilled(this.otpCharArr)) {
        this.#handleButtonDisabledState(
          this.config.target.querySelectorAll(".otp-input")
        );
      }
    }
    this.#addEvents();
  }

  #addButton() {
    const validateButton = document.createElement("button");
    validateButton.textContent = "VALIDATE OTP";
    validateButton.id = "validate-button";
    validateButton.type = "button";
    validateButton.addEventListener("click", this.config.onValidate);
    this.config.target.appendChild(validateButton);
  }

  #addInputs(otpSection) {
    for (let i = 0; i < this.config.inputLength; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.classList.add("otp-input");
      input.maxLength = 1;
      otpSection.appendChild(input);
    }
  }

  #addEvents() {
    const num_arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const otp_inputs = this.config.target.querySelectorAll(".otp-input");
    otp_inputs.forEach((input, index) => {
      input.addEventListener("keydown", (e) => {
        if (num_arr.includes(parseInt(e.key))) {
          e.preventDefault();
          // e.stopPropagation();
          if (!input.value) {
            input.value = parseInt(e.key).toString();
            this.otpCharArr[index] = input.value;
            if (input.nextElementSibling) {
              input.nextElementSibling.focus();
            }
          }

          if (!this.config.noButton) {
            this.#handleButtonDisabledState(otp_inputs);
            this.#handleButtonStateChange(otp_inputs);
          }

          if (this.config.noButton && this.#allInputsFilled(otp_inputs)) {
            this.config.onValidate();
          }
        } else if (e.key === "Backspace") {
          e.preventDefault();

          if (input.previousElementSibling && input.value === "") {
            input.previousElementSibling.focus();
          } else {
            input.value = "";
            this.otpCharArr[index] = "";
          }
          if (!this.config.noButton) {
            this.#handleButtonDisabledState(otp_inputs);
            this.#handleButtonStateChange(otp_inputs);
          }
        } else if (e.key === "Tab") {
          if (input.nextElementSibling) {
            e.preventDefault();
            input.nextElementSibling.focus();
          }
          if (!this.config.noButton) {
            this.#handleButtonDisabledState(otp_inputs);
            this.#handleButtonStateChange(otp_inputs);
          }
        } else if (e.ctrlKey && e.key === "v") {
          e.preventDefault();
          navigator.clipboard.readText().then((text) => {
            let pastedText = text.trim();
            console.log(pastedText);
            if (this.#containsNonNumeric(pastedText)) {
              alert("Non Numeric present");
              alert("pasting sequence with non-numeric characters not allowed");
            } else {
              let pastedTextArr = pastedText.split("");

              if (pastedTextArr.length > this.config.inputLength) {
                pastedTextArr = pastedTextArr.slice(0, this.config.inputLength);
                // alert("Value is higher than expected.");
                // return;
              }
              for (let i = 0; i < pastedTextArr.length; i++) {
                this.otpCharArr[i] = pastedTextArr[i];
              }

              console.log(this.otpCharArr);

              otp_inputs.forEach((input, index) => {
                input.value = this.otpCharArr[index] || "";
              });

              if (this.#allInputsFilled(otp_inputs) && this.config.noButton) {
                this.config.onValidate();
              } else if (
                this.#allInputsFilled(otp_inputs) &&
                !this.config.noButton
              ) {
                otp_inputs[this.config.inputLength - 1].focus();
                this.#handleButtonDisabledState(otp_inputs);
                this.#handleButtonStateChange(otp_inputs);
              }
            }
          });
          // alert("Pasting is not allowed");
        } else if (
          e.key === "Enter" &&
          //   !input.nextElementSibling &&
          this.#allInputsFilled(otp_inputs)
        ) {
          e.preventDefault();
          this.config.onValidate();
        } else if (e.ctrlKey) {
        } else {
          e.preventDefault();
          if (!this.config.noButton) {
            this.#handleButtonDisabledState(otp_inputs);
            this.#handleButtonStateChange(otp_inputs);
          } 
          

        }
      });
    });

    otp_inputs.forEach((input, _) => {
      input.addEventListener("paste", (e) => {
        e.preventDefault();
          navigator.clipboard.readText().then((text) => {
            let pastedText = text.trim();
            console.log(pastedText);
            if (this.#containsNonNumeric(pastedText)) {
              alert("Non Numeric present");
              alert("pasting sequence with non-numeric characters not allowed");
            } else {
              let pastedTextArr = pastedText.split("");

              if (pastedTextArr.length > this.config.inputLength) {
                pastedTextArr = pastedTextArr.slice(0, this.config.inputLength);
                // alert("Value is higher than expected.");
                // return;
              }
              for (let i = 0; i < pastedTextArr.length; i++) {
                this.otpCharArr[i] = pastedTextArr[i];
              }

              console.log(this.otpCharArr);

              otp_inputs.forEach((input, index) => {
                input.value = this.otpCharArr[index] || "";
              });

              if (this.#allInputsFilled(otp_inputs) && this.config.noButton) {
                this.config.onValidate();
              } else if (
                this.#allInputsFilled(otp_inputs) &&
                !this.config.noButton
              ) {
                otp_inputs[this.config.inputLength - 1].focus();
                this.#handleButtonDisabledState(otp_inputs);
                this.#handleButtonStateChange(otp_inputs);
              }
            }
          });
          // alert("Pasting is not allowed");
      });
    });
  }

  #allInputsFilled(otp_inputs) {
    return Array.from(otp_inputs).every((input) => input.value !== "");
  }

  #handleButtonDisabledState(otp_inputs) {
    if (!this.config.noButton) {
      const validateButton =
        this.config.target.querySelector("#validate-button");
      if (this.#allInputsFilled(otp_inputs)) {
        validateButton.disabled = false;
      } else {
        validateButton.disabled = true;
      }
    }
  }

  #handleButtonStateChange(otp_inputs) {
    if (!this.config.noButton) {
      const validateButton =
        this.config.target.querySelector("#validate-button");
      if (this.#allInputsFilled(otp_inputs)) {
        validateButton.style.color = "darkblue";
        validateButton.style.backgroundColor = "lightblue";
        validateButton.disabled = false;
      } else {
        validateButton.style.color = "grey";
        validateButton.style.backgroundColor = "whitesmoke";
        validateButton.disabled = true;
      }
    }
  }

  #containsNonNumeric(str) {
    return /[^0-9]/.test(str);
  }

  getOtp() {
    return this.otpCharArr.join("");
  }
}

// const otpParent = document.getElementById("otp-wrapper");
// // console.log(otpParent);
// const OTPInstance = new OTPInput({
//   target: otpParent,
//   inputLength: 6,
//   // noButton: true,
//   onValidate: () => {
//     console.log(OTPInstance.getOtp());
//   },
// });

// OTPInstance.render();
