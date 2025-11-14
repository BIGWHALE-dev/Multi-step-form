import {
  allSection,
  steps,
  form,
  plans,
  plansSubscription,
  planPromos,
  toggleBtn,
  addOnPrice,
  addOnCheckbox,
  btnContainer,
  changePlanType,
  planInputs,
  selectedAddOnsContainer,
  addOns,
  addOnPackages,
  allNextBtn,
  summaryTotals,
  totalPrice,
  personalInfo_Inputs,
  inputsErrMsgEL,
  email,
  summarySection,
} from "./select.js";

class Form {
  activeSection = 1;
  private billingShortNM: string | undefined;
  private yearlyPlanAmt = [90, 120, 150];
  private monthlyPlanAmt = [9, 12, 15];
  private monthlyAddOnAmt = [1, 2, 2];
  private yearlyAddOnAmt = [10, 20, 20];
  private currBilling?: number[];
  private totalAmt = 0;
  private planAmt?: number;
  private addOnAccumulator = 0;

  constructor() {
    this.toggleBtnValue();
    personalInfo_Inputs.forEach((inp, i) =>
      inp.addEventListener("input", () => {
        inputsErrMsgEL[i]!.textContent = "";
        inp.classList.remove("error");
      })
    );

    btnContainer?.addEventListener("click", (e) => {
      if ([...personalInfo_Inputs].some((inp) => inp.value === "")) {
        this.emptyInputsError();
      }
      if (!email.value.trim().includes("@")) {
        this.invalidEmail();
      } else {
        this.trimInputs();
        this.btnHandler(e);
      }
    });

    toggleBtn?.addEventListener("change", this.toggleHandler.bind(this));
    changePlanType?.addEventListener("click", this.changePlan.bind(this));
    form?.addEventListener("submit", this.formObjects.bind(this));
    form?.addEventListener("keydown", (e) => {
      if (!summarySection?.classList.contains("active__section")) {
        if (e.key === "Enter") e.preventDefault();
      }
      // else this.formObjects.call(this, e);
    });
  } // constructor

  sectionBtns() {
    const maxSection = allSection.length - 1;

    const nextBtn = document.createElement("button");
    const prevBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.setAttribute("data-goto", `${this.activeSection + 1}`);
    const btn = `
    <button type="button" class="next_btn" data-goto="${
      this.activeSection + 1
    }">Next Step</button>`;
    const bothBtns = `
    <button type="button" class="prev_btn" data-goto="2">Go Back</button>
    <button type="button" class="next_btn" data-goto="${
      this.activeSection + 1
    }">Next Step</button>`;
    // this.activeSection++;
    if (this.activeSection === 1) {
      btnContainer?.insertAdjacentHTML("afterend", btn);
    }
    if (this.activeSection > 1) {
      btnContainer?.insertAdjacentHTML("afterend", bothBtns);
    }
  }

  curSection(stepNum: string) {
    document
      .getElementById(`section__${stepNum}`)
      ?.classList.add("active__section");
  }

  updateStepAndSection(step: HTMLElement, stepNum: string) {
    // remove active classes
    steps.forEach((step) => step.classList.remove("active__step"));
    allSection.forEach((sect) => sect.classList.remove("active__section"));

    // switch step
    if (step) step.classList.add("active__step");
    // switch section
    this.curSection(stepNum);
  }

  emptyInputsError(err = "this field is required") {
    personalInfo_Inputs.forEach((input, i) => {
      if (input.value.trim() === "") {
        inputsErrMsgEL[i]!.textContent = err;
        input.classList.add("error");
        // return;
      }
    });
  }

  trimInputs() {
    personalInfo_Inputs.forEach((input) => {
      input.value.trim();
    });
  }

  invalidEmail() {
    document.querySelector(`[for="email"] + .error-msg`)!.textContent =
      "invalid email*";
    email.classList.add("error");
  }

  updatePlanSummary() {
    const planType = document.querySelector(".plan_type") as HTMLElement;
    const planTypePrice = document.querySelector(".plan_amount") as HTMLElement;

    // Find the clicked plan
    const selectedPlan = [...plans].find(
      (pln) => (pln.querySelector("input") as HTMLInputElement).checked
    ) as HTMLElement;

    if (selectedPlan) {
      const inputValue = selectedPlan.querySelector("input")?.value;
      const planSubscribtion = selectedPlan.querySelector(
        ".subscription_price"
      ) as HTMLElement;

      // showing selected plan
      planType.innerText = `${inputValue}(${toggleBtn.value})`;
      planTypePrice.textContent = planSubscribtion?.textContent;
      // console.log(selectedPlan);
      this.planAmt = +planTypePrice.textContent.slice(1, -3);
    }
  }

  updateAddOnSummarry() {
    const selectedAddOns = [...addOns].map((add) => {
      if (add.querySelector("input")!.checked) return add;
      else return null;
    });

    this.addOnAccumulator = 0;
    selectedAddOnsContainer!.innerHTML = "";
    selectedAddOns.forEach((add, i) => {
      if (add) {
        let addOnCont = document.createElement("div");
        addOnCont.classList.add("add-on_cont");
        // prettier-ignore
        addOnCont.innerHTML = `<p class="add-on__package">${
          add!.querySelector("input")?.value}</p>
        <span class="add-on__amount">+$${this.currBilling?.[i]}/${this.billingShortNM}</span>`;

        // send each add-on to the DOM
        selectedAddOnsContainer?.append(addOnCont);
        if (i >= 1) addOnCont.style.marginTop = "1rem";

        // Rounding up total Add-ons amount
        this.addOnAccumulator = this.addOnAccumulator + this.currBilling?.[i]!;
      }
    });
  }

  summaryTotals() {
    if (this.planAmt) this.totalAmt = this.planAmt + this.addOnAccumulator;

    summaryTotals!.textContent = `Total (per ${toggleBtn.value.slice(0, -2)})`;
    totalPrice!.textContent = `$${this.totalAmt}/${this.billingShortNM}`;
  }

  goToBtn(el: HTMLElement | HTMLButtonElement) {
    const sectNum = el.dataset.goto!;
    const step = document.querySelector(
      `[data-step="${sectNum}"]`
    ) as HTMLElement;

    this.updateStepAndSection(step, sectNum);
  }

  btnHandler(e: { target: any }) {
    const clicked = e.target;
    if (clicked instanceof HTMLButtonElement) {
      this.goToBtn(clicked);
      this.sectionBtns();
      if (
        clicked.type !== "submit" &&
        !clicked.classList.contains("prev_btn")
      ) {
        // this.emptyInputsError();
        this.updatePlanSummary();
        this.updateAddOnSummarry();
      }
      if (
        clicked.closest(".section")?.nextElementSibling ===
        document.getElementById("section__4")
      )
        this.summaryTotals();
    }
  }

  toggleBtnValue() {
    if (toggleBtn.checked) {
      toggleBtn.value = "yearly";
      this.billingShortNM = "yr";
      planPromos.forEach((p, i) => {
        p.classList.add("show_promo");
        // plans yearly prices
        plansSubscription[
          i
        ]!.textContent = `$${this.yearlyPlanAmt[i]}/${this.billingShortNM}`;
        // add-ons yearly prices
        addOnPrice[i]!.textContent = `
        +$${this.yearlyAddOnAmt[i]}/${this.billingShortNM}`;
      });
    } else {
      toggleBtn.value = "monthly";
      this.billingShortNM = "mo";
      planPromos.forEach((p, i) => {
        p.classList.remove("show_promo");
        // plans monthly prices
        // prettier-ignore
        plansSubscription[i]!.textContent = `$${this.monthlyPlanAmt[i]}/${this.billingShortNM}`;
        //  add-ons monthly prices
        // prettier-ignore
        addOnPrice[i]!.textContent = `+$${this.monthlyAddOnAmt[i]}/${this.billingShortNM}`;
      });
    }
    this.currBilling =
      this.billingShortNM === "mo" ? this.monthlyAddOnAmt : this.yearlyAddOnAmt;
  }

  toggleHandler() {
    this.toggleBtnValue();
    const yearly = document.querySelector(".yearly");
    const monthly = document.querySelector(".monthly");
    yearly?.classList.toggle("active__billing");
    monthly?.classList.toggle("active__billing");
  }

  changePlan() {
    const sect = changePlanType.dataset.step!;
    const step = document.querySelector(`[data-step="${sect}"]`) as HTMLElement;
    this.updateStepAndSection(step, sect);
  }

  formObjects(e: any) {
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
