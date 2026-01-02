// import { test as base } from '@playwright/test';

// ****************** Only CSS and XPATH locators are supported ************************
 
/* 
loc.auto.fieldName
loc.auto.forId
loc.auto.fieldInstance
loc.auto.location.value
loc.auto.section.value
*/

export const lambdatest = {
  fields: {
    label: ["//label[text()='#{loc.auto.fieldName}']"
      ],
    select: [
      ],
    select_options: [ 
      ],
    input: ["//input[@id='#{loc.auto.forId}']", "##{loc.auto.forId}", "//input[@placeholder='#{loc.auto.fieldName}']",
      "(//input[@placeholder='#{loc.auto.fieldName}'])[#{loc.auto.fieldInstance}]",
      ],
    link: [
      "//a//span[normalize-space(text())='#{loc.auto.fieldName}']"
      ],
    radio: [
      "//input[@type='radio']//following-sibling::label[normalize-space()='#{loc.auto.fieldName}']"
    ],
    checkbox: [
      "//input[@type='checkbox']//following-sibling::label[normalize-space()='#{loc.auto.fieldName}']",
      "//input[@type='checkbox']//following-sibling::label[contains(normalize-space(),'#{loc.auto.fieldName}')]",
    ],
    button: [
      "input[type='submit'][value='#{loc.auto.fieldName}']",
    ],
    tab: [
    ],
    tab_selected: [
    ],
    header: [
      "//div[@role='heading' and text()='#{loc.auto.fieldName}']",
      "//h1[text()='#{loc.auto.fieldName}']",
      "//h1//span[text()='#{loc.auto.fieldName}']",
      "//h2[text()='#{loc.auto.fieldName}']",
      "//h3[text()='#{loc.auto.fieldName}']",
      "//div[@role='heading' and contains(text(),'#{loc.auto.fieldName}')]",
    ],
  },
  locations: {
    top_menu: "#main-navigation",
  },
  sections: {
    radio_group: "//fieldset[legend[normalize-space(text())='#{loc.auto.section.value}']]",
    accordion: "//button[contains(@class,'accordion')][text()='#{loc.auto.section.value}']",
  },
  scroll: [
    "h1:first-child"
  ]
};
