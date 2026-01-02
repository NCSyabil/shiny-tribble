import { test, expect } from '@playwright/test';

// import {comm, web} from '@global';
// import { web, faker, comm, loc } from '@playq/core';
import { comm, web, loc, api, dataTest, faker, vars } from "@playq/core";
import * as locNew from '../../resources/locators/lambdatest.loc';

const locLt = locNew.lambdatest;

test('LambdaTest: Registration001', async ({ page }) => {
  test.info().annotations.push({ type: 'tag', description: 'smoke001' });
  await web.openBrowser(page, "#{env.lambdatest.registration.url}")
  await web.verifyPageTitle(page, "Register Account")
  await web.fill(page, "//input[@placeholder='First Name']", faker.custom.person.fullName())
  await web.fill(page, locLt.registerPage.inpt_lastName(page), "Doe")
  await web.fill(page, "loc.json.lambdatest.registerPage.inpt_telephone", "1234567890")


  // await web.fill(page,"First Name","John")
  // await web.fill(page,"Last Name","Doe")
  await web.fill(page,"E-Mail",faker.internet.email())
  // await web.fill(page,"Telephone","1234567890")
  // await web.fill(page,"Password","password123")
  // await web.fill(page,"Password Confirm","password123")
  // await web.clickRadioButton(page,"Yes")
  // await web.clickCheckbox(page,"I have read and agree to the Privacy Policy")
  // await web.clickButton(page,"Continue")
  // await web.verifyTextOnPage(page,"Your Account Has Been Created!")
  await comm.waitInMilliSeconds(5000)
});


test.describe('LambdaTest: Registration002 @REGRESSION', () => {
  dataTest('DEMO : LambdaTest Test Data Demo  Registration002', { file: "lambdaTest.csv", filter: "_STATUS == 'true'  && _ENV == 'DEV'", testType: "UI" }, async ({ row: td, page }) => {
    await web.openBrowser(page, "https://ecommerce-playground.lambdatest.io/index.php?route=account/register");
    await web.verifyPageTitle(page, "Register Account");
    await web.fill(page, "//input[@placeholder='First Name']", td.fName)
    await web.fill(page, locLt.registerPage.inpt_lastName(page), td.lName);
    await web.fill(page,"E-Mail",faker.internet.email())
    await comm.waitInMilliSeconds(5000)
  });
});

test('LambdaTest: Registration 2', async ({ page }) => {
  test.info().annotations.push({ type: 'tag', description: 'smoke' });
  await web.openBrowser(page, "https://ecommerce-playground.lambdatest.io/index.php?route=account/register")
  await web.verifyPageTitle(page, "Register Account")
  await web.fill(page, "First Name", "John")
  await web.fill(page, "Last Name", "Doe")
  await web.fill(page, "E-Mail", faker.internet.email())
  await web.fill(page, "Telephone", "1234567890")
  await web.fill(page, "Password", "password123")
  await web.fill(page, "Password Confirm", "password123")
  await web.clickRadioButton(page, "Yes")
  await web.clickCheckbox(page, "I have read and agree to the Privacy Policy")
  await web.clickButton(page, "Continue")
  await comm.waitInMilliSeconds(5000)
});


test('NTUC_OLD: UPortal Application ', async ({ page }) => {
  test.info().annotations.push(
    { type: 'tag', description: 'NTUC_OLD' },
    { type: 'tag', description: 'smoke' },
  );
  // await comm.comment("Starting NTUC Test #{pwd.grF0vaHW7fOHNdWaQyaIz4WczuVMKyZFpet92hd5FQaHDAbdmA}");

  console.log("Encrypt Password () ==> " + await comm.encryptPassword("password123"));

  // console.log("NAME  with () ==> " + utils.toCamelCase());
  console.log("NAME  with {withPrefix: true} ==> " + faker.custom.person.fullName({ withPrefix: true }));

  // 
  // console.log("NRIC ==> " + faker.custom.nric.generate());

  // console.log("NRIC Year==> " + faker.custom.nric.getYear(genNric)); // Example NRIC: S6348635C


  await web.openBrowser(page, "#{env.uportal.gb.url}")

  // await webActions.openBrowser(page,"https://uatportal.ntuc.org.sg/uportal/memberships/become-a-member")
  await web.verifyPageTitle(page, "NTUC Union Membership")
  await web.clickButton(page, "START APPLICATION")
  await web.clickButton(page, "APPLY MANUALLY")
  await web.verifyInputFieldPresent(page, "NRIC / FIN number")
  await web.fill(page, "NRIC / FIN number", faker.custom.nric.generate()) // Example NRIC for foreigner
  await web.fill(page, "Name as per NRIC / Passport", faker.custom.person.fullName())
  await web.fill(page, "Date of birth", faker.custom.person.birthDate({ min: 18, max: 65, format: 'DD-MM-YYYY' }))

  // Generate a random date of birth between 18 and 65 years ago

  await comm.waitInMilliSeconds(5000)
  //   await webActions.verifyPageTitle("Google")
  //   await webActions.waitInMilliSeconds(1000)

});
