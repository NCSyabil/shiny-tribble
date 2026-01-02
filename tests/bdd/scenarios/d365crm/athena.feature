Feature: D365 CRM - Test Scenarios for Athena Portal

@athena
  Scenario: Test Athena Portal
    * D365CRM: Login using Microsoft SSO -sessionName: "#{env.athena.user.name}" -url: "#{env.athena.url}" -username: "#{env.athena.user.id}" -password: "#{env.athena.user.password}" -options: ""
    * D365CRM: Wait and verify header -text: "Dashboard Notification" -options: ""
    * D365CRM: Click left menu -field: "Membership Management" then sub menu -field:"Membership Applications" -options: ""
    * D365CRM: Wait and verify header -text: "All Applications" -options: ""
    * D365CRM: Click button -text: "New" -options: ""
    * D365CRM: Input text -fieldName: "Full Name" -text: "#{faker.person.fullName()}" -options: ""
    * D365CRM: Input lookup -field: "Nationality" -text: "SINGAPORE CITIZEN" -options: ""
    * D365CRM: Input date into field -field: "Date of Birth" -date: "#{faker.custom.person.birthDate()}" -options: ""
    * D365CRM: Verify field is mandatory -field: "Date of Birth" -options: ""
    * D365CRM: Verify field is secured -field: "Date of Birth" -options: ""
    * D365CRM: Verify input field value -field: "Membership Category" -value: "Union Membership" -options: ""
    * D365CRM: Verify locked input field value -field: "Recruitment Channel" -value: "NTUC" -options: ""
