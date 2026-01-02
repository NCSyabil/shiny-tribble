Feature: AmdocsCRM - Customer Registration

## Test Case: AmdocsCRM — New Customer Registration and Service Activation
# Test Case ID: ACRM_REG_001
# Test Case Title: Register New Customer and Activate Service in Amdocs CRM
# Module: AmdocsCRM / Customer Management
# Sub-Module: Registration & Service Activation
# Objective: Verify that a new customer can be successfully registered with personal details, linked to billing account, and have their service activated
# Pre-Conditions:   - User has valid AmdocsCRM login credentials with Customer Management permissions
#                   - Test environment is accessible and CRM application is running
#                   - Test data includes valid billing account numbers for linking
#                   - Browser supports Microsoft SSO authentication
# Test Type:        End-to-End Functional Test
# Priority:         High
@ACRM_REG_001 @AmdocsCRM_CustomerManagement @Registration @priority:High
Scenario Outline: Register new customer with service activation in AmdocsCRM
    * AmdocsCRM: Login using Microsoft SSO -sessionName: "#{env.session}" -url: "#{env.url}" -username: "#{env.crm_user}" -password: "#{env.crm_password}" -options: "{ mfa: true }"
    * AmdocsCRM: Wait And Verify Page Header -Text: "Customer Dashboard" -Options: "{timeout:10000}"

    # Navigate to Customer Registration
    * AmdocsCRM: Click Left Menu -Text: "Customer"
    * AmdocsCRM: Click Left Menu -Text: "Customer" -Then Sub Menu -Text: "New Registration"
    * AmdocsCRM: Wait And Verify Page Header -Text: "Customer Registration" -Options: "{timeout:8000}"

    # Fill Customer Personal Information
    * AmdocsCRM: Input Text -Field: "First Name" -Text: "<FirstName>" -Options: ""
    * AmdocsCRM: Input Text -Field: "Last Name" -Text: "<LastName>" -Options: ""
    * AmdocsCRM: Input Text -Field: "Email" -Text: "<Email>" -Options: ""
    * AmdocsCRM: Input Text -Field: "Phone Number" -Text: "<PhoneNumber>" -Options: ""
    * AmdocsCRM: Input Date -Field: "Date of Birth" -Text: "<DateOfBirth>" -Options: ""
    * AmdocsCRM: Input Dropdown -Field: "Customer Type" -Text: "<CustomerType>" -Options: ""

    # Fill Address Information
    * AmdocsCRM: Click Tab -Text: "Address Details" -Options: ""
    * AmdocsCRM: Input Text -Field: "Street Address" -Text: "<StreetAddress>" -Options: ""
    * AmdocsCRM: Input Text -Field: "City" -Text: "<City>" -Options: ""
    * AmdocsCRM: Input Text -Field: "Postal Code" -Text: "<PostalCode>" -Options: ""
    * AmdocsCRM: Input Dropdown -Field: "State" -Text: "<State>" -Options: ""

    # Save Customer Registration
    * AmdocsCRM: Click Button -Text: "Save Customer" -Options: ""
    * AmdocsCRM: Wait For Loader To Disappear -Options: "timeout=10s"
    * AmdocsCRM: Verify Notification -Text: "Customer registered successfully" -Options: "{partialMatch:true}"

    # Store Customer ID for later use
    * AmdocsCRM: Assign Input Value To Variable -Field: "Customer ID" -To Variable: "newCustomerId" -Options: ""

    # Navigate to Service Details Tab
    * AmdocsCRM: Click Tab -Text: "Service Details" -Options: ""
    * AmdocsCRM: Wait And Verify Page Header -Text: "Service Configuration" -Options: "{timeout:5000}"

    # Link Billing Account
    * AmdocsCRM: Link Billing Account -Field: "Billing Account Number" -Text: "<BillingAccount>" -Options: ""
    * AmdocsCRM: Input Dropdown -Field: "Service Type" -Text: "<ServiceType>" -Options: ""
    * AmdocsCRM: Input Text -Field: "Service Plan" -Text: "<ServicePlan>" -Options: ""

    # Activate Service
    * AmdocsCRM: Click Button -Text: "Activate Service" -Options: ""
    * AmdocsCRM: Wait For Loader To Disappear -Options: "timeout=15s"
    * AmdocsCRM: Verify Notification -Text: "Service activated successfully" -Options: "{partialMatch:true}"

    # Verify Customer in Search Results
    * AmdocsCRM: Click Left Menu -Text: "Customer" -Then Sub Menu -Text: "Search Customers"
    * AmdocsCRM: Input Text -Field: "Search Customer" -Text: "<PhoneNumber>" -Options: ""
    * AmdocsCRM: Click Button -Text: "Search" -Options: ""
    * AmdocsCRM: Wait For Loader To Disappear -Options: "timeout=5s"

    # Verify customer appears in search results
    * AmdocsCRM: Verify Table Cell Value Contains -Text: "<FirstName> <LastName>" -Row: "1" -Column: "Customer Name" -Options: ""
    * AmdocsCRM: Verify Table Cell Value Contains -Text: "<PhoneNumber>" -Row: "1" -Column: "Phone" -Options: ""
    * AmdocsCRM: Verify Table Cell Value Contains -Text: "Active" -Row: "1" -Column: "Status" -Options: ""

    # View Customer Details to validate data persistence
    * AmdocsCRM: Click Link -Text: "<FirstName> <LastName>" -Options: ""
    * AmdocsCRM: Wait And Verify Page Header -Text: "Customer Overview" -Options: "{timeout:8000}"
    * AmdocsCRM: Verify Input Value -Field: "Email" -Text: "<Email>" -Options: ""
    * AmdocsCRM: Verify Input Value -Field: "Phone Number" -Text: "<PhoneNumber>" -Options: ""

    # Verify Service Status
    * AmdocsCRM: Click Tab -Text: "Service Details" -Options: ""
    * AmdocsCRM: Verify Input Value -Field: "Service Status" -Text: "Active" -Options: ""
    * AmdocsCRM: Verify Input Value -Field: "Billing Account Number" -Text: "<BillingAccount>" -Options: ""

    # Capture screenshot for evidence
    * AmdocsCRM: Capture Screenshot -Filename: "CustomerRegistration_<FirstName><LastName>_Completed.png" -Options: ""

    * AmdocsCRM: Logout -Options: ""
    

Examples:
  | FirstName | LastName | Email                    | PhoneNumber | DateOfBirth | CustomerType | StreetAddress      | City          | PostalCode | State     | BillingAccount | ServiceType | ServicePlan    |
  | John      | Smith    | john.smith@example.com   | 60123456789 | 15/01/1985  | Individual   | 123 Main Street   | Kuala Lumpur  | 50450      | Selangor  | BA123456789    | Mobile      | Postpaid Plus  |
  | Sarah     | Tan      | sarah.tan@example.com    | 60134567890 | 22/03/1990  | Individual   | 456 Ocean Drive  | Penang        | 10400      | Penang    | BA987654321    | Broadband   | Fiber 100Mbps  |
  | Ahmad     | Rahman   | ahmad.rahman@example.com | 60145678901 | 08/07/1982  | Business     | 789 Business Ave | Johor Bahru   | 80100      | Johor     | BA555666777    | Mobile      | Corporate Plan |