Feature: {{Domain Display}} - {{Module Display}}

## Test Case: {{Domain Display}} — {{Scenario Title}}
# Test Case ID: {{TestCaseID}}
# Test Case Title: {{TestCaseTitle}}
# Module: {{Domain Display}} / {{Module}}
# Sub-Module: {{SubModule}}
# Objective: {{Objective}}
# Pre-Conditions:   - {{Precondition1}}
#                   - {{Precondition2}}
#                   - {{Precondition3}}
# Test Type:        {{TestType}}
# Priority:         {{Priority}}
@{{TestCaseID}} @{{Domain}}_{{ModuleTag}} @{{SubModuleTag}} @priority:{{PriorityTag}}
Scenario Outline: {{ScenarioTitle}}
    * {{Domain}}: Login using Microsoft SSO -sessionName: "{{SessionName}}" -url: "#{env.url}" -username: "#{env.crm_user}" -password: "#{env.crm_password}" -options: "{ mfa: true }"
    * {{Domain}}: Wait and verify header -text: "{{LandingHeader}}" -options: "{timeout:10000}"

    # {{Step Info}}
    * {{Domain}}: Input text -fieldName: "{{SearchField}}" -text: "<{{Identifier}}>" -options: ""
    * {{Domain}}: Click button -text: "Search" -options: ""
    * {{Domain}}: Wait and verify text -text: "<{{ResultName}}>" -options: "{partialMatch:true, timeout:8000}"

    # View details
    * {{Domain}}: Click link -text: "<{{ResultName}}>" -options: ""
    * {{Domain}}: Wait and verify header -text: "{{DetailHeader}}" -options: "{timeout:8000}"
    * {{Domain}}: Verify text -text: "{{DetailVerification1}}" -options: "{partialMatch:true}"
    * {{Domain}}: Verify text -text: "<{{DetailVerification2}}>" -options: "{section:'{{DetailSection}}'}"

    # Update information
    * {{Domain}}: Click button -text: "{{EditButton}}" -options: ""
    * {{Domain}}: Input text -fieldName: "{{UpdateField1}}" -text: "<{{UpdateValue1}}>" -options: ""
    * {{Domain}}: Input text -fieldName: "{{UpdateField2}}" -text: "<{{UpdateValue2}}>" -options: ""
    * {{Domain}}: Click button -text: "Save" -options: ""
    * {{Domain}}: Verify text -text: "{{SuccessMessage}}" -options: "{partialMatch:true, timeout:8000}"

    # Validate persisted data
    * {{Domain}}: Refresh page -options: ""
    * {{Domain}}: Verify text -text: "<{{UpdateValue1}}>" -options: "{section:'{{ValidationSection}}'}"
    * {{Domain}}: Verify text -text: "<{{UpdateValue2}}>" -options: "{section:'{{ValidationSection}}'}"

    * {{Domain}}: Logout -options: ""

Examples:
  | {{Identifier}} | {{ResultName}} | {{DetailVerification2}} | {{UpdateValue1}} | {{UpdateValue2}} |
  | 60123456789    | John Smith     | 60123456789             | john.smith.updated@example.com | 60111222333 |
  | ACCT123456     | Sarah Tan      | 60134567890             | sarah.tan.updated@example.com  | 60119876543 |