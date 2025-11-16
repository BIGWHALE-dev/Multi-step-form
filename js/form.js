import { allSection, steps, form, plans, plansSubscription, planPromos, toggleBtn, addOnPrice, addOnCheckbox, btnContainer, changePlanType, planInputs, selectedAddOnsContainer, addOns, addOnPackages, allNextBtn, summaryTotals, totalPrice, personalInfo_Inputs, inputsErrMsgEL, email, summarySection, } from "./select.js";
class Form {
    activeSection = 1;
    billingShortNM;
    yearlyPlanAmt = [90, 120, 150];
    monthlyPlanAmt = [9, 12, 15];
    monthlyAddOnAmt = [1, 2, 2];
    yearlyAddOnAmt = [10, 20, 20];
    currBilling;
    totalAmt = 0;
    planAmt;
    addOnAccumulator = 0;
    constructor() {
        this.sectionBtns();
        this.toggleBtnValue();
        // Remove error
        personalInfo_Inputs.forEach((inp, i) => inp.addEventListener("input", () => {
            inputsErrMsgEL[i].textContent = "";
            inp.classList.remove("error");
        }));
        btnContainer?.addEventListener("click", (e) => {
            // inputs validation
            if ([...personalInfo_Inputs].some((inp) => inp.value === ""))
                this.emptyInputsError();
            if (email.value && !email.value.trim().includes("@"))
                this.invalidEmail();
            if ([...personalInfo_Inputs].some((inp) => inp.value) &&
                email.value.trim().includes("@")) {
                this.trimInputs();
                this.btnHandler(e);
            }
        });
        toggleBtn?.addEventListener("change", this.toggleHandler.bind(this));
        changePlanType?.addEventListener("click", this.changePlan.bind(this));
        form?.addEventListener("submit", this.formObjects.bind(this));
    } // constructor
    curSection() {
        document
            .getElementById(`section__${this.activeSection}`)
            ?.classList.add("active__section");
    }
    curStep() {
        document
            .querySelector(`.step[data-step="${this.activeSection}"]`)
            ?.classList.add("active__step");
    }
    updateStepAndSection() {
        // remove active classes
        steps.forEach((step) => step.classList.remove("active__step"));
        allSection.forEach((sect) => sect.classList.remove("active__section"));
        // switch step
        // if (step) step.classList.add("active__step");
        this.curStep();
        // switch section
        this.curSection();
    }
    emptyInputsError(err = "this field is required") {
        personalInfo_Inputs.forEach((input, i) => {
            if (input.value.trim() === "") {
                inputsErrMsgEL[i].textContent = err;
                input.classList.add("error");
            }
        });
    }
    trimInputs() {
        personalInfo_Inputs.forEach((input) => {
            input.value.trim();
        });
    }
    invalidEmail() {
        document.querySelector(`[for="email"] + .error-msg`).textContent =
            "invalid email*";
        email.classList.add("error");
    }
    updatePlanSummary() {
        const planType = document.querySelector(".plan_type");
        const planTypePrice = document.querySelector(".plan_amount");
        // Find the clicked plan
        const selectedPlan = [...plans].find((pln) => pln.querySelector("input").checked);
        if (selectedPlan) {
            const inputValue = selectedPlan.querySelector("input")?.value;
            const planSubscribtion = selectedPlan.querySelector(".subscription_price");
            // showing selected plan
            planType.innerText = `${inputValue}(${toggleBtn.value})`;
            planTypePrice.textContent = planSubscribtion?.textContent;
            // console.log(selectedPlan);
            this.planAmt = +planTypePrice.textContent.slice(1, -3);
        }
    }
    updateAddOnSummarry() {
        const selectedAddOns = [...addOns].map((add) => {
            if (add.querySelector("input").checked)
                return add;
            else
                return null;
        });
        this.addOnAccumulator = 0;
        selectedAddOnsContainer.innerHTML = "";
        selectedAddOns.forEach((add, i) => {
            if (add) {
                let addOnCont = document.createElement("div");
                addOnCont.classList.add("add-on_cont");
                // prettier-ignore
                addOnCont.innerHTML = `<p class="add-on__package">${add.querySelector("input")?.value}</p>
          <span class="add-on__amount">+$${this.currBilling?.[i]}/${this.billingShortNM}</span>`;
                // send each add-on to the DOM
                selectedAddOnsContainer?.append(addOnCont);
                if (i >= 1)
                    addOnCont.style.marginTop = "1rem";
                // Rounding up total Add-ons amount
                this.addOnAccumulator = this.addOnAccumulator + this.currBilling?.[i];
            }
        });
    }
    summaryTotals() {
        if (this.planAmt)
            this.totalAmt = this.planAmt + this.addOnAccumulator;
        summaryTotals.textContent = `Total (per ${toggleBtn.value.slice(0, -2)})`;
        totalPrice.textContent = `$${this.totalAmt}/${this.billingShortNM}`;
    }
    sectionBtns() {
        const maxSection = allSection.length;
        const ifSummarySection = this.activeSection === maxSection - 1;
        const btn = `
      <button type="button" class="next_btn" data-goto="${this.activeSection + 1}">Next Step</button>`;
        const bothBtns = `
      <button type="button" class="prev_btn" data-goto="${this.activeSection - 1}">Go Back</button>
      <button type="${ifSummarySection ? "submit" : "button"}" class="next_btn ${ifSummarySection ? "submit_btn" : ""}" data-goto="${this.activeSection + 1}">${ifSummarySection ? "Confirm" : "Next Step"}</button>`;
        if (this.activeSection === 1) {
            btnContainer.innerHTML = btn;
        }
        if (this.activeSection > 1) {
            btnContainer.innerHTML = bothBtns;
        }
        if (this.activeSection === maxSection)
            btnContainer.style.display = "none";
    }
    toggleBtnValue() {
        if (toggleBtn.checked) {
            toggleBtn.value = "yearly";
            this.billingShortNM = "yr";
            planPromos.forEach((p, i) => {
                p.classList.add("show_promo");
                // plans yearly prices
                plansSubscription[i].textContent = `$${this.yearlyPlanAmt[i]}/${this.billingShortNM}`;
                // add-ons yearly prices
                addOnPrice[i].textContent = `
        +$${this.yearlyAddOnAmt[i]}/${this.billingShortNM}`;
            });
        }
        else {
            toggleBtn.value = "monthly";
            this.billingShortNM = "mo";
            planPromos.forEach((p, i) => {
                p.classList.remove("show_promo");
                // plans monthly prices
                // prettier-ignore
                plansSubscription[i].textContent = `$${this.monthlyPlanAmt[i]}/${this.billingShortNM}`;
                //  add-ons monthly prices
                // prettier-ignore
                addOnPrice[i].textContent = `+$${this.monthlyAddOnAmt[i]}/${this.billingShortNM}`;
            });
        }
        this.currBilling =
            this.billingShortNM === "mo" ? this.monthlyAddOnAmt : this.yearlyAddOnAmt;
    }
    btnHandler(e) {
        const clicked = e.target;
        if (clicked instanceof HTMLButtonElement) {
            clicked.classList.contains("next_btn")
                ? this.activeSection++
                : this.activeSection--;
            this.updateStepAndSection();
            this.sectionBtns();
            console.log(this.activeSection);
            if (!clicked.classList.contains("prev_btn")) {
                this.updatePlanSummary();
                this.updateAddOnSummarry();
            }
            if (clicked.dataset.goto === "4")
                this.summaryTotals();
        }
    }
    toggleHandler() {
        this.toggleBtnValue();
        const yearly = document.querySelector(".yearly");
        const monthly = document.querySelector(".monthly");
        yearly?.classList.toggle("active__billing");
        monthly?.classList.toggle("active__billing");
    }
    changePlan(e) {
        e.preventDefault();
        this._activeSection = +changePlanType.dataset.step;
        this.updateStepAndSection();
        this.sectionBtns();
    }
    set _activeSection(v) {
        this.activeSection = v;
    }
    formObjects(e) {
        e.preventDefault();
        const formdata = new FormData(form);
        const formObj = Object.fromEntries(formdata.entries());
        // const formObj = [...formdata];
        console.log(formObj);
    }
}
const formdat = new Form();
console.log(formdat);
// event handlers
// stepsContainer?.addEventListener("click", function (e) {
//   const currStep = (e.target as HTMLElement)?.closest(".step");
//   if (currStep instanceof HTMLElement) {
//     if (!currStep) return;
//     const stepNum = currStep.dataset.step!;
//     updateStep(currStep, stepNum);
//   }
// });
//# sourceMappingURL=form.js.map