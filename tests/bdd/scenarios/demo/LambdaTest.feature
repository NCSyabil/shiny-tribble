Feature: Lambda Test Playground Registration


@lambdatest_registration_001
Scenario: Do Registration with Lambda Test - Hard coded values and locators

    * Step Group: -lambda_reg_navigation.sg- -Navigating to Lambda Test Registration Page-
    * Web: Fill -field: "//input[@id='input-firstname']" -value: "Robert" -options: ""
    * Web: Fill -field: "loc.lambdatest.registerPage.inpt_lastName" -value: "Smith" -options: ""
    * Web: Fill -field: "E-Mail" -value: "robert.smith@example.com" -options: ""
    * Web: Fill -field: "loc.json.lambdatest.registerPage.inpt_telephone" -value: "1234567890" -options: ""
    * Comm: Wait for milliseconds -seconds: "5000"
