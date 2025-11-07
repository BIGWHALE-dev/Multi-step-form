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
} from "./select.js";

class Form {
  private billingShortNM: string | undefined;
  private yearlyPlanAmt = [90, 120, 150];
  private monthlyPlanAmt = [9, 12, 15];
  private monthlyAddOnAmt = [1, 2, 2];
  private yearlyAddOnAmt = [10, 20, 20];
  private currBilling: number[] | undefined;
  private totalAmt = 0;
  private planAmt: number | undefined;
  private addOnAccumulator = 0;

  constructor() {
    this.toggleBtnValue();
    btnContainer.forEach((btn) =>
      btn.addEventListener("click", this.btnHandler.bind(this))
    );
    toggleBtn?.addEventListener("change", this.toggleHandler.bind(this));
    changePlanType?.addEventListener("click", this.changePlan.bind(this));
    // [...allNextBtn]
    //   .find(
    //     (btn) =>
    //       btn.closest(".section")?.nextElementSibling ===
    //       document.getElementById("section__4")
    //   )
    //   ?.addEventListener("click", this.summaryTotals.bind(this));
    form?.addEventListener("submit", this.formObjects);
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

  updatePlanSummary() {
    const planType = document.querySelector(".plan_type") as HTMLElement;
    const planTypePrice = document.querySelector(".plan_amount") as HTMLElement;

    // Find the clicked plan
    const selectedPlan = [...plans].find(
      (pln) => (pln.querySelector("input") as HTMLInputElement).checked
    ) as HTMLElement;

    // planType.innerText = "";
    // planTypePrice.textContent = "";
    if (selectedPlan) {
      const inputValue = selectedPlan.querySelector("input")?.value;
      const planSubscribtion = selectedPlan.querySelector(
        ".subscription_price"
      ) as HTMLElement;

      // showing selected plan
      planType.innerText = `${inputValue}(${toggleBtn.value})`;
      planTypePrice.textContent = planSubscribtion?.textContent;
      console.log(selectedPlan);
      this.planAmt = +planTypePrice.textContent.slice(1, -3);

      // console.log(this.planAmt);
      // console.log(+planTypePrice.textContent.slice(1, -3));
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
        console.log(this.addOnAccumulator);
      }
    });
  }

  summaryTotals() {
    if (this.planAmt) this.totalAmt = this.planAmt + this.addOnAccumulator;

    summaryTotals!.textContent = `Total (per ${toggleBtn.value.slice(0, -2)})`;
    totalPrice!.textContent = `${this.totalAmt}`;
    console.log(this.totalAmt, this.addOnAccumulator);
  }

  goToBtn(el: HTMLElement | HTMLButtonElement) {
    // console.log(el.closest(".section"), el);
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
      if (
        clicked.type !== "submit" &&
        !clicked.classList.contains("prev_btn")
      ) {
        this.updatePlanSummary();
        this.updateAddOnSummarry();
      }
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
    // return this.billingShortNM;
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
