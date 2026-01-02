// import { test as base } from '@playwright/test';

// ****************** Only CSS and XPATH locators are supported ************************

/* 
loc.auto.fieldName
loc.auto.forId
loc.auto.fieldInstance
loc.auto.location.value
loc.auto.section.value
*/

export const d365CrmLocPatterns = {
  fields: {
    label: [
      "//label[text()='#{loc.auto.fieldName}']",
    ],
    dropdown: [
      "(//button[@role='combobox'][@aria-label='#{loc.auto.fieldName}'])[#{loc.auto.fieldInstance}]",
      "//select[@aria-label='#{loc.auto.fieldName}']",
      "//select[@aria-label='#{loc.auto.fieldName}'][@title='#{loc.auto.fieldInstance}']",
      "//select[@aria-label='#{loc.auto.fieldName}']//option[text()='#{loc.auto.fieldInstance}']",
      "//div[text()='#{loc.auto.fieldName}']",

    ],
    input: [
      "input[id='#{loc.auto.forId}']",
      "input[aria-label='#{loc.auto.fieldName}']",
      "input[placeholder='#{loc.auto.fieldName}']",
      "input[name='#{loc.auto.fieldName}']",
      "//textarea[@aria-label='#{loc.auto.fieldName}']",
      "//label[text()='#{loc.auto.fieldName}']//..//..//textarea",
      "//input[@aria-label='Date of #{loc.auto.fieldName}']",
      "//input[@aria-label='Time of #{loc.auto.fieldName}']",
      "//input[@aria-label='#{loc.auto.fieldName}, Lookup']",
      "//div[@aria-label='#{loc.auto.fieldName}, Lookup']",
      "//input[contains(@aria-label,'#{loc.auto.fieldName}')]",
      "//input[contains(@placeholder,'#{loc.auto.fieldName}')]",
      "//input[contains(@name,'#{loc.auto.fieldName}')]",
      "//input[contains(@placeholder,'#{loc.auto.fieldName}') or contains(@aria-label,'#{loc.auto.fieldName}')]",
      "//ul[@title='#{loc.auto.fieldName}']"
    ],
    link: [
      "//a[text()='#{loc.auto.fieldName}']",
      "a[href='#{loc.auto.location.value}']",
      "a[title='#{loc.auto.fieldName}']",
      "a[aria-label='#{loc.auto.fieldName}']",
      "//span[text()='#{loc.auto.fieldName}']",
      "//label[text()='#{loc.auto.fieldName}']",
      "//DIV[text()='#{loc.auto.fieldName}']/parent::DIV/UL/LI/DIV/DIV",
      "//DIV[text()='#{loc.auto.fieldName}, Readonly']/parent::DIV/UL/LI/DIV/DIV",
      "//DIV[text()='#{loc.auto.fieldName}']",
      "//li[title='#{loc.auto.fieldName}']",
      "//li[aria-label='#{loc.auto.fieldName}']",
      "//div[aria-label='#{loc.auto.fieldName}']",
      "//a[contains(text(),'#{loc.auto.fieldName}')]",
      "//a[contains(@aria-label,'#{loc.auto.fieldName}')]",
      "//a[contains(@title,'#{loc.auto.fieldName}')]",
      "//a[contains(@href,'#{loc.auto.fieldName}')]",
      "//a[contains(@aria-label,'#{loc.auto.fieldName}')]",
      "//li[contains(@aria-label,'#{loc.auto.fieldName},')]",
      "//li[contains(@aria-label,'#{loc.auto.fieldName}')]",
    ],
    button: [
      "input[type='submit'][value='#{loc.auto.fieldName}']",
      "button[value='#{loc.auto.fieldName}']",
      "button[aria-label='#{loc.auto.fieldName}']",
      "button[title='#{loc.auto.fieldName}']",
      "//button[name='#{loc.auto.fieldName}']",
      "//button[text()='#{loc.auto.fieldName}']",
      "//button//span[text()='#{loc.auto.fieldName}']",
      "//button//label[text()='#{loc.auto.fieldName}']",
      "//input[@type='submit' and @value='#{loc.auto.fieldName}']",
      "//span[@class='submit' and text()='#{loc.auto.fieldName}']",
      "//span[@class='submit' and contains(text(),'#{loc.auto.fieldName}')]",
      "//span[@id='submitButton' and text()='#{loc.auto.fieldName}']",
      "//button[contains(@aria-label,'#{loc.auto.fieldName}')]",
      "//button[contains(@title,'#{loc.auto.fieldName}')]",
      "//button[contains(text(),'#{loc.auto.fieldName}')]",
      "//button[contains(@value,'#{loc.auto.fieldName}')]",
      "//input[@type='submit' and contains(@value,'#{loc.auto.fieldName}')]",
      "//input[@type='submit' and contains(@aria-label,'#{loc.auto.fieldName}')]",
      "//input[@type='submit' and contains(@title,'#{loc.auto.fieldName}')]",
      "//div[@data-type='app-title' and @title='#{loc.auto.fieldName}']",
      "//input[@aria-label='#{loc.auto.fieldName}, Lookup']",
      "//button[contains(@data-id,'#{loc.auto.fieldName}') and starts-with(@aria-label,'Delete')]",
      "//div[contains(@id,'#{loc.auto.fieldName}')]",
      "//button[@id='#{loc.auto.fieldName}']",
      "//button[@role='option']//span[text()='#{loc.auto.fieldName}']",
      "//input[@aria-label='#{loc.auto.fieldName}']"
    ],
    header: [
      "//div[@role='heading' and text()='#{loc.auto.fieldName}']",
      "//h1[text()='#{loc.auto.fieldName}']",
      "//h1//span[text()='#{loc.auto.fieldName}']",
      "//h2[text()='#{loc.auto.fieldName}']",
      "//h3[text()='#{loc.auto.fieldName}']",
      "//div[@role='heading' and contains(text(),'#{loc.auto.fieldName}')]",
      "//li[@aria-label='#{loc.auto.fieldName}']",
      "//li[contains(@aria-label,'#{loc.auto.fieldName}')]",
      "//h1[@data-id='#{loc.auto.fieldName}']"
    ],
    text: [
      "//div[text()='#{loc.auto.fieldName}']",
      "//span[text()='#{loc.auto.fieldName}']",
      "//p[text()='#{loc.auto.fieldName}']",
      "//div[contains(text(),'#{loc.auto.fieldName}')]",
      "//span[contains(text(),'#{loc.auto.fieldName}')]",
      "//p[contains(text(),'#{loc.auto.fieldName}')]",
    ],
    tab: [
      "//li[@aria-label='#{loc.auto.fieldName}']",
      "//li[contains(@aria-label,'#{loc.auto.fieldName}')]"
    ],
    locked: [
      "//div[@aria-label='Locked #{loc.auto.fieldName}']",
    ],
    mandatory: [
      "//label[text()='#{loc.auto.fieldName}']//..//..//following-sibling::div/div[text()='*']",
      "//label[text()='#{loc.auto.fieldName}']/following-sibling::span[text()='*']"
    ],
    secured: [
      "//div[@aria-label='Secured #{loc.auto.fieldName}']"
    ],
    loader:[
      "//span[@role='alert']",
      "//div[@id='datasethost-progress-indicator']",
      "//span[@title='Loading']"
    ]
  },
  locations: {
    quick_create: "//section[@data-id='quickcreateroot']",
    lookup_records: "//section[@data-id='lookupdialogroot']",
    dialog_window: "//div[@role='dialog']",
    main: "//div[@id='mainContent']",
    popup_dialog: "(//div[contains(@id,'dialogview')] | //div[contains(@id,'modaldialogview')])",
    top_bar: "//div[@id='topbar']",
    top_bar_notification: "//div[contains(@id,'barnotificationlist')]",
    table_edit_filter: "//div[contains(@class,'ms-Panel-contentInner')]",
    nav_left: "//div[@role='navigation'][@data-id='navbar-container']",
    switch_app: "//div[@id='applandingpagecontentcontainer']",
    dropdown_list: "//div[@aria-label='Dropdown panel']",
    dropdown_listbox: "//div[@role='listbox']",
    dropdown_menu: "//ul[@role='menu']",
    dropdown_table_edit_filter_menu: "//div[contains(@class,'ms-Callout-container')]",
    dropdown_table_column: "//div[contains(@class,'ms-contextualmenu-container')]",
    dropdown_tab: "//div[@role='menu']",
    dropdown_more_commands: "//div[contains(@id,'overflowbutton')]",
    dropdown_system_view: "//div[@aria-label='view options'][@role='dialog']",
    tab: "//ul[@role='tablist']",
  },
  sections: {
    tab_list: "//li[@aria-label='#{loc.auto.section.value}']",
    input_lookup: "//input[@aria-label='<field_name>, Lookup']",

  },
  scroll: [
    "//div[@section='#{loc.auto.section.value}']",
    "//li[@data-type='control_fullname']"
  ],

};