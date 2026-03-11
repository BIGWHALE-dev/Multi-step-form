var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
//prettier-ignore
import { steps, form, allSection, personalInfo_Inputs, email, phoneNumber, inputsErrMsgEL, plans, plansSubscription, planPromos, toggleBtn, addOns, addOnPrice, changePlanType, selectedAddOnsContainer, summaryTotals, totalPrice, btnContainer, } from "./select.js";
function binder(value, ctx) {
    // console.log(ctx);
    return ctx.addInitializer(function () {
        this[ctx.name] = this[ctx.name].bind(this);
    });
}
let Form = (() => {
    let _instanceExtraInitializers = [];
    let _toggleHandler_decorators;
    let _changePlan_decorators;
    let _formObjects_decorators;
    return class Form {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _toggleHandler_decorators = [binder];
            _changePlan_decorators = [binder];
            _formObjects_decorators = [binder];
            __esDecorate(this, null, _toggleHandler_decorators, { kind: "method", name: "toggleHandler", static: false, private: false, access: { has: obj => "toggleHandler" in obj, get: obj => obj.toggleHandler }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _changePlan_decorators, { kind: "method", name: "changePlan", static: false, private: false, access: { has: obj => "changePlan" in obj, get: obj => obj.changePlan }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _formObjects_decorators, { kind: "method", name: "formObjects", static: false, private: false, access: { has: obj => "formObjects" in obj, get: obj => obj.formObjects }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        activeSection = (__runInitializers(this, _instanceExtraInitializers), 1);
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
                this.trimInputs();
                // inputs validation
                if ([...personalInfo_Inputs].some((inp) => inp.value === ""))
                    this.emptyInputsError();
                if (email.value && !email.value.includes("@"))
                    this.invalidInputValue("email", "please enter a valid email", email);
                if (phoneNumber.value && phoneNumber.value.length < 7)
                    this.invalidInputValue("phone", "Invalid Phone Number!", phoneNumber);
                if ([...personalInfo_Inputs].every((inp) => inp.value) &&
                    email.value.includes("@") &&
                    phoneNumber.value.length >= 7) {
                    this.btnHandler(e);
                }
            });
            toggleBtn?.addEventListener("change", this.toggleHandler);
            changePlanType?.addEventListener("click", this.changePlan);
            form?.addEventListener("submit", this.formObjects);
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
        invalidInputValue(inputType, err, inp) {
            document.querySelector(`[for="${inputType}"] + .error-msg`).textContent =
                `${err}`;
            inp.classList.add("error");
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
                    plansSubscription[i].textContent =
                        `$${this.yearlyPlanAmt[i]}/${this.billingShortNM}`;
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
                clicked.classList.contains("next_btn") && this.activeSection++;
                clicked.classList.contains("prev_btn") && this.activeSection--;
                this.updateStepAndSection();
                this.sectionBtns();
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
    };
})();
new Form();
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