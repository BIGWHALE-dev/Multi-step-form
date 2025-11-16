export const stepsContainer = document.getElementById("steps");
export const steps = document.querySelectorAll(".step");
export const form = document.querySelector("form") as HTMLFormElement;
export const allSection = document.querySelectorAll(".section");
export const personalInfo_Inputs = form?.querySelectorAll(
  ".personal_info input"
) as NodeListOf<HTMLInputElement>;
export const email = document.getElementById("email") as HTMLInputElement;
export const inputsErrMsgEL = form?.querySelectorAll(".error-msg");
export const planContainer = form?.querySelector(".plans_container");
export const plans = form?.querySelectorAll(".plan") as NodeListOf<HTMLElement>;
export const planInputs = form?.querySelectorAll(`.plan input[type="radio"]`);
export const plansSubscription = document.querySelectorAll(
  ".subscription_price"
) as NodeListOf<HTMLElement>;
export const planPromos = document.querySelectorAll(
  ".promo"
) as NodeListOf<HTMLElement>;
export const toggleBtn = document.getElementById("toggle") as HTMLInputElement;
export const addOns = form?.querySelectorAll(
  ".add-on_feature"
) as NodeListOf<HTMLElement>;
export const addOnCheckbox = form?.querySelectorAll(
  ".add_feature input"
) as NodeListOf<HTMLInputElement>;
export const summarySection = document.querySelector(".finishing_up");
export const addOnPrice = document.querySelectorAll(".add-on_price");
export const changePlanType = form?.querySelector(
  ".change_plan"
) as HTMLAnchorElement;
export const selectedAddOnsContainer = document.querySelector(
  ".add-ons_section"
) as HTMLElement;
export const addOnPackages = document.querySelectorAll(
  ".add-on__package"
) as NodeListOf<HTMLElement>;
export const summaryTotals = document.querySelector(".summary_total");
export const totalPrice = document.querySelector(".total_price");
export const btnContainer = document.querySelector(
  ".btn_container"
) as HTMLElement;
export const submitBtn = document.querySelector(".submit_btn");
export const allNextBtn = document.querySelector(".next_btn");
////////////////////////////////
