@StepGroup
Feature: Step Group for Lambda Test

@StepGroup:lambda_reg_navigation.sg
Scenario: Navigating to Lambda Test Registration Page
    * Web: Open browser -url: "#{env.lambdatest.registration.url}" -options: ""
    * Web: Verify header -text: "Register Account" -options: ""
    * Comm: Comment -text: "renish123"


    
